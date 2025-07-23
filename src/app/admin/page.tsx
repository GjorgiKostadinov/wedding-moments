import { getAllWeddings } from '@/lib/wedding-data'
import { AdminDashboard } from '@/components/admin-dashboard'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

async function checkAuth() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_session')?.value === 'authenticated'
}

export default async function AdminPage() {
  if (!await checkAuth()) {
    redirect('/admin/login')
  }

  const weddings = await getAllWeddings()

  return <AdminDashboard weddings={weddings} />
}