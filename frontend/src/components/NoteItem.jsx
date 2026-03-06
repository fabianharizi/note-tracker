import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import styles from './NoteItem.module.css';

export default function NoteItem({ note, onToggle, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const hasDetails = note.description || note.due_date;

  const dueDisplay = note.due_date
    ? new Date(note.due_date).toLocaleDateString(undefined, { dateStyle: 'short' })
    : null;

  return (
    <div className={`${styles.item} ${note.completed ? styles.completed : ''}`}>
      <div className={styles.row}>
        <button
          type="button"
          className={styles.checkbox}
          onClick={() => onToggle(note)}
          aria-label={note.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {note.completed && <span className={styles.check}>✓</span>}
        </button>
        <div
          className={`${styles.content} ${hasDetails ? styles.expandable : ''}`}
          onClick={() => hasDetails && setExpanded((e) => !e)}
        >
          <span className={styles.title}>{note.title}</span>
          {hasDetails && (
            <span className={styles.meta}>
              {dueDisplay && <span className={styles.due}>{dueDisplay}</span>}
              {note.description && <span className={styles.desc}>•</span>}
            </span>
          )}
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={() => onEdit(note)}
            aria-label="Edit note"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.danger}`}
            onClick={() => onDelete(note)}
            aria-label="Delete note"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      {expanded && hasDetails && (
        <div className={styles.details}>
          {note.description && <p>{note.description}</p>}
          {dueDisplay && <p className={styles.dueDetail}>Due: {dueDisplay}</p>}
        </div>
      )}
    </div>
  );
}
