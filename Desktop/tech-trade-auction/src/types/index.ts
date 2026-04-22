export type ProductCategory = 'Laptop' | 'Phone'
export type ProductCondition = 'Excellent' | 'Good' | 'Fair'

export interface Product {
  id: string
  brand: string
  model: string
  category: string
  condition: string
  processor: string
  ram: number
  storage: number
  batteryHealth: number
  price: number
  imageUrl: string
  listingEnds: Date | string
  bids?: { id: string; amount: number }[]
  createdAt?: Date | string
  updatedAt?: Date | string
}

export interface CompareItem {
  id: string
  brand: string
  model: string
  imageUrl: string
}
