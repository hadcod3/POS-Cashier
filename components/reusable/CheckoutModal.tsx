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
import React, { useState } from "react"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"
import { ScrollArea } from "../ui/scroll-area"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { Input } from "../ui/input"
import { OrderData } from "@/types"

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

const CheckoutModal = ({ open, onClose }: CheckoutModalProps) => {
  const { cart, clearCart } = useCart()
  const { data: session } = useSession()
  const [isPrinting, setIsPrinting] = useState(false)
  const [cashReceived, setCashReceived] = useState(0)
  const [orderType, setOrderType] = useState<'dine-in' | 'take-away'>('dine-in')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris'>('cash')
  const [customerName, setCustomerName] = useState('');

  const subtotal = cart.reduce((acc, item) => {
    const extra = item.variantPrice || 0
    return acc + (item.item.price + extra) * item.quantity
  }, 0)

  const total = subtotal

  const generateTransactionId = () => {
    const now = new Date()
    const dateStr = now.getDate().toString().padStart(2, '0') + 
                    (now.getMonth() + 1).toString().padStart(2, '0') + 
                    now.getFullYear().toString().slice(-2)
    const timeStr = now.getHours().toString().padStart(2, '0') + 
                    now.getMinutes().toString().padStart(2, '0') + 
                    now.getSeconds().toString().padStart(2, '0')
    return `${dateStr}${timeStr}`
  }

  const handlePrint = async (orderData: OrderData) => {

    // Create transaction data
    const transactionData = {
      _id: orderData._id || '12345',
      employee: session?.user?.username || "employee",
      items: cart.map(entry => ({
        name: entry.item.name,
        quantity: entry.quantity,
        variantLabel: entry.variantLabel,
        total: (entry.item.price + (entry.variantPrice || 0)) * entry.quantity,
        unitPrice: entry.item.price + (entry.variantPrice || 0)
      })),
      subtotal,
      total,
      orderOption: orderType,
      paymentMethod,
      cashReceived: paymentMethod === 'cash' ? cashReceived : 0,
      transactionId: generateTransactionId(),
      date: new Date().toLocaleDateString('id-ID'),
      time: new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})
    };

    // Generate invoice HTML content
    const invoiceContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            @page {
              size: 58mm auto;
              margin: 0;
            }
            body {
              font-family: monospace;
              font-size: 14px;
              width: 58mm;
              margin: 0 auto;
              padding: 0 25px;
            }

            .header {
              text-align: center;
              padding: 5px 10px;
            }
            .logo-title {
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .logo-title img {
              width: 36px;
              height: 36px;
            }

            .info-container{
              display: flex;
              padding: 5px 5px 5px 0;
              border-top: 1px dashed #000;
              border-bottom: 1px dashed #000;
            }
            .server-list{
              margin-top: 20px;
            }
            .info-row {
              width: fit-content;
              display: flex;
            }
            .info-row-2 {
              width: fit-content;
            }
            .info-semicolon{
              padding: 0 3px;
            }
            .customer-name{
              text-transform: capitalize;
            }

            .item-container{
              padding: 5px 5px 5px 0;
            }
            .item-row {
              width: fit-content;
              display: flex;
              justify-content: space-between;
              text-transform: capitalize;
            }
            .item-price {
              width: 100%;
              display: flex;
              padding: 0 5px 0 0;
              justify-content: space-between;
              margin-left: 5px;
              margin-bottom: 2px;
            }

            .total-section {
              padding: 5px 0;
              border-top: 1px dashed #000;
              border-bottom: 1px dashed #000;
            }
            .total-row{
              width: 100%;
              display: flex;
              justify-content: space-between;
            }
            .bold {
              font-weight: bold;
            }
            .text-center {
              text-align: center;
            }
            .footer {
              margin-top: 10px;
              text-align: center;
            }

            .print-btn{
              margin-top: 20px;
              width: 100%;
              background-color: #ffffff;
              border: 1px solid rgb(209, 213, 219);
              border-radius: 0.5rem;
              color: #111827;
              font-size: 0.875rem;
              font-weight: 600;
              line-height: 1.25rem;
              padding: 0.75rem 1rem;
              text-align: center;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo-title">
              <img 
                src="/images/invoice_logo.png" 
                alt="logo"
                width="36"
                height="36"
                style="max-width: 36px; max-height: 36px; margin-right: 6px;"
              />
            </div>
            <div>WETGOS</div>
            <div>Jl. Urip Sumoharjo No.4, Bejen, Bantul, Kec. Bantul, Kabupaten Bantul</div>
            <div>Daerah Istimewa Yogyakarta</div>
          </div>
          
          <div class='info-container'>
            <div class="info-row">
              <div>
                <div>Tanggal</div>
                <div>Kasir</div>
                <div>No Trx</div>
                <div>Metode</div>
                <div>Pesanan</div>
                <div>Pemesan</div>
              </div>
              <div>
                <div class="info-semicolon">:</div>
                <div class="info-semicolon">:</div>
                <div class="info-semicolon">:</div>
                <div class="info-semicolon">:</div>
                <div class="info-semicolon">:</div>
                <div class="info-semicolon">:</div>
              </div>
            </div>
            <div class="info-row-2">
              <div>${transactionData.date} ${transactionData.time}</div>
              <div>${transactionData.employee}</div>
              <div>${transactionData.transactionId}</div>
              <div>${transactionData.paymentMethod === 'cash' ? 'CASH' : 'QRIS'}</div>
              <div>${transactionData.orderOption === 'dine-in' ? 'Dine In' : 'Take Away'}</div>
              <div class="customer-name">${customerName || "-"}</div>
            </div>
          </div>
          
          <div class='item-container'>
            ${transactionData.items.map(item => `
              <div class="item-row">
                <span>${item.name}</span>
              </div>
              <div class="item-row">
                <span>${item.variantLabel}</span>
              </div>
              <div class="item-price">
                ${item.quantity} x ${formatPrice(item.unitPrice)}
                <span>${formatPrice(item.total)}</span>
              </div>
            `).join('')}
          </div>
          
          <div class="total-section">
            <div class="total-row bold">
              <span>Total</span>
              <span>Rp ${formatPrice(transactionData.total)}</span>
            </div>
          </div>
          
          ${transactionData.paymentMethod === 'cash' ? `
            <div class="total-section">
              <div class="total-row">
                <span>Tunai</span>
                <span>Rp ${formatPrice(transactionData.cashReceived)}</span>
              </div>
              <div class="total-row bold">
                <span>Kembalian</span>
                <span>Rp ${formatPrice(transactionData.cashReceived - transactionData.total)}</span>
              </div>
            </div>
          ` : ''}
          
          <div class="footer">
            <div class="footer-row">
              Instagram/Tiktok
            </div>
            <div class="footer-row">
              @wetgos
            </div>
            <div class="footer-row">
              Wi-fi Password : wetgosraharja
            </div>
            <div class="footer-row">
              ** Terima Kasih **
            </div>
          </div>

          <div class='info-container server-list'>
            <div class="info-row">
              <div>
                <div>Tanggal</div>
                <div>No Trx</div>
                <div>Metode</div>
                <div>Pemesan</div>
              </div>
              <div>
                <div class="info-semicolon">:</div>
                <div class="info-semicolon">:</div>
                <div class="info-semicolon">:</div>
                <div class="info-semicolon">:</div>
              </div>
            </div>
            <div class="info-row-2">
              <div>${transactionData.date} ${transactionData.time}</div>
              <div>${transactionData.transactionId}</div>
              <div>${transactionData.orderOption === 'dine-in' ? 'Dine In' : 'Take Away'}</div>
              <div class="customer-name">${customerName || "-"}</div>
            </div>
          </div>

          <div class='item-container'>
            ${transactionData.items.map(item => `
              <div class="item-info">
                <span>${item.name}</span>
              </div>
              <div class="item-info">
                <span>${item.variantLabel}</span>
              </div>
              <div class="item-info">
                <span>x ${item.quantity}</span>
              </div>
            `).join('')}
          </div>
          
          <div class="timestamp">
            Printed at: ${new Date().toLocaleString()}
          </div>

          
          <button class="print-btn" onclick="window.print()">WETGOS</button>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(invoiceContent);
      printWindow.document.close();
    }
  };

  const handleConfirmOrder = async () => {
    setIsPrinting(true);
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
        total,
        orderOption: orderType,
        paymentMethod,
        cashReceived: paymentMethod === 'cash' ? cashReceived : 0,
        transactionId: generateTransactionId()
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

      handlePrint(savedOrder)

      clearCart()
      onClose()
      setIsPrinting(false);
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
          <ScrollArea className="space-y-4 h-fit max-h-48">
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

          <div className="flex">
            <div className="w-[50%]">
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

            <div className="w-[50%]">
              <p className="font-semibold mb-2">Payment Method</p>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(val) => {
                  setPaymentMethod(val as 'cash' | 'qris')
                  if (val === 'qris') setCashReceived(total)
                }}
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
          </div>

          <div>
            <label className="text-sm font-medium">Customer Name</label>
            <Input
              type="text"
              value={customerName || ""}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Optional"
            />
          </div>

          {paymentMethod === 'cash' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Cash Received</label>
              <Input
                type="number"
                value={cashReceived || ''}
                onChange={(e) => setCashReceived(Number(e.target.value))}
                min={total}
                placeholder="0"
              />
              {cashReceived > 0 && cashReceived < total && (
                <p className="text-red-500 text-sm">Cash received is less than total amount</p>
              )}
            </div>
          )}

          <div className="pt-4 space-y-2 text-sm">
            {/* <div className="flex justify-between text-zinc-600">
              <span>Subtotal</span>
              <span>Rp {formatPrice(subtotal)}</span>
            </div> */}
            {/* <div className="flex justify-between text-zinc-500">
              <span>Pajak (11%)</span>
              <span>Rp {formatPrice(tax)}</span>
            </div> */}
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Total</span>
              <span>Rp {formatPrice(total)}</span>
            </div>
            {paymentMethod === 'cash' && cashReceived > 0 && (
              <>
                <div className="flex justify-between pt-2">
                  <span>Tunai</span>
                  <span>Rp {formatPrice(cashReceived)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Kembalian</span>
                  <span>Rp {formatPrice(cashReceived - total)}</span>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button 
              disabled={cart.length === 0 || isPrinting || (paymentMethod === 'cash' && cashReceived < total)}
              onClick={handleConfirmOrder}
            >
              {isPrinting ? 'Printing...' : 'Confirm Order'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CheckoutModal