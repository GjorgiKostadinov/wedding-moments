'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Image as ImageIcon, MessageCircle, Calendar, User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Photo {
  id: string
  filename: string
  guestName: string
  message: string
  uploadedAt: string
  weddingSlug: string
  contentType?: string
}

// Helper function за да провериме дали е видео
const isVideo = (filename: string, contentType?: string) => {
  if (contentType) {
    return contentType.startsWith('video/')
  }
  const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv']
  return videoExtensions.some(ext => filename.toLowerCase().endsWith(ext))
}

export default function WeddingGalleryPage() {
  const params = useParams()
  const slug = params.slug as string
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const response = await fetch(`/api/photos/${slug}`)
        if (response.ok) {
          const data = await response.json()
          setPhotos(data.photos || [])
        }
      } catch (error) {
        console.error('Грешка при вчитување на слики:', error)
      } finally {
        setLoading(false)
      }
    }
    loadPhotos()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Се вчитуваат слики...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild className="rounded-full shadow-lg hover:shadow-xl transition-all">
              <Link href={`/wedding/${slug}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Галерија на спомени
              </h1>
              <p className="text-gray-600 mt-1">
                {photos.length > 0 ? `${photos.length} Споделен/и момент/и` : 'Нема слики сè уште'}
              </p>
            </div>
          </div>
        </div>

        {/* Photos Grid */}
        {photos.length === 0 ? (
          <Card className="text-center py-16 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent>
              <div className="mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="h-12 w-12 text-pink-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-3">
                Сè уште нема слики
              </h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Бидете првиот кој ќе сподели незаборавен момент од овој настан! 
                Секоја слика создава спомен што ќе остане засекогаш.
              </p>
              <Button asChild className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                <Link href={`/wedding/${slug}`}>
                  <ImageIcon className="mr-2 h-5 w-5" />
                  Споделете слика
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    {photos.length}
                  </div>
                  <div className="text-gray-600 font-medium">Вкупно</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                    {photos.filter(p => !isVideo(p.filename, p.contentType)).length}
                  </div>
                  <div className="text-gray-600 font-medium">Слики</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                    {photos.filter(p => isVideo(p.filename, p.contentType)).length}
                  </div>
                  <div className="text-gray-600 font-medium">Видео</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    {new Set(photos.map(p => p.guestName)).size}
                  </div>
                  <div className="text-gray-600 font-medium">Гости</div>
                </CardContent>
              </Card>
            </div>

            {/* Photos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {photos.map((photo) => (
                <Card 
                  key={photo.id} 
                  className="group cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden border-0 bg-white/90 backdrop-blur-sm"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <div className="aspect-square relative overflow-hidden">
                    {isVideo(photo.filename, photo.contentType) ? (
                      // Видео thumbnail
                      <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <video
                          src={`/api/uploads/${photo.filename}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          muted
                          playsInline
                          preload="metadata"
                          onMouseEnter={(e) => {
                            const video = e.target as HTMLVideoElement
                            video.currentTime = 1 // Покажи го првиот секунд како thumbnail
                          }}
                        />
                        {/* Видео икона */}
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                            <svg className="h-8 w-8 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Слика
                      <Image
                        src={`/api/uploads/${photo.filename}`}
                        alt={`Слика од ${photo.guestName}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                        {isVideo(photo.filename, photo.contentType) ? (
                          <svg className="h-4 w-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <ImageIcon className="h-4 w-4 text-gray-600" />
                        )}
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white font-semibold text-sm truncate">{photo.guestName}</p>
                      {photo.message && (
                        <p className="text-white/80 text-xs truncate mt-1">{photo.message}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <div 
              className="bg-white rounded-3xl max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-pink-50 to-purple-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{selectedPhoto.guestName}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {(() => {
                        const date = new Date(selectedPhoto.uploadedAt)
                        const day = date.getDate().toString().padStart(2, '0')
                        const month = (date.getMonth() + 1).toString().padStart(2, '0')
                        const year = date.getFullYear()
                        const hours = date.getHours().toString().padStart(2, '0')
                        const minutes = date.getMinutes().toString().padStart(2, '0')
                        return `${day}.${month}.${year} ${hours}:${minutes}`
                      })()}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPhoto(null)}
                  className="rounded-full hover:bg-white/50 text-gray-600"
                >
                  <span className="text-xl">×</span>
                </Button>
              </div>
              
              {/* Modal Image/Video */}
              <div className="relative bg-gray-50">
                <div className="relative w-full max-h-[60vh] overflow-hidden">
                  {isVideo(selectedPhoto.filename, selectedPhoto.contentType) ? (
                    // Видео player
                    <video
                      src={`/api/uploads/${selectedPhoto.filename}`}
                      controls
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-auto max-h-[60vh] object-contain bg-black"
                      style={{ objectFit: 'contain' }}
                    >
                      Вашиот browser не поддржува видео reprodukcija.
                    </video>
                  ) : (
                    // Слика
                    <Image
                      src={`/api/uploads/${selectedPhoto.filename}`}
                      alt={`Слика од ${selectedPhoto.guestName}`}
                      width={800}
                      height={600}
                      className="w-full h-auto max-h-[60vh] object-contain"
                      style={{ objectFit: 'contain' }}
                    />
                  )}
                </div>
              </div>
              
              {/* Modal Message */}
              {selectedPhoto.message && (
                <div className="p-6 border-t bg-gray-50">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <MessageCircle className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-700 leading-relaxed">{selectedPhoto.message}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  )
}
