"use client"

import { useState, useMemo, useCallback } from "react"
import { ChevronDown, MinusCircle, Plus, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import DropDown from "../../components/DropDown"
import CryptoTable from "../components/CryptoTable"
import { Icon } from "@iconify/react"
import useCryptoList from "@/hooks/useCryptoData"
import { ColumnDef } from "@tanstack/react-table"
import { api } from "@convex/_generated/api"
import { CryptoCurrency, cryptoLoanListType, spotAssetType } from "@/lib/types"
import Image from "next/image"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { BsThreeDots } from "react-icons/bs"
import { RxEyeClosed } from "react-icons/rx"
import useCurrencies from "@/hooks/useCurrency"
import { useMutation, useQuery } from "convex/react"


export type CryptoTableData = {
    id: string
    name: string
    symbol: string
    to_be_repaid: number
    borrowed_amount: number
    collateral_value: number
    current_ltv: number
    liquidation_ltv: number
    status: string
}

type CryptoLoanListItem = {
    id: string
    symbol: string
    abv: string
    amount: number
    available: number
    value: number
}


const formSchema = z.object({
    borrowAmount: z.number().min(0, "Borrow amount must be greater than 0"),
    collateralAmounts: z.record(z.number().min(0, "Collateral amount must be greater than or equal to 0"))
});


export default function Assets() {
    const user = useQuery(api.user.user)
    const userId = user?.userId
    const updateUser = useMutation(api.user.updateUser)
    const updateLoanAccount = useMutation(api.loans.update_loan_account)
    const updateSpotAccount = useMutation(api.accounts.update_spot_account)
    const updateSpotAsset = useMutation(api.accounts.update_spot_asset)
    const { data: cryptoData } = useCryptoList()
    const spotAccounts = useQuery(api.accounts.view_all_spot_accounts)
    const { data: currency } = useCurrencies()
    const loanAccounts = useQuery(api.loans.view_Loan_account)
    const loanAccount = loanAccounts?.find((loanAcc: any) => loanAcc?.user === userId)
    type Inputs = z.infer<typeof formSchema>;
    const form = useForm<Inputs>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            borrowAmount: 0,
            collateralAmounts: {},
        },
    });
    // Get current user's spot account ID
    const accountID = useMemo(() => {
        return spotAccounts?.find((acc: any) => acc?.user === userId)?.id
    }, [spotAccounts, userId])

    const spotAccount = useQuery(api.accounts.view_spot_account, { id: accountID as string })

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

    // Dialog open state
    const [borrowDialogOpen, setBorrowDialogOpen] = useState(false)
    const [addCollateralDialogOpen, setAddCollateralDialogOpen] = useState(false)

    // Selected and filtered coins
    const [selectedCoins, setSelectedCoins] = useState<CryptoLoanListItem[]>([])

    // Memoized cryptoLoanList
    const cryptoLoanList: CryptoLoanListItem[] = useMemo(() => (
        cryptoData?.data?.data?.map((crypto: CryptoCurrency) => {
            const coin = spotAccount?.assets
                ? Object.values(spotAccount.assets as cryptoLoanListType)?.find((c) => c?.coin === crypto?.name?.toLocaleLowerCase())
                : undefined
            return {
                id: crypto.id,
                symbol: `https://s2.coinmarketcap.com/static/img/coins/64x64/${crypto.id}.png`,
                abv: crypto.symbol,
                amount: coin?.amount || 0,
                available: coin?.available || 0,
                value: coin?.value || 0,
            }
        }) || []
    ), [cryptoData, spotAccount])

    // Memoized availableCoins and filtered lists
    const availableCoins = useMemo(() =>
        cryptoLoanList.filter(coin => !selectedCoins.some(selected => selected.id === coin.id)),
        [cryptoLoanList, selectedCoins]
    )


    // Move coin from availableCoins to selectedCoins
    const selectCoin = useCallback((coin: CryptoLoanListItem) => {
        setSelectedCoins(prev => prev.some(c => c.id === coin.id) ? prev : [...prev, coin])
    }, []);

    const deselectCoin = useCallback((coin: CryptoLoanListItem) => {
        setSelectedCoins(prev => prev.filter(c => c.id !== coin.id))
    }, []);
    // Memoized table data
    const data: CryptoTableData[] = useMemo(() =>
        cryptoData?.data?.data?.filter((crypto: CryptoCurrency) => crypto?.symbol?.toLocaleLowerCase() === "usdt")
            ?.map((crypto: CryptoCurrency) => ({
                id: crypto.id,
                name: loanAccount?.coin,
                symbol: `https://s2.coinmarketcap.com/static/img/coins/64x64/${crypto.id}.png`,
                to_be_repaid: loanAccount?.to_be_repaid,
                borrowed_amount: loanAccount?.borrowed_amount,
                collateral_value: loanAccount?.collateral_value,
                current_ltv: loanAccount?.current_ltv,
                liquidation_ltv: loanAccount?.liquidation_ltv,
                status: loanAccount?.status,
            })) || [],
        [cryptoData, loanAccount]
    )
    // Swap a selected coin with an available coin
    const swapSelectedCoin = useCallback((oldCoinId: string, newCoin: CryptoLoanListItem) => {
        setSelectedCoins(prev =>
            prev.map(coin => coin.id === oldCoinId ? newCoin : coin)
        )
    }, []);
    const maxBorrowValue = useMemo(() => {
        const collateralAmounts = form.getValues("collateralAmounts");
        const usdValue = (coinType: string) => {
            const coin = cryptoData?.data?.data?.find((crypto: CryptoCurrency) => crypto?.id === parseInt(coinType)) as CryptoCurrency
            return coin?.quote?.USD?.price ?? 0
        }
        const totalCollateralValue = selectedCoins.reduce((acc, coin) => {
            const amount = collateralAmounts[coin.id] || 0;
            const value = usdValue(coin.id) * amount
            return acc + (value || 0);
        }, 0);
        const vip = user?.vip_status ?? 0
        let multiplier = 0;
        if (vip == 0) multiplier = 1.2;
        else if (vip == 1) multiplier = 1.4;
        else if (vip == 2) multiplier = 1.55;
        else if (vip == 3) multiplier = 1.8;
        else if (vip == 4) multiplier = 2;
        else multiplier = 0;

        return totalCollateralValue * multiplier;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cryptoData, selectedCoins, user?.vip_status, form])

    const ltv = useMemo(() => {
        const borrowAmount = form.getValues("borrowAmount")
        if (maxBorrowValue <= 0) return 0;
        return parseInt((((borrowAmount) / maxBorrowValue) * 100).toFixed(2));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [maxBorrowValue, form])

    function maxBorrow() {
        return maxBorrowValue;
    }

    async function onSubmit(value: Inputs) {
        const collateralAmounts = value.collateralAmounts;
        const borrowAmount = value.borrowAmount
        const asset = spotAccount?.assets as spotAssetType
        let status;

        if (ltv < 90) {
            status = "low";

        }
        else if (ltv >= 90 && ltv < 97) {
            status = "middle";
        }
        else {
            status = "high"
        }
        const usdValue = (coinType: string) => {
            const coin = cryptoData?.data?.data?.find((crypto: CryptoCurrency) => crypto?.id === parseInt(coinType)) as CryptoCurrency
            return coin?.quote?.USD?.price
        }
        const usdCoin = (coinName: string) => {
            const coin = cryptoData?.data?.data?.find((crypto: CryptoCurrency) => crypto?.name?.toLowerCase() === coinName) as CryptoCurrency
            return coin?.quote?.USD?.price
        }
        const liqLtv = 98
        const totalCollateralValue = selectedCoins.reduce((acc, coin) => {
            const amount = collateralAmounts[coin.id] || 0;
            const value = usdValue(coin.id) * amount
            return acc + (value || 0);
        }, 0);
        const collateralData = Object.entries(collateralAmounts).map(([coinId, amount]) => ({
            coin: cryptoData?.data?.data?.find((coin: CryptoCurrency) => coin.id == parseInt(coinId))?.name,
            amount: amount
        })).filter(item => item.amount > 0);
        if (totalCollateralValue <= 0) {
            return
        }
        else if (borrowAmount > maxBorrow()) {
            alert("Borrow amount exceeds maximum allowed based on collateral value.");
            return;
        }
        else {
            try {
                for (const [coinId, amount] of Object.entries(collateralData)) {
                    const coin = Object.values(spotAccount?.assets as spotAssetType).find((coin) => coin?.coin === amount.coin.toLowerCase())
                    const usdt = Object.values(spotAccount?.assets as spotAssetType).find((coin) => coin?.coin === "tether usdt")
                    if (coin) {
                        Object.keys(asset).find((key) => {
                            if (asset[parseInt(key, 10)].coin === coin.coin) {
                                const index = parseInt(key, 10);
                                asset[index].amount = coin.amount - amount.amount
                                asset[index].frozen = coin.frozen
                                asset[index].available = coin.amount
                                asset[index].value = usdCoin(coin.coin) * coin.amount
                            }
                        })
                    }
                    Object.keys(asset).find((key) => {
                        if (asset[parseInt(key, 10)].coin === "tether usdt") {
                            const index = parseInt(key, 10);
                            // Add the borrowed amount to the USDT asset
                            asset[index].amount = (usdt?.amount as number) + borrowAmount;
                            asset[index].frozen = usdt?.frozen as number;
                            asset[index].available = usdt?.amount as number;
                            asset[index].value = usdt?.amount as number;
                        }
                    })
                }
                await updateLoanAccount({ equity: borrowAmount, to_be_repaid: borrowAmount * 1.2, borrowed_amount: borrowAmount, collateral_value: totalCollateralValue, current_ltv: ltv, liquidation_ltv: liqLtv, status, id: (loanAccount?.id as string) })
                await updateSpotAsset({ asset, id: spotAccount?.id as string })
                await updateSpotAccount({ amount: (spotAccount?.total_asset as number) + borrowAmount - totalCollateralValue, spotID: spotAccount?.id as string })
                setBorrowDialogOpen(false);
                form.reset();
                setSelectedCoins([]);
            }
            catch (error) {
                console.error("Error creating loan:", error);
                alert("Failed to create loan. Please try again.");
            }
        }
    }
    const getCoinPrice = (userCrypto?: string) => {
        const coin = cryptoData?.data?.data?.find((crypto: CryptoCurrency) => crypto?.name?.toLowerCase() === userCrypto?.toLowerCase());
        return (loanAccount?.equity ?? 0) / (coin?.quote?.USD?.price ?? 1)
    };

    const roundToFourDecimalPlaces = (num: number | undefined | null): number => {
        if (num == null || isNaN(num)) return 0;
        return Math.round(num * 10000) / 10000;
    };
    const roundToTwoDecimalPlaces = (num: number | undefined | null): number => {
        if (num == null || isNaN(num)) return 0;
        return Math.round(num * 100) / 100;
    }

    const collateralValue = loanAccount?.collateral_value as number

    const toBeRepaid = loanAccount?.to_be_repaid as number

    const columns: ColumnDef<CryptoTableData>[] = [
        {
            accessorKey: "name",
            header: () => <div className="flex w-full h-auto">Borrowed</div>,
            cell: ({ row }) => {
                const data = row.original
                return (
                    <div className="flex w-full h-auto items-center py-2 space-x-2">
                        <Image src={data.symbol} alt={data.name} width={100} height={100} className="w-5 h-5 rounded-full" />
                        <div className="text-[0.91rem] text-lnd-fg-muted font-Manrope font-medium">
                            {row.getValue("name")}
                        </div>
                    </div>
                )
            }
        },
        {
            accessorKey: "to_be_repaid",
            header: () => <div className="w-full h-auto flex justify-end">To-be-repaid</div>,
            cell: ({ row }) => (
                <div className="w-full h-auto flex justify-end items-start py-4 text-[0.784rem] text-lnd-accent">{user?.balance_visibility === false ? row.getValue("to_be_repaid") : "********"}</div>
            ),
        },
        {
            accessorKey: "borrowed_amount",
            header: () => <div className="w-full h-auto flex justify-end">Borrowed Amount</div>,
            cell: ({ row }) => (
                <div className="w-full h-auto flex justify-end items-start py-4 text-[0.784rem] text-lnd-accent">{user?.balance_visibility === false ? row.getValue("borrowed_amount") : "********"}</div>
            ),
        },
        {
            accessorKey: "collateral_value",
            header: () => <div className="w-full h-auto flex justify-end">Collateral Value</div>,
            cell: ({ row }) => (
                <div className="w-full h-auto flex justify-end items-start py-4 text-[0.784rem]">{user?.balance_visibility === false ? roundToTwoDecimalPlaces(row.getValue("collateral_value")) : "********"}</div>
            ),
        },
        {
            accessorKey: "current_ltv",
            header: () => <div className="w-full h-auto flex justify-end">Current LTV</div>,
            cell: ({ row }) => (
                <div className="w-full h-auto flex justify-end items-start py-4 text-[0.784rem]">{user?.balance_visibility === false ? row.getValue("current_ltv") : "********"}</div>
            ),
        },
        {
            accessorKey: "liquidation_ltv",
            header: () => <div className="flex w-full h-auto justify-end">Liquidation LTV</div>,
            cell: ({ row }) => (
                <div className="w-full h-auto flex justify-end items-start py-4 text-[0.784rem]">{user?.balance_visibility === false ? row.getValue("liquidation_ltv") : "********"}</div>
            ),
        },
        {
            accessorKey: "status",
            header: () => <div className="flex w-full h-auto justify-end">Status</div>,
            cell: ({ row }) => (
                <div className="flex w-full justify-end items-start py-4 text-[0.784rem]">{user?.balance_visibility === false ? row.getValue("status") : "********"}</div>
            ),
        },
        {
            id: "operation",
            header: () => <div className="w-full h-auto flex justify-end mr-6 pl-20">Operation</div>,
            enableHiding: false,
            cell: () => (
                <>
                    <button className="w-full flex justify-end text-lnd-accent font-Manrope text-[.715rem] font-bold dark:text-lnd-accent disabled:text-lnd-fg" disabled={loanAccount?.to_be_repaid !== 0} onClick={() => setBorrowDialogOpen(true)}>Borrow</button>
                </>
            )
        }
    ]
    return (
        <div className="w-auto h-auto flex flex-col gap-4 dark:text-lnd-fg">
            <div className="w-auto h-auto flex items-center justify-between">
                <div className="w-auto h-auto flex items-center space-x-2.5 mb-1">
                    <span className="w-fit h-6 bg-blend-overlay">
                        <Icon icon="mdi:stop-circle" className="w-5 h-5 text-lnd-accent/30 rotate-45 relative left-1 z-50" />
                        <Icon icon="fa-solid:hand-holding" className="w-6 h-6 text-lnd-fg-muted/50 z-10 relative -top-5" />
                    </span>
                    <span className="db-title">
                        Loan
                    </span>
                </div>
                <div className="w-auto h-auto flex items-start space-x-3 dark:text-lnd-fg">
                    <Button className="flex items-center gap-1.5 bg-lnd-accent/10 hover:bg-lnd-accent/20 border border-lnd-accent/55 py-[.15rem] px-4 rounded-md dark:bg-lnd-accent/15 dark:hover:bg-lnd-accent/25">
                        <span className="w-3 h-3 bg-lnd-accent dark:bg-lnd-accent" />
                        <span className="text-lnd-accent font-Manrope text-[.715rem] font-bold dark:text-lnd-accent">
                            About Crypto Loans
                        </span>
                    </Button>
                </div>
            </div>
            <div className="w-full h-auto dark:text-lnd-fg">
                <div className="w-full lg:w-auto h-auto py-5 px-5 flex flex-col bg-lnd-surface rounded-[1.25rem] space-y-4 dark:bg-lnd-surface">
                    <div className="w-full lg:w-auto h-auto flex flex-col lg:flex-row  lg:justify-between space-y-4 lg:space-y-0 lg:gap-70 pt-1 dark:text-lnd-fg">
                        <div className="w-auto h-auto flex flex-col gap-1.5 dark:text-lnd-fg">
                            <div className="w-auto h-auto flex space-x-2.5 dark:text-lnd-fg">
                                <span>
                                    <span className="font-Manrope text-[0.88rem] text-lnd-fg mr-1.5 border-b border-lnd-border border-dashed border-spacing-[-10px] dark:text-lnd-fg-muted dark:border-lnd-border">
                                        Equity
                                    </span>
                                    <span className="font-Manrope text-[0.88rem] text-lnd-fg dark:text-lnd-fg">
                                        ({user?.crypto === "tether usdt" ? "USDT" : user?.crypto === "bitcoin" ? "BTC" : "ETH"})
                                    </span>
                                </span>
                                <DropDown />
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
                            </div>
                            <div className="w-auto h-auto flex items-center gap-5 font-Manrope dark:text-lnd-fg">
                                {
                                    user?.balance_visibility === false ?
                                        (
                                            <>
                                                <span className="text-[1.97rem] font-extrabold text-lnd-fg dark:text-lnd-fg">
                                                    {roundToFourDecimalPlaces(getCoinPrice(user?.crypto ?? ""))}
                                                </span>
                                                <span className="text-[1.3rem] font-medium text-lnd-fg-muted dark:text-lnd-fg-muted">
                                                    ≈{roundToTwoDecimalPlaces(currencyConvertion(loanAccount?.equity ?? 0))} {user?.currency}
                                                </span>
                                            </>
                                        ) :
                                        <span className="text-[1.3rem] font-medium text-lnd-fg-muted dark:text-lnd-fg-muted">
                                            ********
                                        </span>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full h-auto flex flex-col lg:flex-row lg:justify-between space-x-0 lg:space-x-5 dark:text-lnd-fg">
                <div className="w-full h-auto flex flex-row justify-between items-center lg:flex-col lg:justify-center lg:items-start px-5 py-2 lg:py-4 lg:space-y-2.5 bg-lnd-surface dark:bg-lnd-surface rounded-t-3xl lg:rounded-[1.25rem]">
                    <div className="w-full h-auto text-lnd-fg-muted lg:text-lnd-fg text-[0.9rem] font-Manrope dark:text-lnd-fg-muted">
                        Collateral ({user?.currency})
                    </div>
                    <div className="w-full h-auto text-right lg:text-left text-lg lg:text-[1.4rem] font-Manrope font-extrabold dark:text-lnd-fg">
                        {
                            user?.balance_visibility === false ? roundToTwoDecimalPlaces(currencyConvertion(collateralValue)) : "********"
                        }
                    </div>
                </div>
                <div className="w-full h-auto flex flex-row justify-between items-center lg:flex-col lg:justify-center lg:items-start px-5 py-2 lg:py-4 lg:space-y-2.5 bg-lnd-surface dark:bg-lnd-surface rounded-b-3xl lg:rounded-[1.25rem]">
                    <div className="w-full h-auto text-lnd-fg-muted lg:text-lnd-fg text-[0.9rem] font-Manrope dark:text-lnd-fg-muted">
                        To-be-repaid ({user?.currency})
                    </div>
                    <div className="w-full h-auto text-right lg:text-left text-lg lg:text-[1.4rem] font-Manrope font-extrabold dark:text-lnd-fg">
                        {
                            user?.balance_visibility === false ? roundToTwoDecimalPlaces(currencyConvertion(toBeRepaid)) : "********"
                        }
                    </div>
                </div>
            </div>
            <div className="w-auto h-auto flex flex-col bg-lnd-surface rounded-[1.25rem] dark:bg-lnd-surface">
                <CryptoTable columns={columns} data={data} />
                <div className="w-full h-auto flex flex-col lg:hidden items-center justify-end gap-y-4 px-6 py-4 dark:bg-lnd-surface">
                    <div className="w-full h-auto flex items-center justify-between dark:text-lnd-fg">
                        <span className="flex items-center gap-2 text-lnd-fg text-[0.9rem] font-Manrope dark:text-lnd-fg">
                            <Image src={"https://s2.coinmarketcap.com/static/img/coins/64x64/825.png"} alt={"usdt"} width={100} height={100} className="w-4 h-4 rounded-full" />
                            <span className="text-lg font-semibold">USDT</span>
                        </span>
                        <button disabled={loanAccount?.to_be_repaid !== 0} className="text-lnd-accent bg-lnd-accent/10 disabled:text-lnd-fg disabled:bg-lnd-surface-2 rounded-md flex px-2.5 py-1 items-center justify-center dark:bg-lnd-accent/20 dark:text-lnd-accent dark:disabled:bg-lnd-surface dark:disabled:text-lnd-fg-muted" onClick={() => setBorrowDialogOpen(true)}>
                            <BsThreeDots />
                        </button>
                    </div>
                    <div className="w-full h-auto flex flex-col gap-y-2 dark:text-lnd-fg">
                        <div className="w-full h-auto flex items-center justify-between dark:text-lnd-fg">
                            <span className="text-lnd-fg-muted text-[1rem] font-Manrope dark:text-lnd-fg-muted">To-be-repaid</span>
                            <span className="text-lnd-fg text-[1rem] font-Manrope font-medium dark:text-lnd-fg">
                                {roundToTwoDecimalPlaces(loanAccount?.to_be_repaid ?? 0).toFixed(2)}
                            </span>
                        </div>
                        <div className="w-full h-auto flex items-center justify-between dark:text-lnd-fg">
                            <span className="text-lnd-fg-muted text-[1rem] font-Manrope dark:text-lnd-fg-muted">Borrowed Amount</span>
                            <span className="text-lnd-fg text-[1rem] font-Manrope font-medium dark:text-lnd-fg">
                                {roundToTwoDecimalPlaces(loanAccount?.borrowed_amount ?? 0).toFixed(2)}
                            </span>
                        </div>
                        <div className="w-full h-auto flex items-center justify-between dark:text-lnd-fg">
                            <span className="text-lnd-fg-muted text-[1rem] font-Manrope dark:text-lnd-fg-muted">Collateral Value</span>
                            <span className="text-lnd-fg text-[1rem] font-Manrope font-medium dark:text-lnd-fg">
                                {roundToTwoDecimalPlaces(loanAccount?.collateral_value ?? 0).toFixed(2)}
                            </span>
                        </div>
                        <div className="w-full h-auto flex items-center justify-between dark:text-lnd-fg">
                            <span className="text-lnd-fg-muted text-[1rem] font-Manrope dark:text-lnd-fg-muted">Current LTV</span>
                            <span className="text-lnd-fg text-[1rem] font-Manrope font-medium dark:text-lnd-fg">
                                {roundToTwoDecimalPlaces(loanAccount?.current_ltv ?? 0).toFixed(2)}
                            </span>
                        </div>
                        <div className="w-full h-auto flex items-center justify-between dark:text-lnd-fg">
                            <span className="text-lnd-fg-muted text-[1rem] font-Manrope dark:text-lnd-fg-muted">Liquidation LTV</span>
                            <span className="text-lnd-fg text-[1rem] font-Manrope font-medium dark:text-lnd-fg">
                                {roundToTwoDecimalPlaces(loanAccount?.liquidation_ltv ?? 0).toFixed(2)}
                            </span>
                        </div>
                        <div className="w-full h-auto flex items-center justify-between dark:text-lnd-fg">
                            <span className="text-lnd-fg-muted text-[1rem] font-Manrope dark:text-lnd-fg-muted">Status</span>
                            <span className="text-lnd-fg text-[1.1rem] font-Manrope font-medium dark:text-lnd-fg">
                                {loanAccount?.status}
                            </span>
                        </div>
                    </div>
                </div>
                <Dialog open={borrowDialogOpen} onOpenChange={setBorrowDialogOpen}>
                    <Form {...form}>
                        <form
                            className="w-full h-auto flex justify-end items-start py-4 text-[0.784rem] text-lnd-accent space-x-3 mr-6"
                        >
                            <DialogContent className="w-[calc(100vw-2rem)] max-w-[21rem] lg:w-fit h-fit rounded-2xl">
                                <DialogHeader className="flex flex-row items-start justify-between pb-2">
                                    <DialogTitle className="text-lg font-semi-bold">Start Borrowing</DialogTitle>
                                </DialogHeader>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        {/* Collateral Section */}
                                        <div className="w-auto h-auto flex flex-col items-start dark:text-lnd-fg">
                                            <div className="flex items-center mb-4">
                                                <div className="w-1 h-4 bg-lnd-accent mr-2" />
                                                <h3 className="font-semibold text-[1.1rem] dark:text-lnd-fg">Collateral</h3>
                                            </div>
                                            {selectedCoins.map((coin) => {
                                                return (
                                                    <div key={coin.id}>
                                                        <div className="relative mb-3">
                                                            <div className="flex items-center bg-lnd-surface-2 rounded-md dark:bg-lnd-surface">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger>
                                                                        <div className="flex items-center pl-2 pr-2 border-r-2 border-lnd-border cursor-pointer dark:border-lnd-border">
                                                                            <div className="w-6 h-6 flex items-center justify-center">
                                                                                <Image src={coin.symbol} alt={coin.id} width={100} height={100} className="w-5 h-5 rounded-full" />
                                                                            </div>
                                                                            <span className="font-medium text-sm dark:text-lnd-fg">{coin.abv}</span>
                                                                            <ChevronDown className="h-4 w-4 mr-1 ml-2 text-lnd-fg-muted dark:text-lnd-fg-muted" />
                                                                        </div>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent
                                                                        loop
                                                                        align="start"
                                                                        className="w-48 dark:bg-lnd-surface dark:border-lnd-border"
                                                                        isInsideDialog={true}
                                                                    >
                                                                        <div className="mb-2 flex justify-between px-2 dark:text-lnd-fg-muted">
                                                                            <span className="text-lnd-fg-muted text-sm dark:text-lnd-fg-muted">Coins</span>
                                                                            <span className="text-lnd-fg-muted text-sm dark:text-lnd-fg-muted">Balance</span>
                                                                        </div>
                                                                        <ScrollArea className="w-auto h-48 flex flex-col gap-2 px-2" type="always">
                                                                            {availableCoins.map((availableCoin) => (
                                                                                <button
                                                                                    key={availableCoin.id}
                                                                                    onClick={() => swapSelectedCoin(coin.id, availableCoin)}
                                                                                    className="w-full flex justify-between items-center py-3 px-2 hover:bg-lnd-surface-2 dark:hover:bg-lnd-surface"
                                                                                >
                                                                                    <div className="flex items-center gap-2 dark:text-lnd-fg">
                                                                                        <div className="w-6 h-6 flex items-center justify-center">
                                                                                            <Image src={availableCoin.symbol} alt={availableCoin.id} width={100} height={100} className="w-5 h-5 rounded-full" />
                                                                                        </div>
                                                                                        <span className="dark:text-lnd-fg">{availableCoin.abv}</span>
                                                                                    </div>
                                                                                    <span className="dark:text-lnd-fg">{roundToTwoDecimalPlaces(availableCoin.available)}</span>
                                                                                </button>
                                                                            ))}
                                                                            <ScrollBar />
                                                                        </ScrollArea>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                                <FormField
                                                                    control={form.control}
                                                                    name="collateralAmounts"
                                                                    render={({ field }) => (
                                                                        <FormItem className="w-full h-auto flex flex-col justify-center">
                                                                            <FormControl>
                                                                                <Input
                                                                                    placeholder="Please enter the amount"
                                                                                    value={field.value?.[coin.id]}
                                                                                    onChange={e => {
                                                                                        const val = e.target.value
                                                                                        const num = Number(val)
                                                                                        field.onChange({
                                                                                            ...field.value,
                                                                                            [coin.id]: isNaN(num) ? "" : num
                                                                                        })
                                                                                    }}
                                                                                    type="number"
                                                                                    className="bg-lnd-surface-2 outline-none placeholder:text-[.85rem] placeholder:font-Manrope placeholder:text-lnd-fg-muted rounded-lg pl-5 w-full text-right pr-3 border-none focus-visible:ring-0 dark:bg-lnd-surface dark:text-lnd-fg dark:placeholder:text-lnd-fg-muted" />
                                                                            </FormControl>
                                                                            <FormMessage className="font-normal" />
                                                                        </FormItem>
                                                                    )} />
                                                                <div className="pr-3">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-7 px-3 text-lnd-accent font-medium dark:text-lnd-accent dark:hover:bg-lnd-accent/20"
                                                                        onClick={() => {
                                                                            form.setValue("collateralAmounts", {
                                                                                ...form.getValues("collateralAmounts"),
                                                                                [coin.id]: roundToTwoDecimalPlaces(coin.available)
                                                                            })
                                                                        }}
                                                                    >
                                                                        All
                                                                    </Button>
                                                                </div>
                                                                <button onClick={() => deselectCoin(coin)} className="bg-lnd-surface">
                                                                    <MinusCircle className="w-4 h-4 text-red-500" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between mt-2 text-sm mb-4 dark:text-lnd-fg-muted">
                                                            <div className="text-lnd-fg-muted dark:text-lnd-fg-muted">
                                                                Available: <span className="text-lnd-fg-muted space-x-2 dark:text-lnd-fg">
                                                                    <span>{roundToTwoDecimalPlaces(coin.available)}</span>
                                                                    <span className="dark:text-lnd-fg">{coin.abv}</span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                            <Button onClick={() => setAddCollateralDialogOpen(true)} variant="outline" className="w-full border-dashed border-lnd-border rounded-lg dark:border-lnd-border dark:text-lnd-fg dark:hover:bg-lnd-surface">
                                                <Plus className="h-4 w-4 mr-2 text-lnd-accent dark:text-lnd-accent" />
                                                <span className="dark:text-lnd-fg">Add Collateral</span>
                                            </Button>
                                        </div>
                                        {/* Borrow Section */}
                                        <div>
                                            <div className="flex items-center mb-4">
                                                <div className="w-1 h-4 bg-lnd-accent mr-2" />
                                                <h3 className="font-semibold text-[1.1rem] dark:text-lnd-fg">Borrow</h3>
                                            </div>
                                            <div className="relative mb-3">
                                                <div className="flex items-center bg-lnd-surface-2 rounded-md dark:bg-lnd-surface">
                                                    <div className="w-20 flex items-center pl-2 pr-3 space-x-1 border-r-2 border-lnd-border">
                                                        <Image src={"https://s2.coinmarketcap.com/static/img/coins/64x64/825.png"} alt={"usdt"} width={100} height={100} className="w-4 h-4 rounded-full" />
                                                        <span className="font-medium text-xs dark:text-lnd-fg">USDT</span>
                                                    </div>
                                                    <div className="w-full">
                                                        <label htmlFor="borrow-amount" className="sr-only">
                                                            Enter borrow amount
                                                        </label>
                                                        <FormField
                                                            control={form.control}
                                                            name="borrowAmount"
                                                            render={({ field }) => (
                                                                <FormItem className="w-full h-auto flex flex-col justify-center">
                                                                    <FormControl>
                                                                        <Input
                                                                            type="number"
                                                                            placeholder="Please enter the amount"
                                                                            value={field.value}
                                                                            onChange={e => {
                                                                                const val = e.target.value;
                                                                                const num = Number(val);
                                                                                field.onChange(isNaN(num) ? "" : num);
                                                                            }}
                                                                            className="bg-lnd-surface-2 outline-none placeholder:text-[.85rem] placeholder:font-Manrope placeholder:text-lnd-fg-muted rounded-lg pl-5 w-full dark:bg-lnd-surface dark:text-lnd-fg dark:placeholder:text-lnd-fg-muted" />
                                                                    </FormControl>
                                                                    <FormMessage className="font-normal" />
                                                                </FormItem>
                                                            )} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-sm mb-4 text-lnd-fg-muted dark:text-lnd-fg-muted">
                                                <span className="text-lnd-fg-muted dark:text-lnd-fg-muted">
                                                    Max Borrow: <span className="text-lnd-fg-muted font-semibold dark:text-lnd-fg">{roundToTwoDecimalPlaces(maxBorrow())}</span>
                                                </span>
                                                <span className="text-lnd-fg-muted dark:text-lnd-fg"> USDT</span>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                onClick={form.handleSubmit(onSubmit)}
                                                disabled={form.formState.isSubmitting}
                                                className="w-full bg-lnd-accent hover:bg-lnd-accent/90 text-lnd-accent-fg rounded-[1.25rem] dark:bg-lnd-accent dark:hover:bg-lnd-accent/90"
                                            >
                                                Confirm
                                            </Button>
                                        </DialogFooter>
                                    </div>
                                    {/* LTV Information */}
                                    <div className="w-auto bg-lnd-surface-2 rounded-lg p-6 dark:bg-lnd-surface">
                                        <div className="mb-6">
                                            <p className="w-fit text-lnd-fg-muted text-sm border-b border-dashed border-lnd-border pb-1 dark:text-lnd-fg-muted dark:border-lnd-border">Est. LTV</p>
                                            <p className="text-2xl font-semibold mt-2 dark:text-lnd-fg">
                                                {ltv == 0 ? "--" : `${ltv}%`}
                                            </p>
                                        </div>
                                        <div className="w-auto flex flex-row items-start justify-between gap-2 dark:text-lnd-fg">
                                            <div className="flex flex-col items-center justify-start">
                                                <p className="w-fit text-lnd-fg-muted text-xs border-b border-dashed border-lnd-border dark:text-lnd-fg-muted dark:border-lnd-border">Initial LTV</p>
                                                <p className="text-lg font-semibold dark:text-lnd-fg">80%</p>
                                                <div className="bg-green-100 text-green-600 text-xs rounded-full px-3 py-0.5 inline-block mt-1 dark:bg-green-800/20 dark:text-green-400">Low</div>
                                            </div>
                                            <div className="flex flex-col items-center justify-start">
                                                <p className="w-fit text-lnd-fg-muted text-xs border-b border-dashed border-lnd-border dark:text-lnd-fg-muted dark:border-lnd-border">Liquidation LTV</p>
                                                <p className="text-lg font-semibold dark:text-lnd-fg">97%</p>
                                                <div className="bg-red-100 text-red-600 text-xs rounded-full px-3 py-0.5 inline-block mt-1 dark:bg-red-800/20 dark:text-red-400">High</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                        </form>
                    </Form>
                </Dialog>
                <Dialog open={addCollateralDialogOpen} onOpenChange={setAddCollateralDialogOpen}>
                    <DialogContent className="w-[calc(100vw-2rem)] max-w-96 h-auto rounded-2xl dark:bg-lnd-surface dark:border-lnd-border">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold dark:text-lnd-fg">Add Collateral</h2>
                        </div>
                        <div className="mb-2 flex justify-between px-2">
                            <span className="text-lnd-fg-muted text-sm dark:text-lnd-fg-muted">Coins</span>
                            <span className="text-lnd-fg-muted text-sm dark:text-lnd-fg-muted">Balance</span>
                        </div>
                        <ScrollArea className="max-h-60 overflow-y-auto">
                            {availableCoins.map((coin) => (
                                <button key={coin.id} onClick={() => { selectCoin(coin); setAddCollateralDialogOpen(false) }} className="w-full flex justify-between items-center py-3 px-2 hover:bg-lnd-surface-2 dark:hover:bg-lnd-surface">
                                    <div className="flex items-center gap-2 dark:text-lnd-fg">
                                        <div className="w-6 h-6 flex items-center justify-center">
                                            <Image src={coin.symbol} alt={coin.id} width={100} height={100} className="w-5 h-5 rounded-full" />
                                        </div>
                                        <span className="font-medium dark:text-lnd-fg">{coin.abv}</span>
                                    </div>
                                    <span className="dark:text-lnd-fg">{roundToTwoDecimalPlaces(coin.available)}</span>
                                </button>
                            ))}
                            <ScrollBar />
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
