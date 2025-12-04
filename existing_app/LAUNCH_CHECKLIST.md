# LABL IQ Launch Checklist (Local → Render/Vercel)

## 1) Local Smoke (run this first)
- Backend: `cd existing_app/labl_iq_analysis/hybrid_backend/labl_iq_hybrid_backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt`
- DB: set `DATABASE_URL=postgresql://.../labl_iq_db?schema=public` (docker or local). Apply schema: `prisma migrate deploy`.
- Seed admin: `python scripts/seed_admin.py` (admin@labliq.com / admin123).
- Start API: `python run.py` (docs at http://localhost:8000/docs).
- Frontend: `cd existing_app/labl_iq_frontend/app && npm install`.
- Frontend env: create `.env.local` with `NEXT_PUBLIC_BACKEND_URL=http://localhost:8000`.
- Run UI: `npm run dev` (http://localhost:3000).
- Smoke: follow `existing_app/SMOKE_TEST.md` (login → upload → map → process → view analysis → export).

## 2) Deploy Backend (Render)
- Use `existing_app/labl_iq_analysis/hybrid_backend/labl_iq_hybrid_backend/render.yaml`.
- Create a Render Postgres instance; set `DATABASE_URL` from the Render secret.
- Set env vars (see `existing_app/.env.backend.render.example`): `SECRET_KEY`, `REFRESH_SECRET_KEY`, `ENVIRONMENT=production`, `DEBUG=false`, `CORS_ORIGINS=https://<frontend-domain>`.
- Deploy service (Docker). Health path: `/health`.
- After first boot, run `prisma migrate deploy` against the Render DB (via shell/cron job).

## 3) Deploy Frontend (Vercel or Render)
- Set `NEXT_PUBLIC_BACKEND_URL=https://<backend-host>` (e.g., Render URL).
- Optional: `NEXT_PUBLIC_LEGACY_API_URL` only if you intentionally point at the legacy prototype.
- Build command: `npm run build` (working directory `existing_app/labl_iq_frontend/app`).
- Verify pages: `/login`, `/upload`, `/mapping`, `/analysis/{id}`, `/history`, `/export`, `/dashboard`, `/reports`.

## 4) Post-Deploy Validation
- Login with seeded admin; confirm token refresh works.
- Upload a sample file, map columns, process, view `/analysis/{id}`.
- Download exports (CSV/Excel/PDF) and confirm populated data.
- Spot-check CORS headers and HTTPS on both services.

## 5) Optional Integrations
- AI assistant: set `AI_ASSISTANT_PROVIDER=openai` + `OPENAI_API_KEY` on backend.
- Legacy API: avoid unless migrating; legacy Next.js API routes were removed.
