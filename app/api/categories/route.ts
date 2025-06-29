import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import { handleError } from '@/lib/utils';
import ItemCategory from '@/lib/database/models/category.model';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const categories = await req.json();
    
    if (!Array.isArray(categories)) {
      return NextResponse.json(
        { error: 'Expected an array of categories' },
        { status: 400 }
      );
    }
    
    const createdCategories = await ItemCategory.insertMany(categories);
    
    return NextResponse.json(createdCategories, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await ItemCategory.find();

    if (!categories || categories.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No categories found' }), 
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(categories), { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}