<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:3000');
header('Content-Type: application/json');
include '../../../db.php';

$sql = "SELECT id, name, price, image_location 
        FROM products 
        ORDER BY id DESC 
        LIMIT 6;";

try {
  $stmt = $pdo->query($sql);
  $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode($products);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}

$pdo = null;
?>
