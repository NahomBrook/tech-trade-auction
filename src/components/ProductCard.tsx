'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Clock } from 'lucide-react'
import type { Product } from '@/src/types'
import { useComparisonStore } from '@/src/store/useComparisonStore'
import { BidModal } from './BidModal'

const CONDITION_COLOR: Record<string, string> = {
  Excellent: 'text-[#007600]',
  Good:      'text-[#B7791F]',
  Fair:      'text-[#C0392B]',
}

export function ProductCard({ product }: { product: Product }) {
  const { selectedProductIds, toggleProduct } = useComparisonStore()
  const isSelected = selectedProductIds.includes(product.id)

  const initialHighest = product.bids?.[0]?.amount ?? 0
  const [currentBid,  setCurrentBid]  = useState(initialHighest)
  const [bidCount,    setBidCount]    = useState(product.bids?.length ?? 0)
  const [showModal,   setShowModal]   = useState(false)

  const endingSoon = new Date(product.listingEnds).getTime() - Date.now() < 86_400_000
  const ended      = new Date(product.listingEnds).getTime() < Date.now()
  const timeStr    = timeLeft(product.listingEnds)

  function handleBidSuccess(newAmount: number) {
    setCurrentBid(newAmount)
    setBidCount((c) => c + 1)
    setShowModal(false)
  }

  const batteryClass =
    product.batteryHealth >= 90 ? 'battery-fill-green'
    : product.batteryHealth >= 75 ? 'battery-fill-yellow'
    : 'battery-fill-red'

  return (
    <>
      <article
        className={`group relative flex flex-col bg-white border rounded-sm transition-all duration-200
          hover:shadow-[0_4px_16px_rgba(0,0,0,0.13)] hover:-translate-y-0.5
          ${isSelected
            ? 'border-[#FF9900] shadow-[0_0_0_2px_#FF9900]'
            : 'border-[#D5D9D9]'}`}
      >
        {/* ── Image ─────────────────────────────────────────────── */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[#f7f8f8] rounded-t-sm">
          <Image
            src={product.imageUrl}
            alt={`${product.brand} ${product.model}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-400 group-hover:scale-[1.04]"
          />

          {/* Ending-soon ribbon */}
          {endingSoon && !ended && (
            <span className="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1">
              Ending Soon
            </span>
          )}
          {ended && (
            <span className="absolute top-0 left-0 bg-[#565959] text-white text-[10px] font-bold px-2.5 py-1">
              Ended
            </span>
          )}

          {/* Compare ring overlay */}
          {isSelected && (
            <div className="absolute inset-0 ring-2 ring-[#FF9900] pointer-events-none rounded-t-sm" />
          )}
        </div>

        {/* ── Body ─────────────────────────────────────────────── */}
        <div className="flex flex-col flex-1 p-4">

          {/* Brand */}
          <p className="text-[#007185] text-xs font-medium hover:text-[#C7511F] cursor-pointer transition-colors">
            {product.brand}
          </p>

          {/* Model name */}
          <h2 className="mt-0.5 text-[15px] font-medium leading-snug text-[#0F1111] line-clamp-2
            hover:text-[#C7511F] cursor-pointer transition-colors">
            {product.model}
          </h2>

          {/* Condition + processor */}
          <div className="mt-1.5 flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold ${CONDITION_COLOR[product.condition] ?? 'text-[#565959]'}`}>
              {product.condition}
            </span>
            <span className="text-[#D5D9D9]">·</span>
            <span className="text-[11px] text-[#565959] truncate">{product.processor}</span>
          </div>

          {/* Spec chips */}
          <div className="mt-3 flex gap-1.5 flex-wrap">
            {[
              `${product.ram} GB RAM`,
              `${product.storage} GB SSD`,
            ].map((s) => (
              <span
                key={s}
                className="border border-[#D5D9D9] text-[#565959] text-[10px] px-1.5 py-0.5 rounded-sm bg-[#f7f8f8]"
              >
                {s}
              </span>
            ))}
          </div>

          {/* Battery bar */}
          <div className="mt-3 flex items-center gap-2">
            <div className="battery-bar flex-1">
              <div
                className={`h-full rounded-full ${batteryClass}`}
                style={{ width: `${product.batteryHealth}%` }}
              />
            </div>
            <span className="text-[11px] text-[#565959] shrink-0 tabular-nums">
              {product.batteryHealth}% battery
            </span>
          </div>

          {/* Price block */}
          <div className="mt-4 flex-1">
            {currentBid > 0 ? (
              <>
                <p className="text-[10px] text-[#565959] uppercase tracking-wider">Current bid</p>
                <p className="text-[22px] font-normal text-[#0F1111] leading-none mt-0.5">
                  <span className="price-sup">$</span>
                  {formatPrice(currentBid)}
                </p>
                <p className="text-[11px] text-[#565959] mt-0.5">
                  {bidCount} bid{bidCount !== 1 ? 's' : ''} &nbsp;·&nbsp; starts at ${product.price.toLocaleString()}
                </p>
              </>
            ) : (
              <>
                <p className="text-[10px] text-[#565959] uppercase tracking-wider">Starting bid</p>
                <p className="text-[22px] font-normal text-[#0F1111] leading-none mt-0.5">
                  <span className="price-sup">$</span>
                  {product.price.toLocaleString()}<span className="text-sm">.00</span>
                </p>
                <p className="text-[11px] text-[#565959] mt-0.5">No bids yet — be the first!</p>
              </>
            )}
          </div>

          {/* Countdown */}
          <div className={`mt-3 flex items-center gap-1.5 text-xs font-medium ${
            ended ? 'text-[#565959]' : endingSoon ? 'text-red-600' : 'text-[#565959]'
          }`}>
            <Clock size={12} />
            <span className="tabular-nums">{timeStr}</span>
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex flex-col gap-2">
            <button
              disabled={ended}
              onClick={() => setShowModal(true)}
              className="w-full bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#DBA20C]
                border border-[#FCD200] text-[#0F1111] text-sm font-semibold
                py-2 rounded-full transition-colors cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {ended ? 'Auction Ended' : 'Place Bid'}
            </button>

            <button
              onClick={() =>
                toggleProduct({
                  id:       product.id,
                  brand:    product.brand,
                  model:    product.model,
                  imageUrl: product.imageUrl,
                })
              }
              className={`w-full border text-sm font-medium py-2 rounded-full transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[#232F3E] text-white border-[#232F3E] hover:bg-[#374151]'
                  : 'bg-white text-[#0F1111] border-[#D5D9D9] hover:border-[#999] hover:bg-[#f7f8f8]'
              }`}
            >
              {isSelected ? '✓ In Comparison' : '+ Compare'}
            </button>
          </div>
        </div>
      </article>

      {showModal && (
        <BidModal
          productId={product.id}
          model={`${product.brand} ${product.model}`}
          minBid={currentBid > 0 ? currentBid : product.price}
          onSuccess={handleBidSuccess}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}

function formatPrice(n: number): string {
  const [int, dec] = n.toFixed(2).split('.')
  return `${Number(int).toLocaleString()}.${dec}`
}

function timeLeft(listingEnds: Date | string): string {
  const diff = new Date(listingEnds).getTime() - Date.now()
  if (diff <= 0) return 'Auction ended'
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  return h >= 24 ? `${Math.floor(h / 24)}d ${h % 24}h remaining` : `${h}h ${m}m remaining`
}
