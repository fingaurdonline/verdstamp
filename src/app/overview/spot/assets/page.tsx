"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Eye, User2 } from "lucide-react";
import DropDown from "../../components/DropDown";
import CryptoTable from "../components/CryptoTable";
import { Icon } from "@iconify/react"
import { api } from "@convex/_generated/api";
import useCryptoList from "@/hooks/useCryptoData"
import { CryptoCurrency, futuresAssetType, marginAssetType, spotAssetType } from "@/lib/types"
import { useEffect, useState } from "react";
import { MdCandlestickChart, MdOutlineArrowDropDown, MdOutlineArrowDropUp } from "react-icons/md"
import Image from "next/image";
import { HoverCard, HoverCardContent, HoverCardTrigger, } from "@/components/ui/hover-card"
import { ChevronDown, Info } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import CryptoMobileTable from "../components/CryptoMobileTable";
import { RxEyeClosed } from "react-icons/rx";
import { BiTransferAlt } from "react-icons/bi";
import { FaMoneyBill } from "react-icons/fa6";
import { IoIosSquare } from "react-icons/io";
import { FaClone } from "react-icons/fa";
import { toast } from "sonner";
import { PiThumbsUpFill } from "react-icons/pi";
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




type CryptoTableData = {
    id: string
    name: string,
    symbol: string,
    abv: string
    amount: number
    available: number
    frozen: number
    value: number
}

export default function Assets() {
    const user = useQuery(api.user.user)
    const userId = user?.userId
    const updateFuturesAccount = useMutation(api.accounts.update_futures_account)
    const updateFuturesAsset = useMutation(api.accounts.update_futures_asset)
    const updateMarginAccount = useMutation(api.accounts.update_margin_account)
    const updateMarginAsset = useMutation(api.accounts.update_margin_asset)
    const updateSpotAccount = useMutation(api.accounts.update_spot_account)
    const updateSpotAsset = useMutation(api.accounts.update_spot_asset)
    const updateUser = useMutation(api.user.updateUser)
    const spotAccounts = useQuery(api.accounts.view_all_spot_accounts)
    const futuresAccount = useQuery(api.accounts.view_all_futures_accounts)
    const marginAccount = useQuery(api.accounts.view_all_margin_accounts)
    const [isOpen, setIsOpen] = useState(false)
    const [fromAccount, setFromAccount] = useState("Spot")
    const [toAccount, setToAccount] = useState("Futures")
    const [activeAccount, setActiveAccount] = useState("futures")
    const [amount, setAmount] = useState("")
    const [coins, setCoins] = useState<string>("BTC/USDT")
    const [coin, setCoin] = useState("USDT")
    const { data: currency } = useCurrencies()
    const router = useRouter()
    const handleSwapAccounts = () => {
        // Prevent swapping if both accounts are the same
        if (fromAccount === toAccount) return;
        setFromAccount(toAccount);
        setToAccount(fromAccount);
    }
    const accountDetail = spotAccounts?.find((acc: any) => acc?.user === userId)

    const spotAccount = useQuery(api.accounts.view_spot_account, { id: accountDetail?.id as string })
    useEffect(() => {
        // refetch_spot() - Convex queries are reactive
    }, [spotAccount?.total_asset, spotAccount?.id]);

    const { data: cryptoData } = useCryptoList()
    const data: CryptoTableData[] = cryptoData?.data?.data?.map((crypto: CryptoCurrency) => {
        const existingCoin = spotAccount?.assets ? Object.values(spotAccount.assets as spotAssetType)?.find((coin: any) => coin?.coin === crypto?.name?.toLocaleLowerCase()) : undefined;
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
    const assets = data?.find((crypto: CryptoTableData) => crypto?.name?.toLocaleUpperCase() === coin)
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
    function getTransferPairs(symbol: string) {
        const pairs = [`${symbol}/USDT`];

        const result: string[] = [];
        pairs.forEach(pair => result.push(pair));
        return result;
    }

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
    const tether = data?.find((crypto: CryptoTableData) => crypto?.name?.toLocaleLowerCase() === "tether usdt")
    const usdValue = (coinType: string) => {
        const coin = cryptoData?.data?.data?.find((crypto: CryptoCurrency) => crypto?.name?.toLowerCase() === coinType?.toLowerCase()) as CryptoCurrency
        return coin?.quote?.USD?.price
    }
    const handleFuturesAccountTransfer = async () => {
        // Only allow transfer if amount is valid and enough balance is available

        const transferAmount = parseFloat(amount);
        if (isNaN(transferAmount) || transferAmount <= 0) {
            toast.custom((id) => (<div className="w-80 lg:w-140 h-8 flex items-center justify-center space-x-2 text-rose-900 bg-rose-100 dark:text-rose-100 dark:bg-rose-900">
                <PiThumbsUpFill className="w-3 h-3" />
                <span>Please enter a valid amount.</span>
            </div>));
            return;
        }
        if (!tether || tether.amount < transferAmount) {
            toast.custom((id) => (<div className="w-80 lg:w-140 h-8 flex items-center justify-center space-x-2 text-rose-900 bg-rose-100 dark:text-rose-100 dark:bg-rose-900">
                <PiThumbsUpFill className="w-3 h-3" />
                <span>Insufficient USDT balance.</span>
            </div>));
            return;
        }
        if (fromAccount == "Spot" && toAccount == "Futures") {
            try {
                // Update futures account: add USDT balance
                // Find the futures account for the user
                const futures = futuresAccount?.find((acc: any) => acc?.user === userId);
                if (!futures) {
                    toast.custom((id) => (<div className="w-80 lg:w-140 h-8 flex items-center justify-center space-x-2 text-rose-900 bg-rose-100 dark:text-rose-100 dark:bg-rose-900">
                        <PiThumbsUpFill className="w-3 h-3" />
                        <span>Futures account not found.</span>
                    </div>));
                    return;
                }
                const spot = spotAccounts?.find((acc: any) => acc?.user === userId);
                if (!spot) {
                    toast.custom((id) => (<div className="w-80 lg:w-140 h-8 flex items-center justify-center space-x-2 text-rose-900 bg-rose-100 dark:text-rose-100 dark:bg-rose-900">
                        <PiThumbsUpFill className="w-3 h-3" />
                        <span>Spot account not found.</span>
                    </div>));
                    return;
                }
                const spotAssets = [...(spot.assets as any[])];
                // Update the USDT asset in the spot account
                // Find USDT in spot assets
                let usdtAssetIndexSpot = spotAssets.findIndex(
                    (asset: any) => Array.isArray(asset.coin)
                        ? asset.coin.includes("tether usdt")
                        : asset.coin === coin?.toLocaleLowerCase()
                )
                // Update the USDT asset in the futures account
                const futuresAssets = [...(futures.assets as any[])];
                // Find USDT in futures assets
                let usdtAssetIndexFutures = futuresAssets.findIndex(
                    (asset: any) => asset.coin === coin?.toLocaleLowerCase()
                )
                if (usdtAssetIndexSpot !== -1) {
                    spotAssets[usdtAssetIndexSpot] = {
                        ...spotAssets[usdtAssetIndexSpot],
                        amount: assets?.amount as number - transferAmount,
                        available: assets?.amount as number - transferAmount,
                        value: ((assets?.amount as number - transferAmount) * (usdValue(coin.toLocaleLowerCase()) ?? 0)),
                    }
                }
                if (usdtAssetIndexFutures !== -1) {
                    futuresAssets[usdtAssetIndexFutures] = {
                        ...futuresAssets[usdtAssetIndexFutures],
                        balance: futuresAssets[usdtAssetIndexFutures]?.balance + transferAmount,
                        available: futuresAssets[usdtAssetIndexFutures]?.available + transferAmount,
                        equity: futuresAssets[usdtAssetIndexFutures]?.equity + transferAmount,
                    }
                }
                // Update the futures account total_asset
                await updateFuturesAccount({ amount: futures?.total_asset + (transferAmount * (usdValue(coin.toLocaleLowerCase()) ?? 0) as number), futuresID: futures?.id as string })
                await updateFuturesAsset({ asset: futuresAssets, id: futures?.id as string });
                await updateSpotAsset({ asset: spotAssets, id: spotAccount?.id as string });
                await updateSpotAccount({ amount: (spotAccount?.total_asset as number - (transferAmount * (usdValue(coin.toLocaleLowerCase()) ?? 0) as number)), spotID: spotAccount?.id as string });
                toast.custom((id) => (<div className="w-80 lg:w-140 h-8 flex items-center justify-center space-x-2 text-green-900 bg-green-100 dark:text-green-100 dark:bg-green-900">
                    <PiThumbsUpFill className="w-3 h-3" />
                    <span>Transfer was successful.</span>
                </div>));
            } catch (e) {
                console.error(e);
                toast.custom((id) => (<div className="w-80 lg:w-140 h-8 flex items-center justify-center space-x-2 text-rose-900 bg-rose-100 dark:text-rose-100 dark:bg-rose-900">
                    <PiThumbsUpFill className="w-3 h-3" />
                    <span>Failed to update accounts.</span>
                </div>));
                return;
            }
        }
        if (fromAccount == "Futures" && toAccount == "Spot") {
            try {
                // Update futures account: add USDT balance
                // Find the futures account for the user
                const futures = futuresAccount?.find((acc: any) => acc?.user === userId);
                if (!futures) {
                    toast.custom((id) => (<div className="w-80 lg:w-140 h-8 flex items-center justify-center space-x-2 text-rose-900 bg-rose-100">
                        <PiThumbsUpFill className="w-3 h-3" />
                        <span>Futures account not found.</span>
                    </div>));
                    return;
                }
                const spot = spotAccounts?.find((acc: any) => acc?.user === userId);
                if (!spot) {
                    toast.custom((id) => (<div className="w-80 lg:w-140 h-8 flex items-center justify-center space-x-2 text-rose-900 bg-rose-100 dark:text-rose-100 dark:bg-rose-900">
                        <PiThumbsUpFill className="w-3 h-3" />
                        <span>Spot account not found.</span>
                    </div>));
                    return;
                }
                const spotAssets = [...(spot.assets as any[])];
                // Find USDT in spot assets
                let usdtAssetIndexSpot = spotAssets.findIndex(
                    (asset: any) => asset.coin === coin
                )
                // Update the USDT asset in the futures account
                const futuresAssets = [...(futures.assets as any[])];
                // Find USDT in futures assets
                let usdtAssetIndexFutures = futuresAssets.findIndex(
                    (asset: any) => asset.coin === coin
                )
                if (usdtAssetIndexSpot !== -1) {
                    spotAssets[usdtAssetIndexSpot] = {
                        ...spotAssets[usdtAssetIndexSpot],
                        amount: assets?.amount as number + transferAmount,
                        available: assets?.amount as number + transferAmount,
                        value: ((assets?.amount as number + transferAmount) * (usdValue(coin.toLocaleLowerCase()) ?? 0)),
                    }
                }
                if (usdtAssetIndexFutures !== -1) {
                    futuresAssets[usdtAssetIndexFutures] = {
                        ...futuresAssets[usdtAssetIndexFutures],
                        balance: futuresAssets[usdtAssetIndexFutures]?.balance - transferAmount,
                        available: futuresAssets[usdtAssetIndexFutures]?.available - transferAmount,
                        equity: futuresAssets[usdtAssetIndexFutures]?.equity - transferAmount,
                    }
                }
                // Update the futures account total_asset
                await updateFuturesAccount({ amount: (futures?.total_asset as number) - (transferAmount * (usdValue(coin.toLocaleLowerCase()) ?? 0) as number), futuresID: futures?.id as string })
                await updateFuturesAsset({ asset: futuresAssets, id: futures?.id as string });
                await updateSpotAsset({ asset: spotAssets, id: spotAccount?.id as string });
                await updateSpotAccount({ amount: (spotAccount?.total_asset as number) + (transferAmount * (usdValue(coin.toLocaleLowerCase()) ?? 0) as number), spotID: spotAccount?.id as string });
                toast.custom((id) => (<div className="w-80 lg:w-140 h-8 flex items-center justify-center space-x-2 text-green-900 bg-green-100 dark:text-green-100 dark:bg-green-900">
                    <PiThumbsUpFill className="w-3 h-3" />
                    <span>Transfer was successful</span>
                </div>));
            } catch (e) {
                console.error(e);
                toast.custom((id) => (<div className="w-80 lg:w-140 h-8 flex items-center justify-center space-x-2 text-rose-900 bg-rose-100 dark:text-rose-100 dark:bg-rose-900">
                    <PiThumbsUpFill className="w-3 h-3" />
                    <span>Failed to update accounts.</span>
                </div>));
                return;
            }
        }
    }
    const handleMarginAccountTransfer = async () => {
        const transferAmount = parseFloat(amount);
        if (isNaN(transferAmount) || transferAmount <= 0) {
            toast.custom((id) => (<div className="w-80 lg:w-140 h-8 flex items-center justify-center space-x-2 text-rose-900 bg-rose-100 dark:text-rose-100 dark:bg-rose-900">
                <PiThumbsUpFill className="w-3 h-3" />
                <span>Please enter a valid amount.</span>
            </div>));
            return;
        }
        if (!tether || tether.amount < transferAmount) {
            toast.custom((id) => (<div className="w-80 lg:w-140 h-8 flex items-center justify-center space-x-2 text-rose-900 bg-rose-100 dark:text-rose-100 dark:bg-rose-900">
                <PiThumbsUpFill className="w-3 h-3" />
                <span>Insufficient USDT balance.</span>
            </div>));
            return;
        }
        if (fromAccount == "Spot" && toAccount == "Margin") {
            try {
                // Update margin account: add USDT balance
                // Find the margin account for the user
                const margin = marginAccount?.find((acc: any) => acc?.user === userId);
                if (!margin) {
                    toast.custom((id) => (<div className="w-80 lg:w-140 h-8 flex items-center justify-center space-x-2 text-rose-900 bg-rose-100 dark:text-rose-100 dark:bg-rose-900">
                        <PiThumbsUpFill className="w-3 h-3" />
                        <span>Margin account not found.</span>
                    </div>));
                    return;
                }
                const spot = spotAccounts?.find((acc: any) => acc?.user === userId);
                if (!spot) {
                    toast.custom((id) => (<div className="w-80 lg:w-140 h-8 flex items-center justify-center space-x-2 text-rose-900 bg-rose-100">
                        <PiThumbsUpFill className="w-3 h-3" />
                        <span>Spot account not found.</span>
                    </div>));
                    return;
                }
                const spotAssets = [...(spot.assets as any[])];
                // Find USDT in spot assets
                let usdtAssetIndexSpot = spotAssets.findIndex(
                    (asset: any) => asset.coin === "tether usdt"
                )
                // Update the USDT asset in the margin account
                const marginAssets = [...(margin.assets as any[])];
                // Find USDT in margin assets
                let usdtAssetIndexMargin = marginAssets.findIndex(
                    (asset: any) => asset.margin === coins?.toLocaleLowerCase()
                )
                if (usdtAssetIndexSpot !== -1) {
                    spotAssets[usdtAssetIndexSpot] = {
                        ...spotAssets[usdtAssetIndexSpot],
                        amount: tether?.amount - transferAmount,
                        available: tether?.amount - transferAmount,
                        value: tether?.amount - transferAmount,
                    }
                }
                if (usdtAssetIndexMargin !== -1) {
                    const updatedAvailable = [...marginAssets[usdtAssetIndexMargin].available]
                    updatedAvailable[1] = updatedAvailable[1] + transferAmount
                    marginAssets[usdtAssetIndexMargin] = {
                        ...marginAssets[usdtAssetIndexMargin],
                        available: updatedAvailable,
                    }
                }
                // Update the margin account total_asset
                await updateMarginAsset({ asset: marginAssets, id: margin?.id as string });
                await updateSpotAsset({ asset: spotAssets, id: spotAccount?.id as string });
                await updateMarginAccount({ amount: (margin?.total_asset as number + transferAmount), marginID: margin?.id as string })
                await updateSpotAccount({ amount: (spotAccount?.total_asset as number) - transferAmount, spotID: spotAccount?.id as string });
                toast.custom((id) => (<div className="w-80 lg:w-140 h-8 flex items-center justify-center space-x-2 text-green-900 bg-green-100 dark:text-green-100 dark:bg-green-900">
                    <PiThumbsUpFill className="w-3 h-3" />
                    <span>Transfer was successful</span>
                </div>));
            } catch (e) {
                console.error(e);
                toast.custom((id) => (<div className="w-80 lg:w-140 h-8 flex items-center justify-center space-x-2 text-rose-900 bg-rose-100 dark:text-rose-100 dark:bg-rose-900">
                    <PiThumbsUpFill className="w-3 h-3" />
                    <span>Failed to update accounts.</span>
                </div>));
                return;
            }
        }
        if (fromAccount == "Margin" && toAccount == "Spot") {
            try {
                // Update margin account: add USDT balance
                // Find the margin account for the user
                const margin = marginAccount?.find((acc: any) => acc?.user === userId);
                if (!margin) {
                    toast.custom((id) => (<div className="w-80 lg:w-140 h-8 flex items-center justify-center space-x-2 text-rose-900 bg-rose-100">
                        <PiThumbsUpFill className="w-3 h-3" />
                        <span>Margin account not found.</span>
                    </div>));
                    return;
                }
                const spot = spotAccounts?.find((acc: any) => acc?.user === userId);
                if (!spot) {
                    toast.custom((id) => (<div className="w-80 lg:w-140 h-8 flex items-center justify-center space-x-2 text-rose-900 bg-rose-100">
                        <PiThumbsUpFill className="w-3 h-3" />
                        <span>Spot account not found.</span>
                    </div>));
                    return;
                }
                const spotAssets = [...(spot.assets as any[])];
                // Find USDT in spot assets
                let usdtAssetIndexSpot = spotAssets.findIndex(
                    (asset: any) => asset.coin === "tether usdt"
                )
                // Update the USDT asset in the margin account
                const marginAssets = [...(margin.assets as any[])];
                // Find USDT in margin assets
                let usdtAssetIndexMargin = marginAssets.findIndex(
                    (asset: any) => asset.margin === coins?.toLocaleLowerCase()
                )
                if (usdtAssetIndexSpot !== -1) {
                    spotAssets[usdtAssetIndexSpot] = {
                        ...spotAssets[usdtAssetIndexSpot],
                        amount: tether?.amount + transferAmount,
                        available: tether?.amount + transferAmount,
                        value: tether?.amount + transferAmount,
                    }
                }
                if (usdtAssetIndexMargin !== -1) {
                    const updatedAvailable = [...marginAssets[usdtAssetIndexMargin].available]
                    updatedAvailable[1] = updatedAvailable[1] - transferAmount
                    marginAssets[usdtAssetIndexMargin] = {
                        ...marginAssets[usdtAssetIndexMargin],
                        available: updatedAvailable,
                    }
                }
                // Update the margin account total_asset
                await updateMarginAccount({ amount: (margin?.total_asset as number) - transferAmount, marginID: margin?.id as string })
                await updateMarginAsset({ asset: marginAssets, id: margin?.id as string });
                await updateSpotAsset({ asset: spotAssets, id: spotAccount?.id as string });
                await updateSpotAccount({ amount: (spotAccount?.total_asset as number) + transferAmount, spotID: spotAccount?.id as string });
                toast.custom((id) => (<div className="w-80 lg:w-140 h-8 flex items-center justify-center space-x-2 text-green-900 bg-green-100 dark:text-green-100 dark:bg-green-900">
                    <PiThumbsUpFill className="w-3 h-3" />
                    <span>Transfer was successful.</span>
                </div>));
            } catch (e) {
                console.error(e);
                toast.custom((id) => (<div className="w-80 lg:w-140 h-8 flex items-center justify-center space-x-2 text-rose-900 bg-rose-100 dark:text-rose-100 dark:bg-rose-900">
                    <PiThumbsUpFill className="w-3 h-3" />
                    <span>Failed to update accounts.</span>
                </div>));
                return;
            }
        }
    }


    const columns: ColumnDef<CryptoTableData>[] = [
        {
            accessorKey: "name",
            header:
                ({ column }) => (
                    <div className="flex w-full h-auto">
                        <button
                            className="flex items-center justify-center gap-1"
                            onClick={() => {
                                column.toggleSorting(column.getIsSorted() === "asc")
                            }}>
                            Coin
                            <span
                                className="flex flex-col -space-y-2"
                            >
                                <MdOutlineArrowDropUp className="w-3.5 h-3.5 text-lnd-fg-muted" />
                                <MdOutlineArrowDropDown className={`w-3.5 h-3.5 ${column.getIsSorted() ? "text-lnd-accent" : "text-lnd-fg-muted"}`} />
                            </span>
                        </button>
                    </div>
                ),
            cell: ({ row }) => {
                const data = row.original
                return (
                    <div className="flex w-full h-auto items-center py-2 space-x-2">
                        <Image src={data.symbol} alt={data.name} width={100} height={100} className="w-5 h-5 rounded-full" />
                        <div className="flex flex-col w-auto h-auto -space-y-1">
                            <div className="text-lnd-accent text-[0.84rem] font-medium">
                                {data.abv}
                            </div>
                            <div className="w-full text-[0.781rem] text-lnd-fg-muted/60 font-medium">
                                {row.getValue("name")}
                            </div>
                        </div>
                    </div>
                )
            }
        },
        {
            accessorKey: "amount",
            header: () => <div className="w-full h-auto flex justify-end">Amount</div>,
            cell: ({ row }) => (
                <div className="w-full h-auto flex justify-end items-start py-4 text-[0.784rem] text-lnd-accent">{user?.balance_visibility === false ? roundToTwoDecimalPlaces(row.getValue("amount")) : "********"}</div>
            ),
        },
        {
            accessorKey: "available",
            header: () => <div className="w-full h-auto flex justify-end">Available</div>,
            cell: ({ row }) => (
                <div className="w-full h-auto flex justify-end items-start py-4 text-[0.784rem]">{user?.balance_visibility === false ? roundToTwoDecimalPlaces(row.getValue("available")) : "********"}</div>
            ),
        },
        {
            accessorKey: "frozen",
            header: () => <div className="w-full h-auto flex justify-end">Frozen</div>,
            cell: ({ row }) => (
                <div className="w-full h-auto flex justify-end items-start py-4 text-[0.784rem]">{user?.balance_visibility === false ? roundToTwoDecimalPlaces(row.getValue("frozen")) : "********"}</div>
            ),
        },
        {
            accessorKey: "value",
            header: (
                ({ column }) => (
                    <div className="flex w-full h-auto justify-end">
                        <button
                            className="flex items-center justify-center gap-1"
                            onClick={() =>
                                column.toggleSorting(column.getIsSorted() === "asc")
                            }>
                            Value({user?.currency})
                            <span
                                className="flex flex-col -space-y-2"
                            >
                                <MdOutlineArrowDropUp className="w-3.5 h-3.5 text-lnd-fg-muted" />
                                <MdOutlineArrowDropDown className={`w-3.5 h-3.5 ${column.getIsSorted() ? "text-lnd-accent" : "text-lnd-fg-muted"}`} />
                            </span>
                        </button>
                    </div>
                )
            ),
            cell: ({ row }) => (
                <div className="w-full flex justify-end items-start py-4 text-[0.784rem]">{user?.balance_visibility === false ? roundToTwoDecimalPlaces(currencyConvertion(row.getValue("value"))) : "********"} </div>
            ),
        },
        {
            id: "operation",
            header: () => <div className="w-full h-auto flex justify-end">Operation</div>,
            enableHiding: false,
            cell: ({ row }) => {
                const tether = data?.find((crypto: CryptoTableData) => crypto?.abv === "USDT")
                return (
                    <div className="w-full h-auto flex justify-end items-start py-4 text-[0.78rem] text-lnd-accent space-x-3 mr-6">
                        <button onClick={() => router.push("/overview/spot/deposit")} className="text-lnd-accent dark:text-lnd-accent">
                            Deposit
                        </button>
                        <button onClick={() => router.push("/overview/spot/withdraw")} className="text-lnd-accent dark:text-lnd-accent">
                            Withdraw
                        </button>
                        <HoverCard>
                            <HoverCardTrigger asChild>
                                <button disabled={row.original.abv === "USDT" ? true : false} className="cursor-pointer disabled:cursor-default disabled:text-lnd-fg-muted dark:disabled:text-lnd-fg-muted text-lnd-accent dark:text-lnd-accent">
                                    Trade
                                </button>
                            </HoverCardTrigger>
                            <HoverCardContent className={row.original.abv === "USDT" ? "w-0 h-0" : "p-2 dark:bg-lnd-surface dark:text-lnd-fg"}>
                                <div className="w-auto h-auto flex flex-col gap-2">
                                    <div className="w-auto h-auto flex flex-col items-start gap-2">
                                        {getTradingPairs(row.original.abv)?.map((pair) => (
                                            <button onClick={() => { const [b, q] = pair.split("/"); router.push(`/overview/trade/spot/${b}/${q}`) }} key={pair} className="w-full font-Manrope text-[0.74rem] flex items-center hover:bg-lnd-surface-2 dark:hover:bg-lnd-surface-2 justify-between font-medium space-x-4 rounded-md p-1">
                                                <span>{pair}</span>
                                                {exData(pair)?.percentageChange ? (
                                                    <>
                                                        <span className={`${exData(pair)?.percentageChange == 0 ? "text-lnd-fg dark:text-lnd-fg" : exData(pair)?.percentageChange > 0 ? "text-green-500" : "text-red-500"} space-x-2`}>
                                                            {exData(pair)?.price ? `${roundToTwoDecimalPlaces(exData(pair)?.price).toFixed(2)}` : "--"}
                                                        </span>
                                                        <span className={`${exData(pair)?.percentageChange == 0 ? "text-lnd-fg bg-lnd-surface-2/50 px-1.5 py-[.2rem] rounded-md dark:text-lnd-fg dark:bg-lnd-surface-2/50" : exData(pair)?.percentageChange > 0 ? "text-green-500 bg-green-100/50 px-1.5 py-[.2rem] rounded-md" : "text-red-500 bg-red-100/50 px-1.5 py-[.2rem] rounded-md"} space-x-2`}>
                                                            {exData(pair)?.percentageChange > 0 ? `+${Math.abs(exData(pair)?.percentageChange).toFixed(2)}` : `-${Math.abs(exData(pair)?.percentageChange).toFixed(2)}`}%
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-lnd-fg-muted font-semibold dark:text-lnd-fg-muted">
                                                        --
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                        <button onClick={() => router.push("/swap")}>Swap</button>
                    </div>
                )
            },
        }
    ]
    const getCoinPrice = (userCrypto?: string) => {
        const coin = cryptoData?.data?.data?.find((crypto: CryptoCurrency) => crypto?.name?.toLowerCase() === userCrypto?.toLowerCase());
        return (spotAccount?.total_asset ?? 0) / (coin?.quote?.USD?.price ?? 1)
    };
    const roundToFourDecimalPlaces = (num: number): number => {
        return Math.round(num * 10000) / 10000;
    };
    const roundToTwoDecimalPlaces = (num: number): number => {
        return Math.round(num * 100) / 100;
    };
    return (
        <div className="w-full lg:w-auto h-auto flex flex-col gap-4">
            <div className="w-auto h-auto flex items-center space-x-2.5 mb-1">
                <span className="w-fit h-6 bg-blend-darken">
                    <Icon icon="icon-park-solid:hexagon-one" className="w-4 h-4 text-lnd-fg-muted/50 relative left-3.5 top-3 z-10" />
                    <Icon icon="mdi:stop-circle" className="w-6 h-6 text-lnd-accent/30 rotate-45 relative  -top-4 z-50" />
                </span>
                <span className="db-title">
                    Spot
                </span>
            </div>
            <div className="w-full h-auto">
                <div className="w-full lg:w-auto h-auto py-5 pb-10 px-5 flex flex-col bg-lnd-surface dark:bg-lnd-surface rounded-[1.25rem] space-y-6 lg:space-y-4">
                    <div className="w-full h-auto flex flex-col lg:flex-row lg:justify-between space-y-4 lg:space-y-0 lg:justify-between lg:gap-8 pt-1">
                        <div className="w-full h-auto flex flex-col gap-1.5">
                            <div className="w-auto h-auto flex space-x-2.5">
                                <span className="font-Manrope text-[0.88rem] text-lnd-fg dark:text-lnd-fg">
                                    Est. Total Assets ({user?.crypto === "tether usdt" ? "USDT" : user?.crypto === "bitcoin" ? "BTC" : "ETH"})
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
                                            <Eye className="w-[1.22rem] h-[1.22rem] text-lnd-fg-muted/80" />
                                            :
                                            <RxEyeClosed className="w-[1.22rem] h-[1.22rem] text-lnd-fg-muted/80" />
                                    }
                                </button>
                                {
                                    user?.balance_visibility === true && <div className="lg:w-10" />
                                }
                            </div>
                            <div className="w-auto h-auto flex flex-col lg:flex-row lg:items-center lg:gap-5 text-wrap font-Manrope">
                                {
                                    user?.balance_visibility === false ?
                                        (
                                            <>
                                                <span className="text-[1.96rem] font-extrabold text-lnd-fg dark:text-lnd-fg-muted">
                                                    {roundToFourDecimalPlaces(getCoinPrice(user?.crypto ?? ""))}
                                                </span>
                                                <span className="text-[1.3rem] font-medium text-lnd-fg-muted dark:text-lnd-fg-muted">
                                                    ≈{roundToTwoDecimalPlaces(currencyConvertion(spotAccount?.total_asset))} {user?.currency}
                                                </span>
                                            </>
                                        ) :
                                        <span className="text-[1.3rem] font-medium text-lnd-fg-muted">
                                            ********
                                        </span>
                                }
                            </div>
                        </div>
                        <div className="w-full h-auto flex flex-wrap items-center gap-2 lg:items-end lg:gap-3 pb-2">
                            <Button onClick={() => router.push("/overview/spot/deposit")} className="flex items-center gap-1 bg-lnd-accent hover:bg-lnd-accent/90 dark:bg-lnd-accent dark:hover:bg-lnd-accent/90 transition-all duration-300 py-2.5 px-2.5 lg:px-6 rounded-lg">
                                <span className="w-auto h-fit">
                                    <div className="w-5 h-2 bg-lnd-accent-fg/20 relative z-10 top-0.5" />
                                    <FaMoneyBill className="w-2.5 h-1 text-lnd-accent-fg relative rotate-90 left-0.5 bottom-1 z-0" />
                                </span>
                                <span className="text-lnd-accent-fg font-Manrope text-[.7rem] font-bold">
                                    Deposit
                                </span>
                            </Button>
                            <Button onClick={() => router.push("/overview/spot/withdraw")} className="flex items-center gap-1 bg-lnd-accent/10 dark:bg-lnd-surface-2 group hover:bg-lnd-accent dark:hover:bg-lnd-accent transition-all duration-300 py-2.5 px-2.5 lg:px-6 rounded-lg">
                                <span className="w-auto h-fit">
                                    <div className="w-2.5 h-2.5 bg-lnd-accent/15 rounded-full relative top-1 left-[3px] z-0 group-hover:bg-lnd-accent-fg/30" />
                                    <IoIosSquare className="w-2.5 h-2.5 text-lnd-accent relative rotate-45 group-hover:text-lnd-accent-fg bottom-0.5 z-10" />
                                </span>
                                <span className="text-lnd-accent group-hover:text-lnd-accent-fg dark:text-lnd-accent dark:group-hover:text-lnd-accent-fg font-Manrope text-[.7rem] font-bold">
                                    Withdrawal
                                </span>
                            </Button>
                            <Button onClick={() => { setIsOpen(true) }} className="flex items-center gap-1 group bg-lnd-accent/10 dark:bg-lnd-surface-2 hover:bg-lnd-accent dark:hover:bg-lnd-accent transition-all duration-300 py-2.5 px-2.5 lg:px-6 rounded-lg">
                                <span className="w-auto h-fit">
                                    <FaClone className="w-2.5 h-1.5 text-lnd-accent relative top-2 right-1 z-10 group-hover:text-lnd-accent-fg" />
                                    <BiTransferAlt className="w-1.5 h-1.5 text-lnd-accent relative bottom-1.5 z-0 group-hover:text-lnd-accent-fg" />
                                </span>
                                <span className="text-lnd-accent group-hover:text-lnd-accent-fg dark:text-lnd-accent dark:group-hover:text-lnd-accent-fg font-Manrope text-[.7rem] font-bold">
                                    Transfer
                                </span>
                            </Button>
                            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                <DialogContent className="w-[calc(100vw-2rem)] max-w-[500px] lg:w-[500px] p-0 gap-0 rounded-2xl">
                                    <DialogHeader className="p-6 pb-4">
                                        <div className="flex items-center justify-between">
                                            <DialogTitle className="text-lg font-semibold font-Manrope">From/To</DialogTitle>
                                        </div>
                                    </DialogHeader>

                                    <div className="px-6 pb-6 space-y-4">
                                        <div className="flex w-full bg-lnd-surface-2 rounded-lg p-2">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-1 h-1 bg-lnd-accent rounded-full" />
                                                <div className="h-14 w-px bg-lnd-surface-2" />
                                                <div className="w-1 h-1 bg-orange-400 rounded-full" />
                                            </div>
                                            {/* From/To Section */}
                                            {fromAccount == "Spot" ?
                                                <div className="w-full -space-y-1 bg-lnd-surface-2 p-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="w-full flex items-center space-x-3 bg-lnd-surface rounded-md p-2 py-2.5">
                                                            <div className="w-14 flex items-center space-x-2">
                                                                <div className="w-10 h-4 text-[0.8rem] leading-5 text-lnd-fg-muted flex items-center border-r pb-1">From</div>
                                                            </div>
                                                            <div className="w-full flex items-center justify-start space-x-2">
                                                                <span className="w-fit h-6 bg-blend-overlay">
                                                                    <Icon icon="icon-park-solid:hexagon-one" className="w-3 h-3 text-lnd-fg-muted/50 relative left-2.5 top-3 z-10" />
                                                                    <Icon icon="mdi:stop-circle" className="w-5 h-5 text-lnd-accent/50 rotate-45 relative  -top-3 z-50" />
                                                                </span>
                                                                <span className="font-medium text-sm">{fromAccount}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-center">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-full border bg-lnd-surface z-50 hover:bg-lnd-surface-2"
                                                            onClick={handleSwapAccounts}
                                                        >
                                                            <ArrowUpDown className="h-4 w-4 text-lnd-accent" />
                                                        </Button>
                                                    </div>

                                                    <div className="w-full flex items-center space-x-3 bg-lnd-surface rounded-md p-2 py-2.5">
                                                        <div className="w-14 flex items-center space-x-2">
                                                            <div className="w-10 h-4 text-[0.8rem] leading-5 text-lnd-fg-muted flex items-center border-r pb-1">to</div>
                                                        </div>
                                                        <Select value={toAccount} onValueChange={(value) => { setToAccount(value); setActiveAccount(value.toLowerCase()); }}>
                                                            <SelectTrigger className="w-full border-0 font-medium justify-between text-sm">
                                                                <div className="flex items-center justify-start space-x-2">
                                                                    {
                                                                        activeAccount == "futures" ?
                                                                            <span className="w-fit h-6 bg-blend-overlay">
                                                                                <Icon icon="eva:file-text-fill" className="w-5 h-5 text-lnd-accent/50 relative z-50" />
                                                                                <Icon icon="heroicons:pencil-16-solid" className="w-3.5 h-3 text-lnd-fg-muted/50 relative -rotate-45 -top-3 left-3 z-10" />
                                                                            </span>
                                                                            : activeAccount == "margin" ?
                                                                                <span className="w-fit h-6 bg-blend-overlay">
                                                                                    <Icon icon="stash:circle-dot-solid" className="w-2.5 h-2.5 text-lnd-accent/50 rotate-45 relative top-1 left-1 z-50" />
                                                                                    <Icon icon="material-symbols:pen-size-3" className="w-6 h-6 text-lnd-accent/50 relative -top-2 z-10" />
                                                                                    <Icon icon="stash:circle-dot-solid" className="w-2.5 h-2.5 text-lnd-fg-muted/50 rotate-45 relative -top-5 left-2 z-50" />
                                                                                </span> : null
                                                                    }
                                                                    <SelectValue />
                                                                </div>
                                                                <div>
                                                                    <ChevronDown className="w-5 h-5 text-lnd-accent" />
                                                                </div>
                                                            </SelectTrigger>
                                                            <SelectContent className="w-full shadow-none border-none rounded-sm">
                                                                <SelectItem className="w-full hover:bg-lnd-surface-2 hover:text-lnd-accent" value="Futures">Futures</SelectItem>
                                                                <SelectItem className="w-full hover:bg-lnd-surface-2 hover:text-lnd-accent" value="Margin">Margin</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                :
                                                <div className="w-full -space-y-1 bg-lnd-surface-2 rounded-lg p-3">

                                                    <div className="w-full flex items-center space-x-3 bg-lnd-surface rounded-md p-2 py-2.5">

                                                        <div className="w-14 flex items-center space-x-2">
                                                            <div className="w-10 h-4 text-[0.8rem] leading-5 text-lnd-fg-muted flex items-center border-r pb-1">From </div>
                                                        </div>
                                                        <Select value={fromAccount} onValueChange={(value) => { setFromAccount(value); setActiveAccount(value.toLowerCase()); }}>
                                                            <SelectTrigger className="w-full border-0 font-medium justify-between text-sm">
                                                                <div className="flex items-center justify-start space-x-2">
                                                                    {
                                                                        activeAccount == "futures" ?
                                                                            <span className="w-fit h-6 bg-blend-overlay">
                                                                                <Icon icon="eva:file-text-fill" className="w-5 h-5 text-lnd-accent/50 relative z-50" />
                                                                                <Icon icon="heroicons:pencil-16-solid" className="w-3.5 h-3 text-lnd-fg-muted/50 relative -rotate-45 -top-3 left-3 z-10" />
                                                                            </span>
                                                                            : activeAccount == "margin" ?
                                                                                <span className="w-fit h-6 bg-blend-overlay">
                                                                                    <Icon icon="stash:circle-dot-solid" className="w-2.5 h-2.5 text-lnd-accent/50 rotate-45 relative top-1 left-1 z-50" />
                                                                                    <Icon icon="material-symbols:pen-size-3" className="w-6 h-6 text-lnd-accent/50 relative -top-2 z-10" />
                                                                                    <Icon icon="stash:circle-dot-solid" className="w-2.5 h-2.5 text-lnd-fg-muted/50 rotate-45 relative -top-5 left-2 z-50" />
                                                                                </span> : null
                                                                    }
                                                                    <SelectValue />
                                                                </div>
                                                                <div>
                                                                    <ChevronDown className="w-5 h-5 text-lnd-accent" />
                                                                </div>
                                                            </SelectTrigger>
                                                            <SelectContent className="w-full shadow-none border-none rounded-sm">
                                                                <SelectItem className="w-full hover:bg-lnd-surface-2 hover:text-lnd-accent" value="Futures">Futures</SelectItem>
                                                                <SelectItem className="w-full hover:bg-lnd-surface-2 hover:text-lnd-accent" value="Margin">Margin</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="flex justify-center">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-full border bg-lnd-surface z-50 hover:bg-lnd-surface-2"
                                                            onClick={handleSwapAccounts}
                                                        >
                                                            <ArrowUpDown className="h-4 w-4 text-lnd-accent" />
                                                        </Button>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="w-full flex items-center space-x-3 bg-lnd-surface rounded-md p-2 py-2.5">
                                                            <div className="w-14 flex items-center space-x-2">
                                                                <div className="w-10 h-4 text-[0.8rem] leading-5 text-lnd-fg-muted flex items-center border-r pb-1">to</div>
                                                            </div>
                                                            <div className="w-full flex items-center justify-start space-x-2">
                                                                <span className="w-fit h-6 bg-blend-overlay">
                                                                    <Icon icon="icon-park-solid:hexagon-one" className="w-3 h-3 text-lnd-fg-muted/50 relative left-2.5 top-3 z-10" />
                                                                    <Icon icon="mdi:stop-circle" className="w-5 h-5 text-lnd-accent/50 rotate-45 relative  -top-3 z-50" />
                                                                </span>
                                                                <span className="font-medium text-sm">{toAccount}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                        {
                                            activeAccount == "futures" ?
                                                <>
                                                    <div className="w-full space-y-2">
                                                        <Label className="text-sm font-Manrope text-lnd-fg-muted">Coin</Label>
                                                        <Select value={coin} onValueChange={(value) => setCoin(value)}>
                                                            <SelectTrigger className="w-full bg-lnd-surface-2 p-2 px-3 text-lnd-fg-muted rounded-md">
                                                                {coin}
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="TETHER USDT">
                                                                    USDT
                                                                </SelectItem>
                                                                <SelectItem value="BITCOIN">
                                                                    BITCOIN
                                                                </SelectItem>
                                                                <SelectItem value="ETHEREUM">
                                                                    ETHEREUM
                                                                </SelectItem>
                                                                <SelectItem value="USDC">
                                                                    USDC
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-Manrope text-lnd-fg-muted">Amount</Label>
                                                        <div className="space-y-3">
                                                            <div className="relative">
                                                                <Input
                                                                    type="text"
                                                                    placeholder="Please enter"
                                                                    value={amount}
                                                                    onChange={(e) => setAmount(e.target.value)}
                                                                    className="bg-lnd-surface-2 outline-none placeholder:text-[.85rem] placeholder:font-Manrope placeholder:text-lnd-fg-muted rounded-lg pl-5" />
                                                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1 items-center">
                                                                    <div className="flex h-4 w-12 items-center justify-start text-sm text-lnd-fg-muted border-r border-lnd-border">
                                                                        {assets?.amount?.toFixed(2)}
                                                                        {
                                                                            coin == "USDT" ? "USDT" :
                                                                                coin == "BITCOIN" ? "BTC" :
                                                                                    coin == "ETHEREUM" ? "ETH" : "USDC"
                                                                        }
                                                                    </div>
                                                                    <Button
                                                                        variant={"ghost"}
                                                                        size="sm"
                                                                        className="h-7 px-2 text-lnd-accent font-medium"
                                                                        onClick={() => setAmount(assets?.amount?.toFixed(2) as string)}

                                                                    >
                                                                        All
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="text-xs text-lnd-fg-muted">Available: </span>
                                                                <span className="text-xs text-lnd-accent">
                                                                    {assets?.amount?.toFixed(2)}
                                                                    {
                                                                        coin == "USDT" ? "USDT" :
                                                                            coin == "BITCOIN" ? "BTC" :
                                                                                coin == "ETHEREUM" ? "ETH" : "USDC"
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <Button onClick={() => handleFuturesAccountTransfer()} className="w-full bg-lnd-accent hover:bg-lnd-accent/90 text-lnd-accent-fg rounded-[1.25rem]">
                                                        Confirm
                                                    </Button>
                                                </>
                                                : activeAccount == "margin" ?
                                                    <>
                                                        <div className="w-full space-y-2">
                                                            <Label className="text-sm font-Manrope text-lnd-fg-muted">Margin</Label>
                                                            <Select onValueChange={(value) => setCoins(value)} value={coins}>
                                                                <SelectTrigger className="w-full h-10 p-2 text-sm font-Manrope font-normal text-lnd-fg-muted border-0 justify-between bg-lnd-surface-2 rounded-md">
                                                                    <SelectValue placeholder="Select Pair" />
                                                                </SelectTrigger>
                                                                <div>
                                                                    <SelectContent className="max-h-60">
                                                                        {cryptoData?.data?.data?.flatMap((crypto: CryptoCurrency) =>
                                                                            getTransferPairs(crypto?.symbol).map((pair) => (
                                                                                <SelectItem
                                                                                    className="w-full rounded-sm hover:bg-lnd-accent/10"
                                                                                    key={pair}
                                                                                    value={pair}
                                                                                >
                                                                                    {pair}
                                                                                </SelectItem>
                                                                            ))
                                                                        )}
                                                                    </SelectContent>
                                                                </div>
                                                            </Select>
                                                        </div>
                                                        <div className="w-full space-y-2">
                                                            <Label className="text-sm font-Manrope text-lnd-fg-muted">Coin</Label>
                                                            <div className="w-full bg-lnd-surface-2 p-2 px-3 text-lnd-fg-muted rounded-md">USDT</div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-sm font-Manrope text-lnd-fg-muted">Amount</Label>
                                                            <div className="space-y-3">
                                                                <div className="relative">
                                                                    <Input
                                                                        type="text"
                                                                        placeholder="Please enter"
                                                                        value={amount}
                                                                        onChange={(e) => setAmount(e.target.value)}
                                                                        className="bg-lnd-surface-2 outline-none placeholder:text-[.85rem] placeholder:font-Manrope placeholder:text-lnd-fg-muted rounded-lg pl-5" />
                                                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1 items-center">
                                                                        <div className="flex h-4 w-12 items-center justify-start text-sm text-lnd-fg-muted border-r border-lnd-border">
                                                                            USDT
                                                                        </div>
                                                                        <Button
                                                                            variant={"ghost"}
                                                                            size="sm"
                                                                            className="h-7 px-2 text-lnd-accent font-medium"

                                                                        >
                                                                            All
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <span className="text-xs text-lnd-fg-muted">Available: </span>
                                                                    <span className="text-xs text-lnd-accent"> {tether?.amount.toFixed(2)} USDT</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Button onClick={() => handleMarginAccountTransfer()} className="w-full bg-lnd-accent hover:bg-lnd-accent/90 text-lnd-accent-fg rounded-[1.25rem]">
                                                            Confirm
                                                        </Button>
                                                    </> : null
                                        }
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
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
