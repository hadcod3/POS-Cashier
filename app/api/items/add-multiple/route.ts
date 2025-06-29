
import { connectToDatabase } from '@/lib/database';
import { Item } from "@/lib/database/models/item.model";
import { NextResponse } from "next/server";

// POST: Add multiple items
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const items = await req.json();
    const createdItems = await Item.insertMany(items);
    return NextResponse.json(createdItems, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to create items", error }, { status: 500 });
  }
}
