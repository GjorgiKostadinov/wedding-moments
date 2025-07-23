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
        toast.success(`Свадбата е ${updatedWedding.isActive ? 'активирана' : 'деактивирана'}`)
      }
    } catch (error) {
      toast.error('Не може да се промени статусот')
    } finally {
      setLoading(null)
    }
  }

  async function deleteWedding(weddingId: string) {
    if (!confirm('Дали сте сигурни дека сакате да ја избришете оваа свадба?')) {
      return
    }

    setLoading(weddingId)
    try {
      const response = await fetch(`/api/admin/weddings/${weddingId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setWeddings(prev => prev.filter(w => w.id !== weddingId))
        toast.success('Свадбата е избришана')
      }
    } catch (error) {
      toast.error('Не може да се избрише свадбата')
    } finally {
      setLoading(null)
    }
  }

  const activeWeddings = weddings.filter(w => w.isActive).length
  const totalWeddings = weddings.length

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Управување со свадбени настани</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/wedding/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Нова Свадба
              </Button>
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              <Power className="mr-2 h-4 w-4" />
              Одјави се
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Вкупно Свадби</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalWeddings}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Активни Свадби</CardTitle>
              <ToggleRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeWeddings}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Неактивни</CardTitle>
              <ToggleLeft className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-500">{totalWeddings - activeWeddings}</div>
            </CardContent>
          </Card>
        </div>

        {/* Weddings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Сите Свадби</CardTitle>
            <CardDescription>Управувајте со свадбените настани и нивните поставки</CardDescription>
          </CardHeader>
          <CardContent>
            {weddings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Нема свадби</h3>
                <p className="text-gray-500 mb-4">Започнете со креирање на вашата прва свадба</p>
                <Link href="/admin/wedding/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Креирај Свадба
                  </Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Свадба</TableHead>
                    <TableHead>Датум</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Линк</TableHead>
                    <TableHead className="text-right">Акции</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {weddings.map((wedding) => (
                    <TableRow key={wedding.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{wedding.title}</p>
                          <p className="text-sm text-gray-500">{wedding.coupleNames}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(wedding.date).toLocaleDateString('mk-MK')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{wedding.coupleEmail}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={wedding.isActive ? "default" : "secondary"}>
                          {wedding.isActive ? "Активна" : "Неактивна"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link 
                          href={`/wedding/${wedding.slug}`}
                          target="_blank"
                          className="text-blue-600 hover:underline text-sm"
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
      </div>
    </div>
  )
}