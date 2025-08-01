<?php
require '../../../../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key; 
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../../../../');
$dotenv->load();
putenv("JWT=" . $_ENV['JWT']);
$secretKey = getenv('JWT');

header('Access-Control-Allow-Origin: http://127.0.0.1:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
include '../../../../db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

if (!isset($_COOKIE['token'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Not authenticated']);
    exit;
}

$jwt = $_COOKIE['token'];

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

try {
    $decoded = JWT::decode($jwt, new Key($secretKey, 'HS512'));
    $role = $decoded->role;
    if ($role === "administrator"){
        $input = file_get_contents('php://input');
        if (!$input) {
            http_response_code(400);
            echo json_encode(['error' => 'No data received.']);
            exit;
        }

        $data = json_decode($input, true);
        if (!$data) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid or unparseable JSON.']);
            exit;
        }

        $requiredFields = ['track_api', 'action', 'user', 'time'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "Missing required field: $field"]);
                exit;
            }
        }

        $queryParams = http_build_query([
            'action' => $data['action'],
            'user' => $data['user'],
            'time' => $data['time']
        ]);
        $url = $data['track_api'] . '?' . $queryParams;

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_HEADER, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($ch);

        if (curl_errno($ch)) {
            http_response_code(500);
            echo json_encode(['error' => 'cURL error: ' . curl_error($ch)]);
            curl_close($ch);
            exit;
        }

        $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
        $headersRaw = substr($response, 0, $headerSize);
        $body = substr($response, $headerSize);

        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        $headers = explode("\r\n", $headersRaw);
        foreach ($headers as $headerLine) {
            if (stripos($headerLine, 'X-Powered-By:') === 0) {
                if (preg_match('/X-Powered-By:\s*(\w+)/i', $headerLine, $matches)) {
                    $framework = $matches[1];
                    header("X-Internal-API: $framework");
                }
                break;
            }
        }

        curl_close($ch);

        http_response_code($httpCode);
        echo $body;

    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid or expired token']);
    exit;
}
?>
