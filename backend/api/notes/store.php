<?php
/**
 * POST /api/notes/store.php
 * Body: { "section_id": 1, "title": "...", "description": "...", "due_date": "..." }
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
$sectionId = (int) ($input['section_id'] ?? 0);
$title = trim($input['title'] ?? '');
$description = trim($input['description'] ?? '');
$dueDate = !empty($input['due_date']) ? $input['due_date'] : null;

if (!$sectionId || !$title) {
    http_response_code(400);
    echo json_encode(['error' => 'section_id and title are required']);
    exit;
}

$stmt = $pdo->prepare('SELECT id FROM sections WHERE id = ? AND user_id = ?');
$stmt->execute([$sectionId, $userId]);
if (!$stmt->fetch()) {
    http_response_code(404);
    echo json_encode(['error' => 'Section not found']);
    exit;
}

$stmt = $pdo->prepare('INSERT INTO notes (section_id, user_id, title, description, completed, due_date, created_at) VALUES (?, ?, ?, ?, 0, ?, NOW())');
$stmt->execute([$sectionId, $userId, $title, $description, $dueDate]);
$id = (int) $pdo->lastInsertId();

http_response_code(201);
echo json_encode([
    'note' => [
        'id' => $id,
        'section_id' => $sectionId,
        'user_id' => $userId,
        'title' => $title,
        'description' => $description,
        'completed' => false,
        'due_date' => $dueDate,
        'created_at' => date('Y-m-d H:i:s'),
    ],
]);
