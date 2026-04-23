// Author: Nahom Brook
// Sets up the schema + seeds 12 products in one call.
// GET /api/seed?secret=YOUR_SECRET
// Requires SEED_SECRET env var to be set in Vercel.
import { NextResponse } from 'next/server'
import { neonConfig, neon } from '@neondatabase/serverless'
import { db } from '@/src/lib/db'
import { buildProducts } from '@/src/lib/seedData'
import ws from 'ws'

neonConfig.webSocketConstructor = ws

export async function GET(request: Request) {
  const secret = new URL(request.url).searchParams.get('secret')

  if (!process.env.SEED_SECRET || secret !== process.env.SEED_SECRET) {
    return NextResponse.json(
      { error: 'Unauthorized — set SEED_SECRET in env and pass ?secret=' },
      { status: 401 },
    )
  }

  try {
    // 1. Create tables if they don't exist yet (safe to run multiple times)
    const sql = neon(process.env.DATABASE_URL!)
    await sql`
      CREATE TABLE IF NOT EXISTS "Product" (
        "id"            TEXT             NOT NULL,
        "brand"         TEXT             NOT NULL,
        "model"         TEXT             NOT NULL,
        "category"      TEXT             NOT NULL,
        "condition"     TEXT             NOT NULL,
        "processor"     TEXT             NOT NULL,
        "ram"           INTEGER          NOT NULL,
        "storage"       INTEGER          NOT NULL,
        "batteryHealth" INTEGER          NOT NULL,
        "price"         DOUBLE PRECISION NOT NULL,
        "imageUrl"      TEXT             NOT NULL,
        "listingEnds"   TIMESTAMPTZ      NOT NULL,
        "createdAt"     TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
        "updatedAt"     TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
        CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
      )
    `
    await sql`
      CREATE TABLE IF NOT EXISTS "Bid" (
        "id"        TEXT             NOT NULL,
        "amount"    DOUBLE PRECISION NOT NULL,
        "productId" TEXT             NOT NULL,
        "createdAt" TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
        CONSTRAINT "Bid_pkey"           PRIMARY KEY ("id"),
        CONSTRAINT "Bid_productId_fkey" FOREIGN KEY ("productId")
          REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE
      )
    `

    // 2. Clear and reseed
    await db.product.deleteMany()
    const products = buildProducts()
    await db.product.createMany({ data: products })

    return NextResponse.json({ ok: true, seeded: products.length })
  } catch (err) {
    console.error('Seed error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
