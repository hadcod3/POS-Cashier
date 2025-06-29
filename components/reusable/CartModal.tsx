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
    const variantLabel = Object.entries(selectedOptions)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label]) => label.trim())
      .join(' | ')
      .trim();

      
    let variantPrice = 0;
    if (selectedItem?.variants) {
      selectedItem.variants.forEach((variant) => {
        const selectedLabel = selectedOptions[variant.name];
        const foundOption = variant.options.find((opt) => opt.label === selectedLabel);
        if (foundOption) variantPrice += foundOption.price;
      });
    }

    const cartEntry = {
      item: selectedItem,
      quantity,
      variantLabel: variantLabel || undefined,
      variantPrice: variantPrice || 0, // ✅ pass it
    };

    if (mode === 'edit' && editIndex !== null) {
      updateCartItem(editIndex, cartEntry);
    } else {
      addToCart(cartEntry);
    }

    closeModal();
  };

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
            <Input
              type="number"
              min={selectedItem.minOrder || 1}
              value={quantity}
              onChange={(e) => {
                const q = parseInt(e.target.value) || selectedItem.minOrder || 1;
                setQuantity(Math.max(selectedItem.minOrder || 1, q));
              }}
              className="w-20"
            />
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
