// POST
import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(req) {
  const { id } = await req.json()

  try {
    const client = await clientPromise
    const db = client.db()

    await db.collection('rewards').deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ message: 'Reward deleted successfully' })
  } catch (err) {
    console.error('Delete Reward Error:', err)
    return NextResponse.json({ error: 'Failed to delete reward' }, { status: 500 })
  }
}
