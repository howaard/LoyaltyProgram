'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function AccountSettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dob, setDob] = useState('')

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

    // 🧠 Optional: fetch full profile from DB if needed
    fetch('/api/user/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: session.email })
    })
      .then(res => res.json())
      .then(data => {
        setFirstName(data.firstName || '')
        setLastName(data.lastName || '')
        setDob(data.dob || '')
      })
      .catch(err => {
        console.error('Failed to fetch profile details:', err)
      })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await fetch('/api/user/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        firstName,
        lastName,
        dob
      })
    })

    if (res.ok) {
      toast.success('Profile updated successfully')
    } else {
      toast.error('Failed to update profile')
    }
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-[#f5f9fd]">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-[#132452] mb-6">⚙️ Account Settings</h2>

        {user && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-gray-600">Username</label>
              <div className="border rounded px-3 py-2 bg-gray-100">{user.username}</div>
            </div>
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <div className="border rounded px-3 py-2 bg-gray-100">{user.email}</div>
            </div>
            <div>
              <label className="text-sm text-gray-600">Tier</label>
              <div className="border rounded px-3 py-2 bg-gray-100">{user.tier}</div>
            </div>

            <div>
              <label className="text-sm text-gray-600">First Name</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded mt-1"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Last Name</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded mt-1"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Date of Birth</label>
              <input
                type="date"
                className="w-full border px-3 py-2 rounded mt-1"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="bg-[#0284c7] text-white px-4 py-2 rounded hover:bg-[#0369a1]"
            >
              Save Changes
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
