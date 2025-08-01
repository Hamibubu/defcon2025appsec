<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:3000');
header('Content-Type: application/json');
include '../../../db.php';

require '../../../vendor/autoload.php';
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../../..');
$dotenv->load();

putenv("JWT=" . $_ENV['JWT']);
$secretKey = getenv('JWT');

function generateSecretLink($secretKey) {
    $timestamp = time();
    $date = date('YmdHi', $timestamp);
    $secret = hash('sha256', $secretKey . $date);

    return "http://127.0.0.1:8000/api/v1/debug/phpinfo.php?token={$secret}&ts={$timestamp}";
}

$id = $_GET['id'] ?? null;

$sql = "SELECT p.id, p.name, p.price, p.description, p.image_location, p.stock, p.specifications,
        COALESCE(
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', r.id,
              'review', r.review,
              'reviewer', u.username,
              'uid', u.id,
              'verified', u.verified
            )
          ),
          JSON_ARRAY()
        ) AS reviews
        FROM products p
        LEFT JOIN product_reviews r ON p.id = r.product_id
        LEFT JOIN users u ON r.user_id = u.id
        WHERE p.id = :id
        GROUP BY p.id";

function logAccess($id, $trackingCode, $success) {
    $logFile = __DIR__ . '/access.log';
    $date = date('Y-m-d H:i:s');
    $status = $success ? 'SUCCESS' : 'FAIL';
    $entry = "[$date] Access $status for ProductID=$id, tracking_code=$trackingCode, IP=" . ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . PHP_EOL;
    file_put_contents($logFile, $entry, FILE_APPEND | LOCK_EX);
}

try {
    $trackingCode = md5("track_" . ($id * 12345));
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['id' => $id]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$product) {
        logAccess($id, $trackingCode, false);
        http_response_code(404);
        echo json_encode([
            'error' => 'Product not found',
            'queried_id' => $id,
            'query_used' => $sql,
            'hint' => 'Make sure the product ID exists in the database',
            'debug_info' => [
                'method' => $_SERVER['REQUEST_METHOD'],
                'request_uri' => $_SERVER['REQUEST_URI'],
                'client_ip' => $_SERVER['REMOTE_ADDR'],
                'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
            ]
        ]);
        exit;
    } else {
        logAccess($id, $trackingCode, true);
        echo json_encode($product);
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Internal Server Error',
        'message' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'debug' => generateSecretLink($secretKey),
    ]);
}

$pdo = null;
?>
