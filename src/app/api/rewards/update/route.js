import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const { id, update } = await req.json()

  try {
    const client = await clientPromise
    const db = client.db()

    // 🔥 Prevent _id mutation
    delete update._id

    await db.collection('rewards').updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    )

    return NextResponse.json({ message: 'Reward updated successfully' })
  } catch (err) {
    console.error('Update Reward Error:', err)
    return NextResponse.json({ error: 'Failed to update reward' }, { status: 500 })
  }
}
