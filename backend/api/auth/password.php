<?php
/**
 * PUT /api/auth/password.php
 * Body: { "current_password": "...", "new_password": "..." }
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$userId = requireAuth();
if ($userId === null) {
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$current = $input['current_password'] ?? '';
$new = $input['new_password'] ?? '';

if ($current === '' || $new === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Current password and new password are required']);
    exit;
}

if (strlen($new) < 8) {
    http_response_code(400);
    echo json_encode(['error' => 'New password must be at least 8 characters']);
    exit;
}
if (!preg_match('/[A-Z]/', $new)) {
    http_response_code(400);
    echo json_encode(['error' => 'Password must contain at least one uppercase letter']);
    exit;
}
if (!preg_match('/[a-z]/', $new)) {
    http_response_code(400);
    echo json_encode(['error' => 'Password must contain at least one lowercase letter']);
    exit;
}
if (!preg_match('/[0-9]/', $new)) {
    http_response_code(400);
    echo json_encode(['error' => 'Password must contain at least one number']);
    exit;
}
if (!preg_match('/[!@#$%^&*()_+\-=[\]{};\':"\\\\|,.<>\/?]/', $new)) {
    http_response_code(400);
    echo json_encode(['error' => 'Password must contain at least one special character']);
    exit;
}

$stmt = $pdo->prepare('SELECT password FROM users WHERE id = ?');
$stmt->execute([$userId]);
$row = $stmt->fetch();
if (!$row || !password_verify($current, $row['password'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Current password is incorrect']);
    exit;
}

$hash = password_hash($new, PASSWORD_DEFAULT);
$stmt = $pdo->prepare('UPDATE users SET password = ? WHERE id = ?');
$stmt->execute([$hash, $userId]);

echo json_encode(['success' => true]);
