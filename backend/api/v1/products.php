<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');
include '../../../db.php';

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
        GROUP BY p.id;";

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

