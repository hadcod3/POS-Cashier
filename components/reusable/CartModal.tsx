'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useCart } from './CartContext'
import { useCartModal } from './CartModalContext'
import { useEffect, useState } from 'react'
import { IconMinus, IconPlus } from "@tabler/icons-react"

const CartModal = () => {
  const { isOpen, selectedItem, mode, closeModal, editIndex } = useCartModal()
  const { addToCart, updateCartItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})

  useEffect(() => {
    if (selectedItem?.variants) {
      const defaultOptions: Record<string, string> = {}
      selectedItem.variants.forEach(variant => {
        defaultOptions[variant.name] = variant.options[0]?.label || ''
      })
      setSelectedOptions(defaultOptions)
    }
    setQuantity(selectedItem?.minOrder as number)
  }, [selectedItem])

  if (!selectedItem) return null

  const handleSubmit = () => {
  const variantStrings = Object.entries(selectedOptions)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, label]) => {
      const variant = selectedItem.variants?.find(v => v.name === name);
      const option = variant?.options.find(opt => opt.label === label);
      return option?.label || label; // Use the value if available, otherwise fallback to label
    })
    .filter(Boolean); // Remove any empty strings

  const variantLabel = variantStrings.join(' | ');

    // Calculate total variant price
    let variantPrice = 0
    if (selectedItem?.variants) {
      selectedItem.variants.forEach((variant) => {
        const selectedLabel = selectedOptions[variant.name]
        const foundOption = variant.options.find((opt) => opt.label === selectedLabel)
        if (foundOption) variantPrice += foundOption.price
      })
    }

    const cartEntry = {
      item: selectedItem,
      quantity,
      variantLabel: variantLabel || undefined,
      variantPrice: variantPrice || 0,
      selectedVariants: selectedOptions, 
    }

    if (mode === 'edit' && editIndex !== null) {
      updateCartItem(editIndex, cartEntry)
    } else {
      addToCart(cartEntry)
    }

    closeModal()
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {mode === 'add' ? 'Add to Cart' : 'Edit Cart Item'}
          </DialogTitle>
          <DialogDescription>
            Customize your order before proceeding.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <p className="text-lg font-bold">{selectedItem.name}</p>

          {selectedItem.variants?.map((variant, idx) => (
            <div key={idx}>
              <label className="block text-sm font-medium mb-1">{variant.name}</label>
              <select
                value={selectedOptions[variant.name]}
                onChange={(e) =>
                  setSelectedOptions(prev => ({
                    ...prev,
                    [variant.name]: e.target.value
                  }))
                }
                className="w-full border border-gray-300 p-2 rounded-md"
              >
                {variant.options.map((option, oidx) => (
                  <option key={oidx} value={option.label}>
                    {option.label} - Rp {option.price.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(prev => Math.max(selectedItem.minOrder || 1, prev - 1))}
                disabled={quantity <= (selectedItem.minOrder || 1)}
                className='min-w-9 w-9 min-h-9 h-9'
              >
                <IconMinus className="size-4" />
              </Button>
              <Input
                type="number"
                min={selectedItem.minOrder || 1}
                value={quantity}
                onChange={(e) => {
                  const q = parseInt(e.target.value) || selectedItem.minOrder || 1;
                  setQuantity(Math.max(selectedItem.minOrder || 1, q));
                }}
                className="w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(prev => prev + 1)}
                className='min-w-9 w-9 min-h-9 h-9'
              >
                <IconPlus className="size-4" />
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {mode === 'add' ? 'Add to Cart' : 'Update Item'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CartModal
