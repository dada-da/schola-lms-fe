/**
 * middleware.ts — Locale detection + route protection & redirects.
 *
 * Runs on the Edge Runtime before every matched request.
 * Combines next-intl locale routing with auth-based redirects.
 */

import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

// ─── Route groups ──────────────────────────────────────────────────────────

/** Routes that require authentication (without locale prefix). */
const PROTECTED_PREFIXES = ['/dashboard', '/courses', '/quiz', '/admin']

/** Routes that logged-in users should be redirected away from. */
const AUTH_ROUTES = ['/login', '/register', '/signup']

// ─── Auth check ────────────────────────────────────────────────────────────

function isAuthenticated(request: NextRequest): boolean {
  return Boolean(request.cookies.get('schola-session')?.value)
}

// ─── Helper to strip locale prefix ────────────────────────────────────────

function stripLocale(pathname: string): string {
  for (const locale of routing.locales) {
    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1)
    }
    if (pathname === `/${locale}`) {
      return '/'
    }
  }
  return pathname
}

// ─── Middleware ────────────────────────────────────────────────────────────

export function middleware(request: NextRequest): NextResponse {
  const pathname = stripLocale(request.nextUrl.pathname)
  const authed = isAuthenticated(request)

  // 1. Unauthenticated user trying to access a protected route → /login
  if (!authed && PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 2. Authenticated user visiting login/signup → /dashboard
  if (authed && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // 3. Run next-intl middleware for locale handling
  return intlMiddleware(request)
}

// ─── Matcher ───────────────────────────────────────────────────────────────

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/|auth/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf)).*)',
  ],
}
