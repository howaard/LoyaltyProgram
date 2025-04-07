import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(req) {
  const { email } = await req.json()

  const client = await clientPromise
  const db = client.db()
  const user = await db.collection('users').findOne({ email })

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const tierSpins = {
    Bronze: 1,
    Silver: 2,
    Gold: 3,
    Platinum: 4,
    Diamond: 5
  }

  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  const spinData = user.spinData || { lastSpinDate: null, spinsUsedToday: 0 }

  let spinsLeft = tierSpins[user.tier]

  if (spinData.lastSpinDate === today) {
    spinsLeft = tierSpins[user.tier] - spinData.spinsUsedToday
  }

  return NextResponse.json({
    tier: user.tier,
    spinsLeft: Math.max(spinsLeft, 0)
  })
}
