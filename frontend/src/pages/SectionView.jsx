import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import Layout from '../components/Layout';
import NoteItem from '../components/NoteItem';
import { SECTION_ICONS, getSectionIconComponent } from '../constants/sectionIcons';
import * as sectionsApi from '../api/sections';
import * as notesApi from '../api/notes';
import useIsIOS from '../hooks/useIsIOS';
import styles from './SectionView.module.css';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
];

export default function SectionView() {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const [section, setSection] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [editSection, setEditSection] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [sectionName, setSectionName] = useState('');
  const [error, setError] = useState('');

  const loadSection = useCallback(async () => {
    if (!sectionId) return;
    try {
      const sections = await sectionsApi.getSections();
      const s = sections.find((x) => x.id === parseInt(sectionId, 10));
      if (!s) {
        navigate('/');
        return;
      }
      setSection(s);
      setSectionName(s.name);
    } catch (err) {
      setError(err.message || 'Failed to load section');
    }
  }, [sectionId, navigate]);

  const loadNotes = useCallback(async () => {
    if (!sectionId) return;
    try {
      const data = await notesApi.getNotes(sectionId);
      setNotes(data);
    } catch (err) {
      setError(err.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, [sectionId]);

  useEffect(() => {
    loadSection();
  }, [loadSection]);

  useEffect(() => {
    if (section) loadNotes();
  }, [section, loadNotes]);

  const handleUpdateSection = async () => {
    if (!section || sectionName.trim() === section.name) {
      setEditSection(false);
      return;
    }
    try {
      const updated = await sectionsApi.updateSection(section.id, sectionName.trim(), section.icon ?? null);
      setSection(updated);
      setEditSection(false);
    } catch (err) {
      setError(err.message || 'Failed to update section');
    }
  };

  const handleSectionIconSelect = async (iconId) => {
    if (!section) return;
    try {
      const updated = await sectionsApi.updateSection(section.id, section.name, iconId);
      setSection(updated);
      setShowIconPicker(false);
    } catch (err) {
      setError(err.message || 'Failed to update section icon');
    }
  };

  const handleDeleteSection = async () => {
    if (!section || !window.confirm(`Delete section "${section.name}" and all its notes?`)) return;
    try {
      await sectionsApi.deleteSection(section.id);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to delete section');
    }
  };

  const handleAddNote = async (payload) => {
    try {
      const note = await notesApi.createNote(sectionId, payload);
      setNotes((prev) => [note, ...prev]);
      setShowAdd(false);
    } catch (err) {
      setError(err.message || 'Failed to create note');
    }
  };

  const handleToggle = async (note) => {
    try {
      const updated = await notesApi.updateNote(note.id, { completed: !note.completed });
      setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    } catch (err) {
      setError(err.message || 'Failed to update note');
    }
  };

  const handleEditNote = (note) => setEditNote(note);

  const handleSaveNote = async (id, payload) => {
    try {
      const updated = await notesApi.updateNote(id, payload);
      setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      setEditNote(null);
    } catch (err) {
      setError(err.message || 'Failed to update note');
    }
  };

  const handleDeleteNote = async (note) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await notesApi.deleteNote(note.id);
      setNotes((prev) => prev.filter((n) => n.id !== note.id));
    } catch (err) {
      setError(err.message || 'Failed to delete note');
    }
  };

  const completedNotes = notes.filter((n) => n.completed);
  const handleClearCompleted = async () => {
    if (completedNotes.length === 0 || !window.confirm(`Clear all ${completedNotes.length} completed note(s)?`)) return;
    try {
      for (const note of completedNotes) {
        await notesApi.deleteNote(note.id);
      }
      setNotes((prev) => prev.filter((n) => !n.completed));
    } catch (err) {
      setError(err.message || 'Failed to clear completed');
    }
  };

  const filteredNotes =
    filter === 'active'
      ? notes.filter((n) => !n.completed)
      : filter === 'completed'
        ? notes.filter((n) => n.completed)
        : notes;

  if (!section && !loading) return null;
  if (!section) {
    return (
      <Layout>
        <p className={styles.message}>Loading…</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleRow}>
          <button
            type="button"
            className={styles.sectionIconBtn}
            onClick={() => setShowIconPicker(!showIconPicker)}
            aria-label="Change section icon"
            aria-expanded={showIconPicker}
          >
            {React.createElement(getSectionIconComponent(section.icon), { size: 24, strokeWidth: 2 })}
          </button>
          {editSection ? (
            <div className={styles.sectionEdit}>
              <input
                type="text"
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
                onBlur={handleUpdateSection}
                onKeyDown={(e) => e.key === 'Enter' && handleUpdateSection()}
                className={styles.sectionInput}
                autoFocus
              />
            </div>
          ) : (
            <h1 className={styles.sectionTitle} onClick={() => setEditSection(true)}>
              {section.name}
            </h1>
          )}
          <div className={styles.sectionActions}>
            <button type="button" className={`${styles.iconBtn} ${styles.danger}`} onClick={handleDeleteSection} aria-label="Delete section">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        {showIconPicker && (
          <div className={styles.iconPickerDropdown} role="listbox">
            {SECTION_ICONS.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                className={`${styles.iconPickerDropdownBtn} ${section.icon === id ? styles.iconPickerDropdownBtnActive : ''}`}
                onClick={() => handleSectionIconSelect(id)}
                role="option"
                aria-selected={section.icon === id}
                aria-label={label}
              >
                <Icon size={20} strokeWidth={2} />
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.filtersRow}>
        <div className={styles.filters}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`${styles.filterBtn} ${filter === f.key ? styles.active : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        {completedNotes.length > 0 && (
          <button type="button" className={styles.clearCompletedBtn} onClick={handleClearCompleted} aria-label="Clear all completed">
            Clear completed ({completedNotes.length})
          </button>
        )}
      </div>
      {!showAdd ? (
        <button type="button" className={styles.addNoteBtn} onClick={() => setShowAdd(true)}>
          + Add note
        </button>
      ) : (
        <NoteForm
          onSave={handleAddNote}
          onCancel={() => setShowAdd(false)}
          placeholder="Title"
        />
      )}
      <div className={styles.notesList}>
        {loading ? (
          <p className={styles.message}>Loading notes…</p>
        ) : filteredNotes.length === 0 ? (
          <p className={styles.message}>
            {filter === 'all' ? 'No notes yet.' : `No ${filter} notes.`}
          </p>
        ) : (
          filteredNotes.map((note) =>
            editNote?.id === note.id ? (
              <NoteForm
                key={note.id}
                note={note}
                onSave={(payload) => handleSaveNote(note.id, payload)}
                onCancel={() => setEditNote(null)}
              />
            ) : (
              <NoteItem
                key={note.id}
                note={note}
                onToggle={handleToggle}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
              />
            )
          )
        )}
      </div>
    </Layout>
  );
}

function NoteForm({ note, onSave, onCancel, placeholder = 'Title' }) {
  const [title, setTitle] = useState(note?.title ?? '');
  const [description, setDescription] = useState(note?.description ?? '');
  const [dueDate, setDueDate] = useState(
    note?.due_date ? note.due_date.slice(0, 16) : ''
  );
  const isIOS = useIsIOS();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), description: description.trim() || null, due_date: dueDate || null });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.noteForm}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={placeholder}
        className={styles.noteFormTitle}
        autoFocus
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        className={styles.noteFormDesc}
        rows={2}
      />
      <div className={styles.noteFormDueWrap}>
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className={styles.noteFormDue}
          id="note-due-date"
        />
        {!dueDate && isIOS && (
          <span className={styles.noteFormDuePlaceholder} aria-hidden>Add date/time</span>
        )}
      </div>
      <div className={styles.noteFormActions}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={styles.saveBtn} disabled={!title.trim()}>
          Save
        </button>
      </div>
    </form>
  );
}
