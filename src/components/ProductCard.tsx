'use client'

import Image from 'next/image'
import type { Product } from '@/src/types'
import { useComparisonStore } from '@/src/store/useComparisonStore'

export function ProductCard({ product }: { product: Product }) {
  const { selectedProductIds, toggleProduct } = useComparisonStore()
  const isSelected = selectedProductIds.includes(product.id)

  return (
    <article className="border-2 border-black bg-white hover:shadow-[4px_4px_0_0_#000] transition-shadow duration-150">
      {/* Image */}
      <div className="relative aspect-[4/3] border-b-2 border-black overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={`${product.brand} ${product.model}`}
          fill
          className="object-cover"
          unoptimized
        />
        <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-black px-2 py-1 uppercase tracking-widest">
          {product.category}
        </span>
        <span className="absolute top-3 right-3 bg-white border-2 border-black text-[10px] font-black px-2 py-1 uppercase tracking-widest">
          {product.condition}
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
          {product.brand}
        </p>
        <h2 className="text-xl font-black leading-tight mt-0.5">{product.model}</h2>
        <p className="text-xs text-zinc-500 mt-1 truncate">{product.processor}</p>

        {/* Spec chips */}
        <div className="mt-4 grid grid-cols-3 gap-1.5">
          {[
            { label: 'RAM', value: `${product.ram}GB` },
            { label: 'Storage', value: `${product.storage}GB` },
            { label: 'Battery', value: `${product.batteryHealth}%` },
          ].map(({ label, value }) => (
            <div key={label} className="border border-black py-2 text-center">
              <p className="text-[9px] text-zinc-400 uppercase tracking-wider">{label}</p>
              <p className="text-sm font-black">{value}</p>
            </div>
          ))}
        </div>

        {/* Price + time */}
        <div className="mt-4 flex items-end justify-between border-t-2 border-black pt-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Bid from
            </p>
            <p className="text-2xl font-black">${product.price.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Ends</p>
            <p className="text-sm font-bold">{timeLeft(product.listingEnds)}</p>
          </div>
        </div>

        {/* Compare toggle */}
        <button
          onClick={() =>
            toggleProduct({
              id: product.id,
              brand: product.brand,
              model: product.model,
              imageUrl: product.imageUrl,
            })
          }
          className={`mt-4 w-full border-2 border-black py-2.5 text-xs font-black uppercase tracking-widest transition-colors duration-100 cursor-pointer ${
            isSelected
              ? 'bg-black text-white hover:bg-zinc-800'
              : 'bg-white text-black hover:bg-black hover:text-white'
          }`}
        >
          {isSelected ? '✓ Selected for Compare' : '+ Add to Compare'}
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
