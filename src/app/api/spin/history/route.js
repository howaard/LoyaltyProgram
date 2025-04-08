import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(req) {
  const { email } = await req.json()

  try {
    const client = await clientPromise
    const db = client.db()
    const rewards = await db
      .collection('spin_rewards')
      .find({ userEmail: email })
      .sort({ date: -1 }) // most recent first
      .limit(10)
      .toArray()

    return NextResponse.json({ rewards })
  } catch (err) {
    console.error('Fetch reward history error:', err)
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 })
  }
}
