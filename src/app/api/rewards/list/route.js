import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()
    const rewards = await db.collection('rewards').find({ available: true }).sort({ xpCost: 1 }).toArray()
    return NextResponse.json({ rewards })
  } catch (err) {
    console.error('Fetch rewards failed:', err)
    return NextResponse.json({ error: 'Failed to fetch rewards' }, { status: 500 })
  }
}
