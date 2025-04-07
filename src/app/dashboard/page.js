'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import LuckyWheel from '../components/LuckyWheel'

const tierColors = {
  Bronze: '#8c6239',
  Silver: '#a0a0a0',
  Gold: '#facc15',
  Platinum: '#3b82f6',
  Diamond: '#4b0082',
}

const tierIcons = {
  Bronze: '/icons/bronze.png',
  Silver: '/icons/silver.png',
  Gold: '/icons/gold.png',
  Platinum: '/icons/platinum.png',
  Diamond: '/icons/diamond.png',
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [showMenu, setShowMenu] = useState(false)
  const [spinsLeft, setSpinsLeft] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('flydream_user')

    if (!stored) {
      router.push('/auth/login')
      return
    }

    const session = JSON.parse(stored)
    const isExpired = Date.now() > session.expiresAt

    if (isExpired) {
      localStorage.removeItem('flydream_user')
      router.push('/auth/login')
      return
    }

    setUser(session)
    fetchSpinsLeft(session.email)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('flydream_user')
    window.location.href = '/'
  }

  const fetchSpinsLeft = async (email) => {
    const res = await fetch('/api/spin/info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
  
    const data = await res.json()
    setSpinsLeft(data.spinsLeft)
  }

  return (
    <div className="min-h-screen bg-[#f5f9fd] px-8 py-6">
      <div className="flex justify-end items-center relative">
        {user && (
          <div className="text-right">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded shadow hover:bg-gray-50 transition"
            >
            <span className="text-sm text-gray-600">Welcome back,</span>
            <span className="font-semibold" style={{ color: tierColors[user.tier || 'Bronze'] }}>
              {user.username}
            </span>
            {user.tier && (
              <Image
                src={tierIcons[user.tier]}
                alt={`${user.tier} icon`}
                width={20}
                height={20}
                className="ml-1"
                priority
              />
            )}
            <ChevronDown size={16} className="text-gray-500" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 bg-white rounded shadow-md w-48 text-sm z-10">
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">Account Settings</a>
                <a onClick={handleLogout} className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Log out
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      <h1 className="text-3xl font-bold text-[#132452] mt-10">Dashboard</h1>
      <LuckyWheel
        spinsLeft={spinsLeft}
        onSpinComplete={(reward) => {
          alert(`🎉 You won: ${reward}`)
          // (Optional) POST to /api/spin/redeem here
        }}
      />
    </div>
  )
}
