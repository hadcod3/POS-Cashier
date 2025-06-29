import { NextResponse } from "next/server"
import { startOfDay, subDays, format, addDays } from "date-fns"
import { connectToDatabase } from "@/lib/database"
import Order from "@/lib/database/models/order.model"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const range = searchParams.get("range") || "90d"

  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90

  const fromDate = subDays(startOfDay(new Date()), days - 1) // inclusive start
  const toDate = new Date() // full day up to now

  await connectToDatabase()

  const orders = await Order.find({
    createdAt: { $gte: fromDate, $lte: toDate },
  })

  const dailyMap: Record<string, { orders: number; revenue: number }> = {}

  for (const order of orders) {
    const dateStr = format(new Date(order.createdAt), "yyyy-MM-dd")
    if (!dailyMap[dateStr]) {
      dailyMap[dateStr] = { orders: 0, revenue: 0 }
    }
    dailyMap[dateStr].orders += 1
    dailyMap[dateStr].revenue += order.total || 0
  }

  // Ensure filler dates exist in case there are days with no data
  const result: { date: string; orders: number; revenue: number }[] = []
  for (let i = 0; i < days; i++) {
    const date = addDays(fromDate, i)
    const dateStr = format(date, "yyyy-MM-dd")
    const data = dailyMap[dateStr] || { orders: 0, revenue: 0 }
    result.push({ date: dateStr, ...data })
  }

  return NextResponse.json(result)
}
