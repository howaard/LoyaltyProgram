import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 })
  }

  try {
    const client = await clientPromise
    const db = client.db()
    const tickets = await db.collection('tickets').find({ email }).sort({ date: -1 }).toArray()

    return NextResponse.json({ tickets })
  } catch (err) {
    console.error('Failed to fetch tickets:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
