'use client'

import { useEffect, useState } from 'react'
import { IItem } from '@/lib/database/models/item.model'
import { MenuForm } from '@/components/reusable/MenuForm'
import { useParams } from 'next/navigation'
import Loading from '@/components/reusable/Loading'
import { getItemById } from '@/lib/actions/item.actions'

const UpdateMenu = () => {
  const { id } = useParams()
  const [item, setItem] = useState<IItem>()
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

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

  if (loading) return <Loading/>
  if (error) return <div className="p-4 text-red-500">{error}</div>
  if (!item) return <div className="p-4">No item data</div>

  return (
    <section className="p-4">
      <h1 className="text-xl font-semibold mb-4">Edit Item</h1>
      <MenuForm typeForm="Update" data={item} />
    </section>
  )
}

export default UpdateMenu
