'use client'
import Link from 'next/link'

export default function AdminDashboard({ user }) {
  return (
    <div className="mt-10 bg-white rounded-xl shadow-lg px-8 py-6 border border-blue-100">
      <h2 className="text-2xl font-bold text-[#132452] mb-4">🛠️ Admin Dashboard</h2>

      <p className="text-gray-700 mb-4">
        Welcome, <strong>{user.username}</strong>. You have admin access.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Link href="/admin/users">
        <div className="p-4 border rounded-lg shadow-sm bg-blue-50">
          <h3 className="text-sm font-semibold mb-2">User Analytics</h3>
        </div>
      </Link>

      <Link href="/admin/rewards">
        <div className="p-4 border rounded-lg shadow-sm bg-green-50">
          <h3 className="text-sm font-semibold mb-2">Rewards</h3>
        </div>
      </Link>

      <Link href="/admin/spins">
        <div className="p-4 border rounded-lg shadow-sm bg-yellow-50">
          <h3 className="text-sm font-semibold mb-2">Lucky Draw</h3>
        </div>
      </Link>
      </div>
    </div>
  )
}
