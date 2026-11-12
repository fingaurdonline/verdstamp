"use client"
import { Search, User2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import { api } from "@convex/_generated/api";
import useCryptoList from "@/hooks/useCryptoData"
import { CryptoCurrency, marginAssetType, spotAssetType } from "@/lib/types"
import { useEffect, useState } from "react";
import Image from "next/image"
import {
    Drawer,
    DrawerContent,
} from "@/components/ui/drawer"
import { ChevronDown, Info } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label";
import { MdCandlestickChart } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import NoData from "@/components/icons/NoData";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { BsStarFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation, useQuery } from "convex/react";

type CryptoTableData = {
    id: string,
    symbol: string,
    pairs: string,
    coin_first: string,
    coin_second: string,
    available_first: number,
    available_second: number,
    in_order_first: number,
    in_order_second: number,
    to_bere_paid_first: number,
    to_bere_paid_second: number,
    risk: number,
    liquidity_price: number
}

export default function CryptoMobileTable() {
    const user = useQuery(api.user.user)
    const userId = user?.userId
    const router = useRouter()
    const [openRow, setOpenRow] = useState<string | false>(false)
    const [filteredData, setFilteredData] = useState<CryptoTableData[] | null>(null);
    // const { data: user } = useUserData()
    const spotAccounts = useQuery(api.accounts.view_all_spot_accounts)
    const marginAccount = useQuery(api.accounts.view_all_margin_accounts)
    const accountDetails = () => {
        const record = spotAccounts?.find((acc: any) => acc?.user === userId)
        return record || undefined
    }
    const marginAcc = marginAccount?.find((acc: any) => acc?.user === userId)
    const accountID = accountDetails()?.id
    const spotAccount = useQuery(api.accounts.view_spot_account, { id: accountID as string })
    useEffect(() => {
        // refetch_spot() - Convex queries are reactive
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [spotAccounts]);
    useEffect(() => {
        // refetch_spot() - Convex queries are reactive
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [spotAccounts]);

    const { data: cryptoData } = useCryptoList()
    const marginPair = (symbol: string) => `${symbol}/USDT`;
    const withOutTether = cryptoData?.data?.data?.filter((c: CryptoCurrency) => {
        const sym = (c.symbol ?? "").toUpperCase();
        const name = (c.name ?? "").toLowerCase();
        return sym !== "USDT" && name !== "usdt" && !name.includes("tether");
    }) ?? [];

    const data: CryptoTableData[] = withOutTether.map((crypto: CryptoCurrency) => {
        const existingCoin = marginAcc?.assets
            ? Object.values(marginAcc.assets as marginAssetType).find(
                (coin) => Array.isArray(coin?.coin)
                    ? (coin.coin as string[]).includes(crypto?.name?.toLocaleLowerCase())
                    : coin?.coin === crypto?.name?.toLocaleLowerCase()
            )
            : undefined;

        const id = crypto.id ?? crypto.symbol ?? crypto.name ?? "";
        const symbol = crypto.symbol ?? crypto.name ?? "";
        const pairStr = marginPair(symbol);

        // Balances for first coin in the pair (e.g. CET)
        const available_first =
            existingCoin?.available && Array.isArray(existingCoin.available)
                ? Number(existingCoin.available[0] ?? 0)
                : Number(existingCoin?.available ?? 0);

        const available_second =
            existingCoin?.available && Array.isArray(existingCoin.available)
                ? Number(existingCoin.available[1] ?? 0)
                : 0;

        const in_order_first =
            existingCoin?.inOrder && Array.isArray(existingCoin.inOrder)
                ? Number(existingCoin.inOrder[0] ?? 0)
                : Number(existingCoin?.inOrder ?? 0);

        const in_order_second =
            existingCoin?.inOrder && Array.isArray(existingCoin.inOrder)
                ? Number(existingCoin.inOrder[1] ?? 0)
                : 0;

        const to_bere_paid_first =
            existingCoin?.toBeRepaid && Array.isArray(existingCoin.toBeRepaid)
                ? Number(existingCoin.toBeRepaid[0] ?? 0)
                : Number(existingCoin?.toBeRepaid ?? 0);

        const to_bere_paid_second =
            existingCoin?.toBeRepaid && Array.isArray(existingCoin.toBeRepaid)
                ? Number(existingCoin.toBeRepaid[1] ?? 0)
                : 0;

        // Current market price of the base coin in USDT
        const price = crypto?.quote?.USD?.price ? Number(crypto.quote.USD.price) : 0;

        // ------------------- MARGIN CALC ------------------- //

        // Assets
        const asset_first = available_first + in_order_first;   // e.g. CET
        const asset_second = available_second + in_order_second; // e.g. USDT

        // Debts
        const debt_first = to_bere_paid_first;   // CET owed
        const debt_second = to_bere_paid_second; // USDT owed

        // Convert to USDT value
        const assetValue = asset_first * price + asset_second;
        const debtValue = debt_first * price + debt_second;
        const equity = assetValue - debtValue;

        // Risk % (margin ratio)
        const risk =
            debtValue > 0 && equity > 0 ? (debtValue / equity) * 100 : 0;

        // Liquidation price (assuming borrowing USDT)
        const liquidity_price =
            asset_first > 0 ? (debt_second + debt_first * price) / asset_first : 0;
        return {
            id,
            symbol: `https://s2.coinmarketcap.com/static/img/coins/64x64/${crypto.id}.png`,
            pairs: pairStr,
            coin_first: crypto.symbol,
            coin_second: "USDT",
            available_first,
            available_second,
            in_order_first,
            in_order_second,
            to_bere_paid_first,
            to_bere_paid_second,
            risk,
            liquidity_price,
        };
    }) || [];
    // Reset filteredData when data changes
    useEffect(() => {
        setFilteredData(null);
    }, [cryptoData, spotAccount]);
    function getTradingPairs(symbol: string) {
        const pairs = symbol === "BTC"
            ? ["BTC/USDT", "BTC/USDC"]
            : symbol === "USDT"
                ? [] : symbol === "USDC"
                    ? ["USDC/USDT"] : [
                        `${symbol}/USDT`,
                        `${symbol}/USDC`,
                        `${symbol}/BTC`
                    ];

        const result: string[] = [];
        pairs.forEach(pair => result.push(pair));

        return result;
    }
    function exData(pair: string) {
        const [base, quote] = pair.split('/').map(s => s.toUpperCase());
        const baseCoin = cryptoData?.data?.data?.find((crypto: CryptoCurrency) => crypto?.symbol === base) as CryptoCurrency
        const quoteCoin = cryptoData?.data?.data?.find((crypto: CryptoCurrency) => crypto?.symbol === quote) as CryptoCurrency
        const basePrice = baseCoin?.quote?.USD?.price
        const quotePrice = quoteCoin?.quote?.USD?.price
        const combinedPrice = basePrice / quotePrice;
        const baseChangePercent = baseCoin?.quote?.USD?.percent_change_24h
        const quoteChangePercent = quoteCoin?.quote?.USD?.percent_change_24h
        const baseFactor = 1 + baseChangePercent / 100;
        const quoteFactor = 1 + quoteChangePercent / 100;
        const combinedFactor = baseFactor / quoteFactor;
        const combinedPercentage = (combinedFactor - 1) * 100;

        return {
            price: combinedPrice,
            percentageChange: combinedPercentage
        };
    }
    const roundToFourDecimalPlaces = (num: number): number => {
        return Math.round(num * 10000) / 10000;
    };
    const roundToTwoDecimalPlaces = (num: number): number => {
        return Math.round(num * 100) / 100;
    };
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(6)
    const total = data?.length ?? 0
    const totalPages = Math.max(1, Math.ceil(total / pageSize))
    const currentPage = Math.min(Math.max(1, page), totalPages)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize, total)
    const paginated = data ? data.slice(startIndex, endIndex) : []
    return (
        <div className="w-full h-auto p-3 pt-6 rounded-2xl mx-auto bg-lnd-surface dark:bg-lnd-surface flex lg:hidden flex-col space-y-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-lnd-fg-muted w-4 h-4" />
                <Input
                    placeholder="Search Coin"
                    className="rounded-lg focus:ring-offset-0 focus-visible:ring-offset-0 group-hover:bg-lnd-accent/10 group-hover:ring-1 group-hover:ring-lnd-accent/30 focus:ring-0 focus-visible:ring-0 placeholder:text-[.85rem] placeholder:font-Manrope placeholder:text-lnd-fg-muted bg-lnd-surface-2 dark:bg-lnd-surface group-hover:transition-all group-hover:duration-500 pl-10 outline-none dark:text-lnd-fg"
                    onChange={(e) => {
                        const searchTerm = e.target.value.toLowerCase();
                        const filtered = data.filter((crypto: CryptoTableData) =>
                            crypto.pairs.toLowerCase().includes(searchTerm) ||
                            crypto.coin_first.toLowerCase().includes(searchTerm)
                        );
                        setFilteredData(e.target.value ? filtered : null);
                    }}
                />
            </div>
            <div className="w-full px-4">
                <div className="flex w-full mb-4 bg-transparent dark:bg-transparent p-0 border-b">
                    <div
                        className="border-b-2 border-lnd-accent/55 text-lnd-fg rounded-none py-2 pr-4 font-medium whitespace-nowrap dark:text-lnd-fg"
                    >
                        All Assets
                    </div>
                </div>
                {
                    paginated?.length ? (
                        <>
                            {paginated.map((crypto: CryptoTableData) => (
                                <div key={crypto?.id} className="border-b py-4">
                                    <div className="flex items-center justify-between gap-2 mb-4">
                                        <div className="flex min-w-0 items-center gap-2">
                                            <Image src={crypto?.symbol} alt={crypto?.pairs} width={100} height={100} className="w-5 h-5 shrink-0 rounded-full" />
                                            <div className="min-w-0 space-x-1.5 truncate">
                                                <span className="text-sm font-medium">{crypto?.pairs}</span>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 gap-2">
                                            <button className="text-lnd-accent bg-lnd-accent/10 dark:bg-lnd-accent/15 dark:text-lnd-accent rounded-md flex px-2.5 py-1 items-center justify-center" onClick={() => setOpenRow(crypto.id)}>
                                                <BsThreeDots />
                                            </button>
                                            <Drawer open={openRow === crypto.id} onOpenChange={(isOpen) => setOpenRow(isOpen ? crypto.id : false)}>
                                                <DrawerContent className="w-full h-auto flex flex-col items-center dark:bg-lnd-surface dark:text-lnd-fg">
                                                    <span className="flex flex-col w-full items-center py-4 space-y-5">
                                                        <button onClick={() => router.push("/transfer")} className="w-full text-[.95rem] font-Manrope">
                                                            Transfer
                                                        </button>
                                                        <button onClick={() => router.push("/overview/loan/assets")} className="w-full text-[.95rem] font-Manrope">
                                                            Borrow
                                                        </button>
                                                        <button onClick={() => router.push("/overview/spot/deposit")} className="w-full text-[.95rem] font-Manrope">
                                                            Repay
                                                        </button>
                                                        <button onClick={() => { const [b, q] = String(crypto?.pairs ?? "").split("/"); router.push(`/overview/trade/margin/${b}/${q}`); setOpenRow(false) }} className="w-full text-[.95rem] font-Manrope">
                                                            Trade
                                                        </button>
                                                        <button
                                                            onClick={() => setOpenRow(false)}
                                                            className="w-full text-[.95rem] font-Manrope border-t-8 border-lnd-border pt-2.5">
                                                            Cancel
                                                        </button>
                                                    </span>
                                                </DrawerContent>
                                            </Drawer>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-y-2 text-[.95rem]">
                                        <div className="text-lnd-fg-muted/90 mb-2">Liq. Price</div>
                                        <div className="text-right text-sm text-lnd-accent mb-2">{user?.balance_visibility === false ? roundToTwoDecimalPlaces(crypto?.liquidity_price) : "********"}</div>

                                        <div className="text-lnd-fg-muted/90">Coin</div>
                                        <div className="flex flex-col space-y-1 text-right text-sm">
                                            <span>{crypto?.coin_first}</span>
                                            <span>{crypto?.coin_second}</span>
                                        </div>
                                        <div className="text-lnd-fg-muted/90">Available</div>
                                        <div className="flex flex-col space-y-1 text-right text-sm">
                                            <span>{user?.balance_visibility === false ? roundToTwoDecimalPlaces(crypto?.available_first) : "********"}</span>
                                            <span>{user?.balance_visibility === false ? roundToTwoDecimalPlaces(crypto?.available_second) : "********"}</span>
                                        </div>
                                        <div className="text-lnd-fg-muted/90">In-Order</div>
                                        <div className="flex flex-col space-y-1 text-right text-sm">
                                            <span>{user?.balance_visibility === false ? roundToTwoDecimalPlaces(crypto?.in_order_first) : "********"}</span>
                                            <span>{user?.balance_visibility === false ? roundToTwoDecimalPlaces(crypto?.in_order_second) : "********"}</span>
                                        </div>
                                        <div className="text-lnd-fg-muted/90">To-Be-Repaid</div>
                                        <div className="flex flex-col space-y-1 text-right text-sm">
                                            <span>{user?.balance_visibility === false ? roundToTwoDecimalPlaces(crypto?.to_bere_paid_first) : "********"}</span>
                                            <span>{user?.balance_visibility === false ? roundToTwoDecimalPlaces(crypto?.to_bere_paid_second) : "********"}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="w-full flex items-center justify-between lg:hidden bg-lnd-surface py-3 rounded dark:bg-lnd-surface">
                                <div className="w-full flex items-center justify-between space-x-2">
                                    <button
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 border rounded text-sm text-lnd-accent border-lnd-accent/25 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lnd-accent/10 dark:text-lnd-accent dark:border-lnd-accent/55 dark:hover:bg-lnd-surface-2 dark:bg-lnd-surface"
                                        aria-disabled={currentPage === 1}
                                    >
                                        Prev
                                    </button>

                                    <div className="flex items-center space-x-1.5">
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
                                                                            : "border border-lnd-accent/25 text-lnd-accent hover:bg-lnd-accent/10 dark:border-lnd-accent/55 dark:text-lnd-accent dark:hover:bg-lnd-surface-2 dark:bg-lnd-surface")
                                                                    }
                                                                    aria-current={isActive ? "page" : undefined}
                                                                >
                                                                    {p}
                                                                </button>
                                                            )
                                                        })}

                                                        {pages[pages.length - 1] < totalPages - 1 && (
                                                            <span className="px-2 py-1 text-sm text-lnd-fg-muted dark:text-lnd-fg-muted">…</span>
                                                        )}

                                                        {pages[pages.length - 1] < totalPages && (
                                                            <button
                                                                key={totalPages}
                                                                onClick={() => setPage(totalPages)}
                                                                className={
                                                                    "px-3 py-1 rounded text-sm " +
                                                                    (currentPage === totalPages
                                                                        ? "bg-lnd-accent text-lnd-accent-fg dark:bg-lnd-accent"
                                                                        : "border border-lnd-accent/25 text-lnd-accent hover:bg-lnd-accent/10 dark:border-lnd-accent/55 dark:text-lnd-accent dark:hover:bg-lnd-accent/15")
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
                        </>
                    ) : (
                        <div className="w-full h-auto  items-center justify-center text-center text-lnd-fg-muted py-4">
                            <NoData className="w-20 h-20" />
                            No assets available
                        </div>
                    )
                }
            </div>
        </div>
    )
}
