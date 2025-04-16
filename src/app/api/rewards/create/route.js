import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false
  try {
    const parsed = new URL(url)
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']
    return parsed.protocol.startsWith('http') && validExtensions.some(ext => parsed.pathname.endsWith(ext))
  } catch {
    return false
  }
}

export async function POST(req) {
  const reward = await req.json()

  const requiredFields = ['name', 'description', 'xpCost', 'category']
  for (const field of requiredFields) {
    if (!reward[field]) {
      return NextResponse.json({ error: `${field} is required` }, { status: 400 })
    }
  }

  if (typeof reward.xpCost !== 'number' || reward.xpCost < 0) {
    return NextResponse.json({ error: 'XP Cost must be a positive number' }, { status: 400 })
  }

  // Fallback to placeholder if invalid or missing
  if (!isValidImageUrl(reward.image)) {
    reward.image = '/placeholder.png' // make sure this exists in /public
  }

  try {
    const client = await clientPromise
    const db = client.db()
    const res = await db.collection('rewards').insertOne({
      ...reward,
      available: reward.available !== false, // default true
      quantity: reward.quantity ?? null,
      createdAt: new Date(),
    })

    return NextResponse.json({ message: 'Reward created', id: res.insertedId })
  } catch (err) {
    console.error('Create Reward Error:', err)
    return NextResponse.json({ error: 'Failed to create reward' }, { status: 500 })
  }
}
