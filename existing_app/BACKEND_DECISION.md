# Backend Source of Truth (August 2025)

**Canonical service:** `existing_app/labl_iq_analysis/hybrid_backend/labl_iq_hybrid_backend`

The FastAPI + Prisma stack is the only backend that should receive new features, bugfixes, or integration work. It exposes the authenticated REST API described in `app/api/` and persists state through PostgreSQL via Prisma ORM. All environment configuration, CI jobs, and frontend wiring should target this service (`http://localhost:8000` during local development).

**Legacy utility (`app/simple_backend.py`)**

- Originally introduced as a thin JSON prototype to unblock the Next.js frontend while the Prisma stack was offline.
- Stores data on the filesystem and exposes unauthenticated endpoints on port `8001`.
- Kept in the repository for historical reference and for any outstanding UI screens that have not yet been migrated.
- Do **not** add new behaviour here. When a screen still depends on it, open a task to port that flow to the FastAPI service instead of extending the legacy code.

**Frontend configuration**

- Use `NEXT_PUBLIC_BACKEND_URL` to point the app at the FastAPI instance. By default this should be `http://localhost:8000`.
- Temporary shims that still rely on the legacy prototype must explicitly declare their own base URL (see `NEXT_PUBLIC_LEGACY_API_URL`). This prevents accidentally mixing the two backends.

**Next steps**

1. Port any remaining features that call the legacy endpoints (`useAnalysisStore`, `/app/api/analyses/*`, etc.) to the FastAPI contracts.
2. Once parity is achieved, delete the legacy simple backend and remove the associated environment variables.
3. Update onboarding docs to reflect the simplified stack.

Tracking issue: _Create one in GitHub to monitor migration progress (TODO)._ 
