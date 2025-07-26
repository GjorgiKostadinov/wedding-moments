import { NextRequest, NextResponse } from 'next/server'
import { getWeddingBySlug } from '@/lib/wedding-data'
import { sendWeddingMoment } from '@/lib/email'

export async function POST(request: NextRequest) {
  console.log('🔵 API повик започнат...')
  
  try {
    const formData = await request.formData()
    
    const weddingSlug = formData.get('weddingSlug') as string
    const guestName = formData.get('guestName') as string
    const message = formData.get('message') as string
    const files = formData.getAll('files') as File[]

    console.log('📧 Wedding slug:', weddingSlug)
    console.log('👤 Guest name:', guestName)
    console.log('💌 Message:', message || 'Нема порака')
    console.log('📁 Files count:', files.length)

    // Валидација
    if (!weddingSlug || !guestName || files.length === 0) {
      console.log('❌ Валидациска грешка - недостасуваат полиња')
      return NextResponse.json(
        { success: false, error: 'Недостасуваат потребни полиња' },
        { status: 400 }
      )
    }

    // Најди ја свадбата
    console.log('🔍 Барам свадба со slug:', weddingSlug)
    const wedding = await getWeddingBySlug(weddingSlug)
    if (!wedding) {
      console.log('❌ Свадбата не е пронајдена')
      return NextResponse.json(
        { success: false, error: 'Свадбата не е пронајдена или не е активна' },
        { status: 404 }
      )
    }

    console.log('✅ Свадба пронајдена:', wedding.title)
    console.log('📧 Couple email:', wedding.coupleEmail)

    // Процесирај ги файловите (БЕЗ РАЗМЕРНО ОГРАНИЧУВАЊЕ)
    console.log('📎 Процесирам фајлови...')
    const attachments = []
    for (const file of files) {
      console.log(`📄 Обработувам: ${file.name} (${Math.round(file.size / 1024)}KB)`)
      
      const buffer = Buffer.from(await file.arrayBuffer())
      attachments.push({
        filename: file.name,
        content: buffer,
        contentType: file.type
      })
    }

    console.log('✅ Сите фајлови се обработени')

    // Испрати мејл
    console.log('📤 Испраќам мејл...')
    const result = await sendWeddingMoment({
      weddingTitle: wedding.title,
      coupleEmail: wedding.coupleEmail,
      coupleNames: wedding.coupleNames,
      guestName,
      message: message || undefined,
      attachments
    })

    console.log('📬 Резултат од мејл:', result)

    if (result.success) {
      console.log('🎉 Мејл успешно испратен!')
      return NextResponse.json({ 
        success: true, 
        message: 'Момента е успешно испратен!',
        messageId: result.messageId 
      })
    } else {
      console.log('❌ Мејл не е испратен:', result.error)
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('💥 API Error:', error)
    return NextResponse.json(
      { success: false, error: 'Внатрешна грешка на серверот' },
      { status: 500 }
    )
  }
}