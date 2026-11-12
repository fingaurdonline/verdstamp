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
            <SelectTrigger className="w-32 sm:w-40 h-7 flex items-center px-3 space-x-2 border hover:border-lnd-accent/55 transition-all duration-300">
                <SelectValue placeholder="Select Currency" />
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
