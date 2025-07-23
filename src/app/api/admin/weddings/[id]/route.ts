import { NextRequest, NextResponse } from 'next/server'
import { updateWedding, deleteWedding } from '@/lib/wedding-data'
import { cookies } from 'next/headers'

async function isAuthenticated() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_session')?.value === 'authenticated'
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Неовластен пристап' }, { status: 401 })
  }

  try {
    const { id } = await params
    const updates = await request.json()
    const updatedWedding = await updateWedding(id, updates)
    
    if (!updatedWedding) {
      return NextResponse.json({ error: 'Свадбата не е пронајдена' }, { status: 404 })
    }
    
    return NextResponse.json(updatedWedding)
  } catch (error) {
    return NextResponse.json(
      { error: 'Грешка при ажурирање на свадба' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Неовластен пристап' }, { status: 401 })
  }

  try {
    const { id } = await params
    const deleted = await deleteWedding(id)
    
    if (!deleted) {
      return NextResponse.json({ error: 'Свадбата не е пронајдена' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Грешка при бришење на свадба' },
      { status: 500 }
    )
  }
}