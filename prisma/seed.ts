// Author: Nahom Brook
// Run after `prisma generate` and `prisma db push`:
//   npx prisma db seed
import 'dotenv/config'
import { neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '../app/generated/prisma/client'
import ws from 'ws'

neonConfig.webSocketConstructor = ws

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }),
})

const now = Date.now()
const D   = 86_400_000

// Unsplash images — free to use, no auth required
const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=800&h=600&fit=crop&q=80&auto=format`

async function main() {
  await prisma.product.deleteMany()

  await prisma.product.createMany({
    data: [
      // ── MacBooks ──────────────────────────────────────────────────────────
      {
        brand: 'Apple', model: 'MacBook Air M2', category: 'Laptop',
        condition: 'Excellent', processor: 'Apple M2 8-core CPU, 8-core GPU',
        ram: 16, storage: 512, batteryHealth: 94, price: 850,
        imageUrl: img('1517336714731-489689fd1ca8'),
        listingEnds: new Date(now + 2 * D),
      },
      {
        brand: 'Apple', model: 'MacBook Pro 14" M3 Pro', category: 'Laptop',
        condition: 'Excellent', processor: 'Apple M3 Pro 11-core CPU, 14-core GPU',
        ram: 32, storage: 1024, batteryHealth: 89, price: 1600,
        imageUrl: img('1611186871348-b1ce696e52c9'),
        listingEnds: new Date(now + 18 * 3_600_000), // 18 h — ending soon
      },
      {
        brand: 'Apple', model: 'MacBook Air M1', category: 'Laptop',
        condition: 'Good', processor: 'Apple M1 8-core CPU, 7-core GPU',
        ram: 8, storage: 256, batteryHealth: 82, price: 550,
        imageUrl: img('1484788984921-03950022c9ef'),
        listingEnds: new Date(now + 4 * D),
      },
      // ── ThinkPads ─────────────────────────────────────────────────────────
      {
        brand: 'Lenovo', model: 'ThinkPad X1 Carbon Gen 11', category: 'Laptop',
        condition: 'Excellent', processor: 'Intel Core i7-1365U vPro',
        ram: 32, storage: 512, batteryHealth: 91, price: 920,
        imageUrl: img('1593642632559-0c6d3fc62b89'),
        listingEnds: new Date(now + 3 * D),
      },
      {
        brand: 'Lenovo', model: 'ThinkPad T14s Gen 4', category: 'Laptop',
        condition: 'Good', processor: 'AMD Ryzen 7 PRO 7840U',
        ram: 16, storage: 512, batteryHealth: 78, price: 620,
        imageUrl: img('1525547719571-a2d4ac8945e2'),
        listingEnds: new Date(now + 5 * D),
      },
      // ── Phones ────────────────────────────────────────────────────────────
      {
        brand: 'Apple', model: 'iPhone 15 Pro', category: 'Phone',
        condition: 'Excellent', processor: 'Apple A17 Pro 6-core CPU',
        ram: 8, storage: 256, batteryHealth: 96, price: 720,
        imageUrl: img('1592750475338-74b7b21085ab'),
        listingEnds: new Date(now + 6 * D),
      },
    ],
  })

  console.log('✓ Seeded 6 products with Unsplash images')
}

main().catch(console.error).finally(() => prisma.$disconnect())
