'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import TicketHistory from '../components/TicketHistory'
import RedemptionHistory from '../components/RedemptionHistory'

const LuckyWheel = dynamic(() => import('../components/LuckyWheel'), { ssr: false })

const tierColors = {
  Bronze: '#8c6239',
  Silver: '#a0a0a0',
  Gold: '#facc15',
  Platinum: '#20b2aa',
  Diamond: '#4b0082',
}

const tierIcons = {
  Bronze: '/icons/bronze.png',
  Silver: '/icons/silver.png',
  Gold: '/icons/gold.png',
  Platinum: '/icons/platinum.png',
  Diamond: '/icons/diamond.png',
}

const tierThresholds = {
  Bronze: 0,
  Silver: 1000,
  Gold: 3000,
  Platinum: 6000,
  Diamond: 10000
}

// Define next tier mapping
const nextTierMap = {
  Bronze: 'Silver',
  Silver: 'Gold',
  Gold: 'Platinum',
  Platinum: 'Diamond',
  Diamond: 'Diamond', // Diamond is highest tier
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [showMenu, setShowMenu] = useState(false)
  const [spinsLeft, setSpinsLeft] = useState(null)
  const [rewardHistory, setRewardHistory] = useState([])
  const [xpData, setXpData] = useState({ cumulative: 0, redeemable: 0 })
  const [tickets, setTickets] = useState([])
  const [redemptions, setRedemptions] = useState([])

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

    const fetchXp = async (email) => {
      const res = await fetch('/api/user/xp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      setXpData(data.points)
    }

    const fetchHistory = async (email) => {
      const res = await fetch('/api/spin/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      setRewardHistory(data.rewards || [])
    }

    fetchXp(session.email)
    fetchHistory(session.email)

    const fetchTickets = async (email) => {
      const res = await fetch('/api/tickets/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      setTickets(data.tickets || [])
    }

    fetchTickets(session.email)

    const fetchRedemptions = async (email) => {
      const res = await fetch('/api/redemptions/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      setRedemptions(data.redemptions || [])
    }
    
    fetchRedemptions(session.email)
    
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

  const handleSpinComplete = async (reward) => {
    alert(`🎉 You won: ${reward}`)
  
    // Optional: Send reward to backend
    const res = await fetch('/api/spin/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        reward
      })
    })
  
    if (res.ok) {
      // Refresh spins + history
      fetchSpinsLeft(user.email)
  
      const updated = await fetch('/api/spin/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      })
  
      const data = await updated.json()
      setRewardHistory(data.rewards || [])
    }
  }

  // Get next tier details based on current tier
  const getNextTierInfo = (currentTier) => {
    if (!currentTier) return { nextTier: 'Silver', xpRequired: 1000 }
    
    const nextTier = nextTierMap[currentTier]
    const nextTierThreshold = tierThresholds[nextTier]
    const xpNeeded = Math.max(0, nextTierThreshold - xpData.cumulative)
    
    return { nextTier, xpRequired: xpNeeded }
  }

  const nextTierInfo = user ? getNextTierInfo(user.tier) : { nextTier: 'Silver', xpRequired: 1000 }

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

      <div className="mt-10 bg-white rounded-xl shadow-lg px-8 py-6 border border-blue-100">
        <h2 className="text-xl font-bold text-[#132452] mb-4 flex items-center gap-2">
          🚀 XP Progress
          {user?.tier && (
            <span
              className={`px-3 py-1 text-sm rounded-full font-semibold text-white shadow-sm`}
              style={{ backgroundColor: tierColors[user?.tier] }}
            >
              {user?.tier}
            </span>
          )}
        </h2>

        {/* XP Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Total XP: <strong>{xpData.cumulative}</strong></span>
            {user?.tier !== 'Diamond' && (
              <span>
                Next Tier: <strong>{nextTierInfo.nextTier} ({tierThresholds[nextTierInfo.nextTier]})</strong>
              </span>
            )}
          </div>

          <div className="relative w-full h-5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] shadow-inner transition-all duration-700 ease-out"
              style={{
                width:
                  user?.tier === 'Diamond'
                    ? '100%'
                    : `${Math.min(
                        100,
                        (xpData.cumulative / tierThresholds[nextTierInfo.nextTier]) * 100
                      )}%`
              }}
            ></div>
          </div>

          <div className="mt-2 text-xs text-gray-500">
            {user?.tier === 'Diamond' ? (
              <span className="text-emerald-600 font-semibold">Max Tier Reached!</span>
            ) : (
              <>
                {nextTierInfo.xpRequired} XP to <strong>{nextTierInfo.nextTier}</strong>
              </>
            )}
          </div>
        </div>

        {/* Redeemable XP */}
        <div className="mt-4 text-sm text-gray-800">
          Redeemable XP:
          <span className="ml-2 text-[#0284c7] font-bold">{xpData.redeemable}</span>
        </div>
      </div>

      <div className="mt-12 flex flex-col lg:flex-row gap-10 items-start">
        {/* 🎯 Lucky Wheel */}
        <div className="flex-1">
          <LuckyWheel
            spinsLeft={spinsLeft}
            onSpinComplete={handleSpinComplete}
          />
        </div>

        {/* 🧾 Reward History Sidebar */}
        <div className="w-full lg:w-[300px] max-h-[600px] overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold text-[#132452] mb-3">🧾 Lucky Draw History</h2>
          {rewardHistory.length === 0 ? (
            <p className="text-gray-500 text-sm">No spin history yet.</p>
          ) : (
            <ul className="space-y-3">
              {rewardHistory.map((item, idx) => (
                <li key={idx} className="flex justify-between text-sm border-b pb-2">
                  <span>{item.reward}</span>
                  <span className="text-gray-400">{new Date(item.date).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <TicketHistory tickets={tickets} />
      <RedemptionHistory redemptions={redemptions} />
    </div>
  )
}
