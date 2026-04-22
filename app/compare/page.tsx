import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { db } from '@/src/lib/db'
import type { Product } from '@/src/types'

interface PageProps {
  searchParams: Promise<{ ids?: string }>
}

type SpecRow = {
  label: string
  key: keyof Product
  format?: (v: unknown) => string
  highlight: boolean
}

const SPEC_ROWS: SpecRow[] = [
  { label: 'Brand',          key: 'brand',         highlight: false },
  { label: 'Category',       key: 'category',      highlight: false },
  { label: 'Condition',      key: 'condition',     highlight: false },
  { label: 'Processor',      key: 'processor',     highlight: true  },
  { label: 'RAM',            key: 'ram',           format: (v) => `${v} GB`,  highlight: true  },
  { label: 'Storage',        key: 'storage',       format: (v) => `${v} GB`,  highlight: false },
  { label: 'Battery Health', key: 'batteryHealth', format: (v) => `${v}%`,    highlight: true  },
  { label: 'Starting Price', key: 'price',         format: (v) => `$${Number(v).toLocaleString()}`, highlight: false },
]

export default async function ComparePage({ searchParams }: PageProps) {
  const { ids } = await searchParams
  const idList = ids?.split(',').filter(Boolean) ?? []

  if (idList.length < 2) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <p className="text-2xl font-black uppercase tracking-widest text-center">
          Select 2–3 items to compare.
        </p>
        <Link
          href="/"
          className="flex items-center gap-2 border-2 border-black px-6 py-3 text-sm font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Browse Listings
        </Link>
      </main>
    )
  }

  const products: Product[] = await db.product
    .findMany({ where: { id: { in: idList } } })
    .catch((): Product[] => [])

  return (
    <main className="min-h-screen bg-white pb-16">
      {/* Sticky header */}
      <div className="border-b-2 border-black px-8 py-5 flex items-center justify-between sticky top-0 bg-white z-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-black uppercase tracking-widest hover:opacity-50 transition-opacity"
        >
          <ArrowLeft size={14} /> All Listings
        </Link>
        <h1 className="text-lg font-black uppercase tracking-widest">Side-by-Side</h1>
        <span className="text-sm font-bold text-zinc-400">{products.length} items</span>
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[580px]">
          {/* Product header row */}
          <thead>
            <tr>
              <th className="w-44 border-2 border-black p-4 bg-zinc-50 text-left text-[10px] font-black uppercase tracking-widest align-bottom">
                Specification
              </th>
              {products.map((p) => (
                <th
                  key={p.id}
                  className="border-2 border-black p-5 text-center min-w-[210px] align-top"
                >
                  <div className="relative w-20 h-20 mx-auto border-2 border-black overflow-hidden mb-3">
                    <Image
                      src={p.imageUrl}
                      alt={p.model}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    {p.brand}
                  </p>
                  <p className="text-base font-black leading-tight mt-0.5">{p.model}</p>
                  <p className="text-xl font-black mt-1">${p.price.toLocaleString()}</p>
                  <span className="inline-block mt-2 border-2 border-black text-[10px] font-black px-2 py-0.5 uppercase tracking-widest">
                    {p.condition}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          {/* Spec rows */}
          <tbody>
            {SPEC_ROWS.map(({ label, key, format, highlight }) => {
              const values = products.map((p) => p[key])
              const isDiff = highlight && new Set(values.map(String)).size > 1

              return (
                <tr key={key} className={isDiff ? 'bg-amber-50' : ''}>
                  <td className="border-2 border-black p-4 bg-zinc-50">
                    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
                    {isDiff && <span className="ml-2 text-amber-500">↕</span>}
                  </td>

                  {products.map((p) => {
                    const raw = p[key]
                    const display = format ? format(raw) : String(raw ?? '—')
                    const best = isDiff && isBest(key, raw, values)

                    return (
                      <td
                        key={p.id}
                        className={`border-2 border-black p-4 text-center text-sm font-bold ${
                          best ? 'bg-emerald-50' : ''
                        }`}
                      >
                        {display}
                        {best && (
                          <span className="block text-[9px] text-emerald-700 font-black uppercase tracking-widest mt-0.5">
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
    </main>
  )
}

function isBest(key: keyof Product, value: unknown, all: unknown[]): boolean {
  const nums = all.map(Number)
  const n = Number(value)
  if (key === 'price') return n === Math.min(...nums)
  if (['ram', 'storage', 'batteryHealth'].includes(key as string)) return n === Math.max(...nums)
  return false
}
