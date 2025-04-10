'use client'

import { toast } from 'react-hot-toast'
import { Copy } from 'lucide-react'

export default function RedemptionHistory({ redemptions = [] }) {

    const handleCopy = (id) => {
        navigator.clipboard.writeText(id)
        toast.success('Reward ID copied to clipboard!')
      }

  return (
    <div className="mt-12 bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-[#132452] mb-4">🎁 Redemption History</h2>

      {redemptions.length === 0 ? (
        <p className="text-gray-500 text-sm">You haven't redeemed any rewards yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="py-2 px-4">Reward</th>
                <th className="py-2 px-4">XP Spent</th>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Reward ID</th>
              </tr>
            </thead>
            <tbody>
              {redemptions.map((r, i) => (
                <tr key={i} className="border-b hover:bg-gray-50 transition">
                  <td className="py-2 px-4">{r.rewardName}</td>
                  <td className="py-2 px-4 text-[#0284c7] font-semibold">{r.xpSpent}</td>
                  <td className="py-2 px-4">
                    {new Date(r.date).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 font-mono text-xs text-gray-500 flex items-center gap-2">
                  <span
                        className="text-gray-600 cursor-default"
                        title={r.rewardId.toString()}
                    >
                        {r.rewardId.toString().slice(0, 8)}...
                    </span>
                    <Copy
                        size={14}
                        className="cursor-pointer text-gray-400 hover:text-blue-600 transition"
                        onClick={() => handleCopy(r.rewardId)}
                        title="Copy full ID"
                    />
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
