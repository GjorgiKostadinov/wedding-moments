// Форсирај динамичко рендерирање - нема кеширање
export const dynamic = 'force-dynamic'

import { getWeddingBySlug } from '@/lib/wedding-data'
import { GuestForm } from '@/components/guest-form'
import { notFound } from 'next/navigation'

interface WeddingPageProps {
  params: Promise<{ slug: string }>
}

export default async function WeddingPage({ params }: WeddingPageProps) {
  const { slug } = await params
  
  console.log('👰 Wedding page се рендерира за slug:', slug)
  
  const wedding = await getWeddingBySlug(slug)
  
  console.log('💒 Wedding пронајдена:', wedding ? wedding.title : 'Не е пронајдена')

  if (!wedding) {
    console.log('❌ Wedding не постои за slug:', slug)
    notFound()
  }

  console.log('✅ Прикажувам guest form за:', wedding.title)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <GuestForm wedding={wedding} />
    </div>
  )
}