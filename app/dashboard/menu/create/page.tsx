
import { MenuForm } from "@/components/reusable/MenuForm";

const CreateItemPage = async () => {

  return (
    <section className="p-4">
      <div>
        <h3 className='text-xl font-semibold'>Create Menu Item</h3>
      </div>

      <div className="wrapper mt-4">
        <MenuForm typeForm="Create" />
      </div>
    </section>
  )
}

export default CreateItemPage;