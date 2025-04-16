'use client'

import { useEffect, useState } from 'react'
import { Pencil, Trash2, PlusCircle } from 'lucide-react'
import Image from 'next/image'
import RewardModal from '../../components/RewardModal'

export default function AdminRewardsPage() {
  const [rewards, setRewards] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedReward, setSelectedReward] = useState(null)

  const fetchRewards = async () => {
    const res = await fetch('/api/rewards/list')
    const data = await res.json()
    setRewards(data.rewards || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchRewards()
  }, [])

  const handleEdit = (reward) => {
    setSelectedReward(reward)
    setShowModal(true)
  }

  const handleDelete = async (rewardId) => {
    const confirm = window.confirm('Are you sure you want to delete this reward?')
    if (!confirm) return

    await fetch('/api/rewards/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: rewardId }),
    })

    setRewards(prev => prev.filter(r => r._id !== rewardId))
  }

  return (
    <div className="min-h-screen bg-[#f5f9fd] px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#132452]">🎁 Manage Rewards</h1>
        <button
          onClick={() => {
            setSelectedReward(null)
            setShowModal(true)
          }}
          className="flex items-center bg-[#0284c7] text-white px-4 py-2 rounded hover:bg-[#0369a1] text-sm"
        >
          <PlusCircle className="mr-2" size={18} /> Add Reward
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading rewards...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {rewards.map((r) => (
            <div
              key={r._id}
              className="bg-white rounded-lg shadow-md border border-blue-100 p-4 relative group"
            >
        <div className="relative w-full h-32 mb-3 rounded overflow-hidden bg-gray-100">
          {typeof r.image === 'string' && (r.image.startsWith('http') || r.image.startsWith('/')) ? (
            <Image
              src={r.image}
              alt={r.name}
              fill
              className="object-contain"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.png'
              }}
            />
          ) : (
            <Image
              src="/placeholder.png"
              alt="Fallback image"
              fill
              className="object-contain"
            />
          )}
        </div>
              <h3 className="text-md font-semibold text-[#0c4a6e]">{r.name}</h3>
              <p className="text-sm text-gray-500">{r.description}</p>
              <div className="text-xs text-gray-400 mb-2 capitalize">Category: {r.category}</div>
              <div className="text-sm font-bold text-[#0284c7] mb-1">{r.xpCost} XP</div>
              <div className="text-xs text-gray-600 mb-2">Quantity: {r.quantity ?? '∞'}</div>
              <div className="text-xs text-green-600">
                {r.available ? 'Available' : 'Unavailable'}
              </div>

              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => handleEdit(r)}>
                  <Pencil size={16} className="text-blue-600 hover:text-blue-800" />
                </button>
                <button onClick={() => handleDelete(r._id)}>
                  <Trash2 size={16} className="text-red-500 hover:text-red-700" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <RewardModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedReward(null)
        }}
        initialData={selectedReward}
        onSave={fetchRewards}
      />
    </div>
  )
}
