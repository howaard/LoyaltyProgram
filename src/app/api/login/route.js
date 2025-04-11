import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcrypt'

export async function POST(req) {
  const { email, password } = await req.json()

  try {
    const client = await clientPromise
    const db = client.db()
    const users = db.collection('users')

    const user = await users.findOne({ email })

    if (!user) {
      return NextResponse.json({ error: 'Email not found' }, { status: 401 })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    // Optional: update lastLogin
    await users.updateOne({ email }, { $set: { lastLogin: new Date() } })

    // You could set a cookie here or return a token (JWT)
    return NextResponse.json({ message: 'Login successful', user: { username: user.username, email: user.email, tier: user.tier, isAdmin: user.isAdmin } })
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
