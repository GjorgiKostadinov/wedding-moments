import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Calendar, Bell } from 'lucide-react'

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <div className="mx-auto mb-4 p-3 bg-pink-100 rounded-full w-fit">
            <Heart className="h-8 w-8 text-pink-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-pink-600">
            💕 WeddingMoments
          </CardTitle>
          <CardDescription className="text-lg">
            Моментално нема активни свадбени настани
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 text-gray-600">
              <Calendar className="h-5 w-5" />
              <span>Следете не за најави за нови свадби</span>
            </div>
            
            <div className="flex items-center justify-center gap-3 text-gray-600">
              <Bell className="h-5 w-5" />
              <span>Ќе бидете известени кога ќе има нови настани</span>
            </div>
          </div>
          
          <div className="bg-pink-50 p-4 rounded-lg">
            <p className="text-sm text-pink-700 font-medium mb-2">
              💕 Споделете моменти од свадбени настани
            </p>
            <p className="text-xs text-pink-600">
              Скенирајте го овој QR код кога ќе има активни свадби за да споделите ваши прекрасни моменти!
            </p>
          </div>
          
          <p className="text-xs text-gray-500">
            Оваа страница автоматски ќе ве пренасочи кон активните свадби
          </p>
        </CardContent>
      </Card>
    </div>
  )
}