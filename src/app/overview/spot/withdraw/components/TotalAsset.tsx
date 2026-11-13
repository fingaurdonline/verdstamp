"use client"
import { useQuery } from "convex/react"
import { api } from "@convex/_generated/api"
import useCryptoList from "@/hooks/useCryptoData"
import { TotalChart } from "./TotalChart"
import { CryptoCurrency, spotAssetType } from "@/lib/types"

export default function TotalAsset(
    { value }: {
        value: string
    }
) {
    const spotAccounts = useQuery(api.accounts.view_all_spot_accounts)
    const { data: cryptoData } = useCryptoList()
    const crypto = cryptoData?.data?.data?.find((crypto: CryptoCurrency) => crypto?.name === value) as CryptoCurrency
    const spotAccount = spotAccounts?.[0]
    const targetCoinName = crypto?.name ? crypto.name.toLowerCase() : undefined;
    const Coin = (spotAccount?.assets && targetCoinName)
        ? Object.values(spotAccount.assets as spotAssetType).find((coin) => coin?.coin === targetCoinName)
        : undefined

    const roundToTwoDecimalPlaces = (num: number | undefined | null): number => {
        const value = Number(num);
        if (!Number.isFinite(value)) return 0;
        return Math.round(value * 100) / 100;
    };

    return (
        <div className="w-full h-auto hidden lg:flex">
            <TotalChart available={Coin?.available as number} frozen={Coin?.frozen as number} />
            <div className="w-full h-auto flex flex-col pt-2">
                <div className="w-full h-auto flex justify-between text-[.903rem] font-bold pb-4">
                    <span className="pl-1 font-Manrope">
                        Total Assets
                    </span>
                    <span>
                        {roundToTwoDecimalPlaces((Coin?.available as number) + (Coin?.frozen as number))} {crypto?.symbol}
                    </span>
                </div>
                <div className="w-full h-auto flex justify-between text-[.775rem] text-lnd-fg-muted font-Manrope">
                    <span className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-lnd-accent" />
                        <span className="text-[.765rem]">
                            Available
                        </span>
                    </span>
                    <span>
                        {roundToTwoDecimalPlaces(Coin?.available as number)} {crypto?.symbol}
                    </span>
                </div>
                <div className="w-full h-auto flex justify-between text-[.775rem] text-lnd-fg-muted font-Manrope">
                    <span className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-lnd-surface-2" />
                        <span className="text-[.765rem]">
                            Frozen
                        </span>
                    </span>
                    <span>
                        {roundToTwoDecimalPlaces(Coin?.frozen as number)} {crypto?.symbol}
                    </span>
                </div>
            </div>
        </div>
    )
}
