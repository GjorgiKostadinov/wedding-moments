import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface PhotoData {
  id: string
  filename: string
  guestName: string
  message: string
  uploadedAt: string
  weddingSlug: string
  contentType?: string
}

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params
    const slug = params.slug
    const dataPath = path.join(process.cwd(), 'data', 'photos.json')
    
    let photos: PhotoData[] = []
    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, 'utf-8')
      photos = JSON.parse(data)
    }

    // Филтрирај само слики за овој настан (wedding slug)
    const weddingPhotos = photos.filter(photo => photo.weddingSlug === slug)

    // Сортирај по датум (најновите први)
    weddingPhotos.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())

    return NextResponse.json({
      success: true,
      photos: weddingPhotos,
      count: weddingPhotos.length,
      slug: slug
    })
  } catch (error) {
    console.error('Грешка при вчитување на слики:', error)
    return NextResponse.json(
      { success: false, error: 'Грешка при вчитување на слики' },
      { status: 500 }
    )
  }
}
