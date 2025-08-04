<?php

header('Access-Control-Allow-Origin: http://127.0.0.1:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include '../../db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$inputJSON = file_get_contents('php://input');
$data = json_decode($inputJSON, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

if (empty($data['username']) || empty($data['password'])) {
    http_response_code(422);
    echo json_encode(['error' => 'Missing fields']);
    exit;
}

$username = trim($data['username']);
$password = $data['password'];
$role = $data['role'] ?? 'user';
$bio = $data['description'] ?? '';
$address = $data['address'] ?? '';
$phone = $data['phone'] ?? '';
$email = $data['email'] ?? '';
$verified = $data['verified'] ?? 0;

$passwordHash = password_hash($password, PASSWORD_BCRYPT);

try {
    $stmt = $pdo->prepare('INSERT INTO users (username, password, role, bio, address, phone, email, verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([$username, $passwordHash, $role, $bio, $address, $phone, $email, $verified]);

    http_response_code(201);
    echo json_encode(['message' => 'User registered successfully']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Unexpected error', 'details' => $e->getMessage()]);
    exit;
}

?>