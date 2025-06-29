"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import useSWR from "swr"
import Loading from "./reusable/Loading"

interface DailyData {
  date: string
  orders: number
  revenue: number
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState<"7d" | "30d" | "90d">("90d")
  const [chartType, setChartType] = React.useState<"orders" | "revenue" | "all">("all")

  React.useEffect(() => {
    if (isMobile) setTimeRange("7d")
  }, [isMobile])

  const { data, error } = useSWR<DailyData[]>(
    `/api/orders/daily?range=${timeRange}`,
    fetcher
  )

  const chartData: DailyData[] = data || []

  const config: ChartConfig = {
    orders: { label: "Orders", color: "#3b82f6" },
    revenue: { label: "Revenue", color: "#10b981" },
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>
          {chartType === "orders" ? "Daily Orders" : "Daily Revenue"}
        </CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">Data for selected range</span>
          <span className="@[540px]/card:hidden">Select range</span>
        </CardDescription>
        <CardAction className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={(val) => setTimeRange(val as "7d" | "30d" | "90d")}
              variant="outline"
              className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
            >
              <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
              <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
              <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
            </ToggleGroup>
            <Select
              value={timeRange}
              onValueChange={(val) => {
                if (["7d", "30d", "90d"].includes(val)) {
                  setTimeRange(val as "7d" | "30d" | "90d")
                }
              }}
            >
              <SelectTrigger size="sm" className="w-40 @[767px]/card:hidden">
                <SelectValue placeholder="Last 90 Days" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="90d">Last 90 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <ToggleGroup
              type="single"
              value={chartType}
              onValueChange={(val) => {
                if (val === "orders" || val === "revenue" || val === "all") {
                  setChartType(val)
                }
              }}
              variant="outline"
              className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
            >
              <ToggleGroupItem value="all">All</ToggleGroupItem>
              <ToggleGroupItem value="orders">Orders</ToggleGroupItem>
              <ToggleGroupItem value="revenue">Revenue</ToggleGroupItem>
            </ToggleGroup>
            <Select
              value={chartType}
              onValueChange={(val) => {
                if (val === "orders" || val === "revenue" || val === "all") {
                  setChartType(val)
                }
              }}
            >
              <SelectTrigger size="sm" className="w-40 @[767px]/card:hidden">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="orders">Orders</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {error ? (
          <div className="text-center text-red-500">Failed to load chart data.</div>
        ) : !data ? (
          <div className="h-[250px] flex items-center justify-center">
            <Loading />
          </div>
        ) : (
          <ChartContainer config={config} className="h-[250px] w-full">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={config.orders.color} stopOpacity={0.7} />
                  <stop offset="95%" stopColor={config.orders.color} stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={config.revenue.color} stopOpacity={0.7} />
                  <stop offset="95%" stopColor={config.revenue.color} stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => {
                  const d = new Date(val)
                  return d.toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })
                }}
                minTickGap={20}
              />

              <ChartTooltip
                cursor={true}
                content={
                  <ChartTooltipContent
                    labelFormatter={(val) => {
                      const d = new Date(val!)
                      return d.toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }}
                    indicator="dot"
                  />
                }
              />

              {(chartType === "orders" || chartType === "all") && (
                <Area
                  dataKey="orders"
                  type="natural"
                  fill="url(#fillOrders)"
                  stroke={config.orders.color}
                  strokeWidth={2}
                />
              )}

              {(chartType === "revenue" || chartType === "all") && (
                <Area
                  dataKey="revenue"
                  type="natural"
                  fill="url(#fillRevenue)"
                  stroke={config.revenue.color}
                  strokeWidth={2}
                />
              )}
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
