'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import { IItem } from '@/lib/database/models/item.model'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SquarePen, Trash } from 'lucide-react'
import { deleteItem, getItemById } from '@/lib/actions/item.actions'
import Loading from '@/components/reusable/Loading'

interface VariantOption {
  label: string
  price: number
}
interface Variant {
  name: string
  options: VariantOption[]
}

const ItemDetails = () => {
  const router = useRouter()
  const { id } = useParams()
  const [item, setItem] = useState<IItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await getItemById(id as string)
        if (!data) throw new Error('Item not found')
        setItem(data)
      } catch (err) {
        console.log(err)
        setError('Failed to fetch item')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchItem()
  }, [id])

  const handleEdit = () => {
    router.push(`/dashboard/menu/${item?._id}/update`)
  }

  const handleDelete = async () => {
    await deleteItem({ 
      id: item?._id as string, 
      path: `/dashboard/menu`
    })
    router.push('/dashboard/menu')
  }

  if (loading) return <Loading />
  if (error || !item) return <div className="p-10 text-center text-red-500">Error: {error || 'Item not found'}</div>
  return (
    <div className="p-3">
      <div className="flex gap-4">
        <div className="flex flex-col w-56">
          <Image 
            src={item.imgUrl} 
            alt={item.name} 
            width={1000}
            height={1000}
            className="object-cover object-center w-full h-fit aspect-square rounded-xl overflow-hidden border shadow" 
          />
          <div className='flex flex-col gap-2 py-2'>
            <Button variant={"outline"} onClick={handleEdit}><SquarePen />Edit</Button>
            <Dialog>
              <form>
                <DialogTrigger asChild>
                  <Button className='w-full bg-destructive'><Trash />Delete</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. The item will be permanently removed.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" className='bg-destructive' onClick={handleDelete}>Delete</Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-md font-medium capitalize text-zinc-700">{item.category.name}</h1>
          <h1 className="text-3xl font-bold capitalize text-zinc-950">{item.name}</h1>
          <p className="text-xl font-semibold text-zinc-900">Rp {item.price.toLocaleString()}</p>
          <p className="text-md text-zinc-700">
            Min Order: {item.minOrder} | {item.stock ? 'In Stock' : 'Out of Stock'}
          </p>

          {Array.isArray(item.variants) && item.variants.length > 0 ? (
            <div>
              <h2 className="text-lg font-semibold mb-1">Variants</h2>
              <div className="space-y-3">
                {item.variants.map((variant: Variant, idx: number) => (
                  <div key={idx}>
                    <p className="font-medium">{variant.name}</p>
                    <ul className="ml-4 list-disc text-sm text-gray-700">
                      {variant.options.map((option: VariantOption, oidx: number) => (
                        <li key={oidx}>
                          {option.label} — Rp {option.price.toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="">
              <h2 className="text-lg font-semibold mb-1">No variants for this menu!</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ItemDetails
