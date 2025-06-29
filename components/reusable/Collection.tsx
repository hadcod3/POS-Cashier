'use client';

import { IItemCategory } from '@/lib/database/models/category.model';
import { IItem } from '@/lib/database/models/item.model';
import React from 'react';
import MenuCategoryCard from './MenuCategoryCard';
import MenuCard from './MenuCard';

interface CollectionProps {
  data: IItem[] | IItemCategory[];
  allItems?: IItem[];
  emptyTitle: string;
  emptyStateSubtext: string;
  collectionType?: 'Item' | 'Category';
  activeCategoryId?: string;
  onSelect?: (categoryId: string) => void;
  editable?: boolean;
}

const Collection = ({
  data,
  allItems,
  emptyTitle,
  emptyStateSubtext,
  collectionType,
  activeCategoryId,
  onSelect,
  editable
}: CollectionProps) => {
  
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-lg font-semibold">{emptyTitle}</h2>
        <p className="text-sm text-gray-500">{emptyStateSubtext}</p>
      </div>
    );
  }

  if (collectionType === 'Item') {
    return (
      <div className="flex flex-wrap gap-4 justify-start">
        {Array.isArray(data) ? (
          data as IItem[])
          .filter((item) => editable || item.stock)
          .map((item) => (
            <MenuCard key={item._id} data={item} editable={editable}/>
          )
        ) : (
          <p>No items found or data is invalid</p>
        )}
      </div>
    );
  }

  return (
    <div className='flex gap-4 overflow-x-scroll overflow-y-hidden py-4 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
      {(data as IItemCategory[]).map((category) => (
        <MenuCategoryCard
          key={category._id}
          data={category}
          allItems={allItems}
          isActive={activeCategoryId === category._id}
          onClick={() => onSelect?.(category._id)}
        />
      ))}
    </div>
  );
};

export default Collection;
