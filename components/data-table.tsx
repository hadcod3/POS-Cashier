"use client"

import * as React from "react"
import useSWR from "swr"
import { format } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPrice } from "@/lib/utils"
import { Download, ChevronLeft, ChevronRight } from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
interface Order {
  _id: string
  employee: string
  total: number
  items: {
    name: string
    quantity: number
    total: number
  }[]
  orderOption: string
  createdAt: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function OrdersTablePage() {
  const { data, error, isLoading } = useSWR<Order[]>("/api/orders", fetcher)
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null)

  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(25)

  const startIdx = (page - 1) * perPage
  const paginatedData = data?.slice(startIdx, startIdx + perPage) || []
  const totalPages = data ? Math.ceil(data.length / perPage) : 1

  const exportToPDF = (orders: Order[]) => {
    const doc = new jsPDF()

    doc.setFontSize(16)
    doc.text("Order Report", 14, 15)

    autoTable(doc, {
      startY: 25,
      head: [["Order ID", "Employee", "Total", "Option", "Date"]],
      body: orders.map((order) => [
        order._id.slice(-6),
        order.employee,
        `Rp ${order.total.toLocaleString("id-ID")}`,
        order.orderOption,
        format(new Date(order.createdAt), "dd MMM yyyy"),
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [40, 40, 40] },
    })

    doc.save("orders_report.pdf")
  }

  const exportCSV = () => {
    if (!data) return
    const header = ["Order ID", "Employee", "Total", "Option", "Date"]
    const rows = data.map((o) => [
      o._id,
      o.employee,
      o.total,
      o.orderOption,
      format(new Date(o.createdAt), "dd MMM yyyy"),
    ])
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "orders.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col md:flex-row justify-between gap-4">
          <CardTitle>All Orders</CardTitle>
          <div className="flex items-center gap-2">
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value))
                setPage(1)
              }}
              className="h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 border"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="default">
                  <Download className="w-4 h-4 mr-2" /> Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={exportCSV}>Export as CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportToPDF(data || [])}>Export as PDF</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent>
          {error ? (
            <p className="text-red-500 text-sm">Failed to load orders.</p>
          ) : isLoading ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Option</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    {[...Array(5)].map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Option</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {order._id.slice(-6)}
                      </TableCell>
                      <TableCell>{order.employee}</TableCell>
                      <TableCell>
                        Rp {order.total.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="capitalize">
                        {order.orderOption}
                      </TableCell>
                      <TableCell>
                        {format(new Date(order.createdAt), "dd MMM yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-between items-center mt-4 text-sm">
                <span>
                  Page {page} of {totalPages}
                </span>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-2 text-sm">
              <div className="text-zinc-500">
                <p>
                  <span>ID :</span> <span>{selectedOrder._id}</span>
                </p>
                <p>
                  {format(new Date(selectedOrder.createdAt), "dd MMM yyyy, HH:mm")}
                </p>
                <p className="capitalize">{selectedOrder.orderOption}</p>
                <p>Accepted by : {selectedOrder.employee || "Employee"}</p>
              </div>
              <div className="py-2 border-t border-b border-dashed border-zinc-400">
                <span>Items :</span>
                <ul className="ml-4 list-disc">
                  {selectedOrder.items.map((item, idx) => (
                    <li key={idx}>
                      {item.name} × {item.quantity}
                      <br />
                      <span className="font-semibold">
                        Rp {formatPrice(item.total)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold">
                  <span>Total :</span> Rp {selectedOrder.total.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
