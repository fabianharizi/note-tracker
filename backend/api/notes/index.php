<?php
/**
 * GET /api/notes/index.php?section_id=1 - List notes for a section (authenticated user).
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$userId = requireAuth();
if ($userId === null) {
    exit;
}

$sectionId = (int) ($_GET['section_id'] ?? 0);
if (!$sectionId) {
    http_response_code(400);
    echo json_encode(['error' => 'section_id is required']);
    exit;
}

$stmt = $pdo->prepare('SELECT id, section_id, user_id, title, description, completed, due_date, created_at FROM notes WHERE section_id = ? AND user_id = ? ORDER BY created_at DESC');
$stmt->execute([$sectionId, $userId]);
$notes = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($notes as &$n) {
    $n['id'] = (int) $n['id'];
    $n['section_id'] = (int) $n['section_id'];
    $n['user_id'] = (int) $n['user_id'];
    $n['completed'] = (bool) (int) $n['completed'];
}

echo json_encode(['notes' => $notes]);
