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
    const loanData = useQuery(api.loans.loan_history)
    const data = loanData ?? []
    const isLoading = loanData === undefined
    const { data: crypto } = useCryptoList()
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

    // pagination driven from local state and data (no external "table" object)
    const total = data?.length as number
    const totalPages = pageSize > 0 ? Math.max(1, Math.ceil(total as number / pageSize)) : 1

    // derive the current page and the slice of Loans to display
    const currentPage = Math.max(1, pageIndex + 1)
    const paginatedLoans =
        pageSize >= total && total > 0
            ? data
            : data?.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize)

    const coin = crypto?.data?.data?.find((c: CryptoCurrency) => c.symbol.toLocaleLowerCase() === "usdt")

    function dateFormat(date?: string) {
        if (!date) return "—";
        const datePart = date.split(".")[0];
        return datePart
    }
    return (
        <div className="rounded-lg bg-card overflow-hidden hidden lg:block dark:bg-lnd-surface">
            <div className="overflow-x-auto">
                <Table className="min-w-full">
                    <TableHeader className="dark:bg-lnd-surface">
                        <TableRow className="border-b border-border dark:border-lnd-border">
                            <TableHead className="font-medium text-muted-foreground tracking-wider dark:text-lnd-fg-muted">
                                coin
                            </TableHead>
                            <TableHead className="font-medium text-muted-foreground text-right tracking-wider dark:text-lnd-fg-muted">
                                equity
                            </TableHead>
                            <TableHead className="font-medium text-muted-foreground text-center tracking-wider dark:text-lnd-fg-muted">
                                to_be_repaid
                            </TableHead>
                            <TableHead className="font-medium text-muted-foreground text-right tracking-wider dark:text-lnd-fg-muted">
                                borrowed_amount
                            </TableHead>
                            <TableHead className="font-medium text-muted-foreground text-right tracking-wider dark:text-lnd-fg-muted">
                                collateral_value
                            </TableHead>
                            <TableHead className="font-medium text-muted-foreground text-center tracking-wider dark:text-lnd-fg-muted">
                                current_ltv
                            </TableHead>
                            <TableHead className="font-medium text-muted-foreground dark:text-lnd-fg-muted">Created</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="dark:bg-lnd-surface">
                        {
                            paginatedLoans?.length !== 0 ? (
                                paginatedLoans?.map((loan) => {
                                    const formatCurrency = (v: number) =>
                                        new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 }).format(v)
                                    return (
                                        <TableRow
                                            key={loan?.id}
                                            className="last:border-0 hover:bg-muted/5 transition-colors dark:hover:bg-lnd-surface-2"
                                        >
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Image src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${coin?.id}.png`} alt={loan?.coin ?? ""} width={24} height={24} className="w-6 h-6 rounded-full" />
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-foreground dark:text-lnd-fg">{loan?.coin}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right dark:text-lnd-fg">
                                                <span className="text-sm font-medium text-lnd-accent dark:text-lnd-fg">
                                                    {loan?.equity}
                                                </span>
                                            </TableCell>

                                            <TableCell className="text-center dark:text-lnd-fg">
                                                {loan?.to_be_repaid}
                                            </TableCell>
                                            <TableCell className="text-center dark:text-lnd-fg">{loan?.borrowed_amount}</TableCell>
                                            <TableCell className="text-center dark:text-lnd-fg">
                                                <Badge variant="secondary" className="px-2 py-0.5 text-sm font-normal dark:bg-lnd-accent dark:text-lnd-accent-fg">
                                                    {loan?.current_ltv}%
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center dark:text-lnd-fg">
                                                {loan?.collateral_value}
                                            </TableCell>
                                            <TableCell className="text-foreground text-sm dark:text-lnd-fg">{dateFormat(loan?.timestamp ? new Date(loan.timestamp).toISOString() : undefined)}</TableCell>
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
                                            <div className="flex flex-col items-center justify-center h-full w-full bg-lnd-surface">
                                                <NoData className="w-20 h-20" />
                                                No data available
                                            </div>
                                        </TableCell>
                                    </TableRow>)}
                    </TableBody>
                </Table>
                <div className="hidden lg:flex items-center justify-between py-2 px-2">
                    <div className="flex items-center space-x-3">
                        <div className="text-sm text-lnd-accent dark:text-lnd-fg-muted">
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
                                <RadioGroupItem value="6" id="size-6" className="h-4 w-4 text-lnd-accent border-lnd-accent/25 rounded-full focus:ring-2 focus:ring-lnd-accent/30 dark:text-lnd-accent dark:border-lnd-accent/55 dark:focus:ring-lnd-accent/30" />
                                <span className="text-sm text-lnd-fg dark:text-lnd-fg">6</span>
                            </label>

                            <label className="inline-flex items-center space-x-2">
                                <RadioGroupItem value="10" id="size-10" className="h-4 w-4 text-lnd-accent border-lnd-accent/25 rounded-full focus:ring-2 focus:ring-lnd-accent/30 dark:text-lnd-accent dark:border-lnd-accent/55 dark:focus:ring-lnd-accent/30" />
                                <span className="text-sm text-lnd-fg dark:text-lnd-fg">10</span>
                            </label>

                            <label className="inline-flex items-center space-x-2">
                                <RadioGroupItem value="20" id="size-20" className="h-4 w-4 text-lnd-accent border-lnd-accent/25 rounded-full focus:ring-2 focus:ring-lnd-accent/30 dark:text-lnd-accent dark:border-lnd-accent/55 dark:focus:ring-lnd-accent/30" />
                                <span className="text-sm text-lnd-fg dark:text-lnd-fg">20</span>
                            </label>

                            <label className="inline-flex items-center space-x-2">
                                <RadioGroupItem value="50" id="size-50" className="h-4 w-4 text-lnd-accent border-lnd-accent/25 rounded-full focus:ring-2 focus:ring-lnd-accent/30 dark:text-lnd-accent dark:border-lnd-accent/55 dark:focus:ring-lnd-accent/30" />
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
                                                                ? "bg-lnd-accent text-lnd-accent-fg"
                                                                : "border border-lnd-accent/25 text-lnd-accent hover:bg-lnd-accent/10")
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
                                                            : "border border-lnd-accent/25 text-lnd-accent hover:bg-lnd-accent/10 dark:text-lnd-accent dark:border-lnd-accent/55 dark:hover:bg-lnd-accent/15 dark:bg-lnd-surface")
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
                                                    ? "bg-lnd-accent text-lnd-accent-fg"
                                                    : "border border-lnd-accent/25 text-lnd-accent hover:bg-lnd-accent/10")
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
                            className="px-3 py-1 rounded bg-lnd-accent text-lnd-accent-fg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lnd-accent/90 dark:bg-lnd-accent dark:hover:bg-lnd-accent/90 dark:text-lnd-accent-fg"
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
