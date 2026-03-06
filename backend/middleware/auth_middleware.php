<?php
/**
 * Auth middleware: requires valid JWT and sets $userId in global scope.
 */

require_once __DIR__ . '/../config/jwt.php';

function requireAuth(): ?int {
    $token = getBearerToken();
    if (!$token) {
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Missing or invalid token']);
        return null;
    }
    $payload = jwtDecode($token, $GLOBALS['jwtSecret'] ?? '');
    if (!$payload || empty($payload['user_id'])) {
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Invalid or expired token']);
        return null;
    }
    return (int) $payload['user_id'];
}
