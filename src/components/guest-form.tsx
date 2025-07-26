'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { WeddingConfig } from '@/lib/wedding-data'
import { Heart, Upload, X, Camera, FileImage, Video, Sparkles, Calendar } from 'lucide-react'

interface GuestFormProps {
  wedding: WeddingConfig
}

export function GuestForm({ wedding }: GuestFormProps) {
  const [loading, setLoading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [guestName, setGuestName] = useState('')
  const [message, setMessage] = useState('')

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || [])
    setSelectedFiles(prev => [...prev, ...files])
  }

  function removeFile(index: number) {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  function getFileIcon(fileType: string) {
    if (fileType.startsWith('video/')) return <Video className="h-4 w-4 text-purple-500" />
    return <FileImage className="h-4 w-4 text-blue-500" />
  }

  function formatFileSize(bytes: number) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    console.log('🚀 Форма се испраќа...')
    console.log('👤 Гост:', guestName)
    console.log('💌 Порака:', message)
    console.log('📁 Број на фајлови:', selectedFiles.length)

    try {
      const formData = new FormData()
      formData.append('weddingSlug', wedding.slug)
      formData.append('guestName', guestName)
      formData.append('message', message)
      
      selectedFiles.forEach(file => {
        formData.append('files', file)
      })

      console.log('📤 Испраќам до API...')

      const response = await fetch('/api/send-moment', {
        method: 'POST',
        body: formData
      })

      console.log('📥 Response status:', response.status)

      const result = await response.json()
      console.log('📋 Response data:', result)

      if (result.success) {
        toast.success(`🎉 Вашиот момент е испратен до ${wedding.coupleNames}!`)
        
        // Ресетирај ги полињата
        setGuestName('')
        setMessage('')
        setSelectedFiles([])
        
        // Ресетирај го и HTML формот
        const form = event.currentTarget
        if (form) {
          form.reset()
        }
      } else {
        throw new Error(result.error || 'Грешка при испраќање')
      }
    } catch (error) {
      console.error('❌ Грешка:', error)
      toast.error(error instanceof Error ? error.message : "Се појави неочекувана грешка")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: 'url(/image.png)',
        backgroundColor: '#fce7f3' // fallback розова боја
      }}
    >
      {/* Overlay за подобра читливост */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50/70 via-rose-50/70 to-purple-100/70"></div>

      {/* Floating hearts animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <div className="absolute top-20 left-20 text-pink-300 animate-pulse text-4xl">💕</div>
        <div className="absolute top-40 right-32 text-rose-300 animate-bounce text-3xl">💖</div>
        <div className="absolute bottom-32 left-16 text-purple-300 animate-pulse text-2xl">✨</div>
        <div className="absolute bottom-20 right-20 text-pink-300 animate-bounce text-3xl">💝</div>
      </div>

      <Card className="w-full max-w-lg shadow-2xl border-0 bg-white/95 backdrop-blur-sm relative z-20">
        {/* Decorative border */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 rounded-lg opacity-20 blur-sm"></div>
        
        <CardHeader className="text-center relative">
          <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full w-fit shadow-lg">
            <Heart className="h-10 w-10 text-pink-600 animate-pulse" />
          </div>
          
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            {wedding.title}
          </CardTitle>
          
          <CardDescription className="text-gray-600 text-lg leading-relaxed">
            {wedding.description || 'Споделете ги вашите најубави моменти од свадбата!'}
          </CardDescription>
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">📅 {wedding.date}</span>
          </div>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 relative">
            <div className="space-y-2">
              <Label htmlFor="guestName" className="text-base font-semibold text-gray-700">
                ✨ Вашето име *
              </Label>
              <Input 
                id="guestName" 
                name="guestName" 
                placeholder="Име и Презиме" 
                required 
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="h-12 text-lg border-2 border-pink-200 focus:border-pink-400 rounded-xl"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message" className="text-base font-semibold text-gray-700">
                💌 Порака до {wedding.coupleNames}
              </Label>
              <Textarea 
                id="message" 
                name="message" 
                placeholder="Напишете убава порака..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[100px] text-lg border-2 border-pink-200 focus:border-pink-400 rounded-xl resize-none"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="files" className="text-base font-semibold text-gray-700">
                📸 Прикачи слики или видеа *
              </Label>
              
              <div className="relative">
                <Input 
                  id="files" 
                  type="file" 
                  accept="image/*,video/*" 
                  multiple
                  onChange={handleFileSelect}
                  className="h-12 border-2 border-dashed border-pink-300 hover:border-pink-400 rounded-xl cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                />
                <Camera className="absolute right-3 top-3 h-6 w-6 text-pink-400 pointer-events-none" />
              </div>
              
              <p className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                💡 Можете да изберете повеќе слики или видеа (без ограничување на големина)!
              </p>
              
              {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    <p className="text-base font-semibold text-gray-700">
                      Селектирани датотеки ({selectedFiles.length}):
                    </p>
                  </div>
                  
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {getFileIcon(file.type)}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4 relative">
            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 hover:from-pink-600 hover:via-rose-600 hover:to-purple-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200 rounded-xl" 
              disabled={loading || selectedFiles.length === 0}
            >
              {loading ? (
                <>
                  <Upload className="mr-3 h-5 w-5 animate-spin" />
                  Испраќам до {wedding.coupleNames}...
                </>
              ) : (
                <>
                  <Heart className="mr-3 h-5 w-5 animate-pulse" />
                  Испрати момент со љубов
                </>
              )}
            </Button>
            
            <div className="text-center bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl border border-pink-200">
              <p className="text-sm text-gray-600 font-medium">
                ✉️ Датотеките ќе бидат испратени директно на мејл!
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Нивната радост ќе биде уште поголема кога ќе ги споделите вашите моменти со нив! 💕
              </p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}