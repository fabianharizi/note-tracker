# 📌 Note Tracker PWA -- Project Context

## 🧠 Project Overview

This is a **Note Tracker / Daily Management App** designed to reduce
mental overload and help organize different areas of life.

The app will contain multiple **Sections** (such as School, Work, Gym,
Personal).\
Each Section will contain **To-Do Notes**.

The focus is: - Simplicity - Clean UI - Fast interactions - Mobile-first
design - Low cognitive friction

The app will: - Work as a Progressive Web App (PWA) - Be wrapped using
Capacitor for mobile usage - Support authentication (Register / Login) -
Use a React frontend and PHP backend

------------------------------------------------------------------------

# 🏗 Tech Stack

## Frontend

-   React (Vite)
-   React Router
-   Context API (or Zustand if needed)
-   Fetch API for backend communication
-   vite-plugin-pwa
-   Capacitor (Android initially)

## Backend

-   Vanilla PHP (no Laravel)
-   REST-style API
-   MySQL database
-   JWT authentication
-   Apache (XAMPP for local development)

------------------------------------------------------------------------

# 🔐 Authentication Requirements

-   User registration
-   User login
-   JWT-based authentication
-   Store JWT in:
    -   localStorage (web)
    -   Capacitor secure storage (future mobile improvement)
-   Protected frontend routes
-   Token validation middleware in PHP
-   JWT expiration handling

------------------------------------------------------------------------

# 📦 Core Features (MVP)

## 1️⃣ Sections

Each authenticated user can: - Create sections - Rename sections -
Delete sections - View all their sections

Example sections: - School - Work - Gym - Personal

Each section belongs to one user.

------------------------------------------------------------------------

## 2️⃣ Notes / Todos

Each note belongs to a specific section and user.

Each note contains: - id - title - description (optional) - completed
(boolean) - created_at - due_date (optional)

User should be able to: - Create note - Edit note - Delete note - Mark
as complete - Filter (All / Completed / Active)

------------------------------------------------------------------------

# 🗄 Database Structure

## users

-   id (INT, PK)
-   name (VARCHAR)
-   email (VARCHAR)
-   password (VARCHAR, hashed)
-   created_at (DATETIME)

## sections

-   id (INT, PK)
-   user_id (INT, FK)
-   name (VARCHAR)
-   created_at (DATETIME)

## notes

-   id (INT, PK)
-   section_id (INT, FK)
-   user_id (INT, FK)
-   title (VARCHAR)
-   description (TEXT)
-   completed (TINYINT)
-   due_date (DATETIME, nullable)
-   created_at (DATETIME)

------------------------------------------------------------------------

# 🌐 API Endpoints Structure

## Auth

POST /api/auth/register.php\
POST /api/auth/login.php\
GET /api/auth/validate.php

## Sections

GET /api/sections/index.php\
POST /api/sections/store.php\
PUT /api/sections/update.php\
DELETE /api/sections/delete.php

## Notes

GET /api/notes/index.php?section_id=\
POST /api/notes/store.php\
PUT /api/notes/update.php\
DELETE /api/notes/delete.php

------------------------------------------------------------------------

# 📁 Suggested Folder Structure

## Frontend (React + Vite)

src/ ├── api/ │ ├── auth.js │ ├── sections.js │ └── notes.js │ ├──
context/ │ ├── AuthContext.jsx │ └── AppContext.jsx │ ├── components/ │
├── SectionCard.jsx │ ├── NoteItem.jsx │ └── Layout.jsx │ ├── pages/ │
├── Login.jsx │ ├── Register.jsx │ ├── Dashboard.jsx │ └──
SectionView.jsx │ ├── hooks/ │ └── useAuth.js │ ├── App.jsx └── main.jsx

------------------------------------------------------------------------

## Backend (PHP)

/api /config database.php cors.php jwt.php

/middleware auth_middleware.php

/auth register.php login.php validate.php

/sections index.php store.php update.php delete.php

/notes index.php store.php update.php delete.php

------------------------------------------------------------------------

# 📱 PWA Requirements

-   Installable on mobile
-   Works offline for:
    -   Viewing cached sections
    -   Viewing cached notes
-   Syncs when back online
-   Uses vite-plugin-pwa
-   Caching strategy:
    -   Cache static assets
    -   Network-first for API calls

------------------------------------------------------------------------

# 📲 Capacitor Requirements

1.  Build as PWA first
2.  Initialize Capacitor
3.  Add Android platform
4.  Use WebView

Future improvements: - Push notifications for due dates - Native secure
token storage - Background sync

------------------------------------------------------------------------

# 🎯 UX Requirements

-   Minimal design
-   Mobile-first
-   Fast task creation
-   Clean typography
-   Smooth transitions
-   Dark mode support
-   Quick filtering options

------------------------------------------------------------------------

# 🚀 Future Improvements (Post-MVP)

-   Drag & drop reordering
-   Daily summary dashboard
-   Calendar view
-   Recurring tasks
-   Push notifications
-   Tags
-   Search
-   Weekly productivity analytics

------------------------------------------------------------------------

# 🧩 State Management Philosophy

-   Global auth state
-   Sections & notes fetched per user
-   Optimistic UI updates where possible
-   Avoid unnecessary re-renders
-   Clean separation of concerns

------------------------------------------------------------------------

# 🛡 Security Requirements

-   Use password_hash() in PHP
-   Use password_verify() on login
-   JWT expiration handling
-   Validate user ownership of data
-   Proper CORS configuration
-   Input sanitization
-   Prepared statements (PDO)
-   No direct SQL string concatenation

------------------------------------------------------------------------

# 🧠 Architecture Principles

-   Backend is API-only
-   Frontend and backend are separated
-   Modular structure
-   Reusable components
-   Scalable design
-   Clean code practices

------------------------------------------------------------------------

# 🎯 Project Goal

Build a structured, scalable productivity system that:

-   Reduces mental load
-   Improves daily organization
-   Is mobile-ready
-   Is secure
-   Can grow into a full productivity ecosystem
