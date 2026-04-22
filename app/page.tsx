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
        ...(category ? { category } : {}),
        ...(condition ? { condition } : {}),
        ...(ram ? { ram: { gte: parseInt(ram) } } : {}),
        ...(battery ? { batteryHealth: { gte: parseInt(battery) } } : {}),
      },
      include: { bids: { orderBy: { createdAt: 'desc' }, take: 1 } },
      orderBy: { listingEnds: 'asc' },
    })
    .catch((): Product[] => [])

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b-2 border-black px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-widest">
            Tech<span className="text-zinc-400">Trade</span>
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-0.5">
            C2C Auction Marketplace
          </p>
        </div>
        <span className="border-2 border-black px-4 py-2 text-xs font-black uppercase tracking-widest">
          {products.length} listing{products.length !== 1 ? 's' : ''}
        </span>
      </header>

      {/* Layout */}
      <div className="flex gap-8 max-w-7xl mx-auto px-8 py-8">
        <Suspense>
          <FilterSidebar />
        </Suspense>

        <section className="flex-1 min-w-0">
          {products.length === 0 ? (
            <div className="border-2 border-black p-16 text-center">
              <p className="text-xl font-black uppercase tracking-widest">No listings found.</p>
              <p className="text-sm text-zinc-500 mt-3">
                Adjust your filters, or seed the DB:{' '}
                <code className="font-mono bg-zinc-100 px-1.5 py-0.5">npx prisma db seed</code>
              </p>
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

      {/* Space for the floating tray */}
      <div className="h-24" />
    </div>
  )
}
