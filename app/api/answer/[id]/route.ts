import { NextRequest, NextResponse } from 'next/server'
import { BACKEND_URL } from '@/lib/env'

function authHeader(request: NextRequest): Record<string, string> | null {
  const token = request.cookies.get('schola-session')?.value
  return token ? { Authorization: `Bearer ${token}` } : null
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = authHeader(request)
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  try {
    const res = await fetch(`${BACKEND_URL}/answer/${params.id}`, { headers: auth })
    const data = await res.json().catch(() => null)
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ message: 'Backend unavailable' }, { status: 503 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = authHeader(request)
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  try {
    const res = await fetch(`${BACKEND_URL}/answer/${params.id}`, {
      method: 'PATCH',
      headers: { ...auth, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json().catch(() => null)
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ message: 'Backend unavailable' }, { status: 503 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = authHeader(request)
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  try {
    const res = await fetch(`${BACKEND_URL}/answer/${params.id}`, {
      method: 'DELETE',
      headers: auth,
    })
    if (res.status === 204) return new NextResponse(null, { status: 204 })
    const data = await res.json().catch(() => null)
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ message: 'Backend unavailable' }, { status: 503 })
  }
}
