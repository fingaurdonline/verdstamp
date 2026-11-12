"use client"
import { useState, useMemo } from "react"
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

type LoginStatus = {
    id?: string | number
    created?: string
    device?: string
    ip?: string
    location?: string
}

export default function LoginHistoryTable() {
    const data = useQuery(api.misc.view_login_status)

    const [page, setPage] = useState<number>(1)
    const pageSize = 5
    const total = data?.length ?? 0
    const totalPages = Math.max(1, Math.ceil(total / pageSize))
    const pageItems = useMemo(
        () => data?.slice((page - 1) * pageSize, page * pageSize) ?? [],
        [data, page]
    )

    const goto = (p: number) => {
        const next = Math.max(1, Math.min(totalPages, p))
        setPage(next)
    }

     function dateFormat(date?: string) {
        if (!date) return "—";
        const datePart = date.split(".")[0];
        return datePart
    }
    return (
        <Table className="space-y-3 hidden lg:block dark:bg-lnd-surface rounded-xl">
            <TableHeader>
                <TableRow>
                    <TableHead className="w-full text-sm font-light text-lnd-fg-muted dark:text-lnd-fg-muted">Time</TableHead>
                    <TableHead className="w-full text-sm font-light text-lnd-fg-muted dark:text-lnd-fg-muted">Device</TableHead>
                    <TableHead className="w-full text-sm font-light text-lnd-fg-muted dark:text-lnd-fg-muted">IP</TableHead>
                    <TableHead className="w-full text-sm font-light text-lnd-fg-muted dark:text-lnd-fg-muted">Location</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {pageItems.map((status: LoginStatus, idx) => (
                    <TableRow key={status?.id ?? idx}>
                        <TableCell className="w-full text-xs text-nowrap text-lnd-fg dark:text-lnd-fg">
                            {dateFormat(status?.created)}
                        </TableCell>
                        <TableCell className="w-full text-xs text-nowrap text-lnd-fg dark:text-lnd-fg">
                            {status?.device}
                        </TableCell>
                        <TableCell className="w-full text-xs text-nowrap text-lnd-fg dark:text-lnd-fg">
                            {status?.ip}
                        </TableCell>
                        <TableCell className="w-full text-xs text-nowrap text-lnd-fg dark:text-lnd-fg">
                            {status?.location}
                        </TableCell>
                    </TableRow>
                ))}

                {/* Pagination controls */}
                <TableRow>
                    <TableCell colSpan={4} className="w-full">
                        <div className="flex items-center justify-end px-2 py-3">
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => goto(page - 1)}
                                    disabled={page <= 1}
                                    className="px-3 py-1 border rounded text-sm text-lnd-accent dark:text-lnd-accent border-lnd-accent/25 dark:border-lnd-accent/55 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lnd-accent/10 dark:hover:bg-lnd-surface-2"
                                >
                                    Prev
                                </button>

                                <div className="hidden sm:flex items-center space-x-1">
                                    {Array.from({ length: totalPages }).map((_, i) => {
                                        const p = i + 1
                                        const active = p === page
                                        // show a window around current page
                                        if (
                                            totalPages > 7 &&
                                            Math.abs(p - page) > 2 &&
                                            p !== 1 &&
                                            p !== totalPages
                                        ) {
                                            // skip rendering these page numbers (keeps UI compact)
                                            return null
                                        }
                                        return (
                                            <button
                                                key={p}
                                                onClick={() => goto(p)}
                                                className={`px-2 py-1 text-xs rounded border text-lnd-fg dark:text-lnd-fg border-lnd-border dark:border-lnd-border ${active ? "bg-lnd-surface-2 dark:bg-lnd-surface-2" : "dark:hover:bg-lnd-surface-2"}`}
                                            >
                                                {p}
                                            </button>
                                        )
                                    })}
                                    {totalPages > 7 && page <= totalPages - 3 ? (
                                        <span className="px-2 text-xs dark:text-lnd-fg-muted">…</span>
                                    ) : null}
                                </div>

                                <button
                                    onClick={() => goto(page + 1)}
                                    disabled={page >= totalPages}
                                    className="px-3 py-1 border rounded text-sm text-lnd-accent dark:text-lnd-accent border-lnd-accent/25 dark:border-lnd-accent/55 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lnd-accent/10 dark:hover:bg-lnd-surface-2"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}