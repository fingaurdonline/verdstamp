"use client"
import { Search, User2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { api } from "@convex/_generated/api";
import useCryptoList from "@/hooks/useCryptoData"
import { CryptoCurrency, futuresAssetType } from "@/lib/types"
import { useMemo, useState } from "react";
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
import { useQuery, useMutation } from "convex/react";

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

export default function CryptoMobileTable() {
    const user = useQuery(api.user.user)
    const [drawerRow, setDrawerRow] = useState<string | false>(false)
    const { data: cryptoData } = useCryptoList()
    const futuresAccount = useQuery(api.accounts.view_all_futures_accounts) ?? []
    const router = useRouter()

    const roundToFourDecimalPlaces = (num: number): number => {
        return Math.round(num * 10000) / 10000;
    };
    const roundToTwoDecimalPlaces = (num: number): number => {
        return Math.round(num * 100) / 100;
    };
    const futuresAcc: any = (futuresAccount as any[])?.find((acc: any) => acc?.user === (user as any)?._id || acc?.user === (user as any)?.userId || acc?.user === (user as any)?.id)

    const onlyFuturesAssets = cryptoData?.data?.data?.filter((crypto: CryptoCurrency) => {
        const key = ((crypto?.symbol)).toLowerCase();
        return ['btc', 'usdt', 'usdc', 'eth'].some(k => key.includes(k));
    });

    const data: CryptoTableData[] = useMemo(() => {

        const assetsObj = futuresAcc?.assets as futuresAssetType;
        const assetList = assetsObj ? Object.values(assetsObj) : [];

        return onlyFuturesAssets?.map((currency: CryptoCurrency) => {
            // find the matching asset in the futures account
            const existingCoin = assetList?.find((asset) => {
                const coinName = Array?.isArray(asset?.coin)
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
                in_order: existingCoin?.inOrder ?? 0,
                unrealized_pnl: existingCoin?.unrealizedPNL ?? 0,
            };
        });
    }, [onlyFuturesAssets, futuresAcc]);

    // const getCoinPrice = (userCrypto: string) => {
    //     const coin = cryptoData?.data?.data?.find((crypto: CryptoCurrency) => crypto?.name?.toLowerCase() === userCrypto?.toLowerCase());
    //     return futuresAcc?.total_asset / coin?.quote?.USD?.price as number
    // };
    return (
        <div className="w-full h-auto p-3 pt-6 rounded-2xl mx-auto bg-lnd-surface flex lg:hidden flex-col space-y-3 dark:bg-lnd-surface">
            <div className="w-full marker:px-4">
                <div className="flex w-full mb-4 bg-transparent p-0 border-b dark:border-lnd-border">
                    <div
                        className="border-b-2 border-lnd-accent/55 text-lnd-fg rounded-none py-2 pr-4 font-medium whitespace-nowrap dark:text-lnd-fg dark:border-lnd-accent/55"
                    >
                        All Assets
                    </div>
                </div>
                {
                    data?.length > 0 ?
                        (<>
                            {
                                data?.map((crypto: CryptoTableData) => (
                                    <div key={crypto?.id} className="border-b py-4 dark:border-lnd-border">
                                        <div className="flex items-center justify-between gap-2 mb-4">
                                            <div className="flex min-w-0 items-center gap-2">
                                                <Image src={crypto?.symbol} alt={crypto?.coin} width={100} height={100} className="w-5 h-5 shrink-0 rounded-full" />
                                                <div className="min-w-0 space-x-1.5 truncate">
                                                    <span className="text-sm font-medium dark:text-lnd-fg">{crypto?.coin}</span>
                                                </div>
                                            </div>
                                            <div className="flex shrink-0 gap-2">
                                                <button
                                                    onClick={() => {
                                                        setDrawerRow(crypto.id);
                                                    }}
                                                    className="text-lnd-accent bg-lnd-accent/10 rounded-md flex px-2.5 py-1 items-center justify-center dark:text-lnd-accent dark:bg-lnd-accent/15">
                                                    <BsThreeDots />
                                                </button>
                                                <Drawer open={drawerRow === crypto.id} onOpenChange={(isOpen) => setDrawerRow(isOpen ? crypto.id : false)}>
                                                    <DrawerContent className="w-full h-auto flex flex-col items-center dark:bg-lnd-surface">
                                                        <span className="flex flex-col w-full items-center py-4 space-y-5">
                                                            <button onClick={() => router.push("/transfer")} className="w-full text-[.95rem] font-Manrope dark:text-lnd-fg">
                                                                Transfer
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    router.push(`/overview/trade/futures/${crypto.abv}/USDT`);
                                                                    setDrawerRow(false);
                                                                }}
                                                                className="w-full text-[.95rem] font-Manrope dark:text-lnd-fg"
                                                            >
                                                                Trade
                                                            </button>
                                                            <button
                                                                onClick={() => setDrawerRow(false)}
                                                                className="w-full text-[.95rem] font-Manrope border-t-8 border-lnd-border pt-2.5 dark:border-lnd-border dark:text-lnd-fg">
                                                                Cancel
                                                            </button>
                                                        </span>
                                                    </DrawerContent>
                                                </Drawer>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-y-2 text-[.95rem]">
                                            <div className="text-lnd-fg-muted/90 mb-2 dark:text-lnd-fg-muted">Equity</div>
                                            <div className="text-right text-sm text-lnd-accent mb-2 dark:text-lnd-accent">{user?.balance_visibility === false ? roundToTwoDecimalPlaces(crypto?.equity) : "********"}</div>

                                            <div className="text-lnd-fg-muted/90 dark:text-lnd-fg-muted">Balance</div>
                                            <div className="flex flex-col space-y-1 text-right text-sm dark:text-lnd-fg">
                                                <span>{user?.balance_visibility === false ? roundToTwoDecimalPlaces(crypto?.balance) : "********"}</span>
                                            </div>
                                            <div className="text-lnd-fg-muted/90 dark:text-lnd-fg-muted">Available</div>
                                            <div className="flex flex-col space-y-1 text-right text-sm dark:text-lnd-fg">
                                                <span>{user?.balance_visibility === false ? roundToTwoDecimalPlaces(crypto?.available) : "********"}</span>
                                            </div>
                                            <div className="text-lnd-fg-muted/90 dark:text-lnd-fg-muted">InOrder</div>
                                            <div className="flex flex-col space-y-1 text-right text-sm dark:text-lnd-fg">
                                                <span>{user?.balance_visibility === false ? roundToTwoDecimalPlaces(crypto?.in_order) : "********"}</span>
                                            </div>
                                            <div className="text-lnd-fg-muted/90 dark:text-lnd-fg-muted">Unrealized PNL</div>
                                            <div className="flex flex-col space-y-1 text-right text-sm dark:text-lnd-fg">
                                                <span>{user?.balance_visibility === false ? roundToTwoDecimalPlaces(crypto?.unrealized_pnl) : "********"}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </>) : (
                            <div className="w-full h-auto flex flex-col items-center justify-center text-center text-lnd-fg-muted py-4 dark:text-lnd-fg-muted">
                                <NoData className="w-20 h-20" />
                                No assets available
                            </div>
                        )
                }
            </div>
        </div>
    )
}
