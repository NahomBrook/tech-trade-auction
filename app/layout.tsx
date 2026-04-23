// Author: Nahom Brook
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { ComparisonTray } from '@/src/components/ComparisonTray'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'TechTrade — Auction Marketplace',
  description: 'Buy and sell used electronics through live auctions.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="min-h-screen flex flex-col antialiased">
        {children}
        <ComparisonTray />
      </body>
    </html>
  )
}
