'use server'
import { connectToDatabase } from "@/lib/database"
import { handleError } from "../utils"
import User from "../database/models/user.model"

interface DeleteUserParams {
  id: string;
}

// DELETE AN USER
export const deleteUser = async ({ id }: DeleteUserParams) => {
  try {
    await connectToDatabase()
    const deletedUser = await User.findByIdAndDelete(id)
    if (!deletedUser) {
      return {
        data: null,
        message: "user not found and can't delete",
      }
    }
  } catch (error) {
    handleError(error)
  }
}
