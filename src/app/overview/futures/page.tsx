"use client"
import { Button } from "@/components/ui/button"
import DropDown from "../components/DropDown";;
import CryptoTable from "./components/CryptoTable";
import { Icon } from "@iconify/react"
import { ColumnDef } from "@tanstack/react-table"
import { Eye, User2 } from "lucide-react";
import { api } from "@convex/_generated/api"
import { useQuery } from "convex/react";
import useCryptoList from "@/hooks/useCryptoData"
import { CryptoCurrency, futuresAssetType } from "@/lib/types"
import { useMemo, useState } from "react";
import { MdCandlestickChart, MdOutlineArrowDropDown, MdOutlineArrowDropUp } from "react-icons/md"
import Image from "next/image";
import { ChevronDown, Info } from "lucide-react"
import { Dialog, DialogContent, } from "@/components/ui/dialog"
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
import CryptoMobileTable from "./components/CryptoMobileTable";
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
import { useMutation } from "convex/react";

type CryptoTableData = {
    id: string
    coin: string
    abv: string
    symbol: string
    equity: number
    balance: number
    available: number
    in_order: number
    unrealized_pnl: number
}

export default function Futures() {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const user = useQuery(api.user.user)
    const updateUser = useMutation(api.user.updateUser)
    const { data: currency } = useCurrencies()
    const futuresAccount = useQuery(api.accounts.view_all_futures_accounts) ?? []
    const futuresAcc: any = (futuresAccount as any[])?.find((acc: any) => acc?.user === user?.userId)
    const { data: cryptoData } = useCryptoList()

    const roundToFourDecimalPlaces = (num: number): number => {
        return Math.round(num * 10000) / 10000;
    };
    const roundToTwoDecimalPlaces = (num: number): number => {
        return Math.round(num * 100) / 100;
    };
    const getCoinPrice = (userCrypto: string) => {
        const coin = cryptoData?.data?.data?.find((crypto: CryptoCurrency) => crypto?.name?.toLowerCase() === userCrypto?.toLowerCase());
        if (!coin?.quote?.USD?.price || !futuresAcc?.total_asset) return 0;
        return futuresAcc.total_asset / coin.quote.USD.price;
    };

    const currencies = Object.entries(currency?.data?.conversion_rates ?? {})
    function currencyConvertion(amount: number) {
        let Rate = 0
        currencies?.find(([code, rate]: any) => {
            code == user?.currency
            Rate = amount * rate
            console.log(code, rate)
        })
        if (user?.currency == "USD") {
            return amount
        }
        return Rate
    }


    // Safely compute totalAvailable
    const totalAvailable = (() => {
        const assets = futuresAcc?.assets as futuresAssetType;
        if (!assets) return 0;
        return Object.values(assets).reduce<number>((acc, asset: any) => {
            if (!asset) return acc;
            let availableNum = 0;
            if (typeof asset.available === "number") {
                availableNum = asset.available;
            } else if (typeof asset.available === "string") {
                availableNum = parseFloat(asset.available) || 0;
            } else if (Array.isArray(asset.available)) {
                availableNum = Number(asset.available[0]) || 0;
            }

            const assetKey = (asset.coin ?? "").toString().toLowerCase();
            const coin = cryptoData?.data?.data?.find((c: CryptoCurrency) => {
                const name = (c?.name ?? "").toString().toLowerCase();
                const symbol = (c?.symbol ?? "").toString().toLowerCase();
                return name === assetKey || symbol === assetKey;
            });

            const priceUsd = coin?.quote?.USD?.price ?? (["usdt", "tether", "usdc"].includes(assetKey) ? 1 : 0);
            return acc + availableNum * priceUsd;
        }, 0);
    })();

    // Safely compute totalUnrealizedPNL
    const totalUnrealizedPNL = (() => {
        const assets = futuresAcc?.assets as futuresAssetType;
        if (!assets) return 0;
        return Object.values(assets).reduce<number>((acc, asset: any) => {
            if (!asset) return acc;
            let unrealizedPNL = 0;
            if (Array.isArray(asset.unrealizedPNL)) {
                unrealizedPNL = Number(asset.unrealizedPNL[0]) || 0;
            } else if (typeof asset.unrealizedPNL == "number") {
                unrealizedPNL = asset.unrealizedPNL || 0;
            } else if (typeof asset.unrealizedPNL == "string") {
                unrealizedPNL = Number(asset.unrealizedPNL) || 0;
            }
            return acc + unrealizedPNL;
        }, 0);
    })();

    const onlyFuturesAssets = (cryptoData?.data?.data ?? []).filter((crypto: CryptoCurrency) => {
        const key = (crypto?.symbol).toLowerCase();
        return ['btc', 'usdt', 'usdc', 'eth'].some(k => key.includes(k));
    });

    // 2) Map those coins into the table rows
    const data: CryptoTableData[] = useMemo(() => {
        if (!onlyFuturesAssets.length) return [];

        const assetsObj = futuresAcc?.assets as futuresAssetType;
        const assetList = assetsObj ? Object.values(assetsObj) : [];

        return onlyFuturesAssets.map((currency: CryptoCurrency) => {
            // find the matching asset in the futures account
            const existingCoin = assetList.find((asset) => {
                const coinName = Array.isArray(asset?.coin)
                    ? String(asset.coin[0] ?? '')
                    : String(asset?.coin ?? '');
                return coinName.toLowerCase() === (currency.name ?? '').toLowerCase();
            });

            return {
                id: currency.id,
                coin: currency.name,
                symbol: `https://s2.coinmarketcap.com/static/img/coins/64x64/${currency.id}.png`,
                abv: currency.symbol,
                equity: existingCoin?.equity ?? 0,
                balance: existingCoin?.balance ?? 0,
                available: existingCoin?.available ?? 0,
                in_order: existingCoin?.inOrder ?? 0,          // snake_case to match type
                unrealized_pnl: existingCoin?.unrealizedPNL ?? 0,
            };
        });
    }, [onlyFuturesAssets, futuresAcc]);

    const columns: ColumnDef<CryptoTableData>[] = [
        {
            accessorKey: "coin",
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
                                <MdOutlineArrowDropUp className="w-3.5 h-3.5 text-lnd-fg-muted dark:text-lnd-fg-muted" />
                                <MdOutlineArrowDropDown className={`w-3.5 h-3.5 ${column.getIsSorted() ? "text-lnd-accent" : "text-lnd-fg-muted dark:text-lnd-fg-muted"}`} />
                            </span>
                        </button>
                    </div>
                ),
            cell: ({ row }) => {
                const data = row.original
                return (
                    <div className="flex w-full h-auto items-center py-2 space-x-2">
                        <Image src={data.symbol} alt={data.coin} width={100} height={100} className="w-5 h-5 rounded-full" />
                        <div className="text-[0.784rem] text-lnd-fg-muted/60 font-medium dark:text-lnd-fg-muted">
                            {data.coin}
                        </div>
                    </div>
                )
            }
        },
        {
            accessorKey: "equity",
            header: () => <div className="w-full h-auto pr-12 flex justify-end dark:text-lnd-fg">Equity</div>,
            cell: ({ row }) => (
                <div className="w-full h-auto pr-12 flex justify-end items-start py-4 text-[0.784rem] text-lnd-accent dark:text-lnd-accent">{user?.balance_visibility === false ? roundToFourDecimalPlaces(row.getValue("equity")) : "********"}</div>
            ),
        },
        {
            accessorKey: "balance",
            header: () => <div className="w-full h-auto pr-12 flex justify-end dark:text-lnd-fg">Balance</div>,
            cell: ({ row }) => (
                <div className="w-full h-auto pr-12 flex justify-end items-start py-4 text-[0.784rem] text-lnd-accent dark:text-lnd-accent">{user?.balance_visibility === false ? roundToTwoDecimalPlaces(row.getValue("balance")) : "********"}</div>
            ),
        },
        {
            accessorKey: "available",
            header: () => <div className="w-full h-auto pr-12 flex justify-end dark:text-lnd-fg">Available</div>,
            cell: ({ row }) => (
                <div className="w-full h-auto pr-12 flex justify-end items-start py-4 text-[0.784rem] dark:text-lnd-accent">{user?.balance_visibility === false ? roundToTwoDecimalPlaces(row.getValue("available")) : "********"}</div>
            ),
        },
        {
            accessorKey: "in_order",
            header: () => <div className="w-full h-auto pr-12 flex justify-end dark:text-lnd-fg">In Order</div>,
            cell: ({ row }) => (
                <div className="w-full h-auto pr-12 flex justify-end items-start py-4 text-[0.784rem] dark:text-lnd-accent">{user?.balance_visibility === false ? roundToTwoDecimalPlaces(row.getValue("in_order")) : "********"}</div>
            ),
        },
        {
            accessorKey: "unrealized_pnl",
            header: (
                ({ column }) => (
                    <div className="flex w-full h-auto justify-end pl-4 dark:text-lnd-fg">
                        Unrealized PNL
                    </div>
                )
            ),
            cell: ({ row }) => (
                <div className="flex w-full justify-end items-start py-4 text-[0.784rem] dark:text-lnd-accent">{user?.balance_visibility === false ? roundToTwoDecimalPlaces(row.getValue("unrealized_pnl")) : "********"}USD</div>
            ),
        },
        {
            id: "operation",
            header: () => <div className="w-full h-auto flex justify-end mr-6 pl-10 dark:text-lnd-fg">Operation</div>,
            enableHiding: false,
            cell: ({ row }) => {
                return (
                    <div className="w-full h-auto flex justify-end items-start py-4 text-[0.784rem] text-lnd-accent space-x-3 mr-6 dark:text-lnd-accent">
                        <button onClick={() => router.push("/transfer")}>
                            Transfer
                        </button>
                        <button onClick={() => router.push(`/overview/trade/futures/${row.original.abv}/USDT`)}>
                            Trade
                        </button>
                    </div>
                )
            },
        }
    ]
    return (
        <div className="flex w-full flex-col gap-5">
            <div className="w-auto h-auto flex items-center gap-2.5">
                <span className="w-fit h-6 bg-blend-overlay">
                    <Icon icon="eva:file-text-fill" className="w-6 h-6 text-lnd-accent/30 relative z-50" />
                    <Icon icon="heroicons:pencil-16-solid" className="w-4 h-4 text-lnd-fg-muted/50 relative -rotate-45 -top-4 left-3 z-10" />
                </span>
                <h1 className="db-title">
                    Futures
                </h1>
            </div>
            <div className="w-full h-auto">
                <div className="w-full lg:w-auto h-auto py-5 px-5 flex flex-col bg-lnd-surface dark:bg-lnd-surface rounded-[1.25rem] space-y-4">
                    <div className="flex w-full flex-wrap items-start justify-between gap-3 pt-1 lg:w-auto lg:flex-nowrap lg:gap-70">
                        <div className="flex h-auto w-full min-w-0 flex-col gap-1.5">
                            <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1">
                                <span className="min-w-0 break-words font-Manrope text-[0.88rem] text-lnd-fg dark:text-lnd-fg">
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
                                                <span className="text-[1.96rem] font-extrabold text-lnd-fg dark:text-lnd-fg">
                                                    {roundToFourDecimalPlaces(getCoinPrice(user?.crypto ?? ""))}
                                                </span>
                                                <span className="text-[1.3rem] font-medium text-lnd-fg-muted dark:text-lnd-fg-muted">
                                                    ≈{roundToTwoDecimalPlaces(currencyConvertion(futuresAcc?.total_asset))} {user?.currency}
                                                </span>
                                            </>
                                        ) :
                                        <span className="text-[1.3rem] font-medium text-lnd-fg-muted">
                                            ********
                                        </span>
                                }
                            </div>
                        </div>
                        <div className="w-fit lg:w-auto h-auto flex items-start justify-end lg:justify-normal ">
                            <Button className="w-full lg:w-fit flex items-center gap-2 bg-lnd-accent/10 dark:bg-lnd-accent/20 hover:bg-lnd-accent/10 dark:hover:bg-lnd-accent/30 py-1.5 lg:px-8 rounded-lg">
                                <span className="w-auto h-fit">
                                    <FaClone className="w-2.5 h-1.5 text-lnd-accent relative top-2 right-1 z-0" />
                                    <BiTransferAlt className="w-1 h-1 text-lnd-accent relative bottom-1 right-2 z-10" />
                                </span>
                                <span className="hidden lg:block text-lnd-accent font-Manrope text-xs font-bold">
                                    Transfer History
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full h-auto flex flex-col lg:flex-row lg:justify-between space-x-0 lg:space-x-5">
                <div className="w-full h-auto flex flex-row justify-between items-center lg:flex-col lg:justify-center lg:items-start px-5 py-2 lg:py-4 lg:space-y-2.5 bg-lnd-surface dark:bg-lnd-surface rounded-t-3xl lg:rounded-[1.25rem]">
                    <div className="w-full h-auto text-lnd-fg-muted dark:text-lnd-fg-muted lg:text-lnd-fg text-[0.9rem] font-Manrope">
                        Available ({user?.currency})
                    </div>
                    <div className="w-full h-auto text-right lg:text-left text-lg lg:text-[1.4rem] font-Manrope font-extrabold text-lnd-fg dark:text-lnd-fg">
                        {
                            user?.balance_visibility === false ? roundToTwoDecimalPlaces(currencyConvertion(totalAvailable)) : "********"
                        }
                    </div>
                </div>
                <div className="w-full h-auto flex flex-row justify-between items-center lg:flex-col lg:justify-center lg:items-start px-5 py-2 lg:py-4 lg:space-y-2.5 bg-lnd-surface dark:bg-lnd-surface rounded-b-3xl lg:rounded-[1.25rem]">
                    <div className="w-full h-auto text-lnd-fg-muted dark:text-lnd-fg-muted lg:text-lnd-fg text-[0.9rem] font-Manrope">
                        Unrealized PNL ({user?.currency})
                    </div>
                    <div className="w-full h-auto text-right lg:text-left text-lg lg:text-[1.4rem] font-Manrope font-extrabold text-lnd-fg dark:text-lnd-fg">
                        {
                            user?.balance_visibility === false ? roundToTwoDecimalPlaces(currencyConvertion(totalUnrealizedPNL)) : "********"
                        }
                    </div>
                </div>
            </div>
            <div className="w-full h-auto hidden lg:flex flex-col bg-lnd-surface dark:bg-lnd-surface rounded-[1.25rem]">
                <CryptoTable columns={columns} data={data ?? []} />
            </div>
            <CryptoMobileTable />
        </div>

    )
}
