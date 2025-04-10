import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'

export async function POST(req) {
  const { email, rewardId } = await req.json()

  if (!email || !rewardId) {
    return NextResponse.json({ error: 'Missing email or rewardId' }, { status: 400 })
  }

  try {
    const client = await clientPromise
    const db = client.db()

    const user = await db.collection('users').findOne({ email })
    const reward = await db.collection('rewards').findOne({ _id: new ObjectId(rewardId) })

    if (!user || !reward) {
      return NextResponse.json({ error: 'User or reward not found' }, { status: 404 })
    }

    if (user.points.redeemable < reward.xpCost) {
      return NextResponse.json({ error: 'Not enough XP' }, { status: 403 })
    }

    if (!reward.available) {
      return NextResponse.json({ error: 'Reward out of stock' }, { status: 410 })
    }

    // Deduct XP and reduce reward quantity
    await db.collection('users').updateOne(
      { email },
      { $inc: { 'points.redeemable': -reward.xpCost } }
    )

    // Log redemption
    await db.collection('redemptions').insertOne({
      email,
      rewardId,
      rewardName: reward.name,
      xpSpent: reward.xpCost,
      date: new Date()
    })

    return NextResponse.json({ message: 'Reward redeemed successfully' })
  } catch (err) {
    console.error('Redemption error:', err)
    return NextResponse.json({ error: 'Redemption failed' }, { status: 500 })
  }
}
