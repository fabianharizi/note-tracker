# Note Tracker PWA

A minimal **Note Tracker / Daily Management** app: sections (e.g. School, Work, Gym) and to-do notes per section. React frontend + PHP backend, PWA-ready.

## Project structure

- **`frontend/`** – React (Vite), React Router, PWA plugin
- **`backend/`** – Vanilla PHP REST API, JWT auth, MySQL

## Prerequisites

- Node.js 18+
- PHP 7.4+ with PDO MySQL
- MySQL (e.g. XAMPP)
- Apache (e.g. XAMPP) serving the project at `http://localhost/note-tracker/`

## 1. Database

**You must create the database and tables first**, or you'll get "Database connection failed" or "Unknown database 'note_tracker'".

- Start **MySQL** in XAMPP (Apache + MySQL).
- Create the DB and tables using one of these:

**Option A – command line (same machine as MySQL):**
```bash
mysql -u root -p < backend/database/schema.sql
```
(Leave password empty if you didn't set one for root.)

**Option B – phpMyAdmin:**  
Open http://localhost/phpmyadmin → Import → choose `backend/database/schema.sql` → Execute.

The schema creates the database `note_tracker` and the `users`, `sections`, and `notes` tables.

## 2. Backend (PHP)

- Document root must serve the project so the backend is at  
  `http://localhost/note-tracker/backend/`
- Copy `backend/config/config.local.php.example` to `backend/config/config.local.php` and set your MySQL credentials (XAMPP default: `root` / no password). The repo includes a `config.local.php` with defaults and `show_error: true` so you see the real DB error if something fails.
- Start **Apache** (and MySQL) in XAMPP.

## 3. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

- App: **http://localhost:5173**
- In dev, API requests to `/api/*` are proxied to  
  `http://localhost/note-tracker/backend/api/` (see `frontend/vite.config.js`).

If your backend URL is different, set in `frontend/.env`:

```env
VITE_API_BASE=http://localhost/note-tracker/backend
```

(No trailing slash.)

## 4. Build for production

```bash
cd frontend
npm run build
```

Serve the `frontend/dist` folder and point the API to your PHP backend (same origin or set `VITE_API_BASE` before building).

## PWA (Progressive Web App)

The app is set up as a PWA:

- **Install:** After building and serving over **HTTPS** (or `localhost`), use the browser’s “Install” / “Add to Home Screen” option. Installability requires the production build (service worker and manifest are generated on `npm run build`).
- **Offline:** Static assets and the app shell are cached. API requests use a network-first strategy (cached when online, so previously loaded data can appear when offline).
- **Updates:** When you deploy a new build, the “New content available” toast appears; users can reload to get the latest version.

Icons and manifest are in `frontend/public/icons/` and `vite.config.js`. For best install support on all devices, serve the app over HTTPS in production.

## Features (MVP)

- **Auth:** Register, login, JWT (stored in `localStorage` on web).
- **Sections:** Create, rename, delete; list all.
- **Notes:** Create, edit, delete, mark complete; optional description and due date; filter All / Active / Completed.
- **UI:** Mobile-first, dark theme, minimal layout.

## API base URL

- **Development:** Proxy in Vite sends `/api` to `/note-tracker/backend/api`. No `.env` needed if you use the default XAMPP path.
- **Production:** Set `VITE_API_BASE` to your backend base URL (e.g. `https://api.example.com`) and rebuild.
