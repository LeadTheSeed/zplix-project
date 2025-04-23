# Zplix Backend

A simple Node.js + Express + SQLite backend for Zplix Tools.

## Features
- Submit apps (name, category, keywords, code)
- Admin approve/disapprove/remove apps
- Serve each approved app at `/apps/:slug`
- List pending and approved apps

## Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```
2. **Run the server:**
   ```bash
   npm start
   ```
   The server will run on http://localhost:3001

## API Endpoints

- `POST /api/submit` — Submit a new app
- `GET /api/pending?admin=Admin` — List pending apps (admin only)
- `GET /api/approved` — List approved apps
- `POST /api/approve` — Approve an app (admin only)
- `POST /api/disapprove` — Disapprove an app (admin only)
- `DELETE /api/remove` — Remove an app (admin only)
- `GET /apps/:slug` — View an approved app as a real subpage
- `GET /api/app/:slug` — Get app JSON by slug

## Admin Password
Default: `Admin`

## Database
- SQLite file: `zplix.sqlite` (created automatically)

---

**Frontend integration and advanced features coming next!**
