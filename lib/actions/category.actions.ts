'use server'
import { connectToDatabase } from "@/lib/database"
import ItemCategory from "../database/models/category.model";

// GET ITEM BY ID
export async function getAllCategories() {
  try {
    await connectToDatabase();
    const categories = await ItemCategory.find();

    if (!categories || categories.length === 0) {
      return (
        JSON.stringify({ message: 'No categories found' })
      );
    }

    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error('Error fetching all items:', error);
    if (error instanceof Error) {
      console.error(error.stack); // Log detailed error stack for further insights
    }
    throw new Error('Failed to fetch all items');
  }
}