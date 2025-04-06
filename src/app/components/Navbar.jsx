'use client'
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react'

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkSession = () => {
      const session = localStorage.getItem('flydream_user')
      if (session && Date.now() < JSON.parse(session).expiresAt) {
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false)
      }
    }

    checkSession()

    // 🔁 Listen to localStorage changes (like logout from other tab)
    window.addEventListener('storage', checkSession)

    // 🧼 Cleanup
    return () => window.removeEventListener('storage', checkSession)

  }, [])

  const handleLogout = () => {
    localStorage.removeItem('flydream_user')
    setIsLoggedIn(false)
    window.location.href = '/'
  }

  return (
    <nav className="h-24 bg-gradient-to-b from-[#f5f9fd] to-[#dce9f9] shadow-lg flex items-center justify-between px-12 border-b border-sky-300 font-sans relative z-10">
      <div className="flex items-center space-x-8">
        <Image
          src="/company-logo.png"
          alt="FlyDreamAir Logo"
          width={120}
          height={60}
          className="object-contain drop-shadow-sm"
        />
        <h1 className="text-3xl font-bold text-[#132452] drop-shadow-sm" style={{ fontFamily: 'Work Sans, sans-serif' }}>
          FlyDream XP
        </h1>
      </div>

      <div className="flex gap-16 text-black font-medium text-xl">
        <Link href="/" className="px-5 py-2 hover:text-sky-700 transition">Home</Link>
        <Link href="/dashboard" className="px-5 py-2 hover:text-sky-700 transition">Dashboard</Link>
        <Link href="/rewards" className="px-5 py-2 hover:text-sky-700 transition">Rewards</Link>
        {isLoggedIn ? (
          <a
            onClick={handleLogout}
            className="px-5 py-2 text-sky-700 font-semibold hover:underline cursor-pointer"
          >
            Logout
          </a>
                ) : (
                  <Link href="/auth/login" className="px-5 py-2 hover:underline text-sky-700 font-semibold">
                    Login
                  </Link>
        )}
      </div>
    </nav>
  );
}
