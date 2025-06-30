import { getItemById } from '@/lib/actions/item.actions';
import { connectToDatabase } from '@/lib/database';
import { Item } from '@/lib/database/models/item.model';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ message: "_id is required" }, { status: 400 });
    }

    await connectToDatabase();

    const item = await Item.findByIdAndUpdate(
      _id,
      { ...updateData },
      { new: true, runValidators: true }
    ).populate("category");

    if (!item) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Item updated", item });
  } catch (error) {
    console.error("Failed to update item:", error);
    return NextResponse.json(
      { message: "Failed to update item", error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const item = await getItemById(params.id);

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch item' },
      { status: 500 }
    );
  }
}