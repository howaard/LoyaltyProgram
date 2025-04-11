import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const { email, firstName, lastName, dob } = await req.json()

  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 })
  }

  try {
    const client = await clientPromise
    const db = client.db()

    await db.collection('users').updateOne(
      { email },
      {
        $set: {
          firstName,
          lastName,
          dob
        }
      }
    )

    return NextResponse.json({ message: 'Profile updated' })
  } catch (err) {
    console.error('User update error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
