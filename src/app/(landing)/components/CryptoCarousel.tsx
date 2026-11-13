"use client"

import { useRef } from "react"
import Autoplay from "embla-carousel-autoplay"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
import useCryptoData from "@/hooks/useCryptoData"
import { CryptoCurrency } from "@/lib/types"
import { BiSolidCoinStack } from "react-icons/bi"
import CryptoLogo from "./CryptoLogo"

function round2(num: number) {
    return Math.round(num * 100) / 100
}

function displayPrice(num: number): string {
    return num.toLocaleString("en-US", {
        maximumFractionDigits: Math.abs(num) >= 10 ? 2 : 4,
    })
}

function TickerCoin({ coin }: { coin: CryptoCurrency }) {
    const change = round2(coin.quote.USD.percent_change_24h)
    const positive = change >= 0

    return (
        <div className="flex items-center gap-2.5">
            <CryptoLogo
                url={`https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`}
                alt={coin.name}
            />
            <div className="flex flex-col">
                <span className="flex items-center gap-1.5 text-[0.78rem] font-medium text-lnd-fg">
                    {coin.symbol.toUpperCase()}/USDT
                    <span
                        className={`text-[0.72rem] font-semibold ${
                            positive
                                ? "text-lnd-accent"
                                : "text-red-500 dark:text-red-400"
                        }`}
                    >
                        {positive ? "+" : ""}
                        {change}%
                    </span>
                </span>
                <span className="text-[0.95rem] font-semibold text-lnd-fg">
                    ${displayPrice(coin.quote.USD.price)}
                </span>
            </div>
        </div>
    )
}

function TickerSlide({ coins }: { coins: CryptoCurrency[] }) {
    return (
        <div className="flex h-[92px] items-center justify-center gap-4 py-4 sm:gap-10 lg:gap-14">
            {coins.map((coin, index) => (
                <div
                    key={coin.id}
                    className={`${
                        index >= 2 ? "hidden sm:flex" : "flex"
                    } items-center gap-3 sm:gap-6 lg:gap-14`}
                >
                    <TickerCoin coin={coin} />
                    <span className="hidden h-10 w-px bg-lnd-border sm:block" aria-hidden />
                </div>
            ))}
        </div>
    )
}

function TickerSkeleton() {
    return (
        <div className="flex h-[92px] items-center justify-center gap-10 py-4">
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className={`${
                        i >= 2 ? "hidden sm:flex" : "flex"
                    } items-center gap-2.5`}
                >
                    <span className="flex h-8 w-8 animate-pulse items-center justify-center rounded-full bg-lnd-surface-2">
                        <BiSolidCoinStack className="h-4 w-4 text-lnd-fg-muted" />
                    </span>
                    <span className="flex flex-col gap-1.5">
                        <span className="h-2.5 w-20 animate-pulse rounded bg-lnd-surface-2" />
                        <span className="h-3 w-16 animate-pulse rounded bg-lnd-surface-2" />
                    </span>
                </div>
            ))}
        </div>
    )
}

export default function CryptoCarousel() {
    const { data } = useCryptoData()
    const plugin = useRef(
        Autoplay({
            delay: 6000,
            stopOnInteraction: false,
        }),
    )

    const crypto = data?.data?.data as CryptoCurrency[] | null | undefined

    function getRandomCryptos(data: CryptoCurrency[], count: number) {
        if (!Array.isArray(data)) return []
        const excludedSymbols = ["usdt", "btc", "eth", "xrp", "doge", "sol"]
        const filteredData = data.filter(
            (coin) => !excludedSymbols.includes(coin.symbol.toLowerCase()),
        )
        const shuffledData = filteredData.sort(() => 0.5 - Math.random())
        return shuffledData.slice(0, count)
    }

    function getMajorCryptos(data: CryptoCurrency[], count: number) {
        if (!Array.isArray(data)) return []
        const includedSymbols = ["btc", "eth", "xrp", "doge", "sol"]
        const filteredData = data.filter((coin) =>
            includedSymbols.includes(coin.symbol.toLowerCase()),
        )
        return filteredData.slice(0, count)
    }

    return (
        <div className="w-full border-y border-lnd-border bg-lnd-surface/40">
            <Carousel
                plugins={[plugin.current]}
                opts={{ loop: true, align: "start" }}
                orientation="vertical"
                className="w-full"
            >
                <CarouselContent className="h-[92px]">
                    <CarouselItem>
                        {crypto === undefined ? (
                            <TickerSkeleton />
                        ) : crypto === null ? (
                            <div className="flex h-[92px] items-center justify-center text-sm text-lnd-fg-muted">
                                Market data unavailable
                            </div>
                        ) : (
                            <TickerSlide coins={getRandomCryptos(crypto, 5)} />
                        )}
                    </CarouselItem>
                    <CarouselItem>
                        {crypto === undefined ? (
                            <TickerSkeleton />
                        ) : crypto === null ? (
                            <div className="flex h-[92px] items-center justify-center text-sm text-lnd-fg-muted">
                                Market data unavailable
                            </div>
                        ) : (
                            <TickerSlide coins={getMajorCryptos(crypto, 5)} />
                        )}
                    </CarouselItem>
                </CarouselContent>
            </Carousel>
        </div>
    )
}
