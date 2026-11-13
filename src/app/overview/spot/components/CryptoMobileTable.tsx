"use client"
import { Search, User2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { api } from "@convex/_generated/api";
import useCryptoList from "@/hooks/useCryptoData"
import { CryptoCurrency, spotAssetType } from "@/lib/types"
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
import { BsStarFill, BsThreeDots } from "react-icons/bs";
import NoData from "@/components/icons/NoData";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "nextjs-toploader/app";
import useCurrencies from "@/hooks/useCurrency";
import { toast } from "sonner";
import { useMutation, useQuery } from "convex/react";

export type CryptoTableData = {
    id: string
    name: string,
    symbol: string,
    abv: string
    amount: number
    available: number
    frozen: number
    value: number
}
export default function CryptoMobileTable() {
    const user = useQuery(api.user.user)
    const userId = user?.userId
    const [open, setOpen] = useState<string | false>(false)
    const [filteredData, setFilteredData] = useState<CryptoTableData[] | null>(null);
    const spotAccounts = useQuery(api.accounts.view_all_spot_accounts)
    const { data: currency } = useCurrencies()
    const router = useRouter()
    const accountDetails = () => {
        const record = spotAccounts?.find((account: any) => {
            if (userId === account?.user) return account?.id
        })
        return record || undefined
    }
    const accountID = accountDetails()?.id
    const spotAccount = useQuery(api.accounts.view_spot_account, { id: accountID as string })

    const { data: cryptoData } = useCryptoList()
    const data: CryptoTableData[] = cryptoData?.data?.data?.map((crypto: CryptoCurrency) => {
        const existingCoin = spotAccount?.assets ? Object.values(spotAccount.assets as spotAssetType)?.find((coin) => coin?.coin === crypto?.name?.toLocaleLowerCase()) : undefined;
        return {
            id: crypto.id,
            name: crypto.name,
            symbol: `https://s2.coinmarketcap.com/static/img/coins/64x64/${crypto.id}.png`,
            abv: crypto.symbol,
            amount: existingCoin?.amount || 0,
            available: existingCoin?.available || 0,
            frozen: existingCoin?.frozen || 0,
            value: existingCoin?.value || 0,
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

    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(6)
    const total = data?.length ?? 0
    const totalPages = Math.max(1, Math.ceil(total / pageSize))
    const currentPage = Math.min(Math.max(1, page), totalPages)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize, total)
    const paginated = data ? data.slice(startIndex, endIndex) : []
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

    const currencies = Object.entries(currency?.data?.conversion_rates ?? {})
    function currencyConvertion(amount: number) {
        let Rate = 0
        currencies?.find(([code, rate]: [string, any]) => {
            if (code == user?.currency) {
                Rate = amount * rate
                console.log(code, rate)
            }
        })
        if (user?.currency == "USD") {
            return amount
        }
        return Rate
    }

    return (
        <div className="w-full h-auto p-3 pt-6 rounded-2xl mx-auto bg-lnd-surface flex lg:hidden flex-col space-y-3 dark:bg-lnd-surface">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-lnd-fg-muted w-4 h-4 dark:text-lnd-fg-muted" />
                <Input placeholder="Search"
                    className="rounded-lg focus:ring-offset-0 focus-visible:ring-offset-0 group-hover:bg-lnd-accent/10 group-hover:ring-1 group-hover:ring-lnd-accent/30 focus:ring-0 focus-visible:ring-0 placeholder:text-[.85rem] placeholder:font-Manrope placeholder:text-lnd-fg-muted bg-lnd-surface-2 group-hover:transition-all group-hover:duration-500 pl-10 outline-none dark:bg-lnd-surface dark:placeholder:text-lnd-fg-muted dark:group-hover:bg-lnd-accent/15 dark:group-hover:ring-lnd-accent/30 dark:text-lnd-fg dark:border-lnd-border"
                    onChange={(e) => {
                        const searchTerm = e.target.value.toLowerCase();
                        const filtered = data.filter((crypto: CryptoTableData) =>
                            crypto.name.toLowerCase().includes(searchTerm) ||
                            crypto.abv.toLowerCase().includes(searchTerm)
                        );
                        setFilteredData(e.target.value ? filtered : null);
                    }}
                />
            </div>
            <div className="w-full px-4">
                <div className="flex w-full mb-4 bg-transparent p-0 border-b dark:border-lnd-border">
                    <div
                        className="border-b-2 border-lnd-accent/55 text-lnd-fg rounded-none py-2 pr-4 font-medium whitespace-nowrap dark:text-lnd-fg dark:border-lnd-accent/55"
                    >
                        All Assets
                    </div>
                </div>
                {
                    paginated?.length ? (
                        <>
                            {paginated.map((crypto: CryptoTableData) => (
                                <div key={crypto?.id} className="border-b py-4 dark:border-lnd-border">
                                    <div className="flex items-center justify-between gap-2 mb-4">
                                        <div className="flex min-w-0 items-center gap-2">
                                            <Image src={crypto?.symbol} alt={crypto?.name} width={100} height={100} className="w-5 h-5 shrink-0 rounded-full" />
                                            <div className="flex min-w-0 items-baseline gap-1.5">
                                                <span className="text-lg font-medium dark:text-lnd-fg">{crypto?.abv}</span>
                                                <span className="truncate text-[.9rem] text-lnd-fg-muted dark:text-lnd-fg-muted">{crypto?.name}</span>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 gap-2">
                                            <Drawer open={open === crypto.id} onOpenChange={(isOpen) => setOpen(isOpen ? crypto.id : false)}>
                                                <button className="text-lnd-accent bg-lnd-accent/10 rounded-md flex px-2.5 py-1 items-center justify-center dark:text-lnd-accent dark:bg-lnd-accent/15" onClick={() => setOpen(crypto.id)}>
                                                    <BsThreeDots />
                                                </button>
                                                <DrawerContent className="w-full h-auto flex flex-col items-center dark:bg-lnd-surface dark:border-lnd-border">
                                                    <span className="flex flex-col w-full items-center py-4 space-y-5">
                                                        <button onClick={() => router.push("/overview/spot/deposit")} className="w-full text-[.95rem] font-Manrope dark:text-lnd-fg">
                                                            Deposit
                                                        </button>
                                                        <button onClick={() => router.push("/overview/spot/withdraw")} className="w-full text-[.95rem] font-Manrope dark:text-lnd-fg">
                                                            Withdraw
                                                        </button>
                                                        <button
                                                            className="w-full text-[.95rem] font-Manrope text-lnd-accent justify-start disabled:text-lnd-fg-muted dark:text-lnd-accent dark:disabled:text-lnd-fg-muted"
                                                            type="button"
                                                            onClick={() => setOpen(`${crypto.id}-trade`)}
                                                            disabled={crypto.abv === "USDT" ? true : false}
                                                        >
                                                            Trade
                                                        </button>
                                                        <button onClick={() => {
                                                            router.push("/swap");
                                                            setOpen(false);
                                                        }} className="w-full text-[.95rem] font-Manrope dark:text-lnd-fg">
                                                            Swap
                                                        </button>
                                                        <button
                                                            onClick={() => setOpen(false)}
                                                            className="w-full text-[.95rem] font-Manrope border-t-8 border-lnd-border pt-2.5 dark:border-lnd-border dark:text-lnd-fg">
                                                            Cancel
                                                        </button>
                                                    </span>
                                                </DrawerContent>
                                            </Drawer>
                                            <Drawer open={open === `${crypto.id}-trade`} onOpenChange={(isOpen) => setOpen(isOpen ? `${crypto.id}-trade` : false)}>
                                                <DrawerContent className="w-full h-auto flex flex-col items-center dark:bg-lnd-surface">
                                                    <div className="w-full flex flex-col items-center gap-4 py-6">
                                                        <div className="flex flex-col gap-2 w-full px-4">
                                                            {
                                                                getTradingPairs(crypto.abv).map((pair) => (
                                                                    <button
                                                                        key={pair}
                                                                        className="w-full text-[.95rem] font-Manrope p-2 justify-start disabled:text-lnd-fg-muted py-2 last:border-none dark:text-lnd-fg dark:disabled:text-lnd-fg-muted"
                                                                        onClick={() => {
                                                                            const [b, q] = pair.split("/");
                                                                            router.push(`/overview/trade/spot/${b}/${q}`);
                                                                            setOpen(false);
                                                                        }}
                                                                    >
                                                                        {pair}
                                                                    </button>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                </DrawerContent>
                                            </Drawer>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-y-2 text-[.95rem]">
                                        <div className="text-lnd-fg-muted/90 dark:text-lnd-fg-muted">Amount</div>
                                        <div className="text-right text-lnd-accent dark:text-lnd-accent">{user?.balance_visibility === false ? roundToTwoDecimalPlaces(crypto?.amount) : "********"}</div>

                                        <div className="text-lnd-fg-muted/90 dark:text-lnd-fg">Available</div>
                                        <div className="text-right dark:text-lnd-fg">{user?.balance_visibility === false ? roundToTwoDecimalPlaces(crypto?.available) : "********"}</div>

                                        <div className="text-lnd-fg-muted/90 dark:text-lnd-fg">Frozen</div>
                                        <div className="text-right dark:text-lnd-fg">{user?.balance_visibility === false ? roundToTwoDecimalPlaces(crypto?.frozen) : "********"}</div>

                                        <div className="text-lnd-fg-muted/90 dark:text-lnd-fg">Value</div>
                                        <div className="text-right dark:text-lnd-fg">{user?.balance_visibility === false ? roundToTwoDecimalPlaces(currencyConvertion(crypto.value)) : "********"} USD</div>
                                    </div>
                                </div>
                            ))}
                            <div className="flex w-full items-center justify-between gap-2 rounded bg-lnd-surface py-3 dark:bg-lnd-surface">
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
        </div>
    )
}
