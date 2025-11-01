# Level 4 — Strange’s 14,000,605 Timelines (Minimal UI)

A complete, hostable app for the CSV → Hidden Pattern → Word challenge.

**This build removes:** in-app scatter preview & in-app QR scanner.
Teams must figure out what to do with the CSV themselves.

## Quick Start

### Backend
```bash
cd server
cp .env.example .env
# Edit secrets in .env
npm i
npm run dev
```
- Put one CSV per team in `server/src/datasets/` named exactly `<TEAM_CODE>.csv`.
- Map team codes to words in `server/src/data/teams.json`.
- Submissions are persisted to `server/src/data/submissions.json`.

### Frontend
```bash
cd web
npm i
# (Optional) echo "VITE_API_BASE=http://localhost:4000" > .env
npm run dev
```
Open http://localhost:5173

### Admin
- GET `/api/admin/status` with header `x-admin-token: <ADMIN_TOKEN>`

### Deploy
- Build frontend: `npm run build` then host `web/dist` (Nginx/Netlify/Vercel).
- Run server (Node 18+) behind HTTPS reverse proxy.
"# chakrvyuh-aiml-2-3" 
