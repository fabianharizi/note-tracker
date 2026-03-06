import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import styles from './PWAPrompt.module.css';

/**
 * Shows when a new version is available (after build) or when app is ready for offline use.
 * Only rendered in production build where the service worker is active.
 */
export default function PWAPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration) {
      if (import.meta.env.DEV) return;
      console.log('SW registered:', registration);
    },
    onRegisterError(error) {
      console.warn('SW registration error:', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) return null;

  return (
    <div className={styles.toast} role="alert">
      {needRefresh ? (
        <>
          <p className={styles.message}>New content available.</p>
          <div className={styles.actions}>
            <button type="button" className={styles.btn} onClick={() => updateServiceWorker(true)}>
              Reload
            </button>
            <button type="button" className={styles.btnSecondary} onClick={close}>
              Close
            </button>
          </div>
        </>
      ) : (
        <>
          <p className={styles.message}>App ready to work offline.</p>
          <button type="button" className={styles.btn} onClick={close}>
            Close
          </button>
        </>
      )}
    </div>
  );
}
