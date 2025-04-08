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
      tier: user.tier,
      points: user.points || { cumulative: 0, redeemable: 0 },
    })
  } catch (err) {
    console.error('XP fetch error:', err)
    return NextResponse.json({ error: 'Failed to fetch XP' }, { status: 500 })
  }
}
