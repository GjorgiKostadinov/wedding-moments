import { NextRequest, NextResponse } from 'next/server'
import { getAllWeddings, createWedding } from '@/lib/wedding-data'
import { cookies } from 'next/headers'

// Check admin authentication
async function isAuthenticated() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_session')?.value === 'authenticated'
}

export async function GET() {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Неовластен пристап' }, { status: 401 })
  }

  try {
    const weddings = await getAllWeddings()
    return NextResponse.json(weddings)
  } catch (error) {
    return NextResponse.json(
      { error: 'Грешка при вчитување на свадби' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Неовластен пристап' }, { status: 401 })
  }

  try {
    const weddingData = await request.json()
    const newWedding = await createWedding(weddingData)
    return NextResponse.json(newWedding)
  } catch (error) {
    return NextResponse.json(
      { error: 'Грешка при креирање на свадба' },
      { status: 500 }
    )
  }
}