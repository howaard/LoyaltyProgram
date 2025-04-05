import { NextResponse } from 'next/server'
import clientPromise from '../../../lib/mongodb'
import bcrypt from 'bcrypt'

export async function POST(req) {
    const body = await req.json()
    const { username, email, password } = body
  
    try {
      const client = await clientPromise
      const db = client.db()
      const users = db.collection('users')
  
      // 🔍 Check if email or username already exists
      const existingUser = await users.findOne({
        $or: [{ email }, { username }],
      })
  
      if (existingUser) {
        const errorField = existingUser.email === email ? 'Email' : 'Username'
        return NextResponse.json({ error: `${errorField} already taken` }, { status: 409 })
      }
  
      const hashed = await bcrypt.hash(password, 10)
  
      await users.insertOne({
        username,
        email,
        password: hashed,
        tier: 'Bronze',
        points: {
          redeemable: 0,
          cumulative: 0,
        },
        createdAt: new Date(),
        lastLogin: null,
      })
  
      return NextResponse.json({ message: 'User registered' }, { status: 201 })
    } catch (err) {
      console.error('Registration error:', err)
      return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
    }
  }
