'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Shield } from 'lucide-react'

export default function AdminLogin() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const username = formData.get('username')
    const password = formData.get('password')

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Успешно најавување!')
        router.push('/admin')
      } else {
        toast.error(result.error || 'Грешка при најавување')
      }
    } catch {
      toast.error('Се појави проблем при најавување')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <Shield className="mx-auto h-8 w-8 text-blue-600 mb-2" />
          <CardTitle>Админ Најавување</CardTitle>
          <CardDescription>Внесете ги вашите податоци за пристап</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Корисничко име</Label>
              <Input id="username" name="username" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Лозинка</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Најавување...' : 'Најави се'}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}