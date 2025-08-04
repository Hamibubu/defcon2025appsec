<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:3000');
header('Content-Type: application/json');
include '../../db.php';
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

putenv("JWT=" . $_ENV['JWT']);
$secretKey = getenv('JWT');

function generateSecretLink($secretKey) {
    $timestamp = time();
    $date = date('YmdHi', $timestamp);
    $secret = hash('sha256', $secretKey . $date);
    return "http://127.0.0.1:8000/api/v1/debug/phpinfo.php?token={$secret}&ts={$timestamp}";
}

try {
    $index = $_GET['index'] ?? 'products';

    if (!preg_match('/^[a-zA-Z0-9_]+$/', $index)) {
        throw new Exception("Invalid table name format");
    }

    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);

    if (!in_array($index, $tables, true)) {
        throw new Exception("Table '$index' does not exist");
    }

    if ($index !== 'products') {
        throw new Exception("Filtering is only allowed on 'products' table not ". $index);
    }

    $query = "SELECT * FROM `products` WHERE 1=1";
    $params = [];

    if (!empty($_GET['name'])) {
        $query .= " AND name LIKE :name";
        $params[':name'] = '%' . $_GET['name'] . '%';
    }

    if (!empty($_GET['specifications'])) {
        $query .= " AND specifications LIKE :specs";
        $params[':specs'] = '%' . $_GET['specifications'] . '%';
    }

    if (!empty($_GET['minPrice'])) {
        if (!is_numeric($_GET['minPrice'])) throw new Exception("Invalid minPrice");
        $query .= " AND price >= :minPrice";
        $params[':minPrice'] = $_GET['minPrice'];
    }

    if (!empty($_GET['maxPrice'])) {
        if (!is_numeric($_GET['maxPrice'])) throw new Exception("Invalid maxPrice");
        $query .= " AND price <= :maxPrice";
        $params[':maxPrice'] = $_GET['maxPrice'];
    }

    if (!empty($_GET['inStockOnly']) && $_GET['inStockOnly'] === '1') {
        $query .= " AND stock > 0";
    }

    if (!empty($_GET['minStock'])) {
        if (!is_numeric($_GET['minStock'])) throw new Exception("Invalid minStock");
        $query .= " AND stock >= :minStock";
        $params[':minStock'] = $_GET['minStock'];
    }

    if (!empty($_GET['maxStock'])) {
        if (!is_numeric($_GET['maxStock'])) throw new Exception("Invalid maxStock");
        $query .= " AND stock <= :maxStock";
        $params[':maxStock'] = $_GET['maxStock'];
    }

    $sortOrder = (!empty($_GET['sortPriceAsc']) && $_GET['sortPriceAsc'] === '0') ? 'DESC' : 'ASC';
    $query .= " ORDER BY price $sortOrder";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $products = $stmt->fetchAll();

    echo json_encode($products);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'error' => 'Internal Server Error',
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'debug' => generateSecretLink($secretKey),
        ]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            'error' => 'Internal Server Error',
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'debug' => generateSecretLink($secretKey),
        ]);
    }
