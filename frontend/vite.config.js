import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/*.ico'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,woff,ico}'],
        navigateFallback: '/index.html',
        navigateFallbackAllowlist: [/^\/.*/],
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: /^https?:\/\/.*\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      manifest: {
        name: 'Note Tracker',
        short_name: 'NoteTracker',
        description: 'Daily management & note tracking app',
        theme_color: '#1a1b26',
        background_color: '#16161e',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        id: '/',
        icons: [
          {
            src: 'favicon.ico',
            sizes: '192x192',
            type: 'image/x-icon',
            purpose: 'any',
          },
          {
            src: 'favicon.ico',
            sizes: '512x512',
            type: 'image/x-icon',
            purpose: 'any',
          },
          {
            src: 'favicon.ico',
            sizes: '512x512',
            type: 'image/x-icon',
            purpose: 'maskable',
          },
        ],
        categories: ['productivity', 'utilities'],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/note-tracker/backend/api'),
      },
    },
  },
});
