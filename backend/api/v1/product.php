<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:3000');
header('Content-Type: application/json');
include '../../../db.php';

if (!isset($_GET['id'])) {
  http_response_code(400);
  echo json_encode(['error' => 'Missing product ID']);
  exit;
}

$id = intval($_GET['id']);

$sql = "SELECT p.id, p.name, p.price, p.description, p.image_location, p.stock, p.specifications,
        COALESCE(
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', r.id,
              'review', r.review,
              'reviewer', u.username
            )
          ),
          JSON_ARRAY()
        ) AS reviews
        FROM products p
        LEFT JOIN product_reviews r ON p.id = r.product_id
        LEFT JOIN users u ON r.user_id = u.id
        WHERE p.id = :id
        GROUP BY p.id";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['id' => $id]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$product) {
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
    }else {
        echo json_encode($product);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}

$pdo = null;

?>