<?php
/**
 * JWT encode/decode helpers.
 * Uses HS256. In production use a strong secret from env.
 */

$jwtSecret = getenv('JWT_SECRET') ?: 'note-tracker-secret-change-in-production';
$jwtExpiry = getenv('JWT_EXPIRY') ?: 86400; // 24 hours

function base64UrlEncode(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64UrlDecode(string $data): string {
    $remainder = strlen($data) % 4;
    if ($remainder) {
        $data .= str_repeat('=', 4 - $remainder);
    }
    return base64_decode(strtr($data, '-_', '+/'));
}

function jwtEncode(array $payload, string $secret, int $expiry): string {
    global $jwtSecret, $jwtExpiry;
    $secret = $secret ?: $GLOBALS['jwtSecret'];
    $expiry = $expiry ?: $GLOBALS['jwtExpiry'];
    $header = ['typ' => 'JWT', 'alg' => 'HS256'];
    $payload['iat'] = time();
    $payload['exp'] = time() + $expiry;
    $headerEnc = base64UrlEncode(json_encode($header));
    $payloadEnc = base64UrlEncode(json_encode($payload));
    $signature = hash_hmac('sha256', "$headerEnc.$payloadEnc", $secret, true);
    $signatureEnc = base64UrlEncode($signature);
    return "$headerEnc.$payloadEnc.$signatureEnc";
}

function jwtDecode(string $token, string $secret): ?array {
    global $jwtSecret;
    $secret = $secret ?: $GLOBALS['jwtSecret'];
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return null;
    }
    [$headerEnc, $payloadEnc, $signatureEnc] = $parts;
    $expected = base64UrlEncode(hash_hmac('sha256', "$headerEnc.$payloadEnc", $secret, true));
    if (!hash_equals($expected, $signatureEnc)) {
        return null;
    }
    $payload = json_decode(base64UrlDecode($payloadEnc), true);
    if (!$payload || !isset($payload['exp']) || $payload['exp'] < time()) {
        return null;
    }
    return $payload;
}

function getBearerToken(): ?string {
    $headers = getallheaders();
    $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    if (preg_match('/Bearer\s+(.+)$/i', $auth, $m)) {
        return trim($m[1]);
    }
    return null;
}
