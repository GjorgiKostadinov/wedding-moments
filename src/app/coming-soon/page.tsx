// Форсирај динамичко рендерирање - нема кеширање
export const dynamic = 'force-dynamic'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Bell, Sparkles, Users, Camera } from 'lucide-react'

export default function ComingSoonPage() {
  console.log('🔜 Coming Soon page се рендерира...')
  
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
        <div className="absolute top-1/2 left-10 text-amber-300 text-2xl animate-pulse">🎊</div>
        <div className="absolute top-1/3 right-10 text-yellow-300 text-2xl animate-bounce">🎭</div>
      </div>

      <Card className="w-full max-w-lg shadow-2xl border-0 bg-white/95 backdrop-blur-sm relative z-20">
        {/* Decorative border */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 rounded-lg opacity-20 blur-sm"></div>
        
        <CardHeader className="text-center relative pb-6">
          <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-full w-fit shadow-lg">
            <Camera className="h-12 w-12 text-amber-600 animate-pulse" />
          </div>
          
          <div className="flex justify-center items-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-amber-500 animate-pulse" />
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-amber-700 via-yellow-700 to-amber-800 bg-clip-text text-transparent text-center">
              Сподели Моменти
            </CardTitle>
            <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
          </div>
          
          <CardDescription className="text-stone-600 text-lg leading-relaxed font-medium">
            Моментално нема активни настани
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 relative">
          {/* Status Cards */}
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-xl border border-amber-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 text-amber-800">
                <Calendar className="h-5 w-5 text-amber-600" />
                <span className="font-semibold"> Контактирајте нè за детални информации и закажување термин!</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-xl border border-yellow-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 text-yellow-800">
                <Bell className="h-5 w-5 text-yellow-600" />
                <span className="font-semibold">Телефон/Viber: +389 77 409 939</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-stone-50 to-amber-50 p-4 rounded-xl border border-stone-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 text-stone-700">
                <Users className="h-5 w-5 text-stone-600" />
                <span className="font-semibold">Споделете радост, каде и да сте!</span>
              </div>
            </div>
          </div>
          
          {/* Main feature highlight */}
          <div className="bg-gradient-to-br from-amber-100 via-yellow-100 to-stone-100 p-6 rounded-xl border-2 border-amber-200 shadow-lg">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Camera className="h-6 w-6 text-amber-700" />
                <h3 className="text-lg font-bold text-amber-800">
                  Нека секој момент биде засекогаш!
                </h3>
              </div>
              
              <p className="text-sm text-amber-700 leading-relaxed">
                Дали организирате свадба, матурска, роденден, крштевка или друг посебен настан?
Вклучете се во &ldquo;Сподели Моменти&rdquo; и овозможете им на вашите гости да ги зачуваат и споделат најубавите моменти – на едно место.
              </p>
              
              <div className="flex items-center justify-center gap-1 text-xs text-amber-600 mt-3">
                <Camera className="h-3 w-3" />
                <span>Секој момент е важен – нека биде споделен со најблиските.</span>
                <Camera className="h-3 w-3" />
              </div>
            </div>
          </div>
          
          {/* Auto redirect notice */}
          <div className="text-center bg-gradient-to-r from-stone-50 to-stone-100 p-4 rounded-xl border border-stone-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-stone-500" />
              <p className="text-sm text-stone-600 font-medium">
                Автоматско пренасочување
              </p>
            </div>
            <p className="text-xs text-stone-500">
              Оваа страница автоматски ќе ве пренасочи кон активните настани кога ќе бидат достапни
            </p>
          </div>

          {/* Bottom decorative element */}
          <div className="text-center pt-4">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-amber-200">
              <Camera className="h-4 w-4 text-amber-600 animate-pulse" />
              <span className="text-sm text-stone-600 font-medium">
                Наскоро... 
              </span>
              <Camera className="h-4 w-4 text-amber-600 animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}