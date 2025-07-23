import { NextRequest, NextResponse } from 'next/server'
import { getWeddingBySlug } from '@/lib/wedding-data'
import { sendWeddingMoment } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const weddingSlug = formData.get('weddingSlug') as string
    const guestName = formData.get('guestName') as string
    const message = formData.get('message') as string
    const files = formData.getAll('files') as File[]

    // Валидација
    if (!weddingSlug || !guestName || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Недостасуваат потребни полиња' },
        { status: 400 }
      )
    }

    // Најди ја свадбата
    const wedding = await getWeddingBySlug(weddingSlug)
    if (!wedding) {
      return NextResponse.json(
        { success: false, error: 'Свадбата не е пронајдена или не е активна' },
        { status: 404 }
      )
    }

    // Процесирај ги файловите
    const attachments = []
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        return NextResponse.json(
          { success: false, error: 'Датотека е преголема (максимум 10MB)' },
          { status: 400 }
        )
      }

      const buffer = Buffer.from(await file.arrayBuffer())
      attachments.push({
        filename: file.name,
        content: buffer,
        contentType: file.type
      })
    }

    // Испрати мејл
    const result = await sendWeddingMoment({
      weddingTitle: wedding.title,
      coupleEmail: wedding.coupleEmail,
      coupleNames: wedding.coupleNames,
      guestName,
      message: message || undefined,
      attachments
    })

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Момента е успешно испратен!',
        messageId: result.messageId 
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { success: false, error: 'Внатрешна грешка на серверот' },
      { status: 500 }
    )
  }
}