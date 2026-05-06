import { NextRequest, NextResponse } from 'next/server'
import { BACKEND_URL } from '@/lib/env'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('schola-session')?.value
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  try {
    const res = await fetch(`${BACKEND_URL}/category`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json().catch(() => null)
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ message: 'Backend unavailable' }, { status: 503 })
  }
}
