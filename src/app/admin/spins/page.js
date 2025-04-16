'use client'

import { useEffect, useState } from 'react'
import { Download, FileText } from 'lucide-react'
import html2pdf from 'html2pdf.js'

export default function AdminSpinAnalytics() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch('/api/admin/spins', { method: 'POST' })
      const data = await res.json()
      setStats(data)
      setLoading(false)
    }

    fetchStats()
  }, [])

  const exportCSV = () => {
    const header = ['Email', 'Tier', 'Reward', 'Date']
    const rows = stats.recentSpins.map(s => [
      s.userEmail,
      s.tier,
      s.reward,
      new Date(s.date).toLocaleDateString()
    ])
    const csv = 'data:text/csv;charset=utf-8,' + [header, ...rows].map(r => r.join(',')).join('\n')
    const link = document.createElement('a')
    link.href = encodeURI(csv)
    link.download = 'spin_history.csv'
    link.click()
  }

  const exportPDF = () => {
    const container = document.createElement('div')
    const rows = stats.recentSpins.map(s => `
      <tr>
        <td style="border:1px solid #ccc;padding:6px;">${s.userEmail}</td>
        <td style="border:1px solid #ccc;padding:6px;">${s.tier}</td>
        <td style="border:1px solid #ccc;padding:6px;">${s.reward}</td>
        <td style="border:1px solid #ccc;padding:6px;">${new Date(s.date).toLocaleDateString()}</td>
      </tr>
    `).join('')

    container.innerHTML = `
      <h2 style="font-size:18px;margin-bottom:12px;">🎯 Spin History</h2>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr>
            <th style="border:1px solid #ccc;padding:6px;">Email</th>
            <th style="border:1px solid #ccc;padding:6px;">Tier</th>
            <th style="border:1px solid #ccc;padding:6px;">Reward</th>
            <th style="border:1px solid #ccc;padding:6px;">Date</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `

    html2pdf().from(container).set({
      filename: 'spin_history.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    }).save()
  }

  if (loading) {
    return <div className="p-6 text-gray-500">Loading spin stats...</div>
  }

  return (
    <div className="min-h-screen bg-[#f5f9fd] px-6 py-8">
      <h1 className="text-2xl font-bold text-[#132452] mb-6">🎯 Lucky Draw Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="text-sm text-gray-500 mb-1">Total Spins</h3>
          <p className="text-xl font-bold text-blue-600">{stats.totalSpins}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="text-sm text-gray-500 mb-1">Total XP Earned</h3>
          <p className="text-xl font-bold text-green-600">{stats.totalXPEarned}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="text-sm text-gray-500 mb-1">Top Rewards</h3>
          <ul className="text-sm text-gray-700 space-y-1 mt-2">
            {stats.topRewards.map((r, i) => (
              <li key={i} className="flex justify-between">
                <span>{r.reward}</span>
                <span className="text-gray-500">{r.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-[#132452]">🕓 Recent Spins</h2>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="bg-[#0284c7] text-white px-3 py-1 text-sm rounded hover:bg-[#0369a1] flex items-center">
            <FileText size={16} className="mr-1" /> CSV
          </button>
          <button onClick={exportPDF} className="bg-[#10b981] text-white px-3 py-1 text-sm rounded hover:bg-[#059669] flex items-center">
            <Download size={16} className="mr-1" /> PDF
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white border rounded shadow">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Tier</th>
              <th className="px-4 py-2">Reward</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentSpins.map((spin, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{spin.userEmail}</td>
                <td className="px-4 py-2">{spin.tier}</td>
                <td className="px-4 py-2">{spin.reward}</td>
                <td className="px-4 py-2">{new Date(spin.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
