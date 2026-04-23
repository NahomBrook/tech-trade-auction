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
    <div className="fixed bottom-0 inset-x-0 z-40 bg-[#232F3E] border-t-2 border-[#FF9900] shadow-[0_-4px_24px_rgba(0,0,0,0.3)]">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4">

        {/* Label */}
        <div className="shrink-0 hidden sm:block">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#FF9900]">Compare</p>
          <p className="text-[10px] text-white/60">{selectedItems.length} of 3</p>
        </div>

        {/* Items */}
        <div className="flex-1 flex items-center gap-3 overflow-x-auto min-w-0 pb-0.5">
          {selectedItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 bg-white/10 border border-white/20 px-2.5 py-1.5 rounded-sm shrink-0"
            >
              <div className="relative w-9 h-9 rounded-sm overflow-hidden border border-white/30 shrink-0 bg-white">
                <Image
                  src={item.imageUrl}
                  alt={item.model}
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
              <span className="text-sm font-medium text-white whitespace-nowrap">
                {item.brand} {item.model}
              </span>
              <button
                onClick={() => toggleProduct(item)}
                className="ml-1 text-white/50 hover:text-white transition-colors cursor-pointer"
                aria-label={`Remove ${item.model}`}
              >
                <X size={13} />
              </button>
            </div>
          ))}

          {/* Empty slots */}
          {Array.from({ length: 3 - selectedItems.length }).map((_, i) => (
            <div
              key={`slot-${i}`}
              className="w-40 h-14 border border-dashed border-white/20 rounded-sm shrink-0 flex items-center justify-center"
            >
              <span className="text-[10px] text-white/30 uppercase tracking-wide">Add item</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={clearStore}
            className="text-xs text-white/60 hover:text-white underline transition-colors cursor-pointer hidden sm:block"
          >
            Clear
          </button>

          {selectedItems.length >= 2 ? (
            <Link
              href={compareHref}
              className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200]
                text-[#0F1111] px-5 py-2.5 text-xs font-bold rounded-full
                transition-colors whitespace-nowrap"
            >
              Compare Now →
            </Link>
          ) : (
            <span className="border border-white/20 rounded-full px-5 py-2.5 text-xs font-bold text-white/30 whitespace-nowrap">
              Select {2 - selectedItems.length} more
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
