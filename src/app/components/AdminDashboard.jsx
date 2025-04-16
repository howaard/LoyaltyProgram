'use client'
import Link from 'next/link'
import { BarChart, Gift, Shuffle } from 'lucide-react'

export default function AdminDashboard({ user }) {
  const cards = [
    {
      title: 'User Analytics',
      href: '/admin/users',
      icon: <BarChart className="text-[#0284c7]" size={28} />,
      bg: 'bg-blue-50 hover:bg-blue-100',
      text: 'Manage and monitor user XP, tiers, and engagement.',
    },
    {
      title: 'Rewards',
      href: '/admin/rewards',
      icon: <Gift className="text-[#10b981]" size={28} />,
      bg: 'bg-green-50 hover:bg-green-100',
      text: 'Add, edit, or remove loyalty rewards.',
    },
    {
      title: 'Lucky Draw',
      href: '/admin/spins',
      icon: <Shuffle className="text-yellow-500" size={28} />,
      bg: 'bg-yellow-50 hover:bg-yellow-100',
      text: 'View spin history and configure wheel rewards.',
    }
  ]

  return (
    <div className="mt-10 bg-white rounded-xl shadow-lg px-8 py-6 border border-blue-100">
      <h2 className="text-2xl font-bold text-[#132452] mb-4">🛠️ Admin Dashboard</h2>

      <p className="text-gray-700 mb-6">
        Welcome, <strong>{user.username}</strong>. You have administrative access to FlyDreamAir systems.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <Link key={i} href={card.href}>
            <div
              className={`cursor-pointer transition-all duration-200 border rounded-xl shadow-sm p-5 ${card.bg}`}
            >
              <div className="flex items-center gap-4 mb-3">
                {card.icon}
                <h3 className="text-lg font-semibold text-[#132452]">{card.title}</h3>
              </div>
              <p className="text-sm text-gray-600">{card.text}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
