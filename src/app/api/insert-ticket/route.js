import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const data = await req.json()

    if (!data.email || !data.from || !data.to || !data.ticketClass || !data.tripType || !data.date || !data.xpEarned) {
      return NextResponse.json({ error: 'Missing fields in request body' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()
    
    await db.collection('tickets').insertOne(data)

    return NextResponse.json({ message: 'Ticket inserted successfully' })
  } catch (error) {
    console.error('Ticket insert failed:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
