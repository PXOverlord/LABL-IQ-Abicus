# LABL IQ - Abicus (Full-Stack Shipping Analytics Platform)

## 🚀 Project Overview

LABL IQ - Abicus is a full-stack shipping analytics platform for advanced Amazon rate analysis, built with:
- **Frontend:** Next.js (React, TypeScript, TailwindCSS, Prisma, NextAuth)
- **Backend:** FastAPI (Python, Pandas, Numpy, Pydantic, Prisma, PostgreSQL)
- **Database:** PostgreSQL (via Prisma ORM)
- **Agent/AI Integration:** Designed for Codex, GPT, and automation agents

---

## 🏗️ Architecture

```
project-root/
├── existing_app/
│   ├── labl_iq_frontend/         # Next.js frontend (main app)
│   ├── labl_iq_analysis/         # Backend (FastAPI, API, DB)
│   └── ...
├── ARCHIVE_DO_NOT_USE/           # Old/legacy code (not maintained)
├── figma_design/                 # Figma-based design reference
└── ...
```

- **Frontend:** `existing_app/labl_iq_frontend/app/`
- **Backend:** `existing_app/labl_iq_analysis/hybrid_backend/labl_iq_hybrid_backend/`
- **Figma/Design:** `existing_app/labl_iq_frontend_figma/`, `figma_design/`
- **Archive:** `ARCHIVE_DO_NOT_USE/` (for reference only)

---

## ⚡ Quick Start

### 1. Backend (FastAPI)

```bash
cd existing_app/labl_iq_analysis/hybrid_backend/labl_iq_hybrid_backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python run.py
# API docs: http://localhost:8000/docs
```

- **Docker Compose:**
  - `docker-compose up` (runs backend + PostgreSQL)
- **Reference Data:**
  - `app/services/reference_data/2025 Labl IQ Rate Analyzer Template.xlsx` (required for rate calculations)

### 2. Frontend (Next.js)

```bash
cd existing_app/labl_iq_frontend/app
npm install
npm run dev
# App: http://localhost:3000
```

- **Prisma:**
  - `npx prisma generate` (after any schema changes)
  - `npx prisma migrate dev` (to apply migrations)

---

## 🗂️ Excluded Files & How to Access

**Excluded by .gitignore:**
- `node_modules/`, `.next/`, `.env*`, `*.log`, `*.zip`, `*.pdf`, `*.xlsx`, `*.csv`, `uploads/`, `*.db`, `*.sqlite`, `*.pkl`, `*.egg*`, `venv/`, `ENV/`, `env/`, `.DS_Store`, `.idea/`, `.vscode/`, `test_upload.csv`, build/dist/coverage/
- **Reference Data:** Only `app/services/reference_data/2025 Labl IQ Rate Analyzer Template.xlsx` is included (backend)
- **Uploads:** User-uploaded files are not tracked
- **Large binaries:** Not in repo; request from project owner if needed

**How to access excluded files:**
- Reference data: See backend folder above
- Uploads: Place your test files in the appropriate `uploads/` directory
- Environment: Create `.env` files as needed (see sample in backend/frontend)

---

## 🤖 Agent & Automation Documentation

### Connecting Agents (Codex, GPT, etc.)
- **GitHub Repo:** https://github.com/PXOverlord/LABL-IQ-Abicus
- **API Docs:** http://localhost:8000/docs (when backend is running)
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:8000

### What Agents Can Do
- Analyze code, generate tests, refactor, or automate flows
- Use API endpoints for file upload, mapping, processing, and results
- Modify frontend (React/Next.js) or backend (FastAPI) code
- Add new features, fix bugs, or update documentation

### Key API Endpoints (Backend)
- `POST /api/upload` - Upload CSV/Excel
- `POST /api/map-columns` - Map columns
- `POST /api/process` - Process data
- `GET /api/results/{id}` - Get results
- `POST /api/export` - Export results
- `GET /health` - Health check
- `GET /docs` - Interactive API docs

### Frontend Automation
- All main flows are in `existing_app/labl_iq_frontend/app/app/`
- State management: Zustand stores in `lib/stores/`
- API calls: `lib/api.ts`
- Auth: NextAuth, see `middleware.ts` (auth disabled for testing)

---

## 📈 Project Scope & Stages

### Current Scope
- Amazon shipping rate analysis (advanced engine)
- File upload, mapping, and processing
- Dashboard, history, settings, admin, profiles (frontend)
- Export and reporting
- User authentication (NextAuth, JWT-ready)
- CORS, error handling, and robust API

### Stages
1. **MVP:** File upload, mapping, rate analysis, dashboard
2. **Advanced:** User profiles, settings, admin, export
3. **Enterprise:** Auth, DB persistence, S3, background jobs, monitoring
4. **Agent/AI:** Codex/GPT integration, agent workflows, auto-documentation

---

## 🧑‍💻 Contribution & Troubleshooting

- **Contributing:**
  - Fork, branch, PR workflow
  - Use `npm run lint` (frontend) and `pytest` (backend) before PRs
- **Troubleshooting:**
  - Backend: Check logs, `/docs`, `/health`, Python version (3.11+)
  - Frontend: Check console, `npm run dev`, `.env` config
  - Database: Ensure PostgreSQL is running (see docker-compose)
  - CORS/auth: See `middleware.ts` and backend CORS config
- **Support:**
  - See `INTEGRATION_GUIDE.md` and backend/README for more

---

## 📚 Documentation & References
- Backend: `existing_app/labl_iq_analysis/hybrid_backend/labl_iq_hybrid_backend/README.md`, `INTEGRATION_GUIDE.md`
- Frontend: See code in `existing_app/labl_iq_frontend/app/`
- Figma: `existing_app/labl_iq_frontend_figma/`, `figma_design/`
- Archive: `ARCHIVE_DO_NOT_USE/` (legacy, not maintained)

---

## 🏁 Onboarding Checklist
- [ ] Clone repo & install dependencies (backend & frontend)
- [ ] Set up `.env` files as needed
- [ ] Run backend (`python run.py` or `docker-compose up`)
- [ ] Run frontend (`npm run dev`)
- [ ] Access API docs at `/docs`
- [ ] Connect agents as needed

---

**Welcome to LABL IQ - Abicus!**

For questions, open an issue or contact the project owner. 