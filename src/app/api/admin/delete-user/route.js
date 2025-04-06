import { NextResponse } from 'next/server'
import clientPromise from '../../../../lib/mongodb'

export async function DELETE(req) {
  const { email } = await req.json()

  try {
    const client = await clientPromise
    const db = client.db()
    const users = db.collection('users')

    const result = await users.deleteOne({ email })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'User deleted' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
