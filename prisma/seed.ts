// Author: Nahom Brook
// Run after `prisma generate` and `prisma db push`:
//   npx prisma db seed
import 'dotenv/config'
import { neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '../app/generated/prisma/client'
import ws from 'ws'
import { buildProducts } from '../src/lib/seedData'

neonConfig.webSocketConstructor = ws

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }),
})

async function main() {
  await prisma.product.deleteMany()
  const products = buildProducts()
  await prisma.product.createMany({ data: products })
  console.log(`✓ Seeded ${products.length} products`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
