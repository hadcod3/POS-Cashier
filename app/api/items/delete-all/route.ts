import { connectToDatabase } from '@/lib/database';
import { Item } from "@/lib/database/models/item.model";
import { handleError } from '@/lib/utils';

export async function DELETE() {
  try {
    await connectToDatabase();

    await Item.deleteMany({});

    return new Response(JSON.stringify({ message: 'All items deleted successfully' }), { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
