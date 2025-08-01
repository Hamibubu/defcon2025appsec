<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');

require '../../../vendor/autoload.php';
include '../../../db.php';

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

if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing user ID parameter']);
    exit;
}

function logAccess($id, $trackingCode, $success) {
    $logFile = __DIR__ . '/access.log';
    $date = date('Y-m-d H:i:s');
    $status = $success ? 'SUCCESS' : 'FAIL';
    $entry = "[$date] Access $status for UserID=$id, tracking_code=$trackingCode, IP=" . ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . PHP_EOL;
    file_put_contents($logFile, $entry, FILE_APPEND | LOCK_EX);
}

try {
    $trackingCode = md5("track_" . ($id * 12345));
    logAccess($id, $trackingCode, true);
    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        logAccess($id, $trackingCode, false);
        http_response_code(404);
        echo json_encode([
            'error' => 'User not found',
            'queried_id' => $id,
        ]);
        exit;
    }

    echo json_encode([
        'success' => true,
        'user' => $user,
    ]);
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
