'use client'

import Collection from '@/components/reusable/Collection'
import { SearchBar } from '@/components/reusable/SearchBar'
import { IItem } from '@/lib/database/models/item.model'
import useSWR from 'swr'
import { useDebounce } from '@/hooks/useDebounce'
import { useMemo, useState } from 'react'
import Loading from '@/components/reusable/Loading'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data')
    throw error
  }
  return res.json()
}

const MenuPage = () => {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 400)

  const searchUrl = useMemo(() => {
    return debouncedQuery.trim()
      ? `/api/items/search?name=${encodeURIComponent(debouncedQuery)}`
      : '/api/items'
  }, [debouncedQuery])

  const { 
    data: items = [],
    isLoading, 
    isValidating 
  } = useSWR<IItem[]>(searchUrl, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  })

  const filteredItems = useMemo(() => {
    return items?.filter(item => item.stock === true) || []
  }, [items])

  const handleSearchChange = (value: string) => {
    setQuery(value)
  }

  const showLoading = isLoading || isValidating
  return (
    <section className="p-4">
      <div className="flex flex-col w-full gap-2">
        <SearchBar
          placeholder="Find products..."
          onSearch={handleSearchChange}
          buttonVariant="default"
        />
        
        {showLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loading />
          </div>
        ) : (
          <Collection
            data={filteredItems}
            emptyTitle={query ? "No matching items found" : "No items available"}
            emptyStateSubtext={query ? "Try a different search term" : "Please check back later"}
            collectionType="Item"
            editable={true}
          />
        )}
      </div>
    </section>
  )
}

export default MenuPage
