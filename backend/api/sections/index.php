<?php
/**
 * GET /api/sections/index.php - List all sections for the authenticated user.
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

$stmt = $pdo->prepare('SELECT id, user_id, name, icon, created_at FROM sections WHERE user_id = ? ORDER BY created_at ASC');
$stmt->execute([$userId]);
$sections = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($sections as &$s) {
    $s['id'] = (int) $s['id'];
    $s['user_id'] = (int) $s['user_id'];
}

echo json_encode(['sections' => $sections]);
