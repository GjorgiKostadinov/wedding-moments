'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Users, Sparkles, Camera } from 'lucide-react'
import { WeddingConfig } from '@/lib/wedding-data'
import { useRouter } from 'next/navigation'

interface WeddingSelectionProps {
  weddings: WeddingConfig[]
}

export function WeddingSelection({ weddings }: WeddingSelectionProps) {
  const router = useRouter()

  if (weddings.length === 0) {
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

        <Card className="w-full max-w-md text-center shadow-2xl border-0 bg-white/95 backdrop-blur-sm relative z-20">
          {/* Decorative border */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300 rounded-lg opacity-20 blur-sm"></div>
          
          <CardHeader className="pb-8 relative">
            <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-full w-fit shadow-lg">
              <Camera className="h-16 w-16 text-amber-600 animate-pulse" />
            </div>
            <CardTitle className="text-2xl font-bold text-stone-800">Нема активни настани</CardTitle>
            <CardDescription className="text-lg text-stone-600">
              Моментално нема активни настани.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen relative bg-cover bg-center bg-no-repeat py-12"
      style={{ 
        backgroundImage: 'url(/image.png)',
        backgroundColor: '#f8f6f3' // fallback кремаста боја
      }}
    >
      {/* Overlay за подобра читливост */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-stone-50/80 to-yellow-50/80"></div>

      {/* Floating decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <div className="absolute top-20 left-20 text-amber-300/80 text-4xl animate-pulse">✨</div>
        <div className="absolute top-40 right-32 text-yellow-300/80 text-3xl animate-bounce">📸</div>
        <div className="absolute bottom-32 left-16 text-amber-300/80 text-2xl animate-pulse">🌟</div>
        <div className="absolute bottom-20 right-20 text-yellow-300/80 text-3xl animate-bounce">🎉</div>
        <div className="absolute top-1/2 left-10 text-amber-300/80 text-2xl animate-pulse">🎊</div>
        <div className="absolute top-1/3 right-10 text-yellow-300/80 text-2xl animate-bounce">🎭</div>
      </div>

      <div className="container mx-auto p-6 max-w-6xl relative z-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <Sparkles className="h-8 w-8 text-amber-500 animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent drop-shadow-sm">
              Сподели Моменти
            </h1>
            <Sparkles className="h-8 w-8 text-yellow-500 animate-pulse" />
          </div>
          
          <p className="text-xl text-stone-800 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-sm">
            Изберете настан за да ги споделите вашите најубави моменти и да станете дел од нивната приказна! 🎉
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {weddings.map((wedding, index) => (
            <Card 
              key={wedding.id} 
              className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] border-0 bg-white/95 backdrop-blur-sm relative overflow-hidden"
            >
              {/* Decorative gradient border */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
              
              {/* Card number badge */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                #{index + 1}
              </div>
              
              <CardHeader className="relative">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-full shadow-md">
                    <Camera className="h-6 w-6 text-amber-600 group-hover:animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold text-stone-800 group-hover:text-amber-700 transition-colors">
                      {wedding.title}
                    </CardTitle>
                  </div>
                </div>
                
                {wedding.description && (
                  <CardDescription className="text-stone-600 leading-relaxed text-base">
                    {wedding.description}
                  </CardDescription>
                )}
                
                <div className="flex items-center gap-2 mt-4 bg-gradient-to-r from-stone-50 to-amber-50 px-4 py-3 rounded-xl border border-stone-200">
                  <Calendar className="h-5 w-5 text-amber-600" />
                  <span className="font-semibold text-stone-700">{wedding.date}</span>
                </div>
              </CardHeader>
              
              <CardContent className="relative">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-stone-600">
                    <Users className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium">{wedding.coupleNames}</span>
                  </div>
                  
                  <Button
                    onClick={() => router.push(`/wedding/${wedding.slug}`)}
                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 rounded-xl group"
                  >
                    <Camera className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                    Споделете моменти
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-amber-200">
            <Camera className="h-5 w-5 text-amber-600" />
            <p className="text-stone-700 font-medium">
              Секој момент заслужува да биде споделен. Секоја приказна – запаметена. 📸✨
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}