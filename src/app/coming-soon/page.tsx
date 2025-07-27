// Форсирај динамичко рендерирање - нема кеширање
export const dynamic = 'force-dynamic'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Calendar, Bell, Sparkles, Users, Camera } from 'lucide-react'

export default function ComingSoonPage() {
  console.log('🔜 Coming Soon page се рендерира...')
  
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
        <div className="absolute top-1/2 left-10 text-rose-300 text-2xl animate-pulse">🌸</div>
        <div className="absolute top-1/3 right-10 text-purple-300 text-2xl animate-bounce">🦋</div>
      </div>

      <Card className="w-full max-w-lg shadow-2xl border-0 bg-white/95 backdrop-blur-sm relative z-20">
        {/* Decorative border */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 rounded-lg opacity-20 blur-sm"></div>
        
        <CardHeader className="text-center relative pb-6">
          <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full w-fit shadow-lg">
            <Heart className="h-12 w-12 text-pink-600 animate-pulse" />
          </div>
          
          <div className="flex justify-center items-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-purple-500 animate-pulse" />
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 bg-clip-text text-transparent text-center">
              Сподели Моменти
            </CardTitle>
            <Sparkles className="h-6 w-6 text-pink-500 animate-pulse" />
          </div>
          
          <CardDescription className="text-gray-600 text-lg leading-relaxed font-medium">
            Моментално нема активни настани
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 relative">
          {/* Status Cards */}
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 text-blue-700">
                <Calendar className="h-5 w-5 text-blue-500" />
                <span className="font-semibold"> Контактирајте нè за детални информации и закажување термин!</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 text-purple-700">
                <Bell className="h-5 w-5 text-purple-500" />
                <span className="font-semibold">Телефон/Viber: +389 77 409 939</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 text-green-700">
                <Users className="h-5 w-5 text-green-500" />
                <span className="font-semibold">Споделете радост, каде и да сте!</span>
              </div>
            </div>
          </div>
          
          {/* Main feature highlight */}
          <div className="bg-gradient-to-br from-pink-100 via-rose-100 to-purple-100 p-6 rounded-xl border-2 border-pink-200 shadow-lg">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Camera className="h-6 w-6 text-pink-600" />
                <h3 className="text-lg font-bold text-pink-700">
                  Нека секој момент биде засекогаш!
                </h3>
              </div>
              
              <p className="text-sm text-pink-600 leading-relaxed">
                Дали организирате свадба, роденден, крштевка или друг посебен настан?
Вклучете се во &ldquo;Сподели Моменти&rdquo; и овозможете им на вашите гости да ги зачуваат и споделат најубавите моменти – на едно место.
              </p>
              
              <div className="flex items-center justify-center gap-1 text-xs text-pink-500 mt-3">
                <Heart className="h-3 w-3" />
                <span>Секој момент е важен – нека биде споделен со најблиските.</span>
                <Heart className="h-3 w-3" />
              </div>
            </div>
          </div>
          
          {/* Auto redirect notice */}
          <div className="text-center bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-gray-500" />
              <p className="text-sm text-gray-600 font-medium">
                Автоматско пренасочување
              </p>
            </div>
            <p className="text-xs text-gray-500">
              Оваа страница автоматски ќе ве пренасочи кон активните свадби кога ќе бидат достапни
            </p>
          </div>

          {/* Bottom decorative element */}
          <div className="text-center pt-4">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-pink-200">
              <Heart className="h-4 w-4 text-pink-500 animate-pulse" />
              <span className="text-sm text-gray-600 font-medium">
                Наскоро... 
              </span>
              <Heart className="h-4 w-4 text-pink-500 animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}