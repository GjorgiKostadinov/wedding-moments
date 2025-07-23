import { getWeddingBySlug } from '@/lib/wedding-data'
import { GuestForm } from '@/components/guest-form'
import { notFound } from 'next/navigation'

interface WeddingPageProps {
  params: Promise<{ slug: string }>
}

export default async function WeddingPage({ params }: WeddingPageProps) {
  const { slug } = await params
  const wedding = await getWeddingBySlug(slug)

  if (!wedding) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <GuestForm wedding={wedding} />
    </div>
  )
}