"use client"

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import CountUp from "../../../components/reactbits/CountUp";

export default function ValueInfo() {
    const numbers = useQuery(api.misc.numbers)

    function formatNumber(num: number) {
        const formattedValue = (value: number) => (
            <CountUp
                from={0}
                to={value}
                direction="up"
                duration={0.5}
                className="count-up-text"
            />
        );

        if (num >= 1_000_000_000) {
            return (
                <>
                    {formattedValue(Math.round((num / 1_000_000_000) * 100) / 100)}
                    B
                </>
            );
        } else if (num >= 1_000_000) {
            return (
                <>
                    {formattedValue(Math.round((num / 1_000_000) * 100) / 100)}
                    M
                </>
            );
        } else if (num >= 1_000) {
            return (
                <>
                    {formattedValue(Math.round((num / 1_000) * 100) / 100)}
                    K
                </>
            );
        }
        return formattedValue(Math.round(num * 100) / 100);
    }

    return (
        <div className="grid grid-cols-2 gap-px bg-lnd-border lg:grid-cols-4">
            <div className="flex flex-col gap-2 bg-lnd-bg px-5 py-7 lg:px-8 lg:py-10">
                <span className="font-Manrope text-3xl font-bold tracking-tight text-lnd-fg lg:text-5xl">
                    {!numbers ? (
                        "--"
                    ) : (
                        <CountUp
                            from={0}
                            to={numbers.coins}
                            direction="up"
                            duration={0.5}
                            className="count-up-text"
                        />
                    )}
                </span>
                <span className="text-xs uppercase tracking-[0.14em] text-lnd-fg-muted lg:text-sm">
                    Coins
                </span>
            </div>

            <div className="flex flex-col gap-2 bg-lnd-bg px-5 py-7 lg:px-8 lg:py-10">
                <span className="font-Manrope text-3xl font-bold tracking-tight text-lnd-fg lg:text-5xl">
                    {!numbers ? (
                        "--"
                    ) : (
                        <CountUp
                            from={0}
                            to={numbers.markets}
                            direction="up"
                            duration={0.5}
                            className="count-up-text"
                        />
                    )}
                </span>
                <span className="text-xs uppercase tracking-[0.14em] text-lnd-fg-muted lg:text-sm">
                    Markets
                </span>
            </div>

            <div className="flex flex-col gap-2 bg-lnd-bg px-5 py-7 lg:px-8 lg:py-10">
                <span className="font-Manrope text-3xl font-bold tracking-tight text-lnd-fg lg:text-5xl">
                    {!numbers ? "--" : formatNumber(numbers.twenty_four_hours)}
                </span>
                <span className="text-xs uppercase tracking-[0.14em] text-lnd-fg-muted lg:text-sm">
                    24-hour value (USD)
                </span>
            </div>

            <div className="flex flex-col gap-2 bg-lnd-bg px-5 py-7 lg:px-8 lg:py-10">
                <span className="font-Manrope text-3xl font-bold tracking-tight text-lnd-fg lg:text-5xl">
                    {!numbers ? "--" : formatNumber(numbers.thirty_days)}
                </span>
                <span className="text-xs uppercase tracking-[0.14em] text-lnd-fg-muted lg:text-sm">
                    30-day value (USD)
                </span>
            </div>
        </div>
    )
}
