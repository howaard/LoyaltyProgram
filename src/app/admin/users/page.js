'use client'

import { useEffect, useState } from 'react'
import { Download, FileText } from 'lucide-react'
import html2pdf from 'html2pdf.js'

export default function AdminUserAnalytics() {
  const [users, setUsers] = useState([])
  const [sortKey, setSortKey] = useState('xp')
  const [sortDir, setSortDir] = useState('desc')

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      setUsers(data.users || [])
    }

    fetchUsers()
  }, [])

  const sortedUsers = [...users].sort((a, b) => {
    if (sortKey === 'xp') {
      return sortDir === 'asc' ? a.points.cumulative - b.points.cumulative : b.points.cumulative - a.points.cumulative
    }
    if (sortKey === 'tier') {
      const tiers = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond']
      return sortDir === 'asc' ? tiers.indexOf(a.tier) - tiers.indexOf(b.tier) : tiers.indexOf(b.tier) - tiers.indexOf(a.tier)
    }
    if (sortKey === 'createdAt') {
      return sortDir === 'asc'
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt)
    }
    return 0
  })

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const exportCSV = () => {
    const header = ['Username', 'Email', 'Tier', 'Cumulative XP', 'Redeemable XP']
    const rows = sortedUsers.map(u => [
      u.username, u.email, u.tier,
      u.points.cumulative, u.points.redeemable
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [header, ...rows].map(e => e.join(',')).join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'user_analytics.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportPDF = () => {
    const tableHTML = `
      <h2 style="font-size:18px;margin-bottom:10px;">📊 User Analytics</h2>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr>
            <th style="border:1px solid #ccc;padding:6px;">Username</th>
            <th style="border:1px solid #ccc;padding:6px;">Email</th>
            <th style="border:1px solid #ccc;padding:6px;">Tier</th>
            <th style="border:1px solid #ccc;padding:6px;">Cumulative XP</th>
            <th style="border:1px solid #ccc;padding:6px;">Redeemable XP</th>
          </tr>
        </thead>
        <tbody>
          ${sortedUsers.map(user => `
            <tr>
              <td style="border:1px solid #ccc;padding:6px;">${user.username}</td>
              <td style="border:1px solid #ccc;padding:6px;">${user.email}</td>
              <td style="border:1px solid #ccc;padding:6px;">${user.tier}</td>
              <td style="border:1px solid #ccc;padding:6px;">${user.points.cumulative}</td>
              <td style="border:1px solid #ccc;padding:6px;">${user.points.redeemable}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `

    const container = document.createElement('div')
    container.innerHTML = tableHTML

    html2pdf().from(container).set({
      filename: 'user_analytics.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
    }).save()
  }

  return (
    <div className="min-h-screen bg-[#f5f9fd] px-6 py-8">
      <h1 className="text-2xl font-bold text-[#132452] mb-6">📊 User Analytics</h1>

      <div className="flex justify-end gap-3 mb-4">
        <button
          onClick={exportCSV}
          className="flex items-center bg-[#0284c7] text-white text-sm px-3 py-1.5 rounded hover:bg-[#0369a1]"
        >
          <FileText size={16} className="mr-2" /> Export CSV
        </button>
        <button
          onClick={exportPDF}
          className="flex items-center bg-[#10b981] text-white text-sm px-3 py-1.5 rounded hover:bg-[#059669]"
        >
          <Download size={16} className="mr-2" /> Export PDF
        </button>
      </div>

      <div className="overflow-x-auto bg-white border rounded shadow">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => toggleSort('tier')}>Tier</th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => toggleSort('xp')}>Cumulative XP</th>
              <th className="px-4 py-2">Redeemable XP</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((u, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{u.username}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.tier}</td>
                <td className="px-4 py-2">{u.points.cumulative}</td>
                <td className="px-4 py-2 text-[#0284c7] font-semibold">{u.points.redeemable}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
