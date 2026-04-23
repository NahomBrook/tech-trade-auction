// Author: Nahom Brook
// Shared seed data — used by both prisma/seed.ts and app/api/seed/route.ts

const D = 86_400_000 // ms per day

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=800&h=600&fit=crop&q=80&auto=format`

export function buildProducts() {
  const now = Date.now()

  return [
    // ── MacBooks ────────────────────────────────────────────────────────
    {
      brand: 'Apple', model: 'MacBook Air M2 (2022)', category: 'Laptop',
      condition: 'Excellent', processor: 'Apple M2 — 8-core CPU, 8-core GPU',
      ram: 16, storage: 512, batteryHealth: 94, price: 850,
      imageUrl: img('1517336714731-489689fd1ca8'),
      listingEnds: new Date(now + 14 * D),
    },
    {
      brand: 'Apple', model: 'MacBook Pro 14" M3 Pro', category: 'Laptop',
      condition: 'Excellent', processor: 'Apple M3 Pro — 11-core CPU, 14-core GPU',
      ram: 32, storage: 1024, batteryHealth: 89, price: 1600,
      imageUrl: img('1611186871348-b1ce696e52c9'),
      listingEnds: new Date(now + 21 * D),
    },
    {
      brand: 'Apple', model: 'MacBook Air M1 (2020)', category: 'Laptop',
      condition: 'Good', processor: 'Apple M1 — 8-core CPU, 7-core GPU',
      ram: 8, storage: 256, batteryHealth: 82, price: 550,
      imageUrl: img('1484788984921-03950022c9ef'),
      listingEnds: new Date(now + 10 * D),
    },
    // ── ThinkPads ───────────────────────────────────────────────────────
    {
      brand: 'Lenovo', model: 'ThinkPad X1 Carbon Gen 11', category: 'Laptop',
      condition: 'Excellent', processor: 'Intel Core i7-1365U vPro',
      ram: 32, storage: 512, batteryHealth: 91, price: 920,
      imageUrl: img('1593642632559-0c6d3fc62b89'),
      listingEnds: new Date(now + 18 * D),
    },
    {
      brand: 'Lenovo', model: 'ThinkPad T14s Gen 4', category: 'Laptop',
      condition: 'Good', processor: 'AMD Ryzen 7 PRO 7840U',
      ram: 16, storage: 512, batteryHealth: 78, price: 620,
      imageUrl: img('1525547719571-a2d4ac8945e2'),
      listingEnds: new Date(now + 25 * D),
    },
    // ── Dell / HP ───────────────────────────────────────────────────────
    {
      brand: 'Dell', model: 'XPS 15 (2023) 9530', category: 'Laptop',
      condition: 'Excellent', processor: 'Intel Core i7-13700H',
      ram: 32, storage: 1024, batteryHealth: 96, price: 1100,
      imageUrl: img('1496181133206-80ce9b88a853'),
      listingEnds: new Date(now + 30 * D),
    },
    {
      brand: 'HP', model: 'Spectre x360 14 (2023)', category: 'Laptop',
      condition: 'Good', processor: 'Intel Core i7-1355U',
      ram: 16, storage: 512, batteryHealth: 85, price: 780,
      imageUrl: img('1541807084-db346b4fd4c2'),
      listingEnds: new Date(now + 12 * D),
    },
    // ── Phones ──────────────────────────────────────────────────────────
    {
      brand: 'Apple', model: 'iPhone 15 Pro', category: 'Phone',
      condition: 'Excellent', processor: 'Apple A17 Pro — 6-core CPU',
      ram: 8, storage: 256, batteryHealth: 96, price: 720,
      imageUrl: img('1592750475338-74b7b21085ab'),
      listingEnds: new Date(now + 35 * D),
    },
    {
      brand: 'Apple', model: 'iPhone 14 Pro', category: 'Phone',
      condition: 'Good', processor: 'Apple A16 Bionic — 6-core CPU',
      ram: 6, storage: 128, batteryHealth: 88, price: 540,
      imageUrl: img('1556656793-08538906a9f8'),
      listingEnds: new Date(now + 20 * D),
    },
    {
      brand: 'Samsung', model: 'Galaxy S24 Ultra', category: 'Phone',
      condition: 'Excellent', processor: 'Snapdragon 8 Gen 3 — Octa-core',
      ram: 12, storage: 256, batteryHealth: 98, price: 850,
      imageUrl: img('1610945415295-d9bbf067e59c'),
      listingEnds: new Date(now + 28 * D),
    },
    {
      brand: 'Google', model: 'Pixel 8 Pro', category: 'Phone',
      condition: 'Excellent', processor: 'Google Tensor G3 — Octa-core',
      ram: 12, storage: 256, batteryHealth: 99, price: 580,
      imageUrl: img('1598300042247-d088f8ab3a91'),
      listingEnds: new Date(now + 22 * D),
    },
    {
      brand: 'OnePlus', model: 'OnePlus 12', category: 'Phone',
      condition: 'Good', processor: 'Snapdragon 8 Gen 3 — Octa-core',
      ram: 12, storage: 256, batteryHealth: 92, price: 420,
      imageUrl: img('1574944985070-8f3ebc6b79d2'),
      listingEnds: new Date(now + 16 * D),
    },
  ]
}
