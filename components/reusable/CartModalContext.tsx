'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { IItem } from '@/lib/database/models/item.model'

export type CartModalContextType = {
  isOpen: boolean;
  selectedItem: IItem | null;
  mode: 'add' | 'edit';
  editIndex: number | null;
  openModal: (item: IItem, mode?: 'add' | 'edit', index?: number) => void;
  closeModal: () => void;
};

const CartModalContext = createContext<CartModalContextType | undefined>(undefined)

export const CartModalProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<IItem | null>(null)
    const [mode, setMode] = useState<'add' | 'edit'>('add')
    const [editIndex, setEditIndex] = useState<number | null>(null);

    const openModal = (item: IItem, mode: 'add' | 'edit' = 'add', index: number | null = null) => {
        setSelectedItem(item)
        setMode(mode)
        setEditIndex(index)
        setIsOpen(true)
    }

    const closeModal = () => {
        setIsOpen(false)
        setSelectedItem(null)
        setMode('add')
        setEditIndex(null)
    }


  return (
    <CartModalContext.Provider value={{ isOpen, selectedItem, mode, editIndex, openModal, closeModal }}>
        {children}
    </CartModalContext.Provider>
  )
}

export const useCartModal = () => {
  const context = useContext(CartModalContext)
  if (!context) {
    throw new Error('useCartModal must be used within a CartModalProvider')
  }
  return context
}
