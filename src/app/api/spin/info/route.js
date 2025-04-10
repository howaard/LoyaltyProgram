import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server'

const tierSpins = {
  Bronze: 1,
  Silver: 2,
  Gold: 3,
  Platinum: 4,
  Diamond: 5
}

export async function POST(req) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 })
  }

  try {
    const client = await clientPromise
    const db = client.db()
    const user = await db.collection('users').findOne({ email })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const today = new Date().toISOString().split('T')[0] // "YYYY-MM-DD"
    const spinData = user.spinData || { lastSpinDate: null, spinsUsedToday: 0 }

    // reset spins if lastSpinDate != today
    let spinsUsedToday = spinData.spinsUsedToday
    if (spinData.lastSpinDate !== today) {
      spinsUsedToday = 0

      await db.collection('users').updateOne(
        { email },
        {
          $set: {
            'spinData.spinsUsedToday': 0,
            'spinData.lastSpinDate': today
          }
        }
      )
    }

    const maxSpins = tierSpins[user.tier || 'Bronze']
    const spinsLeft = Math.max(0, maxSpins - spinsUsedToday)

    return NextResponse.json({ spinsLeft })
  } catch (err) {
    console.error('Spin info error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
