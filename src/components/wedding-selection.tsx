'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Heart } from 'lucide-react'
import { WeddingConfig } from '@/lib/wedding-data'
import { useRouter } from 'next/navigation'

interface WeddingSelectionProps {
  weddings: WeddingConfig[]
}

export function WeddingSelection({ weddings }: WeddingSelectionProps) {
  const router = useRouter()

  if (weddings.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <Heart className="mx-auto h-12 w-12 text-pink-500 mb-4" />
            <CardTitle>Нема активни свадби</CardTitle>
            <CardDescription>
              Моментално нема активни свадбени настани.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-pink-600 mb-4">
          💕 WeddingMoments
        </h1>
        <p className="text-gray-600">
          Изберете свадба за да споделите ваши моменти
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {weddings.map((wedding) => (
          <Card key={wedding.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500" />
                {wedding.title}
              </CardTitle>
              {wedding.description && (
                <CardDescription>{wedding.description}</CardDescription>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>{wedding.date}</span>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => router.push(`/wedding/${wedding.slug}`)}
                className="w-full bg-pink-500 hover:bg-pink-600"
              >
                Споделете моменти
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}