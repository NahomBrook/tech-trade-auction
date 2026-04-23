// Author: Nahom Brook
import { Suspense } from 'react'
import { db } from '@/src/lib/db'
import { ProductCard } from '@/src/components/ProductCard'
import { FilterSidebar } from '@/src/components/FilterSidebar'
import { SearchBar } from '@/src/components/SearchBar'
import type { Product } from '@/src/types'

interface PageProps {
  searchParams: Promise<{
    category?: string
    condition?: string
    ram?:      string
    battery?:  string
    q?:        string
  }>
}

export default async function HomePage({ searchParams }: PageProps) {
  const { category, condition, ram, battery, q } = await searchParams

  const products: Product[] = await db.product
    .findMany({
      where: {
        ...(q ? {
          OR: [
            { model: { contains: q, mode: 'insensitive' } },
            { brand: { contains: q, mode: 'insensitive' } },
          ],
        } : {}),
        ...(category  ? { category }                           : {}),
        ...(condition ? { condition }                          : {}),
        ...(ram       ? { ram:           { gte: +ram    } }   : {}),
        ...(battery   ? { batteryHealth: { gte: +battery } }  : {}),
      },
      include: { bids: { orderBy: { amount: 'desc' } } },
      orderBy: { listingEnds: 'asc' },
    })
    .catch((): Product[] => [])

  const endingSoonCount = products.filter(
    (p) => new Date(p.listingEnds).getTime() - Date.now() < 86_400_000,
  ).length

  const activeFilters = [category, condition, ram, battery, q].filter(Boolean).length

  return (
    <div className="min-h-screen flex flex-col">

      {/* ── Top nav bar ─────────────────────────────────────────────── */}
      <header className="bg-[#131921] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center gap-4">

          {/* Wordmark */}
          <a href="/" className="shrink-0 flex items-end gap-0.5 mr-2">
            <span className="text-white text-xl font-black tracking-tight leading-none">Tech</span>
            <span className="text-[#FF9900] text-xl font-black tracking-tight leading-none">Trade</span>
          </a>

          {/* Search bar */}
          <Suspense fallback={<div className="flex-1 max-w-2xl h-9 bg-white/10 rounded-sm animate-pulse" />}>
            <SearchBar />
          </Suspense>

          {/* Ending-soon badge */}
          {endingSoonCount > 0 && (
            <div className="hidden md:flex items-center gap-1.5 shrink-0 text-[11px] font-bold text-red-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              {endingSoonCount} ending today
            </div>
          )}

          {/* Listing count */}
          <div className="shrink-0 hidden sm:block text-[11px] text-white/60 whitespace-nowrap">
            {products.length} listing{products.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Category quick-nav */}
        <div className="bg-[#232F3E] border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center gap-1 overflow-x-auto py-1.5 no-scrollbar">
            {[
              { label: 'All Electronics', value: '' },
              { label: 'Laptops',         value: 'Laptop' },
              { label: 'Phones',          value: 'Phone'  },
            ].map(({ label, value }) => (
              <a
                key={label}
                href={value ? `/?category=${value}` : '/'}
                className={`shrink-0 text-[13px] px-3 py-1 rounded-sm transition-colors whitespace-nowrap ${
                  (value === '' && !category) || category === value
                    ? 'text-[#FF9900] font-semibold border border-[#FF9900]/40'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────────── */}
      <div className="flex-1 bg-[#EAEDED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex gap-6">

          <Suspense>
            <FilterSidebar />
          </Suspense>

          <main className="flex-1 min-w-0">
            {/* Results header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                {q && (
                  <p className="text-[#565959] text-sm">
                    Results for <span className="font-semibold text-[#0F1111]">&ldquo;{q}&rdquo;</span>
                  </p>
                )}
                <p className="text-[13px] text-[#565959]">
                  {products.length} result{products.length !== 1 ? 's' : ''}
                  {activeFilters > 0 && ` · ${activeFilters} filter${activeFilters !== 1 ? 's' : ''} active`}
                </p>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="bg-white border border-[#D5D9D9] rounded-sm p-12 text-center">
                <p className="text-lg font-semibold text-[#0F1111]">No results found</p>
                <p className="text-sm text-[#565959] mt-2">
                  Try different keywords or clear your filters.
                </p>
                <a
                  href="/"
                  className="inline-block mt-4 text-[#007185] text-sm hover:text-[#C7511F] hover:underline transition-colors"
                >
                  Browse all listings →
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#232F3E] text-white/50 text-[11px] text-center py-4 mt-auto">
        © {new Date().getFullYear()} TechTrade — C2C Auction Marketplace
      </footer>

      {/* Space for comparison tray */}
      <div className="h-20" />
    </div>
  )
}
