<?php
/**
 * DELETE /api/sections/delete.php
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
    echo json_encode(['error' => 'Section id is required']);
    exit;
}

$pdo->beginTransaction();
try {
    $stmt = $pdo->prepare('DELETE FROM notes WHERE section_id = ? AND user_id = ?');
    $stmt->execute([$id, $userId]);
    $stmt = $pdo->prepare('DELETE FROM sections WHERE id = ? AND user_id = ?');
    $stmt->execute([$id, $userId]);
    $pdo->commit();
    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Section not found']);
        exit;
    }
} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Failed to delete section']);
    exit;
}

echo json_encode(['success' => true]);
