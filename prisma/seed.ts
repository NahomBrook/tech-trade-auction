// Author: Nahom Brook
// Run after `prisma generate` and `prisma db push`:
//   npx prisma db seed
import 'dotenv/config'
import { neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '../app/generated/prisma'
import ws from 'ws'

neonConfig.webSocketConstructor = ws

// The seed uses the same PrismaNeon adapter as the app runtime so it connects
// to Neon over WebSocket (port 443) — no port 5432 needed.
const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }),
})

const now = Date.now()
const D   = 86_400_000   // one day in ms

async function main() {
  await prisma.product.deleteMany()

  await prisma.product.createMany({
    data: [
      // ── MacBooks ─────────────────────────────────────────────────────────
      {
        brand: 'Apple', model: 'MacBook Air M2', category: 'Laptop',
        condition: 'Excellent', processor: 'Apple M2 8-core CPU, 8-core GPU',
        ram: 16, storage: 512, batteryHealth: 94, price: 850,
        imageUrl: 'https://placehold.co/600x400/0a0a0a/ffffff?text=MacBook+Air+M2',
        listingEnds: new Date(now + 2 * D),
      },
      {
        brand: 'Apple', model: 'MacBook Pro 14" M3 Pro', category: 'Laptop',
        condition: 'Excellent', processor: 'Apple M3 Pro 11-core CPU, 14-core GPU',
        ram: 32, storage: 1024, batteryHealth: 89, price: 1600,
        imageUrl: 'https://placehold.co/600x400/111111/ffffff?text=MacBook+Pro+M3',
        listingEnds: new Date(now + 1 * D),
      },
      {
        brand: 'Apple', model: 'MacBook Air M1', category: 'Laptop',
        condition: 'Good', processor: 'Apple M1 8-core CPU, 7-core GPU',
        ram: 8, storage: 256, batteryHealth: 82, price: 550,
        imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=MacBook+Air+M1',
        listingEnds: new Date(now + 4 * D),
      },
      // ── ThinkPads ─────────────────────────────────────────────────────────
      {
        brand: 'Lenovo', model: 'ThinkPad X1 Carbon Gen 11', category: 'Laptop',
        condition: 'Excellent', processor: 'Intel Core i7-1365U vPro',
        ram: 32, storage: 512, batteryHealth: 91, price: 920,
        imageUrl: 'https://placehold.co/600x400/0d0d0d/ffffff?text=ThinkPad+X1+Carbon',
        listingEnds: new Date(now + 3 * D),
      },
      {
        brand: 'Lenovo', model: 'ThinkPad T14s Gen 4', category: 'Laptop',
        condition: 'Good', processor: 'AMD Ryzen 7 PRO 7840U',
        ram: 16, storage: 512, batteryHealth: 78, price: 620,
        imageUrl: 'https://placehold.co/600x400/161616/ffffff?text=ThinkPad+T14s',
        listingEnds: new Date(now + 5 * D),
      },
      // ── Phone ─────────────────────────────────────────────────────────────
      {
        brand: 'Apple', model: 'iPhone 15 Pro', category: 'Phone',
        condition: 'Excellent', processor: 'Apple A17 Pro 6-core CPU',
        ram: 8, storage: 256, batteryHealth: 96, price: 720,
        imageUrl: 'https://placehold.co/600x400/222222/ffffff?text=iPhone+15+Pro',
        listingEnds: new Date(now + 6 * D),
      },
    ],
  })

  console.log('✓ Seeded 6 products')
}

main().catch(console.error).finally(() => prisma.$disconnect())
