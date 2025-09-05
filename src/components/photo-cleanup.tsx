'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2, Search, AlertTriangle, CheckCircle, Image as ImageIcon, Video } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface OldPhoto {
  filename: string
  guestName: string
  uploadedAt: string
  weddingSlug: string
  contentType?: string
  isVideo: boolean
}

interface CleanupStats {
  totalPhotos: number
  imageCount: number
  videoCount: number
  oldPhotosCount: number
  oldPhotos: OldPhoto[]
  daysOld: number
}

export function PhotoCleanup() {
  const [daysOld, setDaysOld] = useState(2)
  const [stats, setStats] = useState<CleanupStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const checkOldPhotos = async () => {
    setLoading(true)
    setError(null)
    setMessage(null)
    try {
      const response = await fetch(`/api/admin/cleanup?days=${daysOld}`)
      const data = await response.json()
      
      if (data.success) {
        setStats(data)
      } else {
        setError(data.error)
      }
    } catch {
      setError('Грешка при проверка на фајлови')
    } finally {
      setLoading(false)
    }
  }

  const deleteOldPhotos = async () => {
    if (!stats || stats.oldPhotosCount === 0) return
    
    if (!confirm(`Дали сте сигурни дека сакате да избришете ${stats.oldPhotosCount} фајлови постари од ${daysOld} дена?`)) {
      return
    }

    setDeleting(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/cleanup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ daysOld })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setMessage(data.message)
        setStats(null) // Reset stats
      } else {
        setError(data.error)
      }
    } catch {
      setError('Грешка при бришење на фајлови')
    } finally {
      setDeleting(false)
    }
  }

  const deleteAllPhotos = async () => {
    if (!confirm('⚠️ ВНИМАНИЕ: Дали сте сигурни дека сакате да ги избришете СИТЕ слики и видео? Оваа акција не може да се врати!')) {
      return
    }

    if (!confirm('🔴 ПОСЛЕДНО ПРЕДУПРЕДУВАЊЕ: Сите слики и видео ќе бидат трајно избришани. Продолжи?')) {
      return
    }

    setDeleting(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/cleanup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deleteAll: true })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setMessage(data.message)
        setStats(null) // Reset stats
      } else {
        setError(data.error)
      }
    } catch {
      setError('Грешка при бришење на сите фајлови')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trash2 className="h-5 w-5" />
          Управување со слики и видео - Автоматско бришење
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="flex items-end gap-4 flex-wrap">
          <div className="flex-1 max-w-xs">
            <Label htmlFor="days">Избриши фајлови постари од (дена):</Label>
            <Input
              id="days"
              type="number"
              min="1"
              max="30"
              value={daysOld}
              onChange={(e) => setDaysOld(parseInt(e.target.value) || 2)}
              className="mt-1"
            />
          </div>
          <Button 
            onClick={checkOldPhotos}
            disabled={loading}
            variant="outline"
          >
            <Search className="h-4 w-4 mr-2" />
            {loading ? 'Проверувам...' : 'Провери'}
          </Button>
          
          {/* Копче за брисење на сите слики */}
          <Button 
            onClick={deleteAllPhotos}
            disabled={deleting}
            variant="destructive"
            className="bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {deleting ? 'Бришам сè...' : 'Избриши СЀ'}
          </Button>
        </div>

        {/* Messages */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {message && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-green-700">{message}</AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        {stats && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalPhotos}</div>
                  <div className="text-sm text-gray-600">Вкупно фајлови</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.imageCount}</div>
                  <div className="text-sm text-gray-600">Слики</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.videoCount}</div>
                  <div className="text-sm text-gray-600">Видео</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{stats.oldPhotosCount}</div>
                  <div className="text-sm text-gray-600">За бришење</div>
                </CardContent>
              </Card>
            </div>

            {/* Old Photos List */}
            {stats.oldPhotosCount > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Фајлови за бришење (постари од {stats.daysOld} дена):
                </h3>
                <div className="max-h-60 overflow-y-auto border rounded-lg">
                  <div className="space-y-2 p-4">
                    {stats.oldPhotos.map((photo, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {photo.isVideo ? (
                              <Video className="h-5 w-5 text-purple-600" />
                            ) : (
                              <ImageIcon className="h-5 w-5 text-green-600" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {photo.filename}
                              <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                                {photo.isVideo ? 'Видео' : 'Слика'}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {photo.guestName} • {photo.weddingSlug} • {' '}
                              {(() => {
                                const date = new Date(photo.uploadedAt)
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
                      </div>
                    ))}
                  </div>
                </div>

                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Внимание:</strong> Оваа акција е неповратна! 
                    Ќе се избришат {stats.oldPhotosCount} фајлови од серверот 
                    ({stats.oldPhotos.filter(p => !p.isVideo).length} слики, {stats.oldPhotos.filter(p => p.isVideo).length} видео).
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={deleteOldPhotos}
                  disabled={deleting}
                  variant="destructive"
                  size="lg"
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {deleting ? 'Бришам...' : `Избриши ${stats.oldPhotosCount} стари фајлови`}
                </Button>
              </div>
            )}

            {stats.oldPhotosCount === 0 && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Одлично! Нема фајлови постари од {stats.daysOld} дена за бришење.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
