'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'

const RAM_OPTIONS = [8, 16, 32, 64]
const BATTERY_OPTIONS = [
  { label: '80%+', min: 80 },
  { label: '90%+', min: 90 },
  { label: '95%+', min: 95 },
]
const CATEGORIES = ['Laptop', 'Phone']

export function SearchSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const update = useCallback(
    (key: string, value: string) => {
      const p = new URLSearchParams(params.toString())
      value ? p.set(key, value) : p.delete(key)
      router.push(`${pathname}?${p.toString()}`)
    },
    [params, pathname, router],
  )

  return (
    <aside className="w-52 shrink-0">
      <div className="border-2 border-black p-5 space-y-8 sticky top-6">
        <FilterSection title="Category">
          <FilterBtn
            label="All"
            active={!params.get('category')}
            onClick={() => update('category', '')}
          />
          {CATEGORIES.map((cat) => (
            <FilterBtn
              key={cat}
              label={cat}
              active={params.get('category') === cat}
              onClick={() => update('category', cat)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Min RAM">
          <FilterBtn
            label="Any"
            active={!params.get('ram')}
            onClick={() => update('ram', '')}
          />
          {RAM_OPTIONS.map((gb) => (
            <FilterBtn
              key={gb}
              label={`${gb}GB+`}
              active={params.get('ram') === String(gb)}
              onClick={() => update('ram', String(gb))}
            />
          ))}
        </FilterSection>

        <FilterSection title="Battery Health">
          <FilterBtn
            label="Any"
            active={!params.get('battery')}
            onClick={() => update('battery', '')}
          />
          {BATTERY_OPTIONS.map(({ label, min }) => (
            <FilterBtn
              key={min}
              label={label}
              active={params.get('battery') === String(min)}
              onClick={() => update('battery', String(min))}
            />
          ))}
        </FilterSection>
      </div>
    </aside>
  )
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest mb-3 pb-2 border-b-2 border-black">
        {title}
      </p>
      <div className="space-y-1">{children}</div>
    </div>
  )
}

function FilterBtn({
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
