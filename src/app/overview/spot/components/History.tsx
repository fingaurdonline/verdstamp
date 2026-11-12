"use client"
import { useQuery } from "convex/react"
import { api } from "@convex/_generated/api"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import useCryptoList from "@/hooks/useCryptoData"
import { CryptoCurrency } from "@/lib/types"
import Loader from "@/app/(landing)/components/Loader"
import NoData from "@/components/icons/NoData"
import Image from "next/image"
import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function HistoryTable() {
    const tradeData = useQuery(api.trading.trade_history)
    const data = tradeData ?? []
    const isLoading = tradeData === undefined
    const { data: crypto } = useCryptoList()
    const spot_trades = data?.filter((trade) => trade?.order === "spot") || []
    const [{ pageIndex, pageSize }, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
    })

    // setter that accepts either a number (1-based page) or an updater function
    const setPage = (val: number | ((prev: number) => number)) => {
        setPagination(prev => {
            const current = prev.pageIndex + 1
            const newPage = typeof val === "function" ? val(current) : val
            return { ...prev, pageIndex: Math.max(0, newPage - 1) }
        })
    }

    const setPageSize = (size: number) => {
        setPagination(prev => ({ ...prev, pageSize: size, pageIndex: 0 }))
    }

    // pagination driven from local state and spot_trades (no external "table" object)
    const total = spot_trades.length
    const totalPages = pageSize > 0 ? Math.max(1, Math.ceil(total / pageSize)) : 1

    // derive the current page and the slice of trades to display
    const currentPage = Math.max(1, pageIndex + 1)
    const paginatedTrades =
        pageSize >= total && total > 0
            ? spot_trades
            : spot_trades.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize)


    function dateFormat(date?: string) {
        if (!date) return "—";
        const datePart = date.split(".")[0];
        return datePart
    }

    return (
        <div className="rounded-lg bg-card overflow-hidden hidden lg:block dark:bg-lnd-surface">
            <div className="overflow-x-auto">
                <Table className="min-w-full">
                    <TableHeader>
                        <TableRow className="border-b border-border dark:border-lnd-border">
                            <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider dark:text-lnd-fg-muted">
                                Crypto Pair
                            </TableHead>
                            <TableHead className="text-xs font-medium text-muted-foreground text-right uppercase tracking-wider dark:text-lnd-fg-muted">
                                Amount
                            </TableHead>
                            <TableHead className="text-xs font-medium text-muted-foreground text-center uppercase tracking-wider dark:text-lnd-fg-muted">
                                Order
                            </TableHead>
                            <TableHead className="text-xs font-medium text-muted-foreground text-right uppercase tracking-wider dark:text-lnd-fg-muted">
                                Income
                            </TableHead>
                            <TableHead className="text-xs font-medium text-muted-foreground text-right uppercase tracking-wider dark:text-lnd-fg-muted">
                                Rate
                            </TableHead>
                            <TableHead className="text-xs font-medium text-muted-foreground text-center uppercase tracking-wider dark:text-lnd-fg-muted">
                                Status
                            </TableHead>
                            <TableHead className="text-xs font-medium text-muted-foreground dark:text-lnd-fg-muted">Ended</TableHead>
                            <TableHead className="text-xs font-medium text-muted-foreground dark:text-lnd-fg-muted">Created</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            paginatedTrades.length !== 0 ? (
                                paginatedTrades.map((trade) => {
                                    const status = trade?.status ?? "Unknown"
                                    const order = trade?.order ?? ""
                                    const incomeNum = Number(trade?.income) || 0
                                    const rateNum = Number(trade?.rate) || 0
                                    const coin = crypto?.data?.data?.find((c: CryptoCurrency) => c.symbol === (trade?.crypto_pair || "").split("/")[0])
                                    const formatCurrency = (v: number) =>
                                        new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 }).format(v)
                                    const statusClasses =
                                        status === "open"
                                            ? "bg-green-700 text-white"
                                            : status === "closed"
                                                ? "bg-lnd-surface-2 text-lnd-fg"
                                                : status === "canceled"
                                                    ? "bg-red-500 text-white"
                                                    : "bg-orange-400 text-white"

                                    const orderClasses =
                                        order === "spot"
                                            ? "bg-lnd-accent/10 text-lnd-accent"
                                            : "bg-muted text-muted-foreground"

                                    return (
                                        <TableRow
                                            key={trade?.id}
                                            className="last:border-0 hover:bg-muted/5 transition-colors dark:border-lnd-border dark:hover:bg-lnd-surface-2"
                                        >
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Image src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${coin?.id}.png`} alt={trade?.crypto_pair as string} width={24} height={24} className="w-6 h-6 rounded-full" />
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-foreground dark:text-lnd-fg">{trade?.crypto_pair}</span>
                                                        <span className="text-xs text-muted-foreground dark:text-lnd-fg-muted">#{trade?.id}</span>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <span className="text-sm font-medium text-lnd-accent dark:text-lnd-accent">
                                                    {trade?.amount}
                                                </span>
                                            </TableCell>

                                            <TableCell className="text-center">
                                                <Badge variant="secondary" className={`px-2 py-0.5 text-sm ${orderClasses} font-normal dark:text-lnd-fg`}>
                                                    {order}
                                                </Badge>
                                            </TableCell>

                                            <TableCell className="text-right text-foreground dark:text-lnd-fg">
                                                <span className="font-medium">{formatCurrency(incomeNum)}</span>
                                            </TableCell>

                                            <TableCell className="text-right text-foreground dark:text-lnd-fg">
                                                <span className="text-sm">{formatCurrency(rateNum)}</span>
                                            </TableCell>

                                            <TableCell className="text-center">
                                                <Badge variant="secondary" className={`${statusClasses} px-2 py-0.5 text-sm font-normal dark:text-lnd-fg`}>
                                                    {status}
                                                </Badge>
                                            </TableCell>

                                            <TableCell className="text-foreground text-sm dark:text-lnd-fg">
                                                {dateFormat(trade?.ended) ?? "-"}
                                            </TableCell>

                                            <TableCell className="text-foreground text-sm dark:text-lnd-fg">{dateFormat(trade?.created)}</TableCell>
                                        </TableRow>
                                    )
                                })) : isLoading || crypto == undefined ?
                                (
                                    <TableRow className="w-full">
                                        <TableCell colSpan={8} className="h-80 w-full p-0">
                                            <div className="flex items-center justify-center h-full w-full">
                                                <Loader />
                                            </div>
                                        </TableCell>
                                    </TableRow>

                                )
                                : (
                                    <TableRow className="w-full">
                                        <TableCell colSpan={8} className="h-80 w-full p-0">
                                            <div className="flex flex-col items-center justify-center h-full w-full bg-lnd-surface dark:bg-lnd-surface dark:text-lnd-fg">
                                                <NoData className="w-20 h-20" />
                                                No data available
                                            </div>
                                        </TableCell>
                                    </TableRow>)}
                    </TableBody>
                </Table>
                <div className="hidden lg:flex items-center justify-between py-2 px-2 dark:bg-lnd-surface">
                    <div className="flex items-center space-x-3">
                        <div className="text-sm text-lnd-accent dark:text-lnd-accent">
                            Showing Display:
                        </div>
                        <RadioGroup
                            value={pageSize >= total && total > 0 ? "all" : String(pageSize)}
                            onValueChange={(val) => {
                                if (val === "all") {
                                    setPageSize(total || 999)
                                    setPage(1)
                                } else {
                                    setPageSize(Number(val))
                                    setPage(1)
                                }
                            }}
                            className="flex items-center space-x-3"
                        >
                            <label className="inline-flex items-center space-x-2">
                                <RadioGroupItem value="6" id="size-6" className="h-4 w-4 text-lnd-accent border-lnd-accent/25 rounded-full focus:ring-2 focus:ring-lnd-accent/30 dark:border-lnd-accent/55 dark:text-lnd-accent dark:focus:ring-lnd-accent/30" />
                                <span className="text-sm text-lnd-fg dark:text-lnd-fg">6</span>
                            </label>

                            <label className="inline-flex items-center space-x-2">
                                <RadioGroupItem value="10" id="size-10" className="h-4 w-4 text-lnd-accent border-lnd-accent/25 rounded-full focus:ring-2 focus:ring-lnd-accent/30 dark:border-lnd-accent/55 dark:text-lnd-accent dark:focus:ring-lnd-accent/30" />
                                <span className="text-sm text-lnd-fg dark:text-lnd-fg">10</span>
                            </label>

                            <label className="inline-flex items-center space-x-2">
                                <RadioGroupItem value="20" id="size-20" className="h-4 w-4 text-lnd-accent border-lnd-accent/25 rounded-full focus:ring-2 focus:ring-lnd-accent/30 dark:border-lnd-accent/55 dark:text-lnd-accent dark:focus:ring-lnd-accent/30" />
                                <span className="text-sm text-lnd-fg dark:text-lnd-fg">20</span>
                            </label>

                            <label className="inline-flex items-center space-x-2">
                                <RadioGroupItem value="50" id="size-50" className="h-4 w-4 text-lnd-accent border-lnd-accent/25 rounded-full focus:ring-2 focus:ring-lnd-accent/30 dark:border-lnd-accent/55 dark:text-lnd-accent dark:focus:ring-lnd-accent/30" />
                                <span className="text-sm text-lnd-fg dark:text-lnd-fg">50</span>
                            </label>
                        </RadioGroup>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border rounded text-sm text-lnd-accent border-lnd-accent/25 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lnd-accent/10 dark:text-lnd-accent dark:border-lnd-accent/55 dark:hover:bg-lnd-accent/15 dark:bg-lnd-surface"
                            aria-disabled={currentPage === 1}
                        >
                            Prev
                        </button>

                        <div className="flex items-center space-x-2">
                            {totalPages > 4 ? (
                                (() => {
                                    const start = Math.min(currentPage, totalPages - 2) // ensure room for "last"
                                    const first = start
                                    const second = start + 1
                                    const pages: number[] = [first, second].filter((p) => p >= 1 && p <= totalPages)

                                    return (
                                        <>
                                            {pages.map((p) => {
                                                const isActive = p === currentPage
                                                return (
                                                    <button
                                                        key={p}
                                                        onClick={() => setPage(p)}
                                                        className={
                                                            "px-3 py-1 rounded text-sm " +
                                                            (isActive
                                                                ? "bg-lnd-accent text-lnd-accent-fg dark:bg-lnd-accent dark:text-lnd-accent-fg"
                                                                : "border border-lnd-accent/25 text-lnd-accent hover:bg-lnd-accent/10 dark:border-lnd-accent/55 dark:text-lnd-accent dark:hover:bg-lnd-accent/15 dark:bg-lnd-surface")
                                                        }
                                                        aria-current={isActive ? "page" : undefined}
                                                    >
                                                        {p}
                                                    </button>
                                                )
                                            })}

                                            {pages[pages.length - 1] < totalPages - 1 && (
                                                <span className="px-3 py-1 text-sm text-lnd-fg-muted dark:text-lnd-fg-muted">…</span>
                                            )}

                                            {pages[pages.length - 1] < totalPages && (
                                                <button
                                                    key={totalPages}
                                                    onClick={() => setPage(totalPages)}
                                                    className={
                                                        "px-3 py-1 rounded text-sm " +
                                                        (currentPage === totalPages
                                                            ? "bg-lnd-accent text-lnd-accent-fg dark:bg-lnd-accent dark:text-lnd-accent-fg"
                                                            : "border border-lnd-accent/25 text-lnd-accent hover:bg-lnd-accent/10 dark:border-lnd-accent/55 dark:text-lnd-accent dark:hover:bg-lnd-accent/15 dark:bg-lnd-surface")
                                                    }
                                                    aria-current={currentPage === totalPages ? "page" : undefined}
                                                >
                                                    {totalPages}
                                                </button>
                                            )}
                                        </>
                                    )
                                })()
                            ) : (
                                Array.from({ length: totalPages }, (_, i) => {
                                    const p = i + 1
                                    const isActive = p === currentPage
                                    return (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={
                                                "px-3 py-1 rounded text-sm " +
                                                (isActive
                                                    ? "bg-lnd-accent text-lnd-accent-fg dark:bg-lnd-accent dark:text-lnd-accent-fg"
                                                    : "border border-lnd-accent/25 text-lnd-accent hover:bg-lnd-accent/10 dark:border-lnd-accent/55 dark:text-lnd-accent dark:hover:bg-lnd-accent/15 dark:bg-lnd-surface")
                                            }
                                            aria-current={isActive ? "page" : undefined}
                                        >
                                            {p}
                                        </button>
                                    )
                                })
                            )}
                        </div>

                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded bg-lnd-accent text-lnd-accent-fg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lnd-accent/90"
                            aria-disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
