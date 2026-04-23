'use client'

import Image from 'next/image'
import type { Product } from '@/src/types'
import { useComparisonStore } from '@/src/store/useComparisonStore'

const CONDITION_PILL: Record<string, string> = {
  Excellent: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  Good:      'bg-amber-100  text-amber-800  border-amber-300',
  Fair:      'bg-orange-100 text-orange-800 border-orange-300',
}

export function ProductCard({ product }: { product: Product }) {
  const { selectedProductIds, toggleProduct } = useComparisonStore()
  const isSelected  = selectedProductIds.includes(product.id)
  const endingSoon  = new Date(product.listingEnds).getTime() - Date.now() < 86_400_000
  const timeStr     = timeLeft(product.listingEnds)

  return (
    <article
      className={`group relative flex flex-col border-2 border-black bg-white transition-all duration-150
        hover:shadow-[6px_6px_0_0_#000] hover:-translate-y-px
        ${isSelected ? 'shadow-[4px_4px_0_0_#000] -translate-y-px' : ''}`}
    >
      {/* ── Image ─────────────────────────────────────────────────────── */}
      <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-black">
        <Image
          src={product.imageUrl}
          alt={`${product.brand} ${product.model}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* dim gradient so text pops */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

        {/* Category badge — top-left */}
        <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm text-white text-[10px] font-black px-2.5 py-1 uppercase tracking-widest">
          {product.category}
        </span>

        {/* Ending-soon badge — top-right */}
        {endingSoon && (
          <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 uppercase tracking-widest">
            Ending Soon
          </span>
        )}

        {/* Condition pill — bottom-right */}
        <span
          className={`absolute bottom-3 right-3 border text-[9px] font-black px-2 py-0.5 uppercase tracking-widest
            ${CONDITION_PILL[product.condition] ?? 'bg-zinc-100 text-zinc-700 border-zinc-300'}`}
        >
          {product.condition}
        </span>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-5">
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
          {product.brand}
        </p>
        <h2 className="text-[1.15rem] font-black leading-tight mt-0.5">{product.model}</h2>
        <p className="mt-1 text-[11px] text-zinc-500 truncate">{product.processor}</p>

        {/* Spec chips */}
        <div className="mt-4 grid grid-cols-3 gap-1.5">
          {[
            { label: 'RAM',     value: `${product.ram} GB`          },
            { label: 'SSD',     value: `${product.storage} GB`       },
            { label: 'Battery', value: `${product.batteryHealth}%`   },
          ].map(({ label, value }) => (
            <div key={label} className="border border-zinc-200 bg-zinc-50 py-2 text-center">
              <p className="text-[9px] uppercase tracking-wider text-zinc-400">{label}</p>
              <p className="text-[13px] font-black">{value}</p>
            </div>
          ))}
        </div>

        {/* Price + countdown */}
        <div className="mt-4 flex items-end justify-between border-t-2 border-black pt-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Starting bid
            </p>
            <p className="text-2xl font-black">${product.price.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Ends in
            </p>
            <p className={`text-sm font-bold tabular-nums ${endingSoon ? 'text-red-600' : ''}`}>
              {timeStr}
            </p>
          </div>
        </div>

        {/* Compare toggle — pushed to bottom */}
        <button
          onClick={() =>
            toggleProduct({
              id:       product.id,
              brand:    product.brand,
              model:    product.model,
              imageUrl: product.imageUrl,
            })
          }
          className={`mt-4 w-full border-2 border-black py-2.5 text-xs font-black uppercase tracking-widest
            transition-colors duration-100 cursor-pointer
            ${isSelected
              ? 'bg-black text-white hover:bg-zinc-800'
              : 'bg-white text-black hover:bg-black hover:text-white'}`}
        >
          {isSelected ? '✓ In Comparison' : '+ Compare'}
        </button>
      </div>
    </article>
  )
}

function timeLeft(listingEnds: Date | string): string {
  const diff = new Date(listingEnds).getTime() - Date.now()
  if (diff <= 0) return 'Ended'
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  return h >= 24 ? `${Math.floor(h / 24)}d ${h % 24}h` : `${h}h ${m}m`
}
