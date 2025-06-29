'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { useCart } from "./CartContext"
import { useState } from "react"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"
import { ScrollArea } from "../ui/scroll-area"
import { useSession } from "next-auth/react"
import Image from "next/image"

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

const CheckoutModal = ({ open, onClose }: CheckoutModalProps) => {
  const { cart, clearCart } = useCart()
    const { data: session } = useSession()

  const [orderType, setOrderType] = useState<'dine-in' | 'take-away'>('dine-in')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris'>('cash')

  const subtotal = cart.reduce((acc, item) => {
    const extra = item.variantPrice || 0
    return acc + (item.item.price + extra) * item.quantity
  }, 0)

  const tax = subtotal * 0.11
  const total = subtotal + tax

  const handleConfirmOrder = async () => {
    try {
        const items = cart.map(entry => {
        const basePrice = entry.item.price
        const variantPrice = entry.variantPrice || 0
        const total = (basePrice + variantPrice) * entry.quantity

        return {
          itemId: entry.item._id,
          name: entry.item.name,
          quantity: entry.quantity,
          basePrice,
          variantLabel: entry.variantLabel,
          variantPrice,
          total,
        }
      })

      const payload = {
        employee: session?.user?.username || "employee",
        items,
        subtotal,
        tax,
        total,
        orderOption: orderType,
        paymentMethod,
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error('Failed to save order')

      const savedOrder = await res.json()
      console.log('Order saved:', savedOrder)

      toast.success('Order Confirmed', {
        description: 'Your order has been successfully placed!',
        duration: 3000,
      })

      clearCart()
      onClose()
    } catch (err) {
      console.error(err)
      toast.error('Failed to Confirm', {
      description: 'Something went wrong while saving your order.',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Review Order</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <ScrollArea className="space-y-4 h-48">
            {cart.map((entry, idx) => (
              <div key={idx} className="flex items-center gap-3 border-b pb-2">
                <Image
                  width={200}
                  height={200}
                  src={entry.item.imgUrl}
                  alt="cart_thumb"
                  className="h-16 w-16 object-cover rounded-md"
                />
                <div className="flex-1">
                  <p className="font-medium">{entry.item.name}</p>
                  {entry.variantLabel && (
                    <p className="text-xs text-zinc-500">{entry.variantLabel}</p>
                  )}
                  <p className="text-xs text-zinc-400">Qty: {entry.quantity}</p>
                </div>
                <p className="font-medium">
                  Rp {formatPrice((entry.item.price + (entry.variantPrice || 0)) * entry.quantity)}
                </p>
              </div>
            ))}
          </ScrollArea>

          <div>
            <p className="font-semibold mb-2">Order Type</p>
            <RadioGroup
              value={orderType}
              onValueChange={(val) => setOrderType(val as 'dine-in' | 'take-away')}
              className="flex gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="dine-in" id="dine-in" />
                <label htmlFor="dine-in" className="text-sm">Dine In</label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="take-away" id="take-away" />
                <label htmlFor="take-away" className="text-sm">Take Away</label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <p className="font-semibold mb-2">Payment Method</p>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(val) => setPaymentMethod(val as 'cash' | 'qris')}
              className="flex gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="cash" id="cash" />
                <label htmlFor="cash" className="text-sm">Cash</label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="qris" id="qris" />
                <label htmlFor="qris" className="text-sm">QRIS</label>
              </div>
            </RadioGroup>
          </div>

          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-zinc-600">
              <span>Subtotal</span>
              <span>Rp {formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>Tax (11%)</span>
              <span>Rp {formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Total</span>
              <span>Rp {formatPrice(total)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button disabled={cart.length === 0} onClick={handleConfirmOrder}>
              Confirm Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CheckoutModal
