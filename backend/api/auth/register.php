<?php
/**
 * POST /api/auth/register.php
 * Body: { "name": "...", "email": "...", "password": "..." }
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if (!$name || !$email || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'Name, email and password are required']);
    exit;
}

if (strlen($password) < 8) {
    http_response_code(400);
    echo json_encode(['error' => 'Password must be at least 8 characters']);
    exit;
}
if (!preg_match('/[A-Z]/', $password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Password must contain at least one uppercase letter']);
    exit;
}
if (!preg_match('/[a-z]/', $password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Password must contain at least one lowercase letter']);
    exit;
}
if (!preg_match('/[0-9]/', $password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Password must contain at least one number']);
    exit;
}
if (!preg_match('/[!@#$%^&*()_+\-=[\]{};\':"\\\\|,.<>\/?]/', $password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Password must contain at least one special character']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email']);
    exit;
}

$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
$stmt->execute([$email]);
if ($stmt->fetch()) {
    http_response_code(409);
    echo json_encode(['error' => 'Email already registered']);
    exit;
}

$hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $pdo->prepare('INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, NOW())');
$stmt->execute([$name, $email, $hash]);
$userId = (int) $pdo->lastInsertId();

require_once __DIR__ . '/../../config/jwt.php';
$token = jwtEncode(['user_id' => $userId, 'email' => $email], $GLOBALS['jwtSecret'], $GLOBALS['jwtExpiry']);

http_response_code(201);
echo json_encode([
    'token' => $token,
    'user' => [
        'id' => $userId,
        'name' => $name,
        'email' => $email,
    ],
]);
