import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './Layout.module.css';

export default function Layout({ children, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          Note Tracker
        </Link>
        {user && (
          <nav className={styles.nav}>
            <Link to="/settings" className={styles.settingsLink} aria-label="Settings">
              <Settings className={styles.settingsIcon} size={22} />
            </Link>
            <div className={styles.logoutBtnWrap}>
              <button type="button" onClick={handleLogout} className={styles.logoutBtn}>
                Log out
              </button>
            </div>
          </nav>
        )}
      </header>
      <main className={styles.main}>
        {title && <h1 className={styles.pageTitle}>{title}</h1>}
        {children}
      </main>
    </div>
  );
}
