<?php
/**
 * PUT /api/notes/update.php
 * Body: { "id": 1, "title": "...", "description": "...", "completed": true, "due_date": "..." }
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
$title = isset($input['title']) ? trim($input['title']) : null;
$description = isset($input['description']) ? trim($input['description']) : null;
$completed = isset($input['completed']) ? (int) (bool) $input['completed'] : null;
$dueDate = array_key_exists('due_date', $input) ? ($input['due_date'] ?: null) : null;

if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'Note id is required']);
    exit;
}

$stmt = $pdo->prepare('SELECT id, section_id, user_id, title, description, completed, due_date, created_at FROM notes WHERE id = ? AND user_id = ?');
$stmt->execute([$id, $userId]);
$note = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$note) {
    http_response_code(404);
    echo json_encode(['error' => 'Note not found']);
    exit;
}

$updates = [];
$params = [];
if ($title !== null) {
    $updates[] = 'title = ?';
    $params[] = $title;
}
if ($description !== null) {
    $updates[] = 'description = ?';
    $params[] = $description;
}
if ($completed !== null) {
    $updates[] = 'completed = ?';
    $params[] = $completed;
}
if ($dueDate !== null) {
    $updates[] = 'due_date = ?';
    $params[] = $dueDate;
}

if (empty($updates)) {
    $note['id'] = (int) $note['id'];
    $note['section_id'] = (int) $note['section_id'];
    $note['user_id'] = (int) $note['user_id'];
    $note['completed'] = (bool) (int) $note['completed'];
    echo json_encode(['note' => $note]);
    exit;
}

$params[] = $id;
$params[] = $userId;
$sql = 'UPDATE notes SET ' . implode(', ', $updates) . ' WHERE id = ? AND user_id = ?';
$stmt = $pdo->prepare($sql);
$stmt->execute($params);

$stmt = $pdo->prepare('SELECT id, section_id, user_id, title, description, completed, due_date, created_at FROM notes WHERE id = ?');
$stmt->execute([$id]);
$note = $stmt->fetch(PDO::FETCH_ASSOC);
$note['id'] = (int) $note['id'];
$note['section_id'] = (int) $note['section_id'];
$note['user_id'] = (int) $note['user_id'];
$note['completed'] = (bool) (int) $note['completed'];

echo json_encode(['note' => $note]);
