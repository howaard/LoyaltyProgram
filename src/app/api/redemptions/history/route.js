import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 })
  }

  try {
    const client = await clientPromise
    const db = client.db()

    const redemptions = await db
      .collection('redemptions')
      .find({ email })
      .sort({ date: -1 })
      .toArray()

    return NextResponse.json({ redemptions })
  } catch (error) {
    console.error('Failed to fetch redemption history:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
