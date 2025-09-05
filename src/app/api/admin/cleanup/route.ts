import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface Photo {
  id: string
  filename: string
  guestName: string
  message: string
  uploadedAt: string
  weddingSlug: string
  contentType?: string
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { daysOld = 2, deleteAll = false } = body
    
    const dataPath = path.join(process.cwd(), 'data', 'photos.json')
    const uploadsPath = path.join(process.cwd(), 'public', 'api', 'uploads')
    
    let photos: Photo[] = []
    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, 'utf-8')
      photos = JSON.parse(data)
    }

    let photosToDelete: Photo[] = []
    let remainingPhotos: Photo[] = []
    
    if (deleteAll) {
      // Брише ги сите слики
      photosToDelete = [...photos]
      remainingPhotos = []
    } else {
      // Брише слики постари од X дена
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysOld)
      photosToDelete = photos.filter(photo => new Date(photo.uploadedAt) < cutoffDate)
      remainingPhotos = photos.filter(photo => new Date(photo.uploadedAt) >= cutoffDate)
    }

    // Избриши ги фајловите од диск
    let deletedCount = 0
    const deletedFiles: string[] = []
    
    for (const photo of photosToDelete) {
      const filePath = path.join(uploadsPath, photo.filename)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
        deletedCount++
        deletedFiles.push(photo.filename)
        console.log(`🗑️ Избришан фајл: ${photo.filename} (од ${photo.guestName})`)
      }
    }

    // Ажурирај го JSON фајлот
    fs.writeFileSync(dataPath, JSON.stringify(remainingPhotos, null, 2))

    return NextResponse.json({
      success: true,
      deletedCount,
      remainingCount: remainingPhotos.length,
      deletedFiles,
      message: deleteAll 
        ? `🗑️ Успешно избришани СИТЕ ${deletedCount} фајлови!` 
        : `✅ Успешно избришани ${deletedCount} фајлови постари од ${daysOld} дена`
    })
  } catch (error) {
    console.error('Грешка при чистење:', error)
    return NextResponse.json(
      { success: false, error: 'Грешка при чистење на стари фајлови' },
      { status: 500 }
    )
  }
}

// GET за да видиш колку фајлови се стари
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const daysOld = parseInt(url.searchParams.get('days') || '2')
    
    const dataPath = path.join(process.cwd(), 'data', 'photos.json')
    
    let photos: Photo[] = []
    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, 'utf-8')
      photos = JSON.parse(data)
    }

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    const oldPhotos = photos.filter(photo => 
      new Date(photo.uploadedAt) < cutoffDate
    )

    const videoCount = photos.filter(photo => {
      if (photo.contentType) {
        return photo.contentType.startsWith('video/')
      }
      const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv']
      return videoExtensions.some(ext => photo.filename.toLowerCase().endsWith(ext))
    }).length

    const imageCount = photos.length - videoCount

    return NextResponse.json({
      success: true,
      totalPhotos: photos.length,
      imageCount,
      videoCount,
      oldPhotosCount: oldPhotos.length,
      oldPhotos: oldPhotos.map(p => ({
        filename: p.filename,
        guestName: p.guestName,
        uploadedAt: p.uploadedAt,
        weddingSlug: p.weddingSlug,
        contentType: p.contentType,
        isVideo: p.contentType?.startsWith('video/') || false
      })),
      daysOld
    })
  } catch (error) {
    console.error('Грешка при проверка:', error)
    return NextResponse.json(
      { success: false, error: 'Грешка при проверка на стари фајлови' },
      { status: 500 }
    )
  }
}
