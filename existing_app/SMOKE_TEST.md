# LABL IQ Smoke Test (Auth + Upload)

A quick manual checklist to verify the FastAPI + Next.js integration after changes.

## Prerequisites

1. **Backend**
   ```bash
   cd existing_app/labl_iq_analysis/hybrid_backend/labl_iq_hybrid_backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python run.py
   ```

2. **Seed or register a user**
   - Option A: run `python scripts/seed_admin.py` (creates admin@example.com / admin123).
   - Option B: visit `http://localhost:8000/docs` and call `POST /api/auth/register` with a custom email/password.

3. **Frontend**
   ```bash
   cd existing_app/labl_iq_frontend/app
   npm install
   npm run dev
   ```

## Verification Steps

1. **Login**
   - Open `http://localhost:3000/login`.
   - Sign in with the seeded or registered credentials.
   - Expected: redirected to dashboard; no errors in browser console.

2. **Upload + Map + Process**
   - Navigate to `/upload`.
   - Choose a CSV/Excel file (any small sample works).
   - Step 1: click “Upload File” – progress bar should reach 100%.
   - Step 2: confirm required columns are auto-suggested; adjust if needed.
   - Step 3: configure settings (defaults are fine) → Continue.
   - Step 4: “Run Analysis”.
   - Expected: route navigates to `/analysis/{id}`, history page shows the new entry.
   - Verify toolbar exports (Excel/CSV/PDF) now download files populated from persisted results.

3. **Refresh-token flow**
   - Keep the browser open for >30 minutes or manually delete the access token while keeping the refresh token in DevTools → Application → Local Storage (optional manual test).
   - Trigger an authenticated action (reload `/analysis`).
   - Expected: app silently refreshes the access token; user stays logged in.

4. **Logout**
   - Use the account menu to log out.
   - Expected: tokens removed from local storage; subsequent visit to `/upload` redirects to login.

## Troubleshooting

- Ensure `.env` (frontend) contains `NEXT_PUBLIC_BACKEND_URL=http://localhost:8000`.
- FastAPI must be running; 401/403 responses indicate missing or expired tokens.
- Clear local storage between tests if switching accounts.
