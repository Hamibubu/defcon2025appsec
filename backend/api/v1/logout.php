<?php
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Expires: 0");
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');

setcookie('token', '', time() - 3600, '/', '', true, true); 

header('Content-Type: application/json');
echo json_encode(['message' => 'Logged out successfully']);
exit;
?>