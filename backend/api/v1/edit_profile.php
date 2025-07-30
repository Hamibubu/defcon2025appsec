<?php
require '../../../../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key; 

$secretKey = '';

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include '../../../../db.php';

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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $jwt = $_COOKIE['token'];

    try {
        $decoded = JWT::decode($jwt, new Key($secretKey, 'HS512'));
        $id = $_POST['id'];
        
        if (!empty($_POST['username'])) {
            $username = $_POST['username'];
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Invalid username"]);
            exit;
        }
        $role = $_POST['role'] ?? 'user';
        $bio = $_POST['bio'] ?? '';
        $verified = $_POST['verified'] ?? 0;
        
        $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $user = $stmt->fetch();

        if (!$user) {
            http_response_code(404);
            echo json_encode(["error" => "User not found"]);
            exit;
        }

        $stmtUpdate = $pdo->prepare("
        UPDATE users SET
            username = :username,
            role = :role,
            bio = :bio,
            verified = :verified
        WHERE id = :id
        ");

        $stmtUpdate->execute([
            ':username' => $username,
            ':role' => $role,
            ':bio' => $bio,
            ':verified' => intval($verified),
            ':id' => $id
        ]);

        $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $user = $stmt->fetch();

        echo json_encode([
            'success' => true,
            'product' => $user,
        ]);
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(['error' => $e]);
    }
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method Not Allowed']);
?>