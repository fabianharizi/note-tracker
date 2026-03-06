<?php
/**
 * Database configuration and PDO connection.
 * Uses config.local.php if present (copy from config.local.php.example).
 */

$host = '127.0.0.1';
$port = 3306;
$dbname = 'note_tracker';
$user = 'root';
$pass = '';

$localConfig = __DIR__ . '/config.local.php';
if (file_exists($localConfig)) {
    $cfg = require $localConfig;
    $host = $cfg['db_host'] ?? $host;
    $port = (int) ($cfg['db_port'] ?? $port);
    $dbname = $cfg['db_name'] ?? $dbname;
    $user = $cfg['db_user'] ?? $user;
    $pass = $cfg['db_pass'] ?? $pass;
} else {
    $host = getenv('DB_HOST') ?: $host;
    $port = (int) (getenv('DB_PORT') ?: $port);
    $dbname = getenv('DB_NAME') ?: $dbname;
    $user = getenv('DB_USER') ?: $user;
    $pass = getenv('DB_PASS') ?: $pass;
}

$dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";

try {
    $pdo = new PDO(
        $dsn,
        $user,
        $pass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    $message = 'Database connection failed.';
    $showDetail = getenv('DB_SHOW_ERROR') || (isset($cfg) && !empty($cfg['show_error']));
    if ($showDetail) {
        $message .= ' ' . $e->getMessage();
    }
    echo json_encode(['error' => $message]);
    exit;
}
