'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, ToggleLeft, ToggleRight, Trash2, Power, Calendar, Mail } from 'lucide-react'
import { WeddingConfig } from '@/lib/wedding-data'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PhotoCleanup } from '@/components/photo-cleanup'

interface AdminDashboardProps {
  weddings: WeddingConfig[]
}

export function AdminDashboard({ weddings: initialWeddings }: AdminDashboardProps) {
  const [weddings, setWeddings] = useState(initialWeddings)
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  async function toggleWeddingStatus(weddingId: string) {
    setLoading(weddingId)
    try {
      const wedding = weddings.find(w => w.id === weddingId)
      if (!wedding) return

      const response = await fetch(`/api/admin/weddings/${weddingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !wedding.isActive })
      })

      if (response.ok) {
        const updatedWedding = await response.json()
        setWeddings(prev => prev.map(w => 
          w.id === weddingId ? updatedWedding : w
        ))
        toast.success(`Настанот е ${updatedWedding.isActive ? 'активиран' : 'деактивиран'}`)
      }
    } catch {
      toast.error('Не може да се промени статусот')
    } finally {
      setLoading(null)
    }
  }

  async function deleteWedding(weddingId: string) {
    if (!confirm('Дали сте сигурни дека сакате да го избришете овој настан?')) {
      return
    }

    setLoading(weddingId)
    try {
      const response = await fetch(`/api/admin/weddings/${weddingId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setWeddings(prev => prev.filter(w => w.id !== weddingId))
        toast.success('Настанот е избришан')
      }
    } catch {
      toast.error('Не може да се избрише настанот')
    } finally {
      setLoading(null)
    }
  }

  const activeWeddings = weddings.filter(w => w.isActive).length
  const totalWeddings = weddings.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-stone-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-yellow-700 bg-clip-text text-transparent">Admin Dashboard</h1>
            <p className="text-stone-600 mt-1">Управување со настани</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/wedding/new">
              <Button className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white shadow-lg">
                <Plus className="mr-2 h-4 w-4" />
                Нов Настан
              </Button>
            </Link>
            <Button variant="outline" onClick={handleLogout} className="border-amber-200 text-amber-700 hover:bg-amber-50">
              <Power className="mr-2 h-4 w-4" />
              Одјави се
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-stone-700">Вкупно Настани</CardTitle>
              <Calendar className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-700">{totalWeddings}</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-stone-700">Активни Настани</CardTitle>
              <ToggleRight className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{activeWeddings}</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-stone-700">Неактивни</CardTitle>
              <ToggleLeft className="h-4 w-4 text-stone-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-stone-600">{totalWeddings - activeWeddings}</div>
            </CardContent>
          </Card>
        </div>

        {/* Weddings Table */}
        <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-amber-800">Сите Настани</CardTitle>
            <CardDescription className="text-stone-600">Управувајте со настаните и нивните поставки</CardDescription>
          </CardHeader>
          <CardContent>
            {weddings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-amber-500 mb-4" />
                <h3 className="text-lg font-semibold text-stone-700 mb-2">Нема настани</h3>
                <p className="text-stone-500 mb-4">Започнете со креирање на вашиот прв настан</p>
                <Link href="/admin/wedding/new">
                  <Button className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white shadow-lg">
                    <Plus className="mr-2 h-4 w-4" />
                    Креирај Настан
                  </Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-amber-800 font-semibold">Настан</TableHead>
                    <TableHead className="text-amber-800 font-semibold">Датум</TableHead>
                    <TableHead className="text-amber-800 font-semibold">Email</TableHead>
                    <TableHead className="text-amber-800 font-semibold">Статус</TableHead>
                    <TableHead className="text-amber-800 font-semibold">Линк</TableHead>
                    <TableHead className="text-right text-amber-800 font-semibold">Акции</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {weddings.map((wedding) => (
                    <TableRow key={wedding.id} className="hover:bg-amber-50/50 transition-colors">
                      <TableCell>
                        <div>
                          <p className="font-medium text-stone-800">{wedding.title}</p>
                          <p className="text-sm text-stone-600">{wedding.coupleNames}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-stone-700">
                        {(() => {
                          const date = new Date(wedding.date)
                          const day = date.getDate().toString().padStart(2, '0')
                          const month = (date.getMonth() + 1).toString().padStart(2, '0')
                          const year = date.getFullYear()
                          return `${day}.${month}.${year}`
                        })()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-amber-500" />
                          <span className="text-sm text-stone-600">{wedding.coupleEmail}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={wedding.isActive ? "default" : "secondary"}
                          className={wedding.isActive ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200" : "bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200"}
                        >
                          {wedding.isActive ? "Активен" : "Неактивен"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link 
                          href={`/wedding/${wedding.slug}`}
                          target="_blank"
                          className="text-amber-700 hover:text-amber-900 hover:underline text-sm font-medium"
                        >
                          /wedding/{wedding.slug}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleWeddingStatus(wedding.id)}
                            disabled={loading === wedding.id}
                            className="border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300"
                          >
                            {wedding.isActive ? (
                              <ToggleLeft className="h-4 w-4" />
                            ) : (
                              <ToggleRight className="h-4 w-4" />
                            )}
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteWedding(wedding.id)}
                            disabled={loading === wedding.id}
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Photo Cleanup Section */}
        <div className="mt-8">
          <PhotoCleanup />
        </div>
      </div>
    </div>
  )
}