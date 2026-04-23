// Author: Nahom Brook
// Creates the database tables via the Neon WebSocket adapter (port 443).
// Run this once before seeding: npx tsx prisma/init-schema.ts
import 'dotenv/config'
import { neonConfig, neon } from '@neondatabase/serverless'
import ws from 'ws'

neonConfig.webSocketConstructor = ws

const sql = neon(process.env.DATABASE_URL!)

async function main() {
  // Product table
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
  console.log('✓ Product table ready')

  // Bid table
  await sql`
    CREATE TABLE IF NOT EXISTS "Bid" (
      "id"        TEXT             NOT NULL,
      "amount"    DOUBLE PRECISION NOT NULL,
      "productId" TEXT             NOT NULL,
      "createdAt" TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
      CONSTRAINT "Bid_pkey"          PRIMARY KEY ("id"),
      CONSTRAINT "Bid_productId_fkey" FOREIGN KEY ("productId")
        REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE
    )
  `
  console.log('✓ Bid table ready')
  console.log('Schema initialised — run `npx tsx prisma/seed.ts` next.')
}

main().catch(console.error)
