<?php
/**
 * PUT /api/auth/profile.php
 * Body: { "name": "...", "email": "..." }
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
$name = isset($input['name']) ? trim($input['name']) : null;
$email = isset($input['email']) ? trim($input['email']) : null;

if ($name === null && $email === null) {
    http_response_code(400);
    echo json_encode(['error' => 'Provide at least name or email']);
    exit;
}

$stmt = $pdo->prepare('SELECT id, name, email FROM users WHERE id = ?');
$stmt->execute([$userId]);
$user = $stmt->fetch();
if (!$user) {
    http_response_code(404);
    echo json_encode(['error' => 'User not found']);
    exit;
}

$updates = [];
$params = [];

if ($name !== null) {
    if ($name === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Name cannot be empty']);
        exit;
    }
    $updates[] = 'name = ?';
    $params[] = $name;
}

if ($email !== null) {
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid email']);
        exit;
    }
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? AND id != ?');
    $stmt->execute([$email, $userId]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['error' => 'Email already in use']);
        exit;
    }
    $updates[] = 'email = ?';
    $params[] = $email;
}

if (empty($updates)) {
    echo json_encode([
        'user' => [
            'id' => (int) $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
        ],
    ]);
    exit;
}

$params[] = $userId;
$sql = 'UPDATE users SET ' . implode(', ', $updates) . ' WHERE id = ?';
$stmt = $pdo->prepare($sql);
$stmt->execute($params);

$stmt = $pdo->prepare('SELECT id, name, email FROM users WHERE id = ?');
$stmt->execute([$userId]);
$user = $stmt->fetch();

echo json_encode([
    'user' => [
        'id' => (int) $user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
    ],
]);
