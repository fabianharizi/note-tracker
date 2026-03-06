import { apiFetch, apiUrl, getAuthHeaders } from './client';

export async function register(name, email, password) {
  return apiFetch('/api/auth/register.php', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function login(email, password) {
  return apiFetch('/api/auth/login.php', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function validateToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const res = await fetch(apiUrl('/api/auth/validate.php'), {
    headers: getAuthHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return null;
  return data.user;
}

export async function updateProfile(name, email) {
  const data = await apiFetch('/api/auth/profile.php', {
    method: 'PUT',
    body: JSON.stringify({ name, email }),
  });
  return data.user;
}

export async function changePassword(currentPassword, newPassword) {
  await apiFetch('/api/auth/password.php', {
    method: 'PUT',
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });
}
