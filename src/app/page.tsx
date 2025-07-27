// Форсирај динамичко рендерирање - нема кеширање
export const dynamic = 'force-dynamic'
// Алтернативно можете да користите:
// export const revalidate = 0

import { getActiveWeddings } from '@/lib/wedding-data'
import { WeddingSelection } from '@/components/wedding-selection'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  console.log('🏠 HomePage се рендерира...')
  
  const weddings = await getActiveWeddings()
  console.log('📊 Активни настани:', weddings.length)
  
  // Паметно пренасочување
  if (weddings.length === 0) {
    console.log('🔄 Пренасочување кон coming-soon')
    // Нема активни свадби → Coming Soon
    redirect('/coming-soon')
  } else if (weddings.length === 1) {
    console.log('🔄 Пренасочување кон wedding/', weddings[0].slug)
    // Една активна свадба → Директно до формата
    redirect(`/wedding/${weddings[0].slug}`)
  }
  
  console.log('✅ Прикажувам wedding selection')
  // Повеќе активни свадби → Покажи избор
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <WeddingSelection weddings={weddings} />
    </div>
  )
}