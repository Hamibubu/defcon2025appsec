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
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

include '../../../db.php';

if (!isset($_COOKIE['token'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Not authenticated']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    $decoded = JWT::decode($_COOKIE['token'], new Key($secretKey, 'HS512'));
    if ($decoded->role !== 'administrator') {
        http_response_code(403);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid or expired token']);
    exit;
}

$name = $_POST['name'] ?? '';
$price = $_POST['price'] ?? 0;
$stock = $_POST['stock'] ?? 0;
$specifications = $_POST['specifications'] ?? '';
$description = $_POST['description'] ?? '';

if (!$name || !$price || !$stock) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

$uploadDir = realpath(__DIR__ . '/../../../images');
if (!$uploadDir) {
    http_response_code(500);
    echo json_encode(['error' => 'Upload directory not found']);
    exit;
}
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

function uploadImages($files) {
    global $uploadDir;

    $allowedExts = ['jpg', 'jpeg', 'png', 'gif'];
    $urls = [];

    for ($i = 0; $i < count($files['name']); $i++) {

        if ($files['error'][$i] !== UPLOAD_ERR_OK) {
            switch ($files['error'][$i]) {
                case UPLOAD_ERR_INI_SIZE:
                    echo "Error: The file '{$files['name'][$i]}' exceeds the maximum size allowed by the server configuration.\n";
                    break;
                case UPLOAD_ERR_FORM_SIZE:
                    echo "Error: The file '{$files['name'][$i]}' exceeds the maximum size allowed by the form.\n";
                    break;
                case UPLOAD_ERR_PARTIAL:
                    echo "Error: The file '{$files['name'][$i]}' was only partially uploaded.\n";
                    break;
                case UPLOAD_ERR_NO_FILE:
                    echo "Error: No file was uploaded for '{$files['name'][$i]}'.\n";
                    break;
                case UPLOAD_ERR_NO_TMP_DIR:
                    echo "Error: Missing a temporary folder on the server for '{$files['name'][$i]}'.\n";
                    break;
                case UPLOAD_ERR_CANT_WRITE:
                    echo "Error: Failed to write the file '{$files['name'][$i]}' to disk.\n";
                    break;
                case UPLOAD_ERR_EXTENSION:
                    echo "Error: File upload for '{$files['name'][$i]}' was stopped by a PHP extension.\n";
                    break;
                default:
                    echo "Unknown error occurred while uploading the file '{$files['name'][$i]}'.\n";
                    break;
            }
            continue;
        }        

        $filename = $files['name'][$i];
        $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

        if (!in_array($ext, $allowedExts)) {
            echo "Invalid extension for'{$filename}'.\n";
            continue;
        }

        $newName = uniqid('img_', true) . '.' . $ext;
        $destination = $uploadDir . DIRECTORY_SEPARATOR . $newName;

        if (move_uploaded_file($files['tmp_name'][$i], $destination)) {
            $urls[] = '/images/' . $newName;
        } else {
            echo "Error moving the file '{$filename}'.\n";
        }
    }

    return $urls;
}

$imagesUrls = [];
if (isset($_FILES['newImages']) && count($_FILES['newImages']) > 0) {
    $imagesUrls = uploadImages($_FILES['newImages']);
}

print_r($imagesUrls);

try {
    $stmt = $pdo->prepare("
        INSERT INTO products (name, price, stock, specifications, description, image_location)
        VALUES (:name, :price, :stock, :specifications, :description, :image_location)
    ");

    $stmt->execute([
        ':name' => $name,
        ':price' => floatval($price),
        ':stock' => intval($stock),
        ':specifications' => $specifications,
        ':description' => $description,
        ':image_location' => json_encode($imagesUrls),
    ]);

    $newProductId = $pdo->lastInsertId();

    echo json_encode([
        'success' => true,
        'product' => [
            'id' => $newProductId,
            'name' => $name,
            'price' => floatval($price),
            'stock' => intval($stock),
            'specifications' => $specifications,
            'description' => $description,
            'image_location' => $imagesUrls,
        ],
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>