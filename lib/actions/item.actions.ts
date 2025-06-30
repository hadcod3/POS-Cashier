'use server'
import { connectToDatabase } from "@/lib/database"
import { IItem, Item } from "../database/models/item.model"
import { CreateItemParams } from "@/types"
import { handleError } from "../utils"
import { revalidatePath } from "next/cache";

interface DeleteItemParams {
  id: string;
  path: string;
}

// CREATE ITEM
export const createItem = async (itemData: CreateItemParams) => {
  try {
    await connectToDatabase()
    const newItem = await Item.create(itemData)
    return JSON.parse(JSON.stringify(newItem))
  } catch (error) {
    console.error("Error creating item:", error)
    throw error
  }
}

// GET ITEM BY ID
export async function getItemById(itemId: string) {
  try {
    await connectToDatabase();
    
    const item = await Item.findById(itemId)
      .populate({
        path: 'category',
      })
      .lean<IItem>() 
      .exec();

    if (!item) {
      throw new Error('Item not found');
    }

    return item;

  } catch (error) {
    console.error("Error in getItemById:", error);
    
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Failed to fetch item'
    );
  }
}


// DELETE AN ITEM
export const deleteItem = async ({ id, path }: DeleteItemParams) => {
  try {
    await connectToDatabase()
    const deletedItem = await Item.findByIdAndDelete(id)
    if (!deletedItem) {
      return {
        data: null,
        message: "Item not found and can't delete",
      }
    }
    if (deletedItem) revalidatePath(path)
  } catch (error) {
    handleError(error)
  }
}
