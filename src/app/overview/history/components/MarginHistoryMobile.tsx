"use client"
import { useQuery } from "convex/react"
import { api } from "@convex/_generated/api"
import NoData from "@/components/icons/NoData"
import { Badge } from "@/components/ui/badge"
import useCryptoList from "@/hooks/useCryptoData"

import { CryptoCurrency } from "@/lib/types"
import Image from "next/image"
import { useState } from "react"

export default function HistoryMobile() {
  const tradeData = useQuery(api.trading.trade_history)
  const data = tradeData ?? []
  const isLoading = tradeData === undefined
  const { data: crypto } = useCryptoList()
  const spot_trades = data?.filter((trade: any) => trade?.order === "margin") || []

  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(6)
  const total = data?.length ?? 0
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(Math.max(1, page), totalPages)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, total)
  const paginated = data ? data.slice(startIndex, endIndex) : []

  function dateFormat(date?: string | number) {
    if (!date) return "—";
    return new Date(date).toLocaleString();
  }

  return (
    <div className="lg:hidden">
      {
        paginated.length ? (
          <>
            {paginated.map((trade: any) => {
              const coin = crypto?.data?.data?.find((c: CryptoCurrency) => c.symbol === trade?.crypto_pair?.split("/")[0])
              return (
                <div key={trade.id} className="bg-card rounded-lg p-4 space-y-4 dark:bg-lnd-surface">
                  <div className="flex items-center justify-between">
                    <Image src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${coin?.id}.png`} alt={trade?.crypto_pair as string} width={24} height={24} className="w-6 h-6 rounded-full" />
                    <div>
                      <div className="font-semibold text-foreground">{trade.cryptoPair}</div>
                      <div className="text-sm text-lnd-accent font-medium mt-1">Amount: {trade.amount}</div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={trade.status === "open"
                        ? "bg-green-700 text-white"
                        : trade.status === "closed"
                          ? "bg-lnd-surface-2 text-lnd-fg"
                          : trade.status === "canceled"
                            ? "bg-red-500 text-white"
                            : "bg-orange-400 text-white"}
                    >
                      {trade.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 py-3 border-t border-b border-border">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Order</p>
                      <Badge variant="secondary" className="bg-muted text-muted-foreground font-normal text-xs">
                        {trade.order}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Income</p>
                      <p className="min-w-0 break-all font-semibold text-foreground">{Number(trade.income ?? 0).toLocaleString(undefined, { maximumFractionDigits: 8 })}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Rate</p>
                      <p className="min-w-0 break-all font-semibold text-foreground">{Number(trade.rate ?? 0).toLocaleString(undefined, { maximumFractionDigits: 8 })}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ended:</span>
                      <span className="text-foreground">{dateFormat(trade.ended)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span className="text-foreground">{dateFormat(trade.created)}</span>
                    </div>
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
          <div className="w-full h-auto flex flex-col items-center justify-center text-center text-lnd-fg-muted py-4">
            <NoData className="w-20 h-20" />
            No assets available
          </div>
        )
      }
    </div>
  )
}