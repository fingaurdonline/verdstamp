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
  const spot_trades = data?.filter((trade) => trade?.order === "futures") || []

  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(6)
  const total = spot_trades?.length ?? 0
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(Math.max(1, page), totalPages)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, total)
  const paginated = spot_trades ? spot_trades.slice(startIndex, endIndex) : []

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
                <div key={trade.id} className="bg-card dark:bg-lnd-surface rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Image src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${coin?.id}.png`} alt={trade?.crypto_pair as string} width={24} height={24} className="w-6 h-6 rounded-full" />
                    <div>
                      <div className="font-semibold text-foreground dark:text-lnd-fg">{trade.cryptoPair}</div>
                      <div className="text-sm text-lnd-accent font-medium mt-1 dark:text-lnd-accent">Amount: {trade.amount}</div>
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
                      <p className="text-xs text-muted-foreground mb-1 dark:text-lnd-fg-muted">Order</p>
                      <Badge variant="secondary" className="bg-muted text-muted-foreground font-normal text-xs dark:bg-lnd-surface dark:text-lnd-fg">
                        {trade.order}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 dark:text-lnd-fg-muted">Income</p>
                      <p className="font-semibold text-foreground dark:text-lnd-fg">{trade.income}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 dark:text-lnd-fg-muted">Rate</p>
                      <p className="font-semibold text-foreground dark:text-lnd-fg">{trade.rate}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground dark:text-lnd-fg-muted">Ended:</span>
                      <span className="text-foreground dark:text-lnd-fg">{dateFormat(trade.ended)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground dark:text-lnd-fg-muted">Created:</span>
                      <span className="text-foreground dark:text-lnd-fg">{dateFormat(trade.created)}</span>
                    </div>
                  </div>
                </div>
              )
            })}

            <div className="w-full flex items-center justify-between lg:hidden bg-lnd-surface dark:bg-lnd-surface py-3 rounded">
              <div className="w-full flex items-center justify-between space-x-3">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded text-sm text-lnd-accent border-lnd-accent/25 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lnd-accent/10 dark:hover:bg-lnd-accent/15 dark:bg-lnd-surface dark:text-lnd-accent dark:border-lnd-border"
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
                                    : "border border-lnd-accent/25 text-lnd-accent hover:bg-lnd-accent/10 dark:hover:bg-lnd-accent/15 dark:bg-lnd-surface dark:text-lnd-fg dark:border-lnd-border")
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
                                  : "border border-lnd-accent/25 text-lnd-accent hover:bg-lnd-accent/10 dark:hover:bg-lnd-accent/15 dark:bg-lnd-surface dark:text-lnd-fg dark:border-lnd-border")
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
                              : "border border-lnd-accent/25 text-lnd-accent hover:bg-lnd-accent/10 dark:hover:bg-lnd-accent/15 dark:bg-lnd-surface dark:text-lnd-fg dark:border-lnd-border")
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
                  className="px-3 py-1 rounded bg-lnd-accent text-lnd-accent-fg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lnd-accent/90 dark:hover:bg-lnd-accent/90 dark:bg-lnd-accent dark:text-lnd-accent-fg dark:border-lnd-border"
                  aria-disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-auto flex flex-col items-center justify-center text-center text-lnd-fg-muted py-4 dark:text-lnd-fg-muted">
            <NoData className="w-20 h-20" />
            No assets available
          </div>
        )
      }
    </div>
  )
}