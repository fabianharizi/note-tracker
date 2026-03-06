import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Sun, Moon, Monitor } from 'lucide-react';
import Layout from '../components/Layout';
import PasswordInput from '../components/PasswordInput';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { validatePassword, PASSWORD_HINT } from '../utils/password';
import * as authApi from '../api/auth';
import styles from './Settings.module.css';

export default function Settings() {
  const { user, updateUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    if (user) {
      setProfileName(user.name ?? '');
      setProfileEmail(user.email ?? '');
    }
  }, [user]);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const [showAbout, setShowAbout] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMessage({ type: '', text: '' });
    setProfileSaving(true);
    try {
      const updated = await authApi.updateProfile(profileName.trim(), profileEmail.trim());
      updateUser(updated);
      setProfileMessage({ type: 'success', text: 'Profile updated.' });
    } catch (err) {
      setProfileMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });
    const check = validatePassword(newPassword);
    if (!check.valid) {
      setPasswordMessage({ type: 'error', text: check.message });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    setPasswordSaving(true);
    try {
      await authApi.changePassword(currentPassword, newPassword);
      setPasswordMessage({ type: 'success', text: 'Password changed.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordMessage({ type: 'error', text: err.message || 'Failed to change password.' });
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <Layout title="Settings">
      <div className={styles.sections}>
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Appearance</h2>
          <div className={styles.themeRow}>
            <span className={styles.themeLabel}>Theme</span>
            <div className={styles.themeOptions} role="group" aria-label="Theme">
              {[
                { value: 'light', label: 'Light', Icon: Sun },
                { value: 'dark', label: 'Dark', Icon: Moon },
                { value: 'auto', label: 'Auto', Icon: Monitor },
              ].map(({ value, label, Icon }) => (
                <button
                  key={value}
                  type="button"
                  className={`${styles.themeBtn} ${theme === value ? styles.themeBtnActive : ''}`}
                  onClick={() => setTheme(value)}
                  aria-pressed={theme === value}
                  aria-label={label}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Profile</h2>
          <form onSubmit={handleProfileSubmit} className={styles.form}>
            {profileMessage.text && (
              <p className={profileMessage.type === 'success' ? styles.messageSuccess : styles.messageError}>
                {profileMessage.text}
              </p>
            )}
            <label className={styles.label}>
              Name
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className={styles.input}
                required
                autoComplete="name"
              />
            </label>
            <label className={styles.label}>
              Email
              <input
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className={styles.input}
                required
                autoComplete="email"
              />
            </label>
            <button type="submit" className={styles.primaryBtn} disabled={profileSaving}>
              {profileSaving ? 'Saving…' : 'Save profile'}
            </button>
          </form>
        </section>

        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Password</h2>
          <form onSubmit={handlePasswordSubmit} className={styles.form}>
            {passwordMessage.text && (
              <p className={passwordMessage.type === 'success' ? styles.messageSuccess : styles.messageError}>
                {passwordMessage.text}
              </p>
            )}
            <label className={styles.label}>
              Current password
              <PasswordInput
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={styles.input}
                required
                autoComplete="current-password"
              />
            </label>
            <label className={styles.label}>
              New password
              <PasswordInput
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={styles.input}
                required
                minLength={8}
                autoComplete="new-password"
              />
              <span className={styles.hint}>{PASSWORD_HINT}</span>
            </label>
            <label className={styles.label}>
              Confirm new password
              <PasswordInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </label>
            <button type="submit" className={styles.primaryBtn} disabled={passwordSaving}>
              {passwordSaving ? 'Updating…' : 'Change password'}
            </button>
          </form>
        </section>

        <section className={styles.card}>
          <button
            type="button"
            className={styles.aboutToggleBtn}
            onClick={() => setShowAbout(!showAbout)}
            aria-expanded={showAbout}
          >
            <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>About</h2>
            <span className={styles.aboutToggleIcon}>{showAbout ? '−' : '+'}</span>
          </button>

          {showAbout && (
            <div className={styles.infoContent}>
              <p className={styles.infoRow}>
                <strong>Version:</strong> 1.1.0
              </p>
              <p className={styles.infoRow}>
                <strong>Built by:</strong> Fabian Harizi
              </p>
              <p className={styles.infoRow}>
                <strong>Contact:</strong> <a href="mailto:fabianharizi123@gmail.com">fabianharizi123@gmail.com</a>
              </p>

              <div className={styles.disclaimerBlock}>
                <p><strong>Privacy:</strong> We will not share your data with anyone.</p>
                <br />
                <p><strong>Disclaimer:</strong> This application is provided "as is", without warranty of any kind. The developer assumes no liability or legal responsibility for the nature, accuracy, or consequences of the content created or stored within the app by its users, nor for the general usage of the application.</p>
              </div>
            </div>
          )}
        </section>

        <section className={`${styles.card} ${styles.logoutSection}`}>
          <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={20} />
            Log out
          </button>
        </section>
      </div>
    </Layout>
  );
}
