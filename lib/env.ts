/**
 * env.ts — Typed environment variables with runtime validation.
 *
 * Usage:
 *   import { env } from '@/lib/env'
 *   const apiUrl = env.NEXT_PUBLIC_API_URL
 *
 * Add new variables:
 *   1. Add them to the `ClientEnv` or `ServerEnv` interface below.
 *   2. Add a validation check in `validateEnv()`.
 *   3. Add the variable to your `.env.local` / hosting provider.
 */

// ─── Client-side env vars (must be prefixed NEXT_PUBLIC_) ─────────────────
interface ClientEnv {
  NEXT_PUBLIC_APP_URL: string
  NEXT_PUBLIC_API_URL: string
  NEXT_PUBLIC_APP_NAME: string
}

// ─── Server-side env vars (never exposed to the browser) ──────────────────
interface ServerEnv {
  DATABASE_URL: string
  NEXTAUTH_SECRET: string
  NEXTAUTH_URL: string
}

// ─── Combined type ─────────────────────────────────────────────────────────
type Env = ClientEnv & ServerEnv

// ─── Runtime validation ────────────────────────────────────────────────────
function validateEnv(): Env {
  const requiredClient: (keyof ClientEnv)[] = [
    'NEXT_PUBLIC_APP_URL',
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_APP_NAME',
  ]

  const requiredServer: (keyof ServerEnv)[] = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
  ]

  // In the browser, only validate client vars
  const toCheck =
    typeof window === 'undefined'
      ? [...requiredClient, ...requiredServer]
      : requiredClient

  const missing = toCheck.filter((key) => !process.env[key])

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n  ${missing.join('\n  ')}\n` +
      `Copy .env.example to .env.local and fill in the values.`
    )
  }

  return process.env as unknown as Env
}

// ─── Export ────────────────────────────────────────────────────────────────
// `env` is validated once at module load time.
// In development, this surfaces missing vars immediately on startup.
export const env = validateEnv()

// ─── Convenience re-exports ────────────────────────────────────────────────
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'ScholaLMS'
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api'
