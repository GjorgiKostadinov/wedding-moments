'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Heart } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function NewWeddingPage() {
  const [loading, setLoading] = useState(false)
  const [slug, setSlug] = useState('')
  const router = useRouter()

  function generateSlug(title: string) {
    const newSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()
    setSlug(newSlug)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const weddingData = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string,
      date: formData.get('date') as string,
      coupleEmail: formData.get('coupleEmail') as string,
      coupleNames: formData.get('coupleNames') as string,
      isActive: true
    }

    try {
      const response = await fetch('/api/admin/weddings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(weddingData)
      })

      if (response.ok) {
        toast.success('Свадбата е успешно креирана!')
        router.push('/admin')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Грешка при креирање')
      }
    } catch {
      toast.error('Се појави неочекувана грешка')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Нова Свадба</h1>
            <p className="text-gray-600 mt-1">Креирајте нов свадбен настан</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-500" />
              Детали за Свадбата
            </CardTitle>
            <CardDescription>
              Внесете ги основните информации за свадбениот настан
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="title">Назив на свадбата *</Label>
                <Input 
                  id="title" 
                  name="title" 
                  placeholder="пр. Марија и Петар 2025"
                  required
                  onChange={(e) => generateSlug(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="coupleNames">Имиња на младоженците *</Label>
                <Input 
                  id="coupleNames" 
                  name="coupleNames" 
                  placeholder="пр. Марија и Петар"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="slug">URL адреса *</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">/wedding/</span>
                  <Input 
                    id="slug" 
                    name="slug" 
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="marija-petar-2025"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Оваа адреса ќе ја користат гостите за пристап до формата
                </p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Опис (опционално)</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="Споделете ги вашите најубави моменти од нашата свадба..."
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="date">Датум на свадбата *</Label>
                <Input 
                  id="date" 
                  name="date" 
                  type="date"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="coupleEmail">Email за моменти *</Label>
                <Input 
                  id="coupleEmail" 
                  name="coupleEmail" 
                  type="email"
                  placeholder="mladozeneci@example.com"
                  required
                />
                <p className="text-xs text-gray-500">
                  На овој email ќе се испраќаат сите фотографии и видеа од гостите
                </p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Креирам...' : 'Креирај Свадба'}
                </Button>
                <Link href="/admin">
                  <Button type="button" variant="outline">
                    Откажи
                  </Button>
                </Link>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  )
}