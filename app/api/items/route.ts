import { connectToDatabase } from '@/lib/database';
import { Item } from '@/lib/database/models/item.model';
import { NextResponse } from 'next/server';

// GET: Get all items
export async function GET() {
  try {
    await connectToDatabase();
    const items = await Item.find();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch items", error }, { status: 500 });
  }
}

// POST: Add single item
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const newItem = await Item.create(body);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to create item", error }, { status: 500 });
  }
}
