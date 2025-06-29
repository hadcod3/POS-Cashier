'use client'

import { IItem } from '@/lib/database/models/item.model'
import { formatPrice } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { SquarePen } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import { useCartModal } from './CartModalContext' 
import Image from 'next/image'

interface MenuCardProps {
  data: IItem
  editable?: boolean
}

const MenuCard = ({ data, editable }: MenuCardProps) => {
  const router = useRouter()
  const { openModal } = useCartModal()

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/dashboard/menu/${data._id}/update`)
  }

  const handleClick = () => {
    router.push(`/dashboard/menu/${data._id}`)
  }

  const handleAdd = () => {
    openModal(data) 
  }

  return (
    <div
      onClick={() => (editable ? handleClick() : handleAdd())}
      key={data._id}
      className="relative flex-auto w-40 max-w-48 aspect-7/8 overflow-hidden rounded-xl p-2 bg-zinc-100 hover:bg-zinc-200 transition-all"
    >
      {editable && (
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-3 right-3 z-50 bg-zinc-100/90 rounded-md"
          onClick={handleEdit}
        >
          <SquarePen className="w-4 h-4 text-blue-700" />
        </Button>
      )}

      <Image
        src={data.imgUrl}
        alt="thumb-menu"
        width={1000}
        height={1000}
        className="aspect-4/3 rounded-md object-center object-cover"
      />
      <div className="flex flex-col justify-between mt-2 gap-1">
        <p className="text-md leading-5 line-clamp-1 text-zinc-700 capitalize">{data.name}</p>
        <p className="text-lg font-semibold line-clamp-1 text-zinc-950">Rp {formatPrice(data.price)}</p>
      </div>
    </div>
  )
}

export default MenuCard
