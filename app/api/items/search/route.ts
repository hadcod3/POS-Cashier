import { connectToDatabase } from '@/lib/database';
import { Item } from '@/lib/database/models/item.model';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name') || '';
    const categoryId = searchParams.get('categoryId');

    const filter: Record<string, unknown> = {};

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    if (categoryId) {
      filter.category = categoryId;
    }

    const items = await Item.find(filter).populate('category');

    return new Response(JSON.stringify(items), { status: 200 });
  } catch (error) {
    console.error('GET /api/items/search error:', error);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}
