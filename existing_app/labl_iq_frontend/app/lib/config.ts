export const FASTAPI_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL?.trim() || 'http://localhost:8000';

/**
 * Legacy prototype API (simple_backend.py). Only use while migrating flows
 * that still depend on the filesystem-backed service.
 */
export const LEGACY_API_BASE_URL =
  process.env.NEXT_PUBLIC_LEGACY_API_URL?.trim() ||
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ||
  'http://localhost:8001';

export const isLegacyApiEnabled = FASTAPI_BASE_URL !== LEGACY_API_BASE_URL;
