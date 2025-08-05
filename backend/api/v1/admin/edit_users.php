<?php
require '../../../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key; 
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../../../');
$dotenv->load();
putenv("JWT=" . $_ENV['JWT']);
$secretKey = getenv('JWT');

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include '../../../db.php';

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
        $role = $decoded->role;
        if ($role === "administrator"){

            $id = $_POST['id'];
            if (!empty($_POST['username'])) {
                $username = $_POST['username'];
            } else {
                http_response_code(400);
                echo json_encode(["error" => "Invalid username"]);
                exit;
            }

            $roleInput = $_POST['role'] ?? 'user';
            $bio = $_POST['bio'] ?? '';
            $verified = isset($_POST['verified']) ? intval($_POST['verified']) : 0;
            $address = $_POST['address'] ?? null;
            $phone = $_POST['phone'] ?? null;
            $email = $_POST['email'] ?? null;
            
            // Verificar que el usuario exista
            $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
            $stmt->execute([$id]);
            $user = $stmt->fetch();

            if (!$user) {
                http_response_code(404);
                echo json_encode(["error" => "User not found"]);
                exit;
            }

            // Actualizar usuario con los nuevos campos
            $stmtUpdate = $pdo->prepare("
                UPDATE users SET
                    username = :username,
                    role = :role,
                    bio = :bio,
                    verified = :verified,
                    address = :address,
                    phone = :phone,
                    email = :email
                WHERE id = :id
            ");

            $stmtUpdate->execute([
                ':username' => $username,
                ':role' => $roleInput,
                ':bio' => $bio,
                ':verified' => $verified,
                ':address' => $address,
                ':phone' => $phone,
                ':email' => $email,
                ':id' => $id
            ]);

            // Obtener datos actualizados para devolverlos
            $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
            $stmt->execute([$id]);
            $user = $stmt->fetch();

            echo json_encode([
                'success' => true,
                'user' => $user,
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
        }
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method Not Allowed']);
?>