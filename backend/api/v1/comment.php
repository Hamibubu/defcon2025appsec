<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require '../../../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key; 
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../../../');
$dotenv->load();
putenv("JWT=" . $_ENV['JWT']);
$secretKey = getenv('JWT');

include '../../../db.php';

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

try {
    $decoded = JWT::decode($jwt, new Key($secretKey, 'HS512'));
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid token', 'details' => $e->getMessage()]);
    exit;
}

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON body']);
    exit;
}

$product_id = $input['product_id'] ?? null;
$user_id = $input['user_id'] ?? null;
$review = $input['review'] ?? null;

try {
    $stmt = $pdo->prepare("SELECT id FROM products WHERE id = ?");
    $stmt->execute([$product_id]);
    $product = $stmt->fetch();
    if (!$product) {
        http_response_code(404);
        echo json_encode(['error' => 'Product not found']);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO product_reviews (product_id, user_id, review) VALUES (?, ?, ?)");
    $stmt->execute([$product_id, $user_id, $review]);

    echo json_encode([
        'success' => true,
        'review_id' => $pdo->lastInsertId(),
        'product_id' => $product_id,
        'user_id' => $user_id,
        'review' => $review,
        'debug' => [
            'jwt_payload' => $decoded,
            'input' => $input,
        ],
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Database error: ' . $e->getMessage(),
        'debug' => [
            'jwt_payload' => $decoded,
            'input' => $input,
        ],
    ]);
}
?>