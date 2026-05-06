/**
 * env.ts — Typed environment variables with runtime validation.
 *
 * Usage:
 *   import { env } from '@/lib/env'
 *   const backendUrl = env.BACKEND_URL
 */

// ─── Client-side env vars (must be prefixed NEXT_PUBLIC_) ─────────────────
interface ClientEnv {
  NEXT_PUBLIC_APP_URL: string
  NEXT_PUBLIC_APP_NAME: string
}

// ─── Server-side env vars (never exposed to the browser) ──────────────────
interface ServerEnv {
  BACKEND_URL: string
}

type Env = ClientEnv & ServerEnv

// ─── Runtime validation ────────────────────────────────────────────────────
function validateEnv(): Env {
  const required: (keyof ClientEnv)[] = [
    'NEXT_PUBLIC_APP_URL',
    'NEXT_PUBLIC_APP_NAME',
  ]

  const missing = required.filter((key) => !process.env[key])

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n  ${missing.join('\n  ')}\n` +
      `Copy .env.example to .env.local and fill in the values.`
    )
  }

  return {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL!,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME!,
    BACKEND_URL: process.env.BACKEND_URL ?? 'https://lms-be-us8q.onrender.com',
  }
}

// ─── Export ────────────────────────────────────────────────────────────────
export const env = validateEnv()

// ─── Convenience re-exports ────────────────────────────────────────────────
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'ScholaLMS'
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? ''
export const BACKEND_URL = process.env.BACKEND_URL ?? 'https://lms-be-us8q.onrender.com'
