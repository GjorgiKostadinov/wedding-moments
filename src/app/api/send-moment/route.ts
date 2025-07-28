import { NextRequest, NextResponse } from 'next/server'
import { getWeddingBySlug } from '@/lib/wedding-data'
import { sendWeddingMoment } from '@/lib/email'

// Gmail лимити
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB по фајл
const MAX_EMAIL_SIZE = 25 * 1024 * 1024 // 25MB вкупно за Gmail

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
    console.log('📁 Files count:', files.length)

    // Основна валидација
    if (!weddingSlug || !guestName || files.length === 0) {
      console.log('❌ Валидациска грешка')
      return NextResponse.json(
        { success: false, error: 'Недостасуваат потребни полиња' },
        { status: 400 }
      )
    }

    // Проверка за Gmail лимити
    let totalSize = 0
    
    for (const file of files) {
      const sizeMB = Math.round(file.size / 1024 / 1024 * 100) / 100
      console.log(`📄 ${file.name}: ${sizeMB}MB`)
      
      if (file.size > MAX_FILE_SIZE) {
        console.log(`❌ Фајлот ${file.name} е преголем: ${sizeMB}MB`)
        return NextResponse.json(
          { 
            success: false, 
            error: `Фајлот "${file.name}" е преголем (${sizeMB}MB). Максимум 10MB по фајл.` 
          },
          { status: 413 }
        )
      }
      
      totalSize += file.size
    }

    const totalMB = Math.round(totalSize / 1024 / 1024 * 100) / 100
    console.log(`📊 Вкупен размер: ${totalMB}MB`)

    if (totalSize > MAX_EMAIL_SIZE) {
      console.log(`❌ Премногу големо за Gmail: ${totalMB}MB`)
      return NextResponse.json(
        { 
          success: false, 
          error: `Вкупниот размер (${totalMB}MB) е преголем за Gmail. Максимум 25MB.` 
        },
        { status: 413 }
      )
    }

    // Најди свадба
    console.log('🔍 Барам свадба...')
    const wedding = await getWeddingBySlug(weddingSlug)
    if (!wedding) {
      console.log('❌ Свадбата не е пронајдена')
      return NextResponse.json(
        { success: false, error: 'Свадбата не е пронајдена' },
        { status: 404 }
      )
    }

    console.log('✅ Свадба пронајдена:', wedding.title)

    // Процесирај фајлови
    console.log('📎 Процесирам фајлови...')
    const attachments = []
    
    for (const file of files) {
      console.log(`📄 Обработувам: ${file.name}`)
      
      try {
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        
        attachments.push({
          filename: file.name,
          content: buffer,
          contentType: file.type || 'application/octet-stream'
        })
        
        console.log(`✅ Готово: ${file.name}`)
      } catch (fileError) {
        console.error(`❌ Грешка при ${file.name}:`, fileError)
        return NextResponse.json(
          { success: false, error: `Грешка при обработка на "${file.name}"` },
          { status: 500 }
        )
      }
    }

    // Испрати мејл
    console.log('📤 Испраќам мејл преку Gmail...')
    
    const result = await sendWeddingMoment({
      weddingTitle: wedding.title,
      coupleEmail: wedding.coupleEmail,
      coupleNames: wedding.coupleNames,
      guestName,
      message: message || undefined,
      attachments
    })

    if (result.success) {
      console.log(`🎉 Успех! Message ID: ${result.messageId}`)
      
      return NextResponse.json({ 
        success: true, 
        message: 'Момента е успешно испратен!',
        messageId: result.messageId,
        totalSize: totalMB + 'MB'
      })
    } else {
      console.log('❌ Gmail грешка:', result.error)
      return NextResponse.json(
        { success: false, error: `Gmail грешка: ${result.error}` },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('💥 API Error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Внатрешна грешка на серверот'
      },
      { status: 500 }
    )
  }
}