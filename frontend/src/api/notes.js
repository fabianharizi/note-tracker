import { apiFetch } from './client';

export async function getNotes(sectionId) {
  const data = await apiFetch(`/api/notes/index.php?section_id=${sectionId}`);
  return data.notes;
}

export async function createNote(sectionId, { title, description, due_date }) {
  const data = await apiFetch('/api/notes/store.php', {
    method: 'POST',
    body: JSON.stringify({ section_id: sectionId, title, description, due_date: due_date || null }),
  });
  return data.note;
}

export async function updateNote(id, payload) {
  const data = await apiFetch('/api/notes/update.php', {
    method: 'PUT',
    body: JSON.stringify({ id, ...payload }),
  });
  return data.note;
}

export async function deleteNote(id) {
  await apiFetch('/api/notes/delete.php', {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  });
}
