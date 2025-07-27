'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { WeddingConfig } from '@/lib/wedding-data'
import { Upload, X, Camera, FileImage, Video, Sparkles, Calendar } from 'lucide-react'

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
    if (fileType.startsWith('video/')) return <Video className="h-4 w-4 text-amber-600" />
    return <FileImage className="h-4 w-4 text-yellow-600" />
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
        backgroundColor: '#f8f6f3' // fallback кремаста боја
      }}
    >
      {/* Overlay за подобра читливост */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-stone-50/80 to-yellow-50/80"></div>

      {/* Floating decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <div className="absolute top-20 left-20 text-amber-300 animate-pulse text-4xl">✨</div>
        <div className="absolute top-40 right-32 text-yellow-300 animate-bounce text-3xl">📸</div>
        <div className="absolute bottom-32 left-16 text-amber-300 animate-pulse text-2xl">🌟</div>
        <div className="absolute bottom-20 right-20 text-yellow-300 animate-bounce text-3xl">🎉</div>
      </div>

      <Card className="w-full max-w-lg shadow-2xl border-0 bg-white/95 backdrop-blur-sm relative z-20">
        {/* Decorative border */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 rounded-lg opacity-20 blur-sm"></div>
        
        <CardHeader className="text-center relative">
          <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-full w-fit shadow-lg">
            <Camera className="h-10 w-10 text-amber-600 animate-pulse" />
          </div>
          
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-yellow-700 bg-clip-text text-transparent">
            {wedding.title}
          </CardTitle>
          
          <CardDescription className="text-stone-600 text-lg leading-relaxed">
            {wedding.description || 'Споделете ги вашите најубави моменти од настанот!'}
          </CardDescription>
          
          <div className="flex items-center justify-center gap-2 text-sm text-stone-500 bg-stone-50 px-4 py-2 rounded-full">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">📅 {wedding.date}</span>
          </div>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 relative">
            <div className="space-y-2">
              <Label htmlFor="guestName" className="text-base font-semibold text-stone-700">
                ✨ Вашето име *
              </Label>
              <Input 
                id="guestName" 
                name="guestName" 
                placeholder="Име и Презиме" 
                required 
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="h-12 text-lg border-2 border-amber-200 focus:border-amber-400 rounded-xl"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message" className="text-base font-semibold text-stone-700">
                💌 Порака до {wedding.coupleNames}
              </Label>
              <Textarea 
                id="message" 
                name="message" 
                placeholder="Напишете убава порака..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[100px] text-lg border-2 border-amber-200 focus:border-amber-400 rounded-xl resize-none"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="files" className="text-base font-semibold text-stone-700">
                📸 Прикачи слики*
              </Label>
              
              <div className="relative">
                <Input 
                  id="files" 
                  type="file" 
                  accept="image/*,video/*" 
                  multiple
                  onChange={handleFileSelect}
                  className="h-12 border-2 border-dashed border-amber-300 hover:border-amber-400 rounded-xl cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                />
                <Camera className="absolute right-3 top-3 h-6 w-6 text-amber-400 pointer-events-none" />
              </div>
              
              <p className="text-sm text-stone-500 bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                💡 Можете да изберете повеќе слики!
              </p>

              <br />
              
              {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-600" />
                    <p className="text-base font-semibold text-stone-700">
                      Селектирани датотеки ({selectedFiles.length}):
                    </p>
                  </div>
                  
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gradient-to-r from-stone-50 to-amber-50 p-3 rounded-lg border border-stone-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {getFileIcon(file.type)}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-stone-800 truncate">{file.name}</p>
                            <p className="text-xs text-stone-500">{formatFileSize(file.size)}</p>
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
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200 rounded-xl" 
              disabled={loading || selectedFiles.length === 0}
            >
              {loading ? (
                <>
                  <Upload className="mr-3 h-5 w-5 animate-spin" />
                  Испраќам до {wedding.coupleNames}...
                </>
              ) : (
                <>
                  <Camera className="mr-3 h-5 w-5 animate-pulse" />
                  Испрати момент
                </>
              )}
            </Button>
            
            <div className="text-center bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-xl border border-amber-200">
              <p className="text-sm text-stone-600 font-medium">
                ✉️ Датотеките ќе бидат испратени директно на мејл!
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Нивната радост ќе биде уште поголема кога ќе ги споделите вашите моменти со нив! 🎉
              </p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}