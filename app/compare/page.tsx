// Author: Nahom Brook
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { db } from '@/src/lib/db'
import type { Product } from '@/src/types'

interface PageProps {
  searchParams: Promise<{ ids?: string }>
}

type SpecRow = {
  label:    string
  key:      keyof Product
  format?:  (v: unknown) => string
  diff:     boolean
  winner:   'max' | 'min' | null
}

const SPEC_ROWS: SpecRow[] = [
  { label: 'Brand',          key: 'brand',         diff: false, winner: null },
  { label: 'Category',       key: 'category',      diff: false, winner: null },
  { label: 'Condition',      key: 'condition',      diff: false, winner: null },
  { label: 'Processor',      key: 'processor',     diff: true,  winner: null },
  { label: 'RAM',            key: 'ram',           format: (v) => `${v} GB`,  diff: true, winner: 'max' },
  { label: 'Storage',        key: 'storage',       format: (v) => `${v} GB`,  diff: true, winner: 'max' },
  { label: 'Battery Health', key: 'batteryHealth', format: (v) => `${v}%`,    diff: true, winner: 'max' },
  { label: 'Starting Price', key: 'price',         format: (v) => `$${Number(v).toLocaleString()}`, diff: true, winner: 'min' },
]

export default async function ComparePage({ searchParams }: PageProps) {
  const { ids } = await searchParams
  const idList  = ids?.split(',').filter(Boolean) ?? []

  if (idList.length < 2) {
    return (
      <div className="min-h-screen bg-[#EAEDED] flex flex-col">
        {/* Mini header */}
        <div className="bg-[#131921] py-3 px-8">
          <span className="text-white text-lg font-black">Tech<span className="text-[#FF9900]">Trade</span></span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
          <p className="text-xl font-bold text-[#0F1111] text-center">
            Select 2–3 items to compare.
          </p>
          <Link
            href="/"
            className="flex items-center gap-2 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200]
              text-[#0F1111] px-6 py-2.5 text-sm font-semibold rounded-full transition-colors"
          >
            <ArrowLeft size={14} /> Browse Listings
          </Link>
        </div>
      </div>
    )
  }

  const products: Product[] = await db.product
    .findMany({
      where:   { id: { in: idList } },
      include: { bids: { orderBy: { amount: 'desc' }, take: 1 } },
    })
    .catch((): Product[] => [])

  return (
    <div className="min-h-screen bg-[#EAEDED] flex flex-col">

      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="bg-[#131921] sticky top-0 z-10 px-8 py-3 flex items-center justify-between">
        <a href="/" className="flex items-end gap-0.5">
          <span className="text-white text-lg font-black tracking-tight">Tech</span>
          <span className="text-[#FF9900] text-lg font-black tracking-tight">Trade</span>
        </a>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft size={14} /> All Listings
        </Link>
      </div>

      {/* ── Sub-header ────────────────────────────────────────────── */}
      <div className="bg-[#232F3E] px-8 py-2 flex items-center justify-between">
        <h1 className="text-sm font-bold text-white">Side-by-Side Comparison</h1>
        <span className="text-xs text-white/50">{products.length} items</span>
      </div>

      {/* ── Table ─────────────────────────────────────────────────── */}
      <div className="flex-1 px-4 sm:px-8 py-6">
        <div className="bg-white border border-[#D5D9D9] rounded-sm overflow-x-auto shadow-sm">
          <table className="w-full border-collapse min-w-[540px]">

            {/* Product header row */}
            <thead>
              <tr>
                <th className="w-44 bg-[#f7f8f8] border-b border-r border-[#D5D9D9] p-4 text-left text-[10px] font-bold uppercase tracking-widest text-[#565959] align-bottom">
                  Specification
                </th>
                {products.map((p) => {
                  const highestBid = p.bids?.[0]?.amount
                  return (
                    <th key={p.id} className="border-b border-r border-[#D5D9D9] p-5 text-center min-w-[210px] align-top bg-white last:border-r-0">
                      {/* Image */}
                      <div className="relative w-28 h-28 mx-auto border border-[#D5D9D9] rounded-sm overflow-hidden mb-3 bg-[#f7f8f8]">
                        <Image
                          src={p.imageUrl}
                          alt={p.model}
                          fill
                          sizes="112px"
                          className="object-cover"
                        />
                      </div>
                      <p className="text-[11px] font-semibold text-[#007185]">{p.brand}</p>
                      <p className="text-[15px] font-semibold leading-snug mt-0.5 text-[#0F1111]">{p.model}</p>

                      {/* Bid info */}
                      {highestBid ? (
                        <div className="mt-2">
                          <p className="text-[10px] text-[#565959] uppercase tracking-wide">Current bid</p>
                          <p className="text-xl font-normal text-[#0F1111]">${highestBid.toLocaleString()}</p>
                        </div>
                      ) : (
                        <div className="mt-2">
                          <p className="text-[10px] text-[#565959] uppercase tracking-wide">Starting at</p>
                          <p className="text-xl font-normal text-[#0F1111]">${p.price.toLocaleString()}</p>
                        </div>
                      )}

                      <span className={`inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-sm ${
                        p.condition === 'Excellent' ? 'bg-green-50 text-[#007600] border border-green-200'
                        : p.condition === 'Good'    ? 'bg-amber-50 text-[#B7791F] border border-amber-200'
                        : 'bg-orange-50 text-orange-700 border border-orange-200'
                      }`}>
                        {p.condition}
                      </span>
                    </th>
                  )
                })}
              </tr>
            </thead>

            {/* Spec rows */}
            <tbody>
              {SPEC_ROWS.map(({ label, key, format, diff, winner }) => {
                const values  = products.map((p) => p[key])
                const isDiff  = diff && new Set(values.map(String)).size > 1

                return (
                  <tr key={key} className={`${isDiff ? 'bg-amber-50/60' : ''} border-b border-[#D5D9D9] last:border-b-0`}>
                    <td className="border-r border-[#D5D9D9] p-4 bg-[#f7f8f8]">
                      <span className="text-[11px] font-semibold text-[#0F1111] uppercase tracking-wide">{label}</span>
                      {isDiff && <span className="ml-1.5 text-[#FF9900] text-xs">↕</span>}
                    </td>

                    {products.map((p) => {
                      const raw     = p[key]
                      const display = format ? format(raw) : String(raw ?? '—')
                      const best    = isDiff && winner !== null && isBest(winner, raw, values)

                      return (
                        <td
                          key={p.id}
                          className={`border-r border-[#D5D9D9] last:border-r-0 p-4 text-center text-sm ${
                            best ? 'bg-green-50' : ''
                          }`}
                        >
                          <span className={best ? 'font-bold text-[#007600]' : 'text-[#0F1111]'}>
                            {display}
                          </span>
                          {best && (
                            <span className="block text-[9px] text-[#007600] font-bold uppercase tracking-widest mt-0.5">
                              ▲ Best
                            </span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#232F3E] text-white/40 text-[11px] text-center py-3">
        © {new Date().getFullYear()} TechTrade — C2C Auction Marketplace
      </footer>
    </div>
  )
}

function isBest(winner: 'max' | 'min', value: unknown, all: unknown[]): boolean {
  const nums = all.map(Number)
  const n    = Number(value)
  return winner === 'min' ? n === Math.min(...nums) : n === Math.max(...nums)
}
