import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const client = await clientPromise
    const db = client.db()
    const spins = db.collection('spin_rewards')

    // 🧮 Total Spins
    const totalSpins = await spins.countDocuments()

    // 🎯 XP-Only Spins
    const xpSpins = await spins.find({ reward: { $regex: /XP$/i } }).toArray()
    const totalXPEarned = xpSpins.reduce((sum, spin) => {
      const match = spin.reward.match(/^(\d+)\s*XP$/i)
      return sum + (match ? parseInt(match[1]) : 0)
    }, 0)

    // 🔝 Most Common Rewards
    const rewardAgg = await spins.aggregate([
      { $group: { _id: '$reward', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]).toArray()

    // 🕓 Most Recent Spins
    const recentSpins = await spins
      .find({})
      .sort({ date: -1 })
      .limit(15)
      .toArray()

    return NextResponse.json({
      totalSpins,
      totalXPEarned,
      topRewards: rewardAgg.map(r => ({ reward: r._id, count: r.count })),
      recentSpins
    })
  } catch (err) {
    console.error('Spin admin fetch error:', err)
    return NextResponse.json({ error: 'Failed to fetch spin stats' }, { status: 500 })
  }
}
