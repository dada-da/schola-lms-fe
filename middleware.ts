/**
 * middleware.ts — Route protection & redirects.
 *
 * Runs on the Edge Runtime before every matched request.
 * Currently implements a simple cookie-based auth check so the
 * project works out of the box. Swap the `isAuthenticated` logic
 * for your real auth provider (NextAuth, Clerk, Supabase Auth, etc.).
 *
 * Protected routes:  /dashboard, /courses, /quiz, /admin
 * Public routes:     / (landing), /login, /signup, static assets
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ─── Route groups ──────────────────────────────────────────────────────────

/** Routes that require authentication. */
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/courses',
  '/quiz',
  '/admin',
]

/** Routes that logged-in users should be redirected away from. */
const AUTH_ROUTES = ['/login', '/signup']

// ─── Auth check ────────────────────────────────────────────────────────────

/**
 * Determine if the incoming request is authenticated.
 *
 * Replace this with your real auth logic:
 *   - NextAuth:  getToken({ req }) from 'next-auth/jwt'
 *   - Clerk:     auth() from '@clerk/nextjs/server'
 *   - Supabase:  createMiddlewareClient + session check
 */
function isAuthenticated(request: NextRequest): boolean {
  // Example: check for a session cookie set by your auth provider.
  // During development we treat all requests as authenticated so you
  // can navigate freely. Change this to `false` to test the redirect.
  const sessionCookie =
    request.cookies.get('next-auth.session-token') ??
    request.cookies.get('__Secure-next-auth.session-token') ??
    request.cookies.get('schola-session')

  // TODO: replace with real validation
  // For now: if no cookie exists, treat as unauthenticated in production
  if (process.env.NODE_ENV === 'production') {
    return Boolean(sessionCookie)
  }

  // In development, allow all traffic so you can preview pages freely
  return true
}

// ─── Middleware ────────────────────────────────────────────────────────────

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl
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

  // 3. Admin-only section — require explicit admin role
  //    Uncomment and adapt once you have role data in the session token:
  //
  // if (pathname.startsWith('/admin')) {
  //   const token = await getToken({ req: request })
  //   if (token?.role !== 'admin') {
  //     return NextResponse.redirect(new URL('/dashboard', request.url))
  //   }
  // }

  return NextResponse.next()
}

// ─── Matcher ───────────────────────────────────────────────────────────────

export const config = {
  /*
   * Match all routes EXCEPT:
   *   - Next.js internals (_next/static, _next/image)
   *   - favicon.ico
   *   - Public folder files (images, fonts, etc.)
   *   - API routes (handled separately)
   */
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf)).*)',
  ],
}
