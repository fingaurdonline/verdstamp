"use client"
import { Pie, PieChart } from "recharts"

import {
    ChartConfig,
    ChartContainer,
} from "@/components/ui/chart"



export function TotalChart({ available, frozen }: { available: number, frozen: number }) {
    const chartData = [
        { Crypto: "Available", Amount: available as number, fill: "hsl(var(--chart-1))" },
        { Crypto: "Frozen", Amount: frozen as number, fill: "hsl(var(--chart-2))" },
    ]

    const chartConfig = {
        Available: {
            label: "Available",
            color: "hsl(var(--chart-1))",
        },
        Frozen: {
            label: "Frozen",
            color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig
    return (
        <ChartContainer
            config={chartConfig}
            className="w-28 h-24"
        >
            <PieChart
                width={10}
                height={10}
            >
                <Pie
                    data={chartData}
                    dataKey="Amount"
                    nameKey="Crypto"
                    innerRadius={21}
                />
            </PieChart>
        </ChartContainer>
    )
}
