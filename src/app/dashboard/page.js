'use client'
import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'

const tierColors = {
  Bronze: '#8c6239',
  Silver: '#a0a0a0',
  Gold: '#facc15',
  Platinum: '#3b82f6',
  Diamond: '#4b0082',
}

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('flydream_user')
    if (stored) {
      setUser(JSON.parse(stored))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('flydream_user')
    window.location.href = '/'
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
              <span
                className="font-semibold"
                style={{ color: tierColors[user.tier || 'Bronze'] }}
              >
                {user.username}
              </span>
              <ChevronDown size={16} className="text-gray-500" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 bg-white rounded shadow-md w-48 text-sm z-10">
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  Account Settings
                </a>
                <a onClick={handleLogout} className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Log out
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      <h1 className="text-3xl font-bold text-[#132452] mt-10">Dashboard</h1>
      {/* rest of dashboard content */}
    </div>
  )
}
