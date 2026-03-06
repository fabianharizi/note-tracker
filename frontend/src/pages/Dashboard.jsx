import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import SectionCard from '../components/SectionCard';
import { SECTION_ICONS, getSectionIconComponent } from '../constants/sectionIcons';
import * as sectionsApi from '../api/sections';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [showAddSection, setShowAddSection] = useState(false);
  const popupRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowIconPicker(false);
      }
    };
    if (showIconPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showIconPicker]);

  const loadSections = async () => {
    try {
      const data = await sectionsApi.getSections();
      setSections(data);
    } catch (err) {
      setError(err.message || 'Failed to load sections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSections();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    setAdding(true);
    setError('');
    try {
      const section = await sectionsApi.createSection(name, selectedIcon);
      setSections((prev) => [...prev, section]);
      setNewName('');
      setSelectedIcon(null);
      setShowIconPicker(false);
      setShowAddSection(false);
    } catch (err) {
      setError(err.message || 'Failed to create section');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Sections">
        <p className={styles.message}>Loading…</p>
      </Layout>
    );
  }

  return (
    <Layout title="Sections">
      {error && <p className={styles.error}>{error}</p>}
      {!showAddSection ? (
        <button type="button" className={styles.addSectionBtn} onClick={() => setShowAddSection(true)}>
          + Add section
        </button>
      ) : (
        <form onSubmit={handleAdd} className={styles.addForm}>
          <div className={styles.addFormFields}>
            <div className={`${styles.addInputWrapper} ${showIconPicker ? styles.addInputWrapperPopupOpen : ''}`} ref={popupRef}>
              <button
                type="button"
                className={styles.addInputIconBtn}
                onClick={() => setShowIconPicker(!showIconPicker)}
                aria-label="Select section icon"
              >
                {React.createElement(getSectionIconComponent(selectedIcon), { size: 20 })}
              </button>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="New section (e.g. Work, Gym)"
                className={styles.addInput}
                disabled={adding}
                autoFocus
              />
              {showIconPicker && (
                <div className={styles.iconPickerPopup} role="group" aria-label="Section icon">
                  {SECTION_ICONS.map(({ id, label, Icon }) => (
                    <button
                      key={id}
                      type="button"
                      className={`${styles.iconPickerBtn} ${selectedIcon === id ? styles.iconPickerBtnActive : ''}`}
                      onClick={() => {
                        setSelectedIcon(selectedIcon === id ? null : id);
                        setShowIconPicker(false);
                      }}
                      title={label}
                      aria-label={label}
                      aria-pressed={selectedIcon === id}
                    >
                      <Icon size={20} strokeWidth={2} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className={styles.addFormActions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => {
                setShowAddSection(false);
                setNewName('');
                setSelectedIcon(null);
                setShowIconPicker(false);
                setError('');
              }}
            >
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn} disabled={adding || !newName.trim()}>
              Save
            </button>
          </div>
        </form>
      )}
      <div className={styles.list}>
        {sections.length === 0 ? (
          <p className={styles.message}>No sections yet. Add one above.</p>
        ) : (
          sections.map((s) => <SectionCard key={s.id} section={s} />)
        )}
      </div>
    </Layout>
  );
}
