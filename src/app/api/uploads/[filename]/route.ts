import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params
    const filePath = path.join(process.cwd(), 'public', 'api', 'uploads', filename)
    
    // Провери дали фајлот постои
    if (!fs.existsSync(filePath)) {
      console.log('❌ Фајлот не постои:', filePath)
      return NextResponse.json(
        { error: 'Фајлот не е пронајден' },
        { status: 404 }
      )
    }
    
    // Прочитај го фајлот
    const fileBuffer = fs.readFileSync(filePath)
    const stats = fs.statSync(filePath)
    
    // Одреди го content type врз основа на екстензијата
    const ext = path.extname(filename).toLowerCase()
    let contentType = 'application/octet-stream'
    
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg'
        break
      case '.png':
        contentType = 'image/png'
        break
      case '.gif':
        contentType = 'image/gif'
        break
      case '.webp':
        contentType = 'image/webp'
        break
      case '.mp4':
        contentType = 'video/mp4'
        break
      case '.mov':
        contentType = 'video/quicktime'
        break
    }
    
    // Враќај го фајлот
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': stats.size.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
    
  } catch (error) {
    console.error('❌ Грешка при служење на фајл:', error)
    return NextResponse.json(
      { error: 'Грешка при вчитување на фајлот' },
      { status: 500 }
    )
  }
}
