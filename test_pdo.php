<?php
try {
    $pdo = new PDO("mysql:host=127.0.0.1;port=3306;dbname=defcon_store", "defcon_user", 'Pa$$w0rd');
    echo "✅ Connected!";
} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage();
}
