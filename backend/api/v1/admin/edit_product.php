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

$uploadDir = realpath(__DIR__ . '/../../../frontend/public/images');

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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $jwt = $_COOKIE['token'];

    try {
        $decoded = JWT::decode($jwt, new Key($secretKey, 'HS512'));
        $role = $decoded->role;
        if ($role === "administrator"){

            $id = $_POST['id'];
            $name = $_POST['name'] ?? '';
            $price = $_POST['price'] ?? 0;
            $stock = $_POST['stock'] ?? 0;
            $specifications = $_POST['specifications'] ?? '';
            $description = $_POST['description'] ?? '';
            $deletedImages = $_POST['deletedImages'];
            
            $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
            $stmt->execute([$id]);
            $product = $stmt->fetch();

            if (!$product) {
                http_response_code(404);
                echo json_encode(["error" => "Product not found"]);
                exit;
            }

            $dbImages = json_decode($product['image_location'], true);

            $images = [];
            $merged_imgs = $dbImages;
            if (isset($_FILES['newImages']) && count($_FILES['newImages']) > 0) {
                $images = uploadImages($_FILES['newImages']);
                $merged_imgs = array_merge($dbImages, $images);
            }

            if (!is_array($deletedImages)) {
                $deletedImages = [$deletedImages];
            }

            $deletedImages = array_filter($deletedImages);
            
            foreach ($deletedImages as $img) {
                $path = __DIR__ . '/../../../frontend/public' . $img;
                if (file_exists($path)) {
                    unlink($path);
                }
            }

            $filtered_imgs = [];

            foreach ($merged_imgs as $img) {
                if (!in_array($img, $deletedImages, true)) {
                    $filtered_imgs[] = $img;
                }
            }

            $stmtUpdate = $pdo->prepare("
            UPDATE products SET 
                name = :name,
                price = :price,
                stock = :stock,
                specifications = :specifications,
                description = :description,
                image_location = :image_location
            WHERE id = :id
            ");

            $stmtUpdate->execute([
                ':name' => $name,
                ':price' => floatval($price),
                ':stock' => intval($stock),
                ':specifications' => $specifications,
                ':description' => $description,
                ':image_location' => json_encode($filtered_imgs),
                ':id' => $id,
            ]);

            $newProduct = [
                'id' => $id,
                'name' => $name,
                'price' => floatval($price),
                'stock' => intval($stock),
                'specifications' => $specifications,
                'description' => $description,
                'image_location' => $filtered_imgs,
            ];

            echo json_encode([
                'success' => true,
                'product' => $newProduct,
            ]);
        }else{
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
        }
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid or expired token']);
    }
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method Not Allowed']);
?>