# Agent & AI Automation Guide for LABL IQ - Abicus

## 🤖 Connecting Agents

- **GitHub:** Clone or access the repo at https://github.com/PXOverlord/LABL-IQ-Abicus
- **API:** Use backend API docs at http://localhost:8000/docs (FastAPI OpenAPI)
- **Local:** Run backend and frontend locally (see README)
- **CI/CD:** GitHub Actions workflow in `.github/workflows/ci.yml` for automated checks

---

## 🛠️ What Agents Can Do

- Analyze, refactor, or generate code (frontend: Next.js, backend: FastAPI)
- Write, run, and validate tests (pytest, Jest, etc.)
- Automate API flows (file upload, mapping, processing, export)
- Generate or update documentation (README, API docs, etc.)
- Add new features, fix bugs, or optimize performance
- Manage database schema (Prisma migrations)
- Set up or update CI/CD workflows
- Onboard new users or agents (update onboarding docs)

---

## 🔑 Key API Endpoints (Backend)

- `POST /api/upload` - Upload CSV/Excel for analysis
- `POST /api/map-columns` - Map columns to required fields
- `POST /api/process` - Process mapped data and calculate rates
- `GET /api/results/{id}` - Retrieve analysis results
- `POST /api/export` - Export results in various formats
- `GET /health` - Health check
- `GET /docs` - Interactive API documentation

---

## 🗂️ Project Structure for Agents

- **Frontend:** `existing_app/labl_iq_frontend/app/`
  - Pages: `app/app/`
  - Components: `app/components/`
  - State: `app/lib/stores/`
  - API: `app/lib/api.ts`
  - Auth: `app/middleware.ts`, `app/app/api/auth/`
- **Backend:** `existing_app/labl_iq_analysis/hybrid_backend/labl_iq_hybrid_backend/`
  - API: `app/api/`
  - Services: `app/services/`
  - Schemas: `app/schemas/`
  - Models: `app/models/`
  - Config: `app/core/`
  - Reference Data: `app/services/reference_data/`
- **Database:** Prisma schemas in `prisma/schema.prisma` (frontend/backend)
- **CI/CD:** `.github/workflows/ci.yml`
- **Docs:** `README.md`, `INTEGRATION_GUIDE.md`, `AGENTS.md`

---

## 🚫 Excluded Files

- See `.gitignore` for full list (node_modules, .env, uploads, large binaries, etc.)
- **Reference Data:** Only `2025 Labl IQ Rate Analyzer Template.xlsx` is included (backend)
- **Uploads:** Not tracked; agents can generate or request test files
- **How to request:** Open an issue or contact the project owner for access to excluded files

---

## 🧑‍💻 Best Practices for Agent Contributions

- Always run lint and tests before PRs/merges
- Document all changes in PRs and commit messages
- Use environment variables for secrets/configs (never commit .env)
- Follow project structure and naming conventions
- Update documentation when adding features or changing flows
- Use CI/CD workflows for validation

---

## 📝 Example Agent Tasks & Workflows

- Add a new API endpoint (backend)
- Refactor a React component (frontend)
- Write integration tests for file upload and processing
- Automate export and reporting flows
- Update onboarding docs for new users/agents
- Generate OpenAPI client for frontend
- Add new database fields and Prisma migrations
- Set up monitoring or logging for backend

---

**For more, see the main README and backend/INTEGRATION_GUIDE.md.**

Welcome, agents! Automate, optimize, and extend LABL IQ - Abicus. 