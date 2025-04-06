'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('flydream_user')
    if (!stored) return router.push('/auth/login')

    const session = JSON.parse(stored)
    const expired = Date.now() > session.expiresAt

    if (expired) {
      localStorage.removeItem('flydream_user')
      router.push('/auth/login')
    }
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-[#132452]">Welcome to your Dashboard</h1>
      {/* Dashboard content here */}
    </div>
  )
}
