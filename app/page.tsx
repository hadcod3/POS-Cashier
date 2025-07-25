'use client'

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { SearchBar } from "@/components/reusable/SearchBar"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { IItemCategory } from "@/lib/database/models/category.model"
import Collection from "@/components/reusable/Collection"
import { IItem } from "@/lib/database/models/item.model"
import { useCart } from "@/components/reusable/CartContext"
import { formatPrice } from "@/lib/utils"
import CartModal from "@/components/reusable/CartModal"
import { useCartModal } from "@/components/reusable/CartModalContext"
import { Trash } from "lucide-react"
import CheckoutModal from "@/components/reusable/CheckoutModal"
import useSWR from 'swr'
import Loading from "@/components/reusable/Loading"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function Page() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState<boolean>(true)
  const [data, setData] = useState<IItem[]>([])
  const [filteredCategoryId, setFilteredCategoryId] = useState<string | undefined>("685281b814dee1ddd0b40072")
  const [searchQuery, setSearchQuery] = useState("")
  const [showCheckout, setShowCheckout] = useState(false)
  const { cart } = useCart()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in")
    }
    if (status === "authenticated" && !session?.user?.isAdmin) {
      setIsAdmin(false)
    }
  }, [status, router, session?.user?.isAdmin])

  const { data: categoriesData = [], isLoading: loadingCategories } = useSWR<IItemCategory[]>('/api/categories', fetcher, {
    dedupingInterval: 60000,
  })

  const { data: allItemsData = [], isLoading: loadingItems } = useSWR<IItem[]>('/api/items', fetcher, {
    dedupingInterval: 60000,
  })

  const handleSearch = async (query: string, categoryId?: string) => {
    try {
      const searchParams = new URLSearchParams()
      if (query) searchParams.set('name', query)
      if (categoryId && categoryId !== "685281b814dee1ddd0b40072") {
        searchParams.set('categoryId', categoryId)
      }

      const res = await fetch(`/api/items/search?${searchParams.toString()}`)

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to fetch items')
      }

      const items = await res.json()

      if (!Array.isArray(items)) {
        throw new Error('Invalid response format: expected array')
      }

      const filtered = items.filter((item: IItem) => item.stock === true)
      setData(filtered)
    } catch (err) {
      console.error("Search failed", err)
    }
  }

  useEffect(() => {
    if (!loadingItems) {
      const filtered = allItemsData.filter(item => item.stock === true)
      setData(filtered)
    }
  }, [allItemsData, loadingItems])

  useEffect(() => {
    handleSearch(searchQuery, filteredCategoryId)
  }, [searchQuery, filteredCategoryId])

  const { removeCartItem } = useCart()
  const { openModal } = useCartModal()

  const subtotal = cart.reduce((acc, i) => {
    const variantExtra = i.variantPrice || 0
    return acc + (i.item.price + variantExtra) * i.quantity
  }, 0)
  const total = subtotal

  const sortedCategories = [
    ...categoriesData.filter(cat => cat._id === "685281b814dee1ddd0b40072"),
    ...categoriesData.filter(cat => cat._id !== "685281b814dee1ddd0b40072"),
  ]

  if (loadingCategories || loadingItems) {
    return <Loading/>
  }

  return (
    <div>
      <SidebarProvider style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 16)"
      } as React.CSSProperties}>
        <CartModal />
        <AppSidebar variant="inset" isAdminNavBar={isAdmin} userData={session}/>
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col cursor-pointer">
            <div className="@container/main flex flex-1 flex-col gap-2 px-4">

              <Collection 
                data={sortedCategories}
                allItems={allItemsData}
                emptyTitle="Category not found"
                emptyStateSubtext="Try to add something"
                collectionType="Category"
                activeCategoryId={filteredCategoryId}
                onSelect={(categoryId) => {
                  setFilteredCategoryId(prev =>
                    prev === categoryId ? "685281b814dee1ddd0b40072" : categoryId
                  )
                }}
              />

              <div className="w-full">
                <SearchBar 
                  placeholder="Find products..."
                  onSearch={(query) => {
                    setSearchQuery(query)
                    handleSearch(query, filteredCategoryId)
                  }}
                  buttonVariant="default"
                  selectedCategoryId={filteredCategoryId}
                />
              </div>

              <Collection 
                data={data}
                emptyTitle="Item not found"
                emptyStateSubtext="Try to add something"
                collectionType="Item"
              />

            </div>
          </div>
        </SidebarInset>

        <div className="w-[320px]"/>

        <div className="fixed inset-y-0 right-2 z-10 w-[320px] pl-2 py-2">
          <div className="relative w-full h-full flex flex-col">
            <h1 className="text-xl min-h-14 md:h-fit md:text-2xl font-semibold border-b border-zinc-200 px-2 py-3 md:py-4 mb-3">Order Track</h1>
            <div className="h-full flex flex-col overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {cart.length > 0 ? (
                cart.map((entry, idx) => (
                  <div key={idx} onClick={() => openModal(entry.item, 'edit', idx)} className="relative flex gap-2 p-2 hover:bg-zinc-100 transition-all rounded-xl">
                    <Image width={1000} height={1000} src={entry.item.imgUrl} alt="cart_thumb" className="w-20 aspect-square object-cover rounded-md" />
                    <div className="flex-1">
                      <p className="font-semibold">{entry.item.name}</p>
                      <p className="text-sm text-zinc-600">Rp {(entry.item.price + (entry.variantPrice || 0)).toLocaleString()}</p>
                      {entry.variantLabel && (
                        <p className="text-xs text-zinc-500">{entry.variantLabel}</p>
                      )}
                      <p className="text-xs text-zinc-500">x {entry.quantity}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeCartItem(idx)
                        }}
                        className="h-full"
                      >
                        <Trash />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <h2 className="text-lg font-semibold">No Item</h2>
                  <p className="text-sm text-gray-500">Try to add something</p>
                </div>
              )}
            </div>

            <div className="w-full">
              {/* <div className="h-fit py-3">
                <div className="grid grid-cols-7 text-sm text-zinc-600">
                  <p className="col-span-4">Subtotal</p>
                  <p className="col-start-5 text-center">Rp</p>
                  <p className="col-span-2 col-start-6 text-end">{formatPrice(subtotal)}</p>
                </div>
                <div className="grid grid-cols-7 text-xs text-zinc-400">
                  <p className="col-span-4">Tax 11%</p>
                  <p className="col-start-5 text-center">Rp</p>
                  <p className="col-span-2 col-start-6 text-end">{formatPrice(tax)}</p>
                </div>
              </div> */}
              <div className="flex items-center justify-between py-3 border-t border-b border-dashed border-zinc-300">
                <p>Total</p>
                <p>Rp {formatPrice(total)}</p>
              </div>
              <div className="pt-2">
                <Button className="w-full" onClick={() => setShowCheckout(true)} disabled={cart.length === 0}>
                  Proceeding
                </Button>
              </div>
            </div>

          </div>
        </div>
      </SidebarProvider>
      <CheckoutModal open={showCheckout} onClose={() => setShowCheckout(false)} />
    </div>
  )
}
