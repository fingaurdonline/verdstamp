"use client"
import { Button } from "@/components/ui/button"
import DropDown from "../../components/DropDown";;
import CryptoTable from "../components/CryptoTable";
import { Icon } from "@iconify/react"
import { ColumnDef } from "@tanstack/react-table"
import { Eye, User2 } from "lucide-react";
import useCryptoList from "@/hooks/useCryptoData"
import { CryptoCurrency, marginAssetType } from "@/lib/types"
import { useState } from "react";
import { MdCandlestickChart } from "react-icons/md"
import Image from "next/image";
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
import { Input } from "@/components/ui/input";
import { RxEyeClosed } from "react-icons/rx";
import { BiTransferAlt } from "react-icons/bi";
import { FaClone } from "react-icons/fa";
import CryptoMobileTable from "../components/CryptoMobileTable";
import { useRouter } from "nextjs-toploader/app";
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
import useCurrencies from "@/hooks/useCurrency";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

type CryptoTableData = {
    id: number,
    symbol: string,
    pairs: string,
    coin_first: string,
    coin_second: string,
    available_first: number,
    available_second: number,
    in_order_first: number,
    in_order_second: number,
    to_be_repaid_first: number,
    to_be_repaid_second: number,
    risk: number,
    liquidity_price: number
}

export default function Assets() {
    const { data: currency } = useCurrencies()
    const router = useRouter()
    const user = useQuery(api.user.user)
    const updateMarginAccount = useMutation(api.accounts.update_margin_account)
    const updateMarginAsset = useMutation(api.accounts.update_margin_asset)
    const updateUser = useMutation(api.user.updateUser)
    const marginAccount = useQuery(api.accounts.view_all_margin_accounts)
    const roundToFourDecimalPlaces = (num: number | undefined | null): number => {
        if (num == null || isNaN(num)) return 0;
        return Math.round(num * 10000) / 10000;
    };
    const roundToTwoDecimalPlaces = (num: number | undefined | null): number => {
        if (num == null || isNaN(num)) return 0;
        return Math.round(num * 100) / 100;
    };

    const marginAcc = marginAccount?.find((acc: any) => acc?.user === user?.userId)

    const totalAvailable = Object.values(marginAcc?.assets ?? {} as marginAssetType).reduce<number>((acc: number, asset: any) => {
        if (!asset) return acc;
        const available = Array.isArray(asset.available)
            ? Number(asset.available[1])
            : 0
        return acc + available;
    }, 0);

    const totalRepaid = Object.values(marginAcc?.assets ?? {} as marginAssetType).reduce<number>((acc: number, asset: any) => {
        if (!asset) return acc;
        const toBeRepaid = Array.isArray(asset.toBeRepaid)
            ? Number(asset.toBeRepaid[1])
            : 0
        return acc + toBeRepaid;
    }, 0);


    const currencies = Object.entries(currency?.data?.conversion_rates ?? {})
    function currencyConvertion(amount: number | undefined | null) {
        if (amount == null || isNaN(amount)) return 0;
        if (user?.currency === "USD" || !user?.currency) {
            return amount;
        }
        const entry = currencies?.find(([code]: any) => code === user?.currency);
        if (!entry) return amount;
        return amount * Number(entry[1]);
    }

    const { data: cryptoData } = useCryptoList()

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

        const to_be_repaid_first =
            existingCoin?.toBeRepaid && Array.isArray(existingCoin.toBeRepaid)
                ? Number(existingCoin.toBeRepaid[0] ?? 0)
                : Number(existingCoin?.toBeRepaid ?? 0);

        const to_be_repaid_second =
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
        const debt_first = to_be_repaid_first;   // CET owed
        const debt_second = to_be_repaid_second; // USDT owed

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
            id: crypto.id,
            symbol: `https://s2.coinmarketcap.com/static/img/coins/64x64/${crypto.id}.png`,
            pairs: pairStr,
            coin_first: crypto.symbol,
            coin_second: "USDT",
            available_first,
            available_second,
            in_order_first,
            in_order_second,
            to_be_repaid_first,
            to_be_repaid_second,
            risk,
            liquidity_price,
        };
    }) || [];
    const getCoinPrice = (userCrypto: string) => {
        const coin = cryptoData?.data?.data?.find((crypto: CryptoCurrency) => crypto?.name?.toLowerCase() === userCrypto?.toLowerCase());
        return marginAcc?.total_asset / coin?.quote?.USD?.price as number
    };

    const usdValue = (coinType: string) => {
        const coin = cryptoData?.data?.data?.find((crypto: CryptoCurrency) => crypto?.name?.toLowerCase() === coinType?.toLowerCase()) as CryptoCurrency
        return coin?.quote?.USD?.price
    }

    const columns: ColumnDef<CryptoTableData>[] = [
        {
            accessorKey: "pairs",
            header:
                ({ column }) => (
                    <div className="flex w-full h-auto">
                        Margin
                    </div>
                ),
            cell: ({ row }) => {
                const data = row.original
                return (
                    <div className="flex w-full h-auto py-2 items-center space-x-2">
                        <Image src={data.symbol} alt={data.coin_first} width={100} height={100} className="w-5 h-5 rounded-full" />
                        <div className="text-lnd-accent text-xs">
                            {data.pairs}
                        </div>
                    </div>
                )
            }
        },
        {
            accessorKey: "coin_first",
            header: () => <div className="w-full h-auto flex justify-end">Coin</div>,
            cell: ({ row }) => {
                const data = row.original
                return (
                    <div className="w-full h-auto flex flex-col items-end justify-start py-2 text-[0.79rem]">
                        <div>
                            {data.coin_first}
                        </div>
                        <div>
                            {data.coin_second}
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: "available",
            header: () => <div className="w-full h-auto flex justify-end">Available</div>,
            cell: ({ row }) => {
                const data = row.original
                return (
                    <div className="w-full h-auto flex flex-col items-end justify-start py-2 text-[0.79rem]">
                        <div>
                            {user?.balance_visibility === false ? roundToFourDecimalPlaces(data.available_first) : "********"}
                        </div>
                        <div>
                            {user?.balance_visibility === false ? roundToFourDecimalPlaces(data.available_second) : "********"}
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: "in_order",
            header: () => <div className="w-full h-auto flex justify-end">In-Order</div>,
            cell: ({ row }) => {
                const data = row.original
                return (
                    <div className="w-full h-auto flex flex-col items-end justify-start py-2 text-[0.79rem]">
                        <div>
                            {user?.balance_visibility === false ? roundToFourDecimalPlaces(data.in_order_first) : "********"}
                        </div>
                        <div>
                            {user?.balance_visibility === false ? roundToFourDecimalPlaces(data.in_order_second) : "********"}
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: "to_be_paid",
            header: () => <div className="w-full h-auto flex justify-end">To-be-paid</div>,
            cell: ({ row }) => {
                const data = row.original
                return (
                    <div className="w-full h-auto flex flex-col items-end justify-start py-2 text-[0.79rem]">
                        <div>
                            {user?.balance_visibility === false ? roundToFourDecimalPlaces(data.to_be_repaid_first) : "********"}
                        </div>
                        <div>
                            {user?.balance_visibility === false ? roundToFourDecimalPlaces(data.to_be_repaid_second) : "********"}
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: "risk",
            header: () => <div className="w-full h-auto flex justify-end">Risk%</div>,
            cell: ({ row }) => (
                <div className="w-full h-auto flex justify-end items-start py-2 text-[0.79rem]">{user?.balance_visibility === false ? roundToFourDecimalPlaces(row.getValue("risk")) : "********"}</div>
            ),
        },
        {
            accessorKey: "liquidity_price",
            header: () => <div className="w-full h-auto flex justify-end">Liq. Price</div>,
            cell: ({ row }) => (
                <div className="w-full h-auto flex justify-end items-start py-2 text-[0.79rem]">{user?.balance_visibility === false ? roundToFourDecimalPlaces(row.getValue("liquidity_price")) : "********"}</div>
            ),
        },
        {
            id: "operation",
            header: () => <div className="w-full h-auto flex justify-end">Operation</div>,
            enableHiding: false,
            cell: ({ row }) => {
                return (
                    <div className="w-full h-auto flex flex-col justify-start items-end py-2 text-[0.75rem] font-medium text-lnd-accent space-x-1">
                        <div className="w-full h-auto flex justify-end items-center space-x-1">
                            <button onClick={() => router.push("/transfer")}>
                                transfer
                            </button>
                            <button onClick={() => router.push("/overview/loan/assets")}>
                                Borrow
                            </button>
                        </div>
                        <div className="w-full h-auto flex justify-end items-center space-x-1">
                            <button onClick={() => router.push("/overview/spot/deposit")}>
                                Repay
                            </button>
                            <button onClick={() => { const [b, q] = row.original.pairs.split("/"); router.push(`/overview/trade/margin/${b}/${q}`) }}>
                                Trade
                            </button>
                        </div>

                    </div>
                )
            },
        }
    ]

    return (
        <div className="w-full lg:w-auto h-auto flex flex-col gap-4">
            <div className="w-auto h-auto flex items-center space-x-2.5 mb-1">
                <span className="w-fit h-6 bg-blend-overlay">
                    <Icon icon="stash:circle-dot-solid" className="w-4 h-4 text-lnd-accent/30 rotate-45 relative -top-1 left-1 z-50" />
                    <Icon icon="material-symbols:pen-size-3" className="w-8 h-8 text-lnd-accent/30 relative -top-4 z-10" />
                    <Icon icon="stash:circle-dot-solid" className="w-4 h-4 text-lnd-fg-muted/50 rotate-45 relative -top-8 left-3 z-50" />
                </span>
                <span className="db-title">
                    Margin
                </span>
            </div>
            <div className="w-full h-auto">
                <div className="w-full lg:w-auto h-auto py-5 px-5 flex flex-col bg-lnd-surface dark:bg-lnd-surface rounded-[1.25rem] space-y-4">
                    <div className="flex w-full flex-wrap items-start justify-between gap-3 pt-1 lg:w-auto lg:flex-nowrap lg:gap-70">
                        <div className="flex h-auto min-w-0 flex-1 flex-col gap-1.5">
                            <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1">
                                <span className="min-w-0 break-words">
                                    <span className="mr-1.5 border-b border-dashed border-lnd-border font-Manrope text-[0.88rem] text-lnd-fg dark:border-lnd-border dark:text-lnd-fg">
                                        Account Income
                                    </span>
                                    <span className="font-Manrope text-[0.88rem] text-lnd-fg dark:text-lnd-fg">
                                        ({user?.crypto === "tether usdt" ? "USDT" : user?.crypto === "bitcoin" ? "BTC" : "ETH"})
                                    </span>
                                </span>
                                {
                                    user?.balance_visibility === false ?
                                        <DropDown /> : null
                                }
                                <button onClick={async () => {
                                    await updateUser({ balance_visibility: !user?.balance_visibility });
                                }} className="w-auto h-auto flex items-center justify-center pl-2">
                                    {
                                        user?.balance_visibility === false ?
                                            <Eye className="w-[1.22rem] h-[1.22rem] text-lnd-fg-muted/80 dark:text-lnd-fg-muted" />
                                            :
                                            <RxEyeClosed className="w-[1.22rem] h-[1.22rem] text-lnd-fg-muted/80 dark:text-lnd-fg-muted" />
                                    }
                                </button>
                                {
                                    user?.balance_visibility === true && <div className="lg:w-10" />
                                }
                            </div>
                            <div className="w-auto h-auto flex flex-col lg:flex-row lg:items-center lg:gap-5 font-Manrope">
                                {
                                    user?.balance_visibility === false ?
                                        (
                                            <>
                                                <span className="text-[1.97rem] font-extrabold text-lnd-fg dark:text-lnd-fg">
                                                    {roundToFourDecimalPlaces(getCoinPrice(user?.crypto ?? ""))}
                                                </span>
                                                <span className="text-[1.3rem] font-medium text-lnd-fg-muted dark:text-lnd-fg-muted">
                                                    ≈{roundToTwoDecimalPlaces(currencyConvertion(marginAcc?.total_asset))} {user?.currency}
                                                </span>
                                            </>
                                        ) :
                                        <span className="text-[1.3rem] font-medium text-lnd-fg-muted dark:text-lnd-fg-muted">
                                            ********
                                        </span>
                                }
                            </div>
                        </div>
                        <div className="w-fit lg:w-auto h-auto flex items-start justify-end lg:justify-normal ">
                            <Button className="w-full lg:w-fit flex items-center lg:gap-1.5 bg-lnd-accent/10 hover:bg-lnd-accent/10 dark:bg-lnd-accent/15 dark:hover:bg-lnd-accent/15 py-1.5 lg:px-8 rounded-lg">
                                <span className="w-auto h-fit">
                                    <FaClone className="w-2.5 h-1.5 text-lnd-accent relative top-2 right-1 z-0" />
                                    <BiTransferAlt className="w-1 h-1 text-lnd-accent relative bottom-1 right-2 z-10" />
                                </span>
                                <span className="hidden lg:block text-lnd-accent dark:text-lnd-accent font-Manrope text-xs font-bold">
                                    Transfer History
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full h-auto flex flex-col lg:flex-row lg:justify-between space-x-0 lg:space-x-5">
                <div className="w-full h-auto flex flex-row justify-between items-center lg:flex-col lg:justify-center lg:items-start px-5 py-2 lg:py-4 lg:space-y-2.5 bg-lnd-surface dark:bg-lnd-surface rounded-t-3xl lg:rounded-[1.25rem]">
                    <div className="w-full h-auto text-lnd-fg-muted dark:text-lnd-fg-muted lg:text-lnd-fg dark:lg:text-lnd-fg text-[0.9rem] font-Manrope">
                        Available ({user?.currency})
                    </div>
                    <div className="w-full h-auto text-right lg:text-left text-lg lg:text-[1.4rem] font-Manrope font-extrabold dark:text-lnd-fg">
                        {
                            user?.balance_visibility === false ? roundToTwoDecimalPlaces(currencyConvertion(totalAvailable)) : "********"
                        }
                    </div>
                </div>
                <div className="w-full h-auto flex flex-row justify-between items-center lg:flex-col lg:justify-center lg:items-start px-5 py-2 lg:py-4 lg:space-y-2.5 bg-lnd-surface dark:bg-lnd-surface rounded-b-3xl lg:rounded-[1.25rem]">
                    <div className="w-full h-auto text-lnd-fg-muted dark:text-lnd-fg-muted lg:text-lnd-fg dark:lg:text-lnd-fg text-[0.9rem] font-Manrope">
                        To-be-repaid ({user?.currency})
                    </div>
                    <div className="w-full h-auto text-right lg:text-left text-lg lg:text-[1.4rem] font-Manrope font-extrabold dark:text-lnd-fg">
                        {
                            user?.balance_visibility === false ? roundToTwoDecimalPlaces(currencyConvertion(totalRepaid)) : "********"
                        }
                    </div>
                </div>
            </div>
            <div className="w-full h-auto hidden lg:flex flex-col bg-lnd-surface dark:bg-lnd-surface rounded-[1.25rem]">
                <CryptoTable columns={columns} data={data} />
            </div>
            <CryptoMobileTable />
        </div>
    )
}
