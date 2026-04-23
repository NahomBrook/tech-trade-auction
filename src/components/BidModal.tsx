'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface Props {
  productId: string
  model:     string
  minBid:    number
  onSuccess: (newAmount: number) => void
  onClose:   () => void
}

export function BidModal({ productId, model, minBid, onSuccess, onClose }: Props) {
  const [amount,  setAmount]  = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const bid = parseFloat(amount)
    if (isNaN(bid) || bid <= minBid) {
      setError(`Bid must be greater than $${minBid.toLocaleString()}`)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/bids', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ productId, amount: bid }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to place bid')
      setSuccess(true)
      setTimeout(() => { onSuccess(bid) }, 1200)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-sm shadow-2xl w-full max-w-md border border-[#D5D9D9]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D5D9D9]">
          <h2 className="text-lg font-bold text-[#0F1111]">Place Your Bid</h2>
          <button
            onClick={onClose}
            className="text-[#565959] hover:text-[#0F1111] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {success ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-3">🎉</div>
              <p className="text-lg font-bold text-[#007600]">Bid placed successfully!</p>
              <p className="text-sm text-[#565959] mt-1">You are the highest bidder.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <p className="text-sm font-medium text-[#0F1111]">{model}</p>
                <p className="text-sm text-[#565959] mt-1">
                  {minBid > 0
                    ? <>Current highest bid: <span className="font-bold text-[#0F1111]">${minBid.toLocaleString()}</span></>
                    : 'No bids yet — be the first!'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F1111] mb-1.5">
                  Your bid (USD)
                </label>
                <div className="flex items-center border-2 border-[#D5D9D9] focus-within:border-[#FF9900] transition-colors rounded-sm overflow-hidden">
                  <span className="px-3 text-[#565959] text-sm select-none">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => { setAmount(e.target.value); setError(null) }}
                    placeholder={(minBid + 1).toString()}
                    min={minBid + 0.01}
                    step="0.01"
                    className="flex-1 py-2.5 pr-3 text-[15px] font-semibold text-[#0F1111] outline-none bg-transparent"
                    required
                    autoFocus
                  />
                </div>
                {error && (
                  <p className="mt-1.5 text-sm text-red-600">{error}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#DBA20C] disabled:opacity-60
                  border border-[#FCD200] text-[#0F1111] font-semibold py-2.5 text-sm
                  rounded-full transition-colors cursor-pointer"
              >
                {loading ? 'Placing bid…' : 'Place Bid'}
              </button>

              <p className="text-[11px] text-[#565959] text-center leading-relaxed">
                By placing a bid you agree to complete the purchase if you win.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
