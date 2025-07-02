import { connectToDatabase } from '@/lib/database';
import ItemCategory from '@/lib/database/models/category.model';
import { IItem, Item } from '@/lib/database/models/item.model';
import { Query } from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { NextResponse } from 'next/server';

const populateItem = (query: Query<HydratedDocument<IItem>[], HydratedDocument<IItem>>) => {
  return query
  .populate({ path: 'category', model: ItemCategory, select: '_id' })
}
// GET: Get all items
export async function GET() {
  try {
    await connectToDatabase();
    const items = await populateItem(Item.find());
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
