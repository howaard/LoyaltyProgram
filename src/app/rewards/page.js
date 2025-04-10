'use client'

import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import RewardCard from '../components/RewardCard'

export default function RewardsPage() {
  const router = useRouter()
  const [redeemingId, setRedeemingId] = useState(null)
  const [rewards, setRewards] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRewards = async () => {
      const res = await fetch('/api/rewards/list')
      const data = await res.json()
      setRewards(data.rewards || [])
      setIsLoading(false)
    }

    fetchRewards()
  }, [])

  const grouped = rewards.reduce((acc, reward) => {
    acc[reward.category] = acc[reward.category] || []
    acc[reward.category].push(reward)
    return acc
  }, {})

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'lounge': return '🛋️ Lounge Access'
      case 'discount': return '💸 Discounts'
      case 'merch': return '🎽 Merchandise'
      default: return category.charAt(0).toUpperCase() + category.slice(1)
    }
  }

  const handleRedeem = async (reward) => {
    if (redeemingId) return // prevent double clicks
    setRedeemingId(reward._id)
  
    const user = JSON.parse(localStorage.getItem('flydream_user'))
    if (!user) {
        toast('Please log in to redeem rewards', { icon: '🔒' })
        setTimeout(() => {
          window.location.href = '/auth/login'
        }, 1500)
        return
      }
  
    const res = await fetch('/api/rewards/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        rewardId: reward._id
      })
    })
  
    const result = await res.json()
  
    if (res.ok) {
      toast.success(`🎉 Redeemed "${reward.name}"!`)
      // Reload rewards or XP
      router.refresh() // or re-fetch rewards manually
    } else {
      toast.error(result.error || 'Redemption failed')
    }
  
    setRedeemingId(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#dbeafe] px-6 py-10">
      <h1 className="text-3xl font-bold text-[#132452] mb-8">🎁 Redeem Your Rewards</h1>

      {isLoading ? (
        <p className="text-gray-600">Loading rewards...</p>
      ) : rewards.length === 0 ? (
        <p className="text-gray-500 text-sm">No rewards available right now.</p>
      ) : (
        <div className="space-y-12">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-xl font-semibold text-[#0c4a6e] mb-4">{getCategoryLabel(category)}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((reward, i) => (
                  <RewardCard
                  key={reward._id}
                  reward={reward}
                  onRedeem={handleRedeem}
                  isRedeeming={redeemingId === reward._id}
                />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
