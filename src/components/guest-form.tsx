'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { WeddingConfig } from '@/lib/wedding-data'
import { Heart, Upload, X } from 'lucide-react'

interface GuestFormProps {
  wedding: WeddingConfig
}

export function GuestForm({ wedding }: GuestFormProps) {
  const [loading, setLoading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || [])
    setSelectedFiles(prev => [...prev, ...files])
  }

  function removeFile(index: number) {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      formData.append('weddingSlug', wedding.slug)
      
      // Додај ги сите селектирани файлови
      selectedFiles.forEach(file => {
        formData.append('files', file)
      })

      const response = await fetch('/api/send-moment', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        toast.success(`🎉 Вашиот момент е испратен до ${wedding.coupleNames}!`)
        
        // Reset форма
        event.currentTarget.reset()
        setSelectedFiles([])
      } else {
        throw new Error(result.error || 'Грешка при испраќање')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Се појави неочекувана грешка")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <Heart className="mx-auto h-8 w-8 text-pink-500 mb-2" />
          <CardTitle className="text-2xl font-bold text-pink-600">
            {wedding.title}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {wedding.description || 'Споделете ги вашите најубави моменти од свадбата!'}
          </CardDescription>
          <div className="text-sm text-gray-500">
            📅 {wedding.date}
          </div>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="guestName">Вашето име *</Label>
              <Input 
                id="guestName" 
                name="guestName" 
                placeholder="Име и Презиме" 
                required 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="message">Порака до {wedding.coupleNames}</Label>
              <Textarea 
                id="message" 
                name="message" 
                placeholder="Напишете кратка порака..." 
                className="min-h-[80px]" 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="files">Прикачи слики или видеа *</Label>
              <Input 
                id="files" 
                type="file" 
                accept="image/*,video/*" 
                multiple
                onChange={handleFileSelect}
              />
              <p className="text-xs text-gray-500">
                Можете да изберете повеќе датотеки (максимум 10MB по датотека)
              </p>
              
              {/* Приказ на селектирани файлови */}
              {selectedFiles.length > 0 && (
                <div className="mt-2 space-y-2">
                  <p className="text-sm font-medium">Селектирани датотеки:</p>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm truncate">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            <Button 
              type="submit" 
              className="w-full bg-pink-500 hover:bg-pink-600 text-white" 
              disabled={loading || selectedFiles.length === 0}
            >
              {loading ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  Испраќам до {wedding.coupleNames}...
                </>
              ) : (
                <>
                  <Heart className="mr-2 h-4 w-4" />
                  Испрати момент
                </>
              )}
            </Button>
            
            <p className="text-center text-sm text-gray-500">
              Датотеките ќе бидат испратени директно на мејл до младоженците
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}