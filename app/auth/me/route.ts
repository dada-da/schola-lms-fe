import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('schola-session')?.value
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const [, payload] = token.split('.')
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString())
    return NextResponse.json({
      id: decoded.userId,
      email: decoded.sub,
      role: decoded.role,
    })
  } catch {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }
}
