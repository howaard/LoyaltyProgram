import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()
    const users = await db.collection('users').find({}, {
      projection: { username: 1, email: 1, tier: 1, points: 1, isAdmin: 1 }
    }).toArray()

    return NextResponse.json({ users })
  } catch (err) {
    console.error('Failed to fetch users:', err)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}
