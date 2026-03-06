<?php
/**
 * PUT /api/sections/update.php
 * Body: { "id": 1, "name": "..." }
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
$id = (int) ($input['id'] ?? 0);
$name = trim($input['name'] ?? '');
$icon = array_key_exists('icon', $input) ? ($input['icon'] !== '' && $input['icon'] !== null ? trim($input['icon']) : null) : null;

if (!$id || !$name) {
    http_response_code(400);
    echo json_encode(['error' => 'Section id and name are required']);
    exit;
}

if (array_key_exists('icon', $input)) {
    $stmt = $pdo->prepare('UPDATE sections SET name = ?, icon = ? WHERE id = ? AND user_id = ?');
    $stmt->execute([$name, $icon, $id, $userId]);
} else {
    $stmt = $pdo->prepare('UPDATE sections SET name = ? WHERE id = ? AND user_id = ?');
    $stmt->execute([$name, $id, $userId]);
}
if ($stmt->rowCount() === 0) {
    http_response_code(404);
    echo json_encode(['error' => 'Section not found']);
    exit;
}

$stmt = $pdo->prepare('SELECT id, user_id, name, icon, created_at FROM sections WHERE id = ?');
$stmt->execute([$id]);
$section = $stmt->fetch(PDO::FETCH_ASSOC);
$section['id'] = (int) $section['id'];
$section['user_id'] = (int) $section['user_id'];

echo json_encode(['section' => $section]);
