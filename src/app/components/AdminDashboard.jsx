'use client'

export default function AdminDashboard({ user }) {
  return (
    <div className="mt-10 bg-white rounded-xl shadow-lg px-8 py-6 border border-blue-100">
      <h2 className="text-2xl font-bold text-[#132452] mb-4">🛠️ Admin Dashboard</h2>

      <p className="text-gray-700 mb-4">
        Welcome, <strong>{user.username}</strong>. You have admin access.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border rounded-lg shadow-sm bg-blue-50">
          <h3 className="text-sm font-semibold mb-2">📊 Total Users</h3>
          <p className="text-xl text-[#0284c7] font-bold">Coming Soon</p>
        </div>

        <div className="p-4 border rounded-lg shadow-sm bg-green-50">
          <h3 className="text-sm font-semibold mb-2">🎁 Total Rewards Redeemed</h3>
          <p className="text-xl text-[#10b981] font-bold">Coming Soon</p>
        </div>

        <div className="p-4 border rounded-lg shadow-sm bg-yellow-50">
          <h3 className="text-sm font-semibold mb-2">💼 Tickets Sold</h3>
          <p className="text-xl text-yellow-500 font-bold">Coming Soon</p>
        </div>
      </div>
    </div>
  )
}
