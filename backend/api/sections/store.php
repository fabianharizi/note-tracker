<?php
/**
 * POST /api/sections/store.php
 * Body: { "name": "..." }
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$userId = requireAuth();
if ($userId === null) {
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$name = trim($input['name'] ?? '');
$icon = isset($input['icon']) ? trim($input['icon']) : null;
if ($icon === '') $icon = null;

if (!$name) {
    http_response_code(400);
    echo json_encode(['error' => 'Section name is required']);
    exit;
}

$stmt = $pdo->prepare('INSERT INTO sections (user_id, name, icon, created_at) VALUES (?, ?, ?, NOW())');
$stmt->execute([$userId, $name, $icon]);
$id = (int) $pdo->lastInsertId();

http_response_code(201);
echo json_encode([
    'section' => [
        'id' => $id,
        'user_id' => $userId,
        'name' => $name,
        'icon' => $icon,
        'created_at' => date('Y-m-d H:i:s'),
    ],
]);
