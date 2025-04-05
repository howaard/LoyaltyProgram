'use client'

import { useState } from 'react'
import Footer from '../../components/Footer'

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    if (res.ok) {
      setMessage('✅ Registered successfully!')
      setForm({ username: '', email: '', password: '' })
    } else {
      setMessage(`❌ ${data.error || 'Something went wrong'}`)
    }
  }

  return (
    <div>
        <div className="max-w-md mx-auto py-20 px-4">
        <h1 className="text-3xl font-bold text-[#132452] mb-6">Create Account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
            <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
            />
            <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
            />
            <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
            />
            <button
            type="submit"
            className="w-full bg-sky-600 text-white py-2 rounded hover:bg-sky-700 transition"
            >
            Sign Up
            </button>
        </form>

        {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
    <Footer />
    </div>
    
  )
}
