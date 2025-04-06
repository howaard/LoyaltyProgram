'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Footer from '../../components/Footer'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setIsError(false)

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    if (res.ok) {
      setMessage('✅ Login successful!')
      // Example: redirect to dashboard
      setTimeout(() => router.push('/dashboard'), 1500)
      const expiresAt = Date.now() + 60 * 60 * 1000 // 1 hour
      localStorage.setItem('flydream_user', JSON.stringify({
        email: form.email,
        expiresAt
      }))
      // 🔁 Immediately go to dashboard (forces Navbar to reload)
      window.location.href = '/dashboard'
    } else {
      setIsError(true)
      setMessage(data.error || 'Login failed')
    }
  }

  return (
    <div className="bg-[#f5f9fd] min-h-screen flex flex-col justify-between">
      <div className="flex justify-center items-center py-24 px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-[#132452] mb-2">Log In</h1>
          <p className="text-sm text-gray-600 mb-6">Welcome back. Let’s get you flying again.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-sky-600 text-white py-2 rounded-lg text-base font-medium hover:bg-sky-700 transition cursor-pointer"
            >
              Log In
            </button>
            <p className="text-xs text-center text-gray-500 mt-4">
                Not yet a member?{' '}
                <a href="/auth/register" className="text-sky-700 font-semibold hover:underline">
                    Sign up now
                </a>
            </p>

          </form>

          {message && (
            <p className={`mt-4 text-sm ${isError ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
