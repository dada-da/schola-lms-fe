import { NextRequest, NextResponse } from 'next/server'

// Adjust this path to match your backend's login endpoint
const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8080'

export async function POST(request: NextRequest) {
  const body = await request.json()

  let res: Response
  try {
    res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    return NextResponse.json({ message: 'Backend unavailable' }, { status: 503 })
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Invalid credentials' }))
    return NextResponse.json(err, { status: res.status })
  }

  const { token, ...user } = await res.json()

  const response = NextResponse.json(user)
  response.cookies.set('schola-session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 24h
  })
  return response
}
