<?php
require '../../../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../../../');
$dotenv->load();
putenv("JWT=" . $_ENV['JWT']);
$secretKey = getenv('JWT');

header('Access-Control-Allow-Origin: http://127.0.0.1:3000');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include '../../../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
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

try {
    $decoded = JWT::decode($jwt, new Key($secretKey, 'HS512'));
    $username = $decoded->username;

    $stmt = $pdo->prepare('SELECT * FROM users WHERE username = ?');
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(404);
        echo json_encode(['error' => 'User not found']);
        exit;
    }

    echo json_encode(['user' => $user]);

} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid or expired token']);
    exit;
}
