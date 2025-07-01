import MenuDetails from '@/components/reusable/MenuDetails'
import { getItemById } from '@/lib/actions/item.actions'

const ItemDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params
    const item = await getItemById(id)

    if (!item) {
      throw new Error('Item not found')
    }

    return (
      <div className="p-3">
        <MenuDetails data={item} />
      </div>
    )
  } catch (error) {
    console.error('Error fetching item:', error)
    return (
      <div className="p-3 text-red-500">
        Error loading item details. Please try again.
      </div>
    )
  }
}

export default ItemDetails