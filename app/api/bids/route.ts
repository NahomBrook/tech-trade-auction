// Author: Nahom Brook
import { NextResponse } from 'next/server'
import { db } from '@/src/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { productId, amount } = body as { productId?: string; amount?: number }

    if (!productId || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid bid data.' }, { status: 400 })
    }

    const product = await db.product.findUnique({
      where:   { id: productId },
      include: { bids: { orderBy: { amount: 'desc' }, take: 1 } },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 })
    }

    if (new Date(product.listingEnds) < new Date()) {
      return NextResponse.json({ error: 'This listing has ended.' }, { status: 400 })
    }

    const floor = product.bids[0]?.amount ?? product.price
    if (amount <= floor) {
      return NextResponse.json(
        { error: `Bid must exceed $${floor.toLocaleString()}.` },
        { status: 400 },
      )
    }

    const bid = await db.bid.create({ data: { productId, amount } })
    return NextResponse.json({ bid }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
