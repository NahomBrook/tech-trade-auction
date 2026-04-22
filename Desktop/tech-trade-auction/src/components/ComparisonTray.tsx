'use client'

import Link from 'next/link'
import Image from 'next/image'
import { X } from 'lucide-react'
import { useComparisonStore } from '@/src/store/useComparisonStore'

export function ComparisonTray() {
  const { selectedItems, selectedProductIds, toggleProduct, clearStore } = useComparisonStore()

  if (selectedItems.length === 0) return null

  const compareHref = `/compare?ids=${selectedProductIds.join(',')}`

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-white border-t-2 border-black shadow-[0_-4px_0_0_#000]">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4">
        {/* Label */}
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 shrink-0">
          Compare&nbsp;({selectedItems.length}/3)
        </p>

        {/* Items */}
        <div className="flex-1 flex items-center gap-3 overflow-x-auto min-w-0">
          {selectedItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 border-2 border-black px-2 py-1.5 shrink-0"
            >
              <div className="relative w-9 h-9 border border-black overflow-hidden shrink-0">
                <Image
                  src={item.imageUrl}
                  alt={item.model}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <span className="text-sm font-bold whitespace-nowrap">
                {item.brand} {item.model}
              </span>
              <button
                onClick={() => toggleProduct(item)}
                className="ml-1 hover:opacity-40 transition-opacity cursor-pointer"
                aria-label={`Remove ${item.model}`}
              >
                <X size={13} strokeWidth={2.5} />
              </button>
            </div>
          ))}

          {/* Empty slots */}
          {Array.from({ length: 3 - selectedItems.length }).map((_, i) => (
            <div
              key={`slot-${i}`}
              className="w-36 h-14 border-2 border-dashed border-zinc-300 shrink-0"
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={clearStore}
            className="text-xs font-black uppercase tracking-widest underline hover:opacity-50 transition-opacity cursor-pointer"
          >
            Clear
          </button>

          {selectedItems.length >= 2 ? (
            <Link
              href={compareHref}
              className="bg-black text-white px-5 py-3 text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors whitespace-nowrap"
            >
              Compare Now →
            </Link>
          ) : (
            <span className="border-2 border-zinc-200 px-5 py-3 text-xs font-black uppercase tracking-widest text-zinc-300 whitespace-nowrap">
              Select {2 - selectedItems.length} more
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
