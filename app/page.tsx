// Author: Nahom Brook
import { Suspense } from 'react'
import { db } from '@/src/lib/db'
import { ProductCard } from '@/src/components/ProductCard'
import { FilterSidebar } from '@/src/components/FilterSidebar'
import type { Product } from '@/src/types'

interface PageProps {
  searchParams: Promise<{
    category?: string
    condition?: string
    ram?: string
    battery?: string
  }>
}

export default async function HomePage({ searchParams }: PageProps) {
  const { category, condition, ram, battery } = await searchParams

  const products: Product[] = await db.product
    .findMany({
      where: {
        ...(category ? { category }                           : {}),
        ...(condition ? { condition }                         : {}),
        ...(ram       ? { ram:           { gte: +ram    } }  : {}),
        ...(battery   ? { batteryHealth: { gte: +battery } } : {}),
      },
      include: { bids: { orderBy: { createdAt: 'desc' }, take: 1 } },
      orderBy: { listingEnds: 'asc' },
    })
    .catch((): Product[] => [])

  const endingSoonCount = products.filter(
    (p) => new Date(p.listingEnds).getTime() - Date.now() < 86_400_000,
  ).length

  return (
    <div className="min-h-screen bg-white">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-white border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between gap-6">
          {/* Wordmark */}
          <div>
            <h1 className="text-2xl font-black uppercase tracking-widest leading-none">
              Tech<span className="text-zinc-300">Trade</span>
            </h1>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 mt-0.5">
              C2C Auction Marketplace
            </p>
          </div>

          {/* Live indicator + stats */}
          <div className="flex items-center gap-5">
            {endingSoonCount > 0 && (
              <div className="hidden sm:flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-red-600">
                  {endingSoonCount} ending today
                </span>
              </div>
            )}
            <div className="border-2 border-black px-4 py-2 text-xs font-black uppercase tracking-widest">
              {products.length} listing{products.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className="flex gap-8 max-w-7xl mx-auto px-8 py-8">
        <Suspense>
          <FilterSidebar />
        </Suspense>

        <section className="flex-1 min-w-0">
          {products.length === 0 ? (
            <div className="border-2 border-dashed border-zinc-300 p-16 text-center">
              <p className="text-xl font-black uppercase tracking-widest text-zinc-400">
                No listings found.
              </p>
              <p className="text-sm text-zinc-400 mt-3">
                Try different filters, or seed the DB:
              </p>
              <code className="inline-block mt-2 font-mono text-xs bg-zinc-100 border border-zinc-200 px-3 py-1.5">
                npx prisma db seed
              </code>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Space so the floating tray doesn't cover the last row */}
      <div className="h-28" />
    </div>
  )
}
