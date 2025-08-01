<?php
require '../../../../vendor/autoload.php';
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../../../../');
$dotenv->load();
putenv("JWT=" . $_ENV['JWT']);
$secretKey = getenv('JWT');

function getSecret($secretKey) {
    $timestamp = time();
    $date = date('YmdHi', $timestamp);
    return hash('sha256', $secretKey . $date);
}

$token = $_GET['token'] ?? '';
$timestamp = $_GET['ts'] ?? '';

if (!$token || !$timestamp) {
    http_response_code(403);
    exit('Missing token or timestamp');
}

if (abs(time() - (int)$timestamp) > 300) {
    http_response_code(403);
    exit('Token expired — must be within 5 minutes of error event');
}

$expected = getSecret($secretKey);

if (!hash_equals($expected, $token)) {
    http_response_code(403);
    exit('Invalid token — must be generated for the *exact minute* when the error occurred');
}

phpinfo();
?>