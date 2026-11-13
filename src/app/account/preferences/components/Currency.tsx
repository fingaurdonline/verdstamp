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
import useCurrencies from "@/hooks/useCurrency";

export function Currency() {
    const user = useQuery(api.user.user)
    const updateCurrency = useMutation(api.user.update_currency)
    const { data: currencies } = useCurrencies()

    const handleCurrencyChange = (value: string) => {
        updateCurrency({ currency: value })
    }

    const currencyList = Object.keys(currencies?.data?.conversion_rates ?? {})

    return (
        <Select value={user?.currency} onValueChange={handleCurrencyChange}>
            <SelectTrigger className="flex h-9 w-28 items-center gap-2 rounded-md border px-2.5 text-sm transition-all duration-300 hover:border-lnd-accent/55 [&>span]:truncate sm:w-40">
                <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
                <SelectGroup>
                    <SelectLabel>Available Currencies</SelectLabel>
                    {currencyList.map((code) => (
                        <SelectItem key={code} value={code}>
                            {code}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
