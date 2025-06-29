'use client'

import Collection from '@/components/reusable/Collection'
import { SearchBar } from '@/components/reusable/SearchBar'
import { IItem } from '@/lib/database/models/item.model'
import useSWR from 'swr'
import { useDebounce } from '@/hooks/useDebounce'
import { useState } from 'react'
import Loading from '@/components/reusable/Loading'

const fetcher = (url: string) => fetch(url).then(res => res.json())

const MenuPage = () => {
  const [query, setQuery] = useState('')

  const debouncedQuery = useDebounce(query, 400)

  const { data: items, error, isLoading } = useSWR<IItem[]>(
    debouncedQuery.trim()
      ? `/api/items/search?name=${encodeURIComponent(debouncedQuery)}`
      : '/api/items',
    fetcher
  )

  if (isLoading) return <Loading/>

  return (
    <section className="p-4">
      <div className="flex flex-col w-full gap-2">
        <SearchBar
          placeholder="Find products..."
          onSearch={(val) => setQuery(val)}
          buttonVariant="default"
        />
        
        <Collection
          data={items || []}
          emptyTitle="Item not found"
          emptyStateSubtext="Try to add something"
          collectionType="Item"
          editable={true}
        />

        {error && (
          <div className="text-red-500 text-sm text-center mt-4">
            Failed to fetch items. Please try again.
          </div>
        )}
      </div>
    </section>
  )
}

export default MenuPage
