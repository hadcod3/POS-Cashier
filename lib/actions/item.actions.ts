'use server'
import { connectToDatabase } from "@/lib/database"
import { Item } from "../database/models/item.model"
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
    const item = await Item.findById(itemId).populate('category')

    if (!item) {
      return {
        data: null,
        message: "Item not found",
      };
    }

    return JSON.parse(JSON.stringify(item))
  } catch (error) {
    console.error("Error fetching item by ID:", error);
    throw new Error("Failed to fetch item by ID");
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
