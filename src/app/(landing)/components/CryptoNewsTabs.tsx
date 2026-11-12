"use client"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import useCryptoNews from "@/hooks/useCryptoNews"
import NoData from "@/components/icons/NoData"
import Loader from "./Loader"

type CryptoNewsItem = {
    id: number
    slug: string
    title: string
    description: string
    published_at: string
    created_at: string
    kind: string
}

function timeAgo(timestamp: string): string {
    const now = new Date()
    const past = new Date(timestamp)
    const diffMs = now.getTime() - past.getTime()

    const minutes = Math.floor(diffMs / (1000 * 60))
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (minutes < 1) return "just now"
    if (minutes < 60) return `${minutes} min(s) ago`
    if (hours < 24) return `${hours} hr(s) ago`
    return `${days} day(s) ago`
}

export default function CryptoNewsTabs() {
    const { data: cryptoNews, isLoading } = useCryptoNews()

    const items = cryptoNews?.data?.results as CryptoNewsItem[] | undefined

    return (
        <div className="mt-4">
            {cryptoNews === null ? (
                <div className="flex h-[420px] flex-col items-center justify-center gap-3 text-sm text-lnd-fg-muted">
                    <NoData className="h-14 w-14 opacity-60" />
                    No data available
                </div>
            ) : cryptoNews === undefined || isLoading ? (
                <div className="flex h-[420px] items-center justify-center">
                    <Loader />
                </div>
            ) : (
                <ScrollArea className="h-[420px] pr-2">
                    <div className="flex flex-col">
                        {items?.map((newsItem) => (
                            <article
                                key={newsItem.id}
                                className="group flex flex-col gap-1.5 border-b border-lnd-border/70 py-3.5 last:border-b-0"
                            >
                                <p className="line-clamp-2 text-sm leading-relaxed text-lnd-fg transition-colors group-hover:text-lnd-accent">
                                    {newsItem.title}
                                </p>
                                <span className="flex items-center gap-2 text-[0.7rem] text-lnd-fg-muted">
                                    <span className="lnd-live-dot h-1 w-1 rounded-full bg-lnd-accent" />
                                    {timeAgo(newsItem.published_at)}
                                </span>
                            </article>
                        ))}
                    </div>
                    <ScrollBar className="w-1.5" />
                </ScrollArea>
            )}
        </div>
    )
}
