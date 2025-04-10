import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

const tierSpins = {
  Bronze: 1,
  Silver: 2,
  Gold: 3,
  Platinum: 4,
  Diamond: 5
}

const getTierFromXP = (xp) => {
  if (xp >= 10000) return 'Diamond'
  if (xp >= 6000) return 'Platinum'
  if (xp >= 3000) return 'Gold'
  if (xp >= 1000) return 'Silver'
  return 'Bronze'
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

    // ✅ Reset spins if it's a new day
    if (spinData.lastSpinDate !== today) {
      await users.updateOne(
        { email },
        {
          $set: {
            'spinData.lastSpinDate': today,
            'spinData.spinsUsedToday': 0
          }
        }
      )
      spinData.spinsUsedToday = 0
    }

    const spinsUsedToday = spinData.spinsUsedToday
    if (spinsUsedToday >= maxSpins) {
      return NextResponse.json({ error: 'No spins left today' }, { status: 403 })
    }

    const xpMatch = reward.match(/^(\d+)\s*XP$/i)
    const xpEarned = xpMatch ? parseInt(xpMatch[1]) : 0

    await rewards.insertOne({
      userEmail: email,
      tier: user.tier,
      reward,
      date: new Date(),
      source: 'daily-wheel'
    })

    const updateQuery = {
      $set: {
        'spinData.lastSpinDate': today,
      },
      $inc: {
        'spinData.spinsUsedToday': 1,
      }
    }

    if (xpEarned > 0) {
      updateQuery.$inc['points.redeemable'] = xpEarned
      updateQuery.$inc['points.cumulative'] = xpEarned
    }

    await users.updateOne({ email }, updateQuery)

    const newTier = getTierFromXP(user.points?.cumulative + xpEarned)

    if (newTier !== user.tier) {
      await users.updateOne({ email }, { $set: { tier: newTier } })
    }

    return NextResponse.json({ message: 'Spin recorded', reward, xpEarned })
  } catch (err) {
    console.error('Spin error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

