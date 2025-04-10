import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const data = await req.json()
    const client = await clientPromise
    const db = client.db()
    await db.collection('rewards').insertOne({
      ...data,
      available: true,
      createdAt: new Date()
    })

    return NextResponse.json({ message: 'Reward created' })
  } catch (err) {
    console.error('Create reward failed:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
