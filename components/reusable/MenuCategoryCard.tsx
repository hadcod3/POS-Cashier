import React from 'react'
import { IconType } from 'react-icons'
import { Button } from '../ui/button'
import { 
    ChefHat,
    Coffee,
    Martini,
    Croissant,
    Utensils
} from 'lucide-react';
import { IItemCategory } from '@/lib/database/models/category.model';
import { IItem } from '@/lib/database/models/item.model';

type IconComponentsType = {
  [key: string]: IconType;
}

const iconComponents: IconComponentsType = {
    ChefHat,
    Coffee,
    Martini,
    Croissant,
    Utensils
};

interface MenuCategoryCardProps {
  data: IItemCategory
  allItems?: IItem[]
  isActive?: boolean;
  onClick?: () => void;
}

const MenuCategoryCard = ({data, allItems= [], isActive, onClick} : MenuCategoryCardProps) => {
  const Icon = iconComponents[data.icon];

  const isAllCategory = data._id === '685281b814dee1ddd0b40072';

  const itemCount = isAllCategory
  ? allItems?.filter(item => item.stock === true).length ?? 0
  : allItems?.filter(item => item.category && item.category._id === data._id && item.stock === true).length ?? 0;
  
   return (
    <Button
      key={data._id}
      onClick={onClick}
      className={`flex flex-col items-start justify-between aspect-square h-28 rounded-lg p-2 transition-all
        ${isActive 
          ? 'bg-zinc-200 border-zinc-300 hover:bg-zinc-200' 
          : 'bg-zinc-100 hover:bg-zinc-200 border-transparent hover:border-zinc-300'
        } border`}
    >
      <div className={`p-2 rounded-full aspect-square w-fit transition-all
        ${isActive ? 'bg-zinc-600' : 'bg-zinc-50'}`}>
        {Icon ? <Icon className={`${isActive ? 'text-zinc-50' : 'text-zinc-500'}`}/> : <ChefHat className={`${isActive ? 'text-zinc-50' : 'text-zinc-500'}`}/>}
      </div>
      <p className="capitalize text-sm text-zinc-900">{data.name}</p>
      <p className={`text-xs ${isActive ? 'text-zinc-600' : 'text-zinc-600'}`}>
        {itemCount} item{itemCount !== 1 || 0 ? 's' : ''}
      </p>
    </Button>
  )
}

export default MenuCategoryCard