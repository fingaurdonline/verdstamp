"use client"
import NoData from "@/components/icons/NoData"
import { Badge } from "@/components/ui/badge"
import useCryptoList from "@/hooks/useCryptoData"
import { CryptoCurrency } from "@/lib/types"
import Image from "next/image"
import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@convex/_generated/api"

export default function HistoryMobile() {
    const data = useQuery(api.loans.loan_history)
    const { data: crypto } = useCryptoList()
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(6)
    const total = data?.length ?? 0
    const totalPages = Math.max(1, Math.ceil(total / pageSize))
    const currentPage = Math.min(Math.max(1, page), totalPages)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize, total)
    const paginated = data ? data.slice(startIndex, endIndex) : []

    function dateFormat(date?: string) {
        if (!date) return "—";
        const datePart = date.split(".")[0];
        return datePart
    }
    const coin = crypto?.data?.data?.find((c: CryptoCurrency) => c.symbol.toLocaleLowerCase() === "usdt")

    return (
        <div className="lg:hidden">
            {
                paginated.length ? (
                    <>
                        {paginated.map((loan: any) => {
                            return (
                                <div key={loan?._id || loan?.id} className="bg-card rounded-lg p-4 space-y-4 dark:bg-lnd-surface dark:text-lnd-fg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Image src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${coin?.id}.png`} alt={loan?.coin} width={24} height={24} className="w-6 h-6 rounded-full" />
                                            <div className="font-semibold text-foreground dark:text-lnd-fg">{loan?.coin}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-muted-foreground dark:text-lnd-fg-muted">Current LTV</div>
                                            <div className="font-semibold text-foreground dark:text-lnd-fg">{loan?.current_ltv}%</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-border dark:border-lnd-border">
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1 dark:text-lnd-fg-muted">To Be Repaid</p>
                                            <p className="font-semibold text-foreground dark:text-lnd-fg">{loan?.to_be_repaid}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1 dark:text-lnd-fg-muted">Borrowed Amount</p>
                                            <p className="font-semibold text-foreground dark:text-lnd-fg">{loan?.borrowed_amount}</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground dark:text-lnd-fg-muted">Collateral Value:</span>
                                        <span className="text-foreground font-medium dark:text-lnd-fg">{loan?.collateral_value.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground dark:text-lnd-fg-muted">Created:</span>
                                        <span className="text-foreground dark:text-lnd-fg">{dateFormat(loan?.created)}</span>
                                    </div>
                                </div>
                            )
                        })}

                        <div className="flex w-full items-center justify-between gap-2 py-3 lg:hidden">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="min-h-9 rounded border border-lnd-accent/25 px-3 py-1 text-sm text-lnd-accent hover:bg-lnd-accent/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-lnd-accent/55 dark:bg-lnd-surface dark:text-lnd-accent dark:hover:bg-lnd-accent/15"
                                aria-disabled={currentPage === 1}
                            >
                                Prev
                            </button>
                            <span className="shrink-0 text-center text-xs text-lnd-fg-muted dark:text-lnd-fg-muted">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="min-h-9 rounded bg-lnd-accent px-3 py-1 text-sm text-lnd-accent-fg hover:bg-lnd-accent/90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-lnd-accent dark:text-lnd-accent-fg dark:hover:bg-lnd-accent/90"
                                aria-disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="w-full h-auto items-center justify-center text-center text-lnd-fg-muted py-4 dark:text-lnd-fg-muted">
                        <NoData className="w-20 h-20 dark:text-lnd-fg-muted" />
                        No assets available
                    </div>
                )
            }
        </div>
    )
}

