'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Footer from '../../components/Footer'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setIsError(false)

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    if (res.ok) {
      setMessage('🎉 Account created! Redirecting to login...')
      setForm({ username: '', email: '', password: '' })
      setTimeout(() => router.push('/auth/login'), 2000)
    } else {
      setIsError(true)
      setMessage(data.error || 'Something went wrong')
    }
  }

  return (
    <div className="bg-[#f5f9fd] min-h-screen flex flex-col justify-between">
      <div className="flex justify-center items-center py-24 px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-[#132452] mb-2">Create Your Account</h1>
          <p className="text-sm text-gray-600 mb-6">Start earning XP and rewards with FlyDream XP.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

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
              Sign Up
            </button>

            <p className="text-xs text-gray-500 text-center mt-2">
              By submitting this form, you agree to our{' '}
              <a href="#" className="underline hover:text-sky-700">Terms</a> and{' '}
              <a href="#" className="underline hover:text-sky-700">Privacy Policy</a>.
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
