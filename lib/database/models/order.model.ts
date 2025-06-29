import { Schema, model, models } from 'mongoose'

const OrderItemSchema = new Schema({
  itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
  name: String,
  quantity: Number,
  basePrice: Number,
  variantLabel: String,
  variantPrice: Number,
  total: Number,
})

const OrderSchema = new Schema({
  employee: { type: String, required: true },
  items: [OrderItemSchema],
  orderOption: { type: String, enum: ['dine-in', 'take-away'], required: true },
  paymentMethod: { type: String, enum: ['cash', 'qris'], required: true },
  subtotal: Number,
  tax: Number,
  total: Number,
  createdAt: { type: Date, default: Date.now }
})

const Order = models.Order || model('Order', OrderSchema)
export default Order
