'use client'

import { CartEntry } from '@/types'
import { createContext, useContext, useState } from 'react'

type CartContextType = {
  cart: CartEntry[];
  addToCart: (entry: CartEntry) => void;
  updateCartItem: (index: number, entry: CartEntry) => void;
  removeCartItem: (index: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartEntry[]>([])

    const getVariantKey = (variantLabel: string | undefined) => {
      return (variantLabel || '').split('|').map(str => str.trim()).sort().join(' | ').trim()
    }

    const addToCart = (entry: CartEntry) => {
      const normalizedLabel = getVariantKey(entry.variantLabel);

      setCart((prev) => {
        const existingIndex = prev.findIndex(
          (i) =>
            i.item._id === entry.item._id &&
            getVariantKey(i.variantLabel) === normalizedLabel
        );

        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + entry.quantity,
          };
          return updated;
        } else {
          return [
            ...prev,
            {
              ...entry,
              variantLabel: normalizedLabel,
              variantPrice: entry.variantPrice || 0,
            },
          ];
        }
      });
    };

  const updateCartItem = (index: number, entry: CartEntry) => {
    setCart((prev) => {
      const updated = [...prev]
      updated[index] = entry
      return updated
    })
  }

  const removeCartItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index))
  }

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateCartItem, removeCartItem, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
