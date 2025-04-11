import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const { email } = await req.json()

  try {
    const client = await clientPromise
    const db = client.db()
    const user = await db.collection('users').findOne({ email })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      dob: user.dob || ''
    })
  } catch (err) {
    console.error('Profile fetch error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
