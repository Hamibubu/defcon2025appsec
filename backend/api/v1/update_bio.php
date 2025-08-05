<?php
require '../../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key; 
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();
putenv("JWT=" . $_ENV['JWT']);
$secretKey = getenv('JWT');

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include '../../db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

if (!isset($_COOKIE['token'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Not authenticated']);
    exit;
}

$inputJSON = file_get_contents('php://input');
$data = json_decode($inputJSON, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $jwt = $_COOKIE['token'];

    try {
        $decoded = JWT::decode($jwt, new Key($secretKey, 'HS512'));
        $id = $data['id'] ?? null;

        $allowedFields = ['username', 'role', 'bio', 'verified', 'address', 'phone', 'email'];

        $fieldsToUpdate = array_intersect_key($data, array_flip($allowedFields));

        if (empty($fieldsToUpdate)) {
            http_response_code(400);
            echo json_encode(["error" => "No valid fields to update"]);
            exit;
        }

        $setClause = implode(', ', array_map(fn($field) => "$field = :$field", array_keys($fieldsToUpdate)));

        $fieldsToUpdate['id'] = $id;

        $sql = "UPDATE users SET $setClause WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($fieldsToUpdate);

        $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $user = $stmt->fetch();

        echo json_encode([
            'success' => true,
            'user' => $user,
        ]);
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method Not Allowed']);
?>
