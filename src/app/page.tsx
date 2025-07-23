import { getActiveWeddings } from '@/lib/wedding-data'
import { WeddingSelection } from '@/components/wedding-selection'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const weddings = await getActiveWeddings()
  
  // Паметно пренасочување
  if (weddings.length === 0) {
    // Нема активни свадби → Coming Soon
    redirect('/coming-soon')
  } else if (weddings.length === 1) {
    // Една активна свадба → Директно до формата
    redirect(`/wedding/${weddings[0].slug}`)
  }
  
  // Повеќе активни свадби → Покажи избор
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <WeddingSelection weddings={weddings} />
    </div>
  )
}