"use client"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

const FEE_ASSETS = [
    { label: "USDT", value: "USDT" },
    { label: "BTC", value: "BTC" },
    { label: "ETH", value: "ETH" },
]

export function PayWithdrawalFee() {
    const user = useQuery(api.user.user)
    const updateWithdrawFee = useMutation(api.user.update_withdraw_fee)

    const handleFeeChange = (value: string) => {
        updateWithdrawFee({ asset: value })
    }

    return (
        <Select value={user?.withdraw_fee_asset} onValueChange={handleFeeChange}>
            <SelectTrigger className="w-32 sm:w-40 lg:w-32 h-7 flex items-center lg:px-3 space-x-2 border hover:border-lnd-accent/55 transition-all duration-300">
                <SelectValue placeholder="Select Asset" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Pay Fees With</SelectLabel>
                    {FEE_ASSETS.map((asset) => (
                        <SelectItem key={asset.value} value={asset.value}>
                            {asset.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
