<?php
/**
 * DELETE /api/notes/delete.php
 * Body: { "id": 1 }
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
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

if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'Note id is required']);
    exit;
}

$stmt = $pdo->prepare('DELETE FROM notes WHERE id = ? AND user_id = ?');
$stmt->execute([$id, $userId]);
if ($stmt->rowCount() === 0) {
    http_response_code(404);
    echo json_encode(['error' => 'Note not found']);
    exit;
}

echo json_encode(['success' => true]);
