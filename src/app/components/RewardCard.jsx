'use client'

import Image from 'next/image'

export default function RewardCard({ reward, onRedeem, isRedeeming }) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 p-4 flex flex-col justify-between">
      <div className="relative w-full h-36 mb-4 rounded-md overflow-hidden">
        <Image
          src={reward.image}
          alt={reward.name}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-[#0c4a6e] mb-1">{reward.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
        <div className="text-xs text-gray-500 mb-2">
          Category: <span className="capitalize">{reward.category}</span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <span className="bg-[#0284c7] text-white text-sm px-3 py-1 rounded-full shadow text-center">
          {reward.xpCost} XP
        </span>
        <button
            onClick={() => onRedeem(reward)}
            className={`bg-[#20b2aa] hover:bg-[#168b8b] text-white text-xs px-4 py-2 rounded-md transition-all cursor-pointer ${
                isRedeeming ? 'opacity-60 cursor-wait' : ''
            }`}
            disabled={isRedeeming}
            >
            {isRedeeming ? 'Redeeming...' : 'Redeem'}
        </button>
      </div>
    </div>
  )
}
