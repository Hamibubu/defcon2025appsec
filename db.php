<?php
require_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

putenv("DB_HOST=" . $_ENV['DB_HOST']);
putenv("DB_USER=" . $_ENV['DB_USER']);
putenv("DB_PASS=" . $_ENV['DB_PASS']);
putenv("DB_NAME=" . $_ENV['DB_NAME']);


$servername = getenv('DB_HOST');
$username   = getenv('DB_USER');
$password   = getenv('DB_PASS');
$dbname     = getenv('DB_NAME');

$dsn = "mysql:host=$servername;port=3306;dbname=$dbname;charset=utf8mb4";

try {
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);

} catch (PDOException $e) {
    if (!headers_sent()) {
        http_response_code(500);
    }
    echo json_encode(['error' => 'DB Connection failed: ' . $e->getMessage()]);
    exit;
}
