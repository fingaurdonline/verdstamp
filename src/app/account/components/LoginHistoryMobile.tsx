"use client"
import { useState, useMemo } from "react"
import { useQuery } from "convex/react"
import { api } from "@convex/_generated/api"

type LoginStatus = {
    id?: string | number
    created?: string
    device?: string
    ip?: string
    location?: string
}
export default function LoginHistoryMobile() {
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
        <div className="w-full h-auto flex lg:hidden flex-col gap-y-4 dark:bg-lnd-surface">
            {
                pageItems.map((status: LoginStatus, idx) => (
                    <div key={idx} className="w-full h-auto flex flex-col space-y-3 p-3 bg-lnd-surface-2 dark:bg-lnd-surface-2 rounded-xl">
                        <div className="w-full flex items-center justify-between gap-3">
                            <span className="shrink-0 text-sm font-light text-lnd-fg-muted dark:text-lnd-fg-muted">Time</span>
                            <span className="min-w-0 truncate text-right text-xs text-lnd-fg dark:text-lnd-fg">{dateFormat(status?.created)}</span>
                        </div>
                        <div className="w-full flex items-center justify-between gap-3">
                            <span className="shrink-0 text-sm font-light text-lnd-fg-muted dark:text-lnd-fg-muted">Device</span>
                            <span className="min-w-0 truncate text-right text-xs text-lnd-fg dark:text-lnd-fg">{status?.device}</span>
                        </div>
                        <div className="w-full flex items-center justify-between gap-3">
                            <span className="shrink-0 text-sm font-light text-lnd-fg-muted dark:text-lnd-fg-muted">ip</span>
                            <span className="min-w-0 truncate text-right text-xs text-lnd-fg dark:text-lnd-fg">{status?.ip}</span>
                        </div>
                        <div className="w-full flex items-center justify-between gap-3">
                            <span className="shrink-0 text-sm font-light text-lnd-fg-muted dark:text-lnd-fg-muted">Location</span>
                            <span className="min-w-0 truncate text-right text-xs text-lnd-fg dark:text-lnd-fg">{status?.location}</span>
                        </div>
                    </div>))}
            <div className="flex flex-wrap items-center justify-center gap-2 px-2 py-3 sm:justify-end">
                <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                        onClick={() => goto(page - 1)}
                        disabled={page <= 1}
                        className="px-3 py-1 border rounded text-sm text-lnd-accent dark:text-lnd-accent border-lnd-accent/25 dark:border-lnd-accent/55 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lnd-accent/10 dark:hover:bg-lnd-surface-2"
                    >
                        Prev
                    </button>

                    <div className="flex flex-wrap items-center justify-center gap-1">
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
        </div>
    )
}