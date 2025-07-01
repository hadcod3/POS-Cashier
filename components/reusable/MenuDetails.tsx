"use client"
import React from 'react'
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
import Image from 'next/image'
import { IItem } from '@/lib/database/models/item.model'
import { deleteItem } from '@/lib/actions/item.actions'
import { useRouter } from 'next/navigation'

type MenuDetailsProps = {
    data: IItem
}
interface VariantOption {
  label: string
  price: number
}
interface Variant {
  name: string
  options: VariantOption[]
}

const MenuDetails = ({data} : MenuDetailsProps) => {
  const router = useRouter()

  const handleEdit = () => {
    router.push(`/dashboard/menu/${data?._id}/update`)
  }

  const handleDelete = async () => {
    await deleteItem({ 
      id: data?._id as string, 
      path: `/dashboard/menu`
    })
    router.push('/dashboard/menu')
  }
  return (
    <div>
      <div className="flex gap-4">
        <div className="flex flex-col w-56">
          <Image 
            src={data.imgUrl} 
            alt={data.name} 
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
                      This action cannot be undone. The data will be permanently removed.
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
          <h1 className="text-md font-medium capitalize text-zinc-700">{data.category.name}</h1>
          <h1 className="text-3xl font-bold capitalize text-zinc-950">{data.name}</h1>
          <p className="text-xl font-semibold text-zinc-900">Rp {data.price.toLocaleString()}</p>
          <p className="text-md text-zinc-700">
            Min Order: {data.minOrder} | {data.stock ? 'In Stock' : 'Out of Stock'}
          </p>

          {Array.isArray(data.variants) && data.variants.length > 0 ? (
            <div>
              <h2 className="text-lg font-semibold mb-1">Variants</h2>
              <div className="space-y-3">
                {data.variants.map((variant: Variant, idx: number) => (
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

export default MenuDetails