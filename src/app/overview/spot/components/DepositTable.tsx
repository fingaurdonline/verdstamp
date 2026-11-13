"use client"
import { useState } from "react"
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

import { BiRefresh } from "react-icons/bi"
import { ArrowUpRight, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import useCryptoList from "@/hooks/useCryptoData"
import { CryptoCurrency } from "@/lib/types"
import Image from "next/image"
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group"

export default function DepositTable() {
    const data = useQuery(api.cryptoTransactions.view_all_transactions)

    /* Pagination state */
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(6)
    const { data: cryptoData } = useCryptoList()
    const total = data?.length ?? 0
    const totalPages = Math.max(1, Math.ceil(total / pageSize))
    const currentPage = Math.min(Math.max(1, page), totalPages)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize, total)
    const paginated = data ? data.slice(startIndex, endIndex) : []

    function maskAddress(input?: string) {
        if (!input) return "—";
        try {
            const firstPart = input?.slice(0, 9);
            const lastPart = input?.slice(-4);
            const masked = `${firstPart}...${lastPart}`;
            return masked;
        } catch (error) {
            console.log(error)
            return input
        }
    }
    function dateFormat(date?: string | number) {
        if (!date) return "—";
        if (typeof date === "number") {
            return new Date(date).toLocaleString();
        }
        const datePart = String(date).split(".")[0];
        return datePart;
    }
    const [copiedField, setCopiedField] = useState<string | null>(null)

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text)
        setCopiedField(field)
        setTimeout(() => setCopiedField(null), 2000)
    }

    return (
        <>
            <div id="deposit-records" className="flex h-fit w-full flex-col rounded-[1.4rem] bg-lnd-surface pb-8 dark:bg-lnd-surface">
                <div className="flex h-auto w-full flex-col items-start gap-3 px-4 pb-3 pt-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
                    <div className="flex flex-wrap items-center gap-2 text-[.95rem] dark:text-lnd-fg sm:gap-3">
                        <span>Last 6 Deposit Records</span>
                        <BiRefresh className="mt-0.5 h-[1.4rem] w-[1.4rem] text-lnd-accent dark:text-lnd-accent" />
                    </div>
                    <span className="h-fit w-fit rounded-full border border-lnd-accent/55 bg-lnd-surface px-6 py-[.16rem] font-Manrope text-[.75rem] font-normal text-lnd-accent transition-all duration-300 hover:bg-lnd-accent/90 hover:text-lnd-accent-fg dark:border-lnd-accent/55 dark:bg-lnd-surface dark:text-lnd-accent dark:hover:bg-lnd-accent/15 dark:hover:text-lnd-accent">
                        All Records
                    </span>
                </div>
                <div className="flex h-fit w-full flex-col gap-4 px-4 py-4 lg:hidden">
                    {paginated.length === 0 ? (
                        <p className="rounded-2xl border border-dashed border-lnd-border px-4 py-8 text-center text-sm text-lnd-fg-muted">
                            No deposits to display
                        </p>
                    ) : null}
                    {
                        paginated.map((deposit: any) => {
                            const crypto = cryptoData?.data?.data?.find((c: CryptoCurrency) => c?.name.toLocaleLowerCase() === (deposit.coin_type || deposit.asset).toLocaleLowerCase()) as CryptoCurrency | undefined;
                            return (
                                <div key={deposit.id || deposit._id} className="w-full p-4 rounded-3xl bg-lnd-surface-2 dark:bg-lnd-surface">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <Image src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${crypto?.id}.png`} alt={crypto?.name as string} width={24} height={24} className="w-6 h-6 rounded-full" />
                                            <div>
                                                <h3 className="font-semibold text-card-foreground capitalize dark:text-lnd-fg">{deposit.coin_type || deposit.asset}</h3>
                                                <p className="text-sm text-muted-foreground dark:text-lnd-fg-muted">{dateFormat(deposit.created || deposit.timestamp || deposit._creationTime)}</p>
                                            </div>
                                        </div>
                                        {(deposit?.status || deposit.metadata?.status) === "pending" ? (
                                            <Badge className="text-white bg-orange-600">Pending</Badge>
                                        ) : (deposit?.status || deposit.metadata?.status) === "failed" ? (
                                            <Badge className="text-white bg-red-600">Failed</Badge>
                                        ) : (deposit?.status || deposit.metadata?.status) === "declined" ? (
                                            <Badge className="text-white bg-yellow-600">Declined</Badge>
                                        ) : (deposit?.status || deposit.metadata?.status) === "accepted" ? (
                                            <Badge className="text-white bg-green-600">Accepted</Badge>
                                        ) : (
                                            <Badge className="text-lnd-fg bg-lnd-surface-2">—</Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-t border-b border-border dark:border-lnd-border">
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1 dark:text-lnd-fg-muted">Amount</p>
                                            <p className="font-semibold text-card-foreground dark:text-lnd-fg">{deposit.amount || deposit.value}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground mb-1 dark:text-lnd-fg-muted">Network</p>
                                            <p className="text-xs text-muted-foreground mb-1">
                                                {
                                                    (deposit.coin_type || deposit.asset) === "bitcoin" ? "--" :
                                                        (deposit.coin_type || deposit.asset) === "ethereum" ? "ERC-20" :
                                                            (deposit.coin_type || deposit.asset) === "binance" ? "BEP-20" :
                                                                (deposit.coin_type || deposit.asset) === "polygon" ? "MATIC" :
                                                                    (deposit.coin_type || deposit.asset) === "solana" ? "SPL" :
                                                                        (deposit.coin_type || deposit.asset) === "ripple" ? "Ledger" : (deposit.coin_type || deposit.asset)
                                                }
                                            </p>

                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1.5 dark:text-lnd-fg-muted">Sender Address</p>
                                        <div className="flex items-center justify-between gap-2">
                                            <code className="min-w-0 flex-1 break-all font-mono text-sm text-card-foreground dark:text-lnd-fg">{maskAddress(deposit.sender || deposit.metadata?.sender || deposit.from)}</code>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 shrink-0"
                                                onClick={() => copyToClipboard(deposit.sender || deposit.metadata?.sender || deposit.from, "sender")}
                                            >
                                                {copiedField === "sender" ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4 dark:text-lnd-fg-muted" />}
                                            </Button>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1.5 dark:text-lnd-fg-muted">Transaction ID</p>
                                        <div className="flex items-center justify-between gap-2">
                                            <code className="min-w-0 flex-1 break-all font-mono text-sm text-card-foreground dark:text-lnd-fg">{maskAddress(deposit.hash || deposit.metadata?.hash)}</code>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 shrink-0"
                                                onClick={() => copyToClipboard(deposit.hash || deposit.metadata?.hash, "txid")}
                                            >
                                                {copiedField === "txid" ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4 dark:text-lnd-fg-muted" />}
                                            </Button>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="w-full mt-2 bg-lnd-accent text-lnd-accent-fg dark:bg-lnd-accent dark:hover:bg-lnd-accent/90 dark:text-lnd-accent-fg" size="sm">
                                        View on Explorer
                                        <ArrowUpRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </div>
                            );
                        })
                    }
                </div>
                <div className="w-full h-fit hidden lg:block">
                    <Table>
                        <TableHeader>
                            <TableRow className="w-full bg-lnd-surface-2 dark:bg-lnd-surface">
                                <TableHead className="w-full text-lnd-fg-muted text-sm font-light dark:text-lnd-fg-muted">Time</TableHead>
                                <TableHead className="w-full text-lnd-fg-muted text-sm font-light dark:text-lnd-fg-muted">Coin</TableHead>
                                <TableHead className="w-full text-lnd-fg-muted text-sm font-light dark:text-lnd-fg-muted">Amount</TableHead>
                                <TableHead className="w-full text-lnd-fg-muted text-sm font-light dark:text-lnd-fg-muted">Network</TableHead>
                                <TableHead className="w-full text-lnd-fg-muted text-sm font-light dark:text-lnd-fg-muted">SenderAddress</TableHead>
                                <TableHead className="w-full text-lnd-fg-muted text-sm font-light dark:text-lnd-fg-muted">Status</TableHead>
                                <TableHead className="w-full text-lnd-fg-muted text-sm text-right font-light dark:text-lnd-fg-muted">TxID</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginated.map((deposit: any) => (
                                <TableRow key={deposit.id || deposit._id} className="w-full h-10 border-b border-lnd-border dark:border-lnd-border">
                                    <TableCell className="w-full text-sm text-lnd-accent dark:text-lnd-accent">{dateFormat(deposit.created || deposit.timestamp || deposit._creationTime)}</TableCell>
                                    <TableCell className="w-full text-sm font-normal text-lnd-fg dark:text-lnd-fg">{deposit.coin_type || deposit.asset}</TableCell>
                                    <TableCell className="w-full text-sm font-normal text-lnd-fg dark:text-lnd-fg">{deposit.amount || deposit.value}</TableCell>
                                    <TableCell className="w-full text-sm font-normal text-lnd-fg dark:text-lnd-fg">{
                                        (deposit.coin_type || deposit.asset) === "bitcoin" ? "--" :
                                            (deposit.coin_type || deposit.asset) === "ethereum" ? "ERC-20" :
                                                (deposit.coin_type || deposit.asset) === "binance" ? "BEP-20" :
                                                    (deposit.coin_type || deposit.asset) === "polygon" ? "MATIC" :
                                                        (deposit.coin_type || deposit.asset) === "solana" ? "SPL" :
                                                            (deposit.coin_type || deposit.asset) === "ripple" ? "Ledger" : (deposit.coin_type || deposit.asset)}</TableCell>
                                    <TableCell className="w-full text-sm font-normal text-lnd-fg dark:text-lnd-fg">{maskAddress(deposit.sender || deposit.metadata?.sender || deposit.from)}</TableCell>
                                    <TableCell className="w-full text-sm font-normal text-lnd-fg dark:text-lnd-fg">
                                        {(deposit?.status || deposit.metadata?.status) === "pending" ? (
                                            <span className="text-yellow-600">Pending</span>
                                        ) : (deposit?.status || deposit.metadata?.status) === "failed" ? (
                                            <span className="text-red-600">Failed</span>
                                        ) : (deposit?.status || deposit.metadata?.status) === "declined" ? (
                                            <span className="text-orange-600">Declined</span>
                                        ) : (deposit?.status || deposit.metadata?.status) === "accepted" ? (
                                            <span className="text-green-600">Accepted</span>
                                        ) : (
                                            <span className="text-lnd-fg-muted">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="w-full text-sm font-normal text-lnd-fg dark:text-lnd-fg">{maskAddress(deposit.hash || deposit.metadata?.hash)}</TableCell>
                                </TableRow>
                            ))}

                            {paginated.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-4 text-sm text-lnd-fg-muted dark:text-lnd-fg-muted">
                                        No deposits to display
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            {/* Pagination controls */}
            <div className="w-full mt-3">
                {/* Mobile pagination (shown on small screens) */}
                <div className="flex items-center justify-between gap-2 rounded-lg bg-lnd-surface px-3 py-3 shadow-sm dark:bg-lnd-surface lg:hidden">
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

                {/* Desktop pagination (shown on lg and up) */}
                <div className="hidden lg:flex items-center justify-between mt-3 dark:bg-lnd-surface">
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
                            className="px-3 py-1 border rounded text-sm text-lnd-accent border-lnd-accent/25 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lnd-accent/10"
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
                                                <span className="px-3 py-1 text-sm text-lnd-fg-muted">…</span>
                                            )}

                                            {pages[pages.length - 1] < totalPages && (
                                                <button
                                                    key={totalPages}
                                                    onClick={() => setPage(totalPages)}
                                                    className={
                                                        "px-3 py-1 rounded text-sm " +
                                                        (currentPage === totalPages
                                                            ? "bg-lnd-accent text-lnd-accent-fg"
                                                            : "border border-lnd-accent/25 text-lnd-accent hover:bg-lnd-accent/10")
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
                            className="px-3 py-1 rounded bg-lnd-accent text-lnd-accent-fg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lnd-accent/90"
                            aria-disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}