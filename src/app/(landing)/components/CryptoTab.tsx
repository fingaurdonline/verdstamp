"use client"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import useCryptoData from "@/hooks/useCryptoData"
import { CryptoCurrency } from "@/lib/types"
import NoData from "@/components/icons/NoData"
import Loader from "./Loader"
import CryptoLogo from "./CryptoLogo"

function formatNumber(num: number): string {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + "T"
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B"
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M"
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K"
    return num.toString()
}

function formatPrice(num: number): string {
    if (Math.abs(num) >= 1) {
        return num.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    }
    return num.toLocaleString("en-US", { maximumFractionDigits: 6 })
}

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value))
}

function priceAtChange(current: number, change: number) {
    const factor = 1 + change / 100
    if (!Number.isFinite(factor) || factor <= 0) return current
    return current / factor
}

function buildSparklinePath(values: number[], width = 112, height = 40) {
    if (values.length < 2) return ""

    const paddingX = 2
    const paddingY = 5
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min
    const usableWidth = width - paddingX * 2
    const usableHeight = height - paddingY * 2

    const points = values.map((value, index) => ({
        x: paddingX + (index / (values.length - 1)) * usableWidth,
        y:
            range === 0
                ? height / 2
                : height -
                  paddingY -
                  ((value - min) / range) * usableHeight,
    }))

    let path = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`

    for (let index = 0; index < points.length - 1; index++) {
        const previous = points[index - 1] ?? points[index]
        const current = points[index]
        const next = points[index + 1]
        const afterNext = points[index + 2] ?? next

        const control1X = current.x + (next.x - previous.x) / 6
        const control1Y = clamp(
            current.y + (next.y - previous.y) / 6,
            paddingY,
            height - paddingY,
        )
        const control2X = next.x - (afterNext.x - current.x) / 6
        const control2Y = clamp(
            next.y - (afterNext.y - current.y) / 6,
            paddingY,
            height - paddingY,
        )

        path += ` C ${control1X.toFixed(2)} ${control1Y.toFixed(2)}, ${control2X.toFixed(2)} ${control2Y.toFixed(2)}, ${next.x.toFixed(2)} ${next.y.toFixed(2)}`
    }

    return path
}

function Sparkline({ coin }: { coin: CryptoCurrency }) {
    const quote = coin.quote.USD
    const change24h = Number.isFinite(quote.percent_change_24h)
        ? quote.percent_change_24h
        : 0
    const change1h = Number.isFinite(quote.percent_change_1h)
        ? quote.percent_change_1h
        : 0
    const positive = change24h >= 0
    const values = [
        priceAtChange(quote.price, change24h),
        priceAtChange(quote.price, change1h),
        quote.price,
    ]

    return (
        <svg
            viewBox="0 0 112 40"
            preserveAspectRatio="none"
            role="img"
            aria-label={`${coin.name} 24-hour price trend, ${positive ? "up" : "down"}`}
            className={`h-7 w-12 shrink-0 sm:h-9 sm:w-24 lg:h-10 lg:w-28 ${
                positive
                    ? "text-lnd-accent"
                    : "text-red-500 dark:text-red-400"
            }`}
        >
            <path
                d={buildSparklinePath(values)}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    )
}

function getHotCryptos(data: CryptoCurrency[]) {
    if (!Array.isArray(data)) return []
    return data
        .filter(
            (coin) =>
                coin?.quote?.USD?.volume_24h &&
                coin?.quote?.USD?.volume_change_24h,
        )
        .sort((a, b) => b.quote.USD.volume_24h - a.quote.USD.volume_24h)
        .slice(0, 10)
}
function getNewCryptos(data: CryptoCurrency[]) {
    if (!Array.isArray(data)) return []
    return [...data]
        .sort(
            (a, b) =>
                new Date(b.date_added).getTime() -
                new Date(a.date_added).getTime(),
        )
        .slice(0, 10)
}
function getGainersCryptos(data: CryptoCurrency[]) {
    if (!Array.isArray(data)) return []
    return [...data]
        .sort(
            (a, b) =>
                b.quote.USD.percent_change_24h - a.quote.USD.percent_change_24h,
        )
        .slice(0, 10)
}
function getLosersCryptos(data: CryptoCurrency[]) {
    if (!Array.isArray(data)) return []
    return [...data]
        .sort(
            (a, b) =>
                a.quote.USD.percent_change_24h - b.quote.USD.percent_change_24h,
        )
        .slice(0, 10)
}
function getMarketCapCryptos(data: CryptoCurrency[]) {
    if (!Array.isArray(data)) return []
    return [...data]
        .sort((a, b) => b.quote.USD.market_cap - a.quote.USD.market_cap)
        .slice(0, 10)
}

const TAB_DEFS = [
    { value: "Hot", label: "Hot", getter: getHotCryptos },
    { value: "New", label: "New", getter: getNewCryptos },
    { value: "Gainers", label: "Gainers", getter: getGainersCryptos },
    { value: "Losers", label: "Losers", getter: getLosersCryptos },
    { value: "MarketCap", label: "Market cap", getter: getMarketCapCryptos },
]

const ROW_GRID =
    "grid grid-cols-[minmax(0,1.35fr)_minmax(0,1.1fr)_minmax(0,0.65fr)_minmax(0,0.75fr)] items-center gap-2 px-2 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-3 lg:px-3"

function CoinRow({ coin }: { coin: CryptoCurrency }) {
    const change = Number.isFinite(coin.quote.USD.percent_change_24h)
        ? coin.quote.USD.percent_change_24h
        : 0
    const positive = change >= 0

    return (
        <div
            className={`${ROW_GRID} border-b border-lnd-border/70 py-3 transition-colors last:border-b-0 hover:bg-lnd-surface-2/60`}
        >
            <div className="flex min-w-0 items-center gap-2.5">
                <CryptoLogo
                    url={`https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`}
                    alt={coin.name}
                />
                <span className="truncate text-sm font-medium text-lnd-fg lg:text-[0.95rem]">
                    {coin.name}
                </span>
                <span className="hidden shrink-0 text-[0.68rem] font-medium uppercase text-lnd-fg-muted sm:block lg:text-[0.72rem]">
                    {coin.symbol}
                </span>
            </div>
            <span className="whitespace-nowrap text-right text-sm font-medium tabular-nums text-lnd-fg lg:text-[0.95rem]">
                ${formatPrice(coin.quote.USD.price)}
            </span>
            <span
                className={`whitespace-nowrap text-right text-sm font-semibold tabular-nums lg:text-[0.95rem] ${
                    positive
                        ? "text-lnd-accent"
                        : "text-red-500 dark:text-red-400"
                }`}
            >
                {positive ? "+" : ""}
                {change.toFixed(2)}%
            </span>
            <span className="hidden whitespace-nowrap text-right text-sm tabular-nums text-lnd-fg-muted lg:block lg:text-[0.92rem]">
                ${formatNumber(coin.quote.USD.market_cap)}
            </span>
            <span className="hidden whitespace-nowrap text-right text-sm tabular-nums text-lnd-fg-muted lg:block lg:text-[0.92rem]">
                ${formatNumber(coin.quote.USD.volume_24h)}
            </span>
            <div className="flex justify-end">
                <Sparkline coin={coin} />
            </div>
        </div>
    )
}

function CoinTable({ coins }: { coins: CryptoCurrency[] | null | undefined }) {
    if (coins === null) {
        return (
            <div className="flex h-72 flex-col items-center justify-center gap-3 text-sm text-lnd-fg-muted">
                <NoData className="h-14 w-14 opacity-60" />
                No data available
            </div>
        )
    }

    if (coins === undefined) {
        return (
            <div className="flex h-72 items-center justify-center">
                <Loader />
            </div>
        )
    }

    if (coins.length === 0) {
        return (
            <div className="flex h-72 items-center justify-center text-sm text-lnd-fg-muted">
                No markets to show right now
            </div>
        )
    }

    return (
        <div className="mt-3">
            <div
                className={`${ROW_GRID} border-b border-lnd-border pb-2 text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-lnd-fg-muted lg:text-[0.72rem]`}
            >
                <span>Coins</span>
                <span className="text-right">Price</span>
                <span className="text-right">24h</span>
                <span className="hidden text-right lg:block">Market cap</span>
                <span className="hidden text-right lg:block">Volume</span>
                <span className="text-right">
                    <span className="lg:hidden">Trend</span>
                    <span className="hidden lg:inline">24H trend</span>
                </span>
            </div>
            <div className="flex flex-col">
                {coins.map((coin) => (
                    <CoinRow key={coin.id} coin={coin} />
                ))}
            </div>
        </div>
    )
}

export default function CryptoTabs() {
    const { data, isLoading } = useCryptoData()
    const cryptos: CryptoCurrency[] | null | undefined = data?.data?.data

    return (
        <Tabs defaultValue="Hot" className="mt-4">
            <ScrollArea className="w-full">
                <TabsList className="h-auto w-max justify-start gap-1 rounded-none bg-transparent p-0 shadow-none">
                    {TAB_DEFS.map((tab) => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="rounded-full px-3.5 py-1.5 text-sm font-medium text-lnd-fg-muted transition-colors hover:text-lnd-fg data-[state=active]:bg-lnd-surface-2 data-[state=active]:text-lnd-fg data-[state=active]:shadow-none lg:text-[0.95rem]"
                        >
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
                <ScrollBar orientation="horizontal" className="hidden" />
            </ScrollArea>

            {TAB_DEFS.map((tab) => (
                <TabsContent key={tab.value} value={tab.value}>
                    <CoinTable
                        coins={
                            cryptos === undefined || isLoading
                                ? undefined
                                : cryptos === null
                                  ? null
                                  : tab.getter(cryptos)
                        }
                    />
                </TabsContent>
            ))}
        </Tabs>
    )
}
