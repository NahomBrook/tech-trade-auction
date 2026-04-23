// Author: Nahom Brook
// Seeds the database from a deployed environment.
// Requires SEED_SECRET env var. Call with GET /api/seed?secret=YOUR_SECRET
import { NextResponse } from 'next/server'
import { db } from '@/src/lib/db'
import { buildProducts } from '@/src/lib/seedData'

export async function GET(request: Request) {
  const secret = new URL(request.url).searchParams.get('secret')

  if (!process.env.SEED_SECRET || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized — set SEED_SECRET env var and pass ?secret=' }, { status: 401 })
  }

  try {
    await db.product.deleteMany()
    const products = buildProducts()
    await db.product.createMany({ data: products })
    return NextResponse.json({ ok: true, seeded: products.length })
  } catch (err) {
    console.error('Seed error:', err)
    return NextResponse.json({ error: 'Seed failed — check server logs.' }, { status: 500 })
  }
}
