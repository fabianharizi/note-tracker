import { apiFetch } from './client';

export async function getSections() {
  const data = await apiFetch('/api/sections/index.php');
  return data.sections;
}

export async function createSection(name, icon = null) {
  const data = await apiFetch('/api/sections/store.php', {
    method: 'POST',
    body: JSON.stringify({ name, icon: icon || null }),
  });
  return data.section;
}

export async function updateSection(id, name, icon = null) {
  const body = { id, name };
  if (icon !== undefined) body.icon = icon;
  const data = await apiFetch('/api/sections/update.php', {
    method: 'PUT',
    body: JSON.stringify(body),
  });
  return data.section;
}

export async function deleteSection(id) {
  await apiFetch('/api/sections/delete.php', {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  });
}
