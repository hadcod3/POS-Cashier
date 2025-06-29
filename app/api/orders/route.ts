import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import Order from '@/lib/database/models/order.model'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("Incoming order:", body)

    const newOrder = new Order(body)
    await newOrder.save()

    return new Response(JSON.stringify({ success: true }), { status: 201 })
  } catch (err) {
    console.error("Order saving failed:", err)
    return new Response(JSON.stringify({ error: "Failed to save order" }), { status: 500 })
  }
}

export async function GET() {
  try {
    await connectToDatabase()

    const orders = await Order.find().sort({ createdAt: -1 }) // newest first

    return NextResponse.json(orders, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    await connectToDatabase();

    await Order.deleteMany({});

    return new Response(JSON.stringify({ message: 'All orders deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('DELETE /api/orders error:', error);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}

