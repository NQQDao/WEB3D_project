# AGENTS.md

## Layout
- One npm package, no workspaces. Frontend is React 19 + Vite + Three.js + Zustand in `src/`. Backend is Express 5 + `pg` in `server/`. Everything is ESM (`"type": "module"`).
- The frontend entry is `index.html` -> `src/main.jsx` -> `src/App.jsx`. State lives in `src/stores/use*Store.js`.
- The 3D scene lives in `src/engine/threeEngine.js` (`ShowroomEngine`), which `components/showroom/ShowroomViewport.jsx` mounts. Product, finish and hotspot data (`hotspotsData`, `sofaFinishes`) is exported from `src/stores/useShowroomStore.js` and shared by the engine, the UI and the admin store.
- Textures are drawn procedurally on canvas, so there are no image or model assets.

## Commands
- `npm run dev`: Vite on port 5173. It proxies `/api` to `http://localhost:5000`.
- `npm run server`: Express API on `PORT` (default 5000). It reads `.env`; copy `.env.example` to create one.
- `npm run db:migrate`: runs `server/schema.sql` (idempotent: `CREATE ... IF NOT EXISTS` plus seed data) against `DATABASE_URL`. It catches SQL errors and still exits 0, so read its output.
- `npm run build`: writes `dist/`. Use it as the main check.
- There is no test runner, linter, formatter or typecheck.

## Gotchas
- The frontend still works without the backend or Postgres. `src/api.js` checks `/api/health`, and if that fails, each call returns `{ offline: true }` and the stores fall back to localStorage. Any new API method needs the same offline fallback.
- `JWT_SECRET` is in `.env.example`, but no code uses it: there is no JWT or password hashing. Auth routes look users up by email.
- Source files, comments and UI text are in Vietnamese (UTF-8). PowerShell `Get-Content` without `-Encoding utf8` shows garbled text. Never rewrite files through a shell that might re-encode them.

## Workflow
- The repo uses OpenSpec (`openspec/`). Its skills and commands are generated into `.opencode/` (OpenCode) and `.agents/` (Antigravity) by `openspec init --tools "opencode,antigravity"`; regenerate them that way instead of editing them by hand. In PowerShell, quote the tool list. Active change proposals are in `openspec/changes/<name>/` (proposal, design, specs, tasks). Use the openspec-* skills to propose, apply or archive changes.
