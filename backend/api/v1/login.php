<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');

require '../../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();
putenv("JWT=" . $_ENV['JWT']);
$secretKey = getenv('JWT');

header('Content-Type: application/json');
include '../../db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    exit(0);
}

$inputJSON = file_get_contents('php://input');
$data = json_decode($inputJSON, true);

if (empty($data['username']) || empty($data['password'])) {
    http_response_code(422);
    echo json_encode(['error' => 'Missing username or password']);
    exit;
}

$username = trim($data['username']);
$password = $data['password'];

try {
    $stmt = $pdo->prepare('SELECT id, username, password, role, bio, address, phone, email FROM users WHERE username = ?');
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid username or password']);
        exit;
    }

    $issuedAt = time();

    $expire = $issuedAt + 7200;

    $payload = [
        'iat' => $issuedAt,
        'exp' => $expire,
        'sub' => $user['id'],
        'username' => $user['username'],
        'role' => $user['role'],
    ];

    $jwt = JWT::encode($payload, $secretKey, 'HS512');

    setcookie('token', $jwt, [
        'expires' => $expire,
        'path' => '/',
        'domain' => '127.0.0.1',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);

    http_response_code(200);
    echo json_encode([
        'message' => 'Login successful', 'user' => $user
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}

$pdo = null;
?>
