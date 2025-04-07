import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

const tierSpins = {
  Bronze: 1,
  Silver: 2,
  Gold: 3,
  Platinum: 4,
  Diamond: 5
}

export async function POST(req) {
  const { email, reward } = await req.json()
  const today = new Date().toISOString().slice(0, 10)

  try {
    const client = await clientPromise
    const db = client.db()
    const users = db.collection('users')
    const rewards = db.collection('spin_rewards')

    const user = await users.findOne({ email })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const maxSpins = tierSpins[user.tier] || 1
    const spinData = user.spinData || { lastSpinDate: null, spinsUsedToday: 0 }

    let spinsUsedToday = spinData.spinsUsedToday
    if (spinData.lastSpinDate !== today) {
      spinsUsedToday = 0 // reset if it's a new day
    }

    if (spinsUsedToday >= maxSpins) {
      return NextResponse.json({ error: 'No spins left today' }, { status: 403 })
    }

    // ✅ Record spin in separate collection
    await rewards.insertOne({
      userEmail: email,
      tier: user.tier,
      reward,
      date: new Date(),
      source: 'daily-wheel'
    })

    // ✅ Update spin usage only
    await users.updateOne(
      { email },
      {
        $set: { 'spinData.lastSpinDate': today },
        $inc: { 'spinData.spinsUsedToday': 1 }
      }
    )

    return NextResponse.json({ message: 'Spin recorded', reward })
  } catch (err) {
    console.error('Spin error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
