'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useRef } from 'react'
import { Search } from 'lucide-react'

export function SearchBar() {
  const router      = useRouter()
  const pathname    = usePathname()
  const params      = useSearchParams()
  const inputRef    = useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = inputRef.current?.value.trim() ?? ''
    const next = new URLSearchParams(params.toString())
    q ? next.set('q', q) : next.delete('q')
    router.push(`${pathname}?${next.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 max-w-2xl">
      <input
        ref={inputRef}
        defaultValue={params.get('q') ?? ''}
        type="text"
        placeholder="Search by brand or model…"
        className="flex-1 px-4 py-2 text-[#0F1111] text-sm rounded-l-sm outline-none bg-white placeholder:text-[#999]"
      />
      <button
        type="submit"
        className="bg-[#FFD814] hover:bg-[#F7CA00] px-4 rounded-r-sm flex items-center transition-colors cursor-pointer"
        aria-label="Search"
      >
        <Search size={18} className="text-[#0F1111]" />
      </button>
    </form>
  )
}
