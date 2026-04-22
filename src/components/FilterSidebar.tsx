'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'

const CATEGORIES = ['Laptop', 'Phone']
const CONDITIONS = ['Excellent', 'Good', 'Fair']
const RAM_OPTIONS = [8, 16, 32, 64]
const BATTERY_OPTIONS = [75, 80, 85, 90, 95]

export function FilterSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const update = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString())
      value ? next.set(key, value) : next.delete(key)
      router.push(`${pathname}?${next.toString()}`)
    },
    [params, pathname, router],
  )

  return (
    <aside className="w-52 shrink-0">
      <div className="border-2 border-black p-5 space-y-7 sticky top-6">
        <FilterGroup title="Category">
          <FilterChip
            label="All"
            active={!params.get('category')}
            onClick={() => update('category', '')}
          />
          {CATEGORIES.map((c) => (
            <FilterChip
              key={c}
              label={c}
              active={params.get('category') === c}
              onClick={() => update('category', c)}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Condition">
          <FilterChip
            label="Any"
            active={!params.get('condition')}
            onClick={() => update('condition', '')}
          />
          {CONDITIONS.map((c) => (
            <FilterChip
              key={c}
              label={c}
              active={params.get('condition') === c}
              onClick={() => update('condition', c)}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Min RAM">
          <FilterChip
            label="Any"
            active={!params.get('ram')}
            onClick={() => update('ram', '')}
          />
          {RAM_OPTIONS.map((gb) => (
            <FilterChip
              key={gb}
              label={`${gb} GB+`}
              active={params.get('ram') === String(gb)}
              onClick={() => update('ram', String(gb))}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Min Battery Health">
          <FilterChip
            label="Any"
            active={!params.get('battery')}
            onClick={() => update('battery', '')}
          />
          {BATTERY_OPTIONS.map((pct) => (
            <FilterChip
              key={pct}
              label={`${pct}%+`}
              active={params.get('battery') === String(pct)}
              onClick={() => update('battery', String(pct))}
            />
          ))}
        </FilterGroup>
      </div>
    </aside>
  )
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest pb-2 mb-2 border-b-2 border-black">
        {title}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-1.5 text-sm font-bold border-2 transition-colors cursor-pointer ${
        active
          ? 'border-black bg-black text-white'
          : 'border-transparent text-black hover:border-black'
      }`}
    >
      {label}
    </button>
  )
}
