'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { ChevronRight } from 'lucide-react'

const CATEGORIES  = ['Laptop', 'Phone']
const CONDITIONS  = ['Excellent', 'Good', 'Fair']
const RAM_OPTIONS = [8, 16, 32, 64]
const BAT_OPTIONS = [75, 80, 85, 90, 95]

export function FilterSidebar() {
  const router   = useRouter()
  const pathname = usePathname()
  const params   = useSearchParams()

  const update = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString())
      value ? next.set(key, value) : next.delete(key)
      router.push(`${pathname}?${next.toString()}`)
    },
    [params, pathname, router],
  )

  const active = (key: string, val: string) => params.get(key) === val

  return (
    <aside className="w-56 shrink-0 self-start sticky top-[72px]">
      <div className="bg-white border border-[#D5D9D9] rounded-sm overflow-hidden">

        {/* Header */}
        <div className="px-4 py-3 border-b border-[#D5D9D9] bg-[#f7f8f8]">
          <h2 className="text-sm font-bold text-[#0F1111]">Filter by</h2>
        </div>

        {/* Category */}
        <Section title="Category">
          <RadioItem
            label="All Categories"
            active={!params.get('category')}
            onClick={() => update('category', '')}
          />
          {CATEGORIES.map((c) => (
            <RadioItem
              key={c}
              label={c}
              active={active('category', c)}
              onClick={() => update('category', c)}
            />
          ))}
        </Section>

        <Divider />

        {/* Condition */}
        <Section title="Condition">
          <RadioItem
            label="Any Condition"
            active={!params.get('condition')}
            onClick={() => update('condition', '')}
          />
          {CONDITIONS.map((c) => (
            <RadioItem
              key={c}
              label={c}
              active={active('condition', c)}
              onClick={() => update('condition', c)}
            />
          ))}
        </Section>

        <Divider />

        {/* Min RAM */}
        <Section title="Min RAM">
          <RadioItem
            label="Any"
            active={!params.get('ram')}
            onClick={() => update('ram', '')}
          />
          {RAM_OPTIONS.map((gb) => (
            <RadioItem
              key={gb}
              label={`${gb} GB & up`}
              active={active('ram', String(gb))}
              onClick={() => update('ram', String(gb))}
            />
          ))}
        </Section>

        <Divider />

        {/* Battery */}
        <Section title="Min Battery Health">
          <RadioItem
            label="Any"
            active={!params.get('battery')}
            onClick={() => update('battery', '')}
          />
          {BAT_OPTIONS.map((pct) => (
            <RadioItem
              key={pct}
              label={`${pct}% & up`}
              active={active('battery', String(pct))}
              onClick={() => update('battery', String(pct))}
            />
          ))}
        </Section>

        {/* Clear all */}
        {(params.get('category') || params.get('condition') || params.get('ram') || params.get('battery') || params.get('q')) && (
          <>
            <Divider />
            <div className="px-4 py-3">
              <button
                onClick={() => router.push(pathname)}
                className="text-[#007185] text-sm hover:text-[#C7511F] hover:underline transition-colors cursor-pointer flex items-center gap-1"
              >
                <ChevronRight size={12} /> Clear all filters
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-4 py-3">
      <p className="text-xs font-bold text-[#0F1111] uppercase tracking-wide mb-2">{title}</p>
      <ul className="space-y-0.5">{children}</ul>
    </div>
  )
}

function Divider() {
  return <hr className="border-[#D5D9D9]" />
}

function RadioItem({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <li>
      <button
        onClick={onClick}
        className={`w-full text-left text-sm py-1 px-2 rounded-sm flex items-center gap-2 transition-colors cursor-pointer ${
          active
            ? 'text-[#C7511F] font-semibold'
            : 'text-[#0F1111] hover:text-[#C7511F]'
        }`}
      >
        <span
          className={`inline-flex w-3.5 h-3.5 rounded-full border-2 shrink-0 ${
            active ? 'border-[#FF9900] bg-[#FF9900]' : 'border-[#D5D9D9]'
          }`}
        />
        {label}
      </button>
    </li>
  )
}
