"use client"

import { useEffect, useState } from "react"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPrice } from "@/lib/utils"

interface Order {
  total: number
  createdAt: string
  paymentMethod: string
  items: { name: string; quantity: number }[] 
}

export function SectionCards() {
  const [loading, setLoading] = useState(true)

  const [thisMonthRevenue, setThisMonthRevenue] = useState(0)
  const [revenueGrowth, setRevenueGrowth] = useState(0)
  const [revenueUp, setRevenueUp] = useState(true)

  const [thisMonthOrders, setThisMonthOrders] = useState(0)
  const [orderGrowth, setOrderGrowth] = useState(0)
  const [orderUp, setOrderUp] = useState(true)

  const [topPaymentMethod, setTopPaymentMethod] = useState<{
    method: string
    count: number
  } | null>(null)

  const [bestSeller, setBestSeller] = useState<{
    name: string
    total: number
  } | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders")
        const orders: Order[] = await res.json()

        const now = new Date()
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
        const lastYear = currentMonth === 0 ? currentYear - 1 : currentYear

        let thisMonthRev = 0,
          lastMonthRev = 0,
          thisMonthCount = 0,
          lastMonthCount = 0

        const paymentCounts: Record<string, number> = {}
        const itemCounts: Record<string, { name: string; total: number }> = {}

        for (const order of orders) {
          const date = new Date(order.createdAt)
          const month = date.getMonth()
          const year = date.getFullYear()

          if (month === currentMonth && year === currentYear) {
            thisMonthRev += order.total || 0
            thisMonthCount += 1
          } else if (month === lastMonth && year === lastYear) {
            lastMonthRev += order.total || 0
            lastMonthCount += 1
          }

          const method = order.paymentMethod || "unknown"
          paymentCounts[method] = (paymentCounts[method] || 0) + 1

          order.items?.forEach(({ name, quantity }) => {
            if (!itemCounts[name]) itemCounts[name] = { name, total: 0 }
            itemCounts[name].total += quantity
          })
        }

        // Revenue
        setThisMonthRevenue(thisMonthRev)
        const revDiff = thisMonthRev - lastMonthRev
        const revPercent = lastMonthRev === 0 ? 100 : (revDiff / lastMonthRev) * 100
        setRevenueGrowth(Math.abs(+revPercent.toFixed(1)))
        setRevenueUp(revDiff >= 0)

        // Orders
        setThisMonthOrders(thisMonthCount)
        const orderDiff = thisMonthCount - lastMonthCount
        const orderPercent = lastMonthCount === 0 ? 100 : (orderDiff / lastMonthCount) * 100
        setOrderGrowth(Math.abs(+orderPercent.toFixed(1)))
        setOrderUp(orderDiff >= 0)

        // Payment Method
        const cashCount = paymentCounts["cash"] || 0
        const qrisCount = paymentCounts["qris"] || 0
        const totalPay = cashCount + qrisCount

        let topMethod = "cash"
        let diffPercent = 0

        if (cashCount > qrisCount) {
          topMethod = "cash"
          diffPercent = ((cashCount - qrisCount) / totalPay) * 100
        } else if (qrisCount > cashCount) {
          topMethod = "qris"
          diffPercent = ((qrisCount - cashCount) / totalPay) * 100
        } else {
          topMethod = "equal"
          diffPercent = 0
        }

        setTopPaymentMethod({
          method: topMethod,
          count: Math.round(diffPercent),
        })

        // Best Seller
        const best = Object.values(itemCounts).reduce(
          (a, b) => (a.total > b.total ? a : b),
          { name: "", total: 0 }
        )
        setBestSeller(best.name ? best : null)
      } catch (err) {
        console.error("Failed to fetch orders:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Revenue */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Revenue (Rp)</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? <Skeleton className="h-6 w-28" /> : formatPrice(thisMonthRevenue)}
          </CardTitle>
          <CardAction>
            {loading ? (
              <Skeleton className="h-6 w-16 rounded-full" />
            ) : (
              <Badge variant={"outline"}>
                {revenueUp ? <IconTrendingUp className="mr-1 size-4 text-green-500" /> : <IconTrendingDown className="mr-1 size-4 text-red-500" />}
                {revenueGrowth}%
              </Badge>
            )}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Monthly performance{" "}
            {loading ? <Skeleton className="h-4 w-4 rounded-full" /> : revenueUp ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">Based on this month’s order total</div>
        </CardFooter>
      </Card>

      {/* Orders */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Orders</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? <Skeleton className="h-6 w-12" /> : thisMonthOrders}
          </CardTitle>
          <CardAction>
            {loading ? (
              <Skeleton className="h-6 w-16 rounded-full" />
            ) : (
              <Badge variant={"outline"}>
                {orderUp ? <IconTrendingUp className="mr-1 size-4 text-green-500" /> : <IconTrendingDown className="mr-1 size-4 text-red-500" />}
                {orderGrowth}%
              </Badge>
            )}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Compared to last month{" "}
            {loading ? <Skeleton className="h-4 w-4 rounded-full" /> : orderUp ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">Total confirmed orders</div>
        </CardFooter>
      </Card>

      {/* Payment Method */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Payment Method</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl capitalize">
            {loading ? <Skeleton className="h-6 w-24" /> : topPaymentMethod?.method || "No Data"}
          </CardTitle>
          <CardAction>
            {loading ? (
              <Skeleton className="h-6 w-20 rounded-full" />
            ) : (
              <Badge variant="outline">
                {topPaymentMethod?.method !== "equal"
                  ? `+${topPaymentMethod?.count ?? 0}%`
                  : "Cash & QRIS Equal"}
              </Badge>
            )}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">Most frequent payment method</div>
          <div className="text-muted-foreground">Based on full order history</div>
        </CardFooter>
      </Card>

      {/* Best Seller */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Best Seller</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? <Skeleton className="h-6 w-28" /> : bestSeller?.name || "No Data"}
          </CardTitle>
          <CardAction>
            {loading ? (
              <Skeleton className="h-6 w-14 rounded-full" />
            ) : (
              <Badge variant="outline">{bestSeller?.total ?? 0} sold</Badge>
            )}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">Top selling menu</div>
          <div className="text-muted-foreground">Based on order history</div>
        </CardFooter>
      </Card>
    </div>
  )
}
