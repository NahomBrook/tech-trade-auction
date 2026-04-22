import { create } from 'zustand'
import type { CompareItem } from '@/src/types'

const MAX = 3

interface ComparisonState {
  selectedProductIds: string[]
  selectedItems: CompareItem[]
  toggleProduct: (item: CompareItem) => void
  clearStore: () => void
}

export const useComparisonStore = create<ComparisonState>((set, get) => ({
  selectedProductIds: [],
  selectedItems: [],

  toggleProduct: (item) => {
    const { selectedProductIds, selectedItems } = get()
    if (selectedProductIds.includes(item.id)) {
      set({
        selectedProductIds: selectedProductIds.filter((id) => id !== item.id),
        selectedItems: selectedItems.filter((p) => p.id !== item.id),
      })
    } else {
      if (selectedProductIds.length >= MAX) return
      set({
        selectedProductIds: [...selectedProductIds, item.id],
        selectedItems: [...selectedItems, item],
      })
    }
  },

  clearStore: () => set({ selectedProductIds: [], selectedItems: [] }),
}))
