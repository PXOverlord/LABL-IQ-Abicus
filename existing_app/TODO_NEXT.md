# Next Steps (August 2025)

## Backend
- [x] Persist processed shipment rows (or rate results) via Prisma JSON fields.
- [x] Add metadata fields (merchant/title/tags) to `Analysis` model + FastAPI responses.
- [x] Expose dedicated export endpoints in FastAPI (so frontend no longer rebuilds files client-side).

## Frontend (after backend work lands)
- [x] Remove legacy Next.js API bridges under `app/app/api/analyses/*` and `app/app/api/analysis/route.ts`.
- [x] Replace toolbar export implementation with FastAPI export endpoints once available.
- [ ] Update reporting/dashboard UI to use persisted summary stats and comparisons.

## Testing
- [ ] Automate the smoke test in `existing_app/SMOKE_TEST.md` (e.g., Playwright or Cypress) once auth/export flows are stable.
