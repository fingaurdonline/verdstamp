"use client"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { useRef } from "react"

export function RewardCarousel() {
    const plugin = useRef(
        Autoplay({
            delay: 5000,
            stopOnInteraction: false,
        }),
    )

    function generateRewardMessages(count = 5) {
        const messages = []

        for (let i = 0; i < count; i++) {
            const prefix = randomEmailFragment()
            const domain = randomDomainFragment()
            const amount = (Math.random() * (45 - 9) + 5).toFixed(2)

            messages.push({
                email: `${prefix}@${domain}.com`,
                amount: `${amount} USDT`,
            })
        }

        return messages
    }

    function randomEmailFragment() {
        const letters = "abcdefghijklmnopqrstuvwxyz"
        const randomLetter = () =>
            letters.charAt(Math.floor(Math.random() * letters.length))
        //ramdomly generate a number between 1 and 999 or an empty string
        const randomNumber = () => Math.floor(Math.random() * 999) + 1 || ""

        const visible = randomLetter() + randomLetter()
        const masked = "*".repeat(Math.floor(Math.random() * 3) + 3) // 3 to 5 asterisks
        const ending = randomNumber()

        return `${visible}${masked}${ending}`
    }

    function randomDomainFragment() {
        return "*".repeat(Math.floor(Math.random() * 3) + 2)
    }

    const emails = generateRewardMessages()

    return (
        <Carousel
            plugins={[plugin.current]}
            opts={{
                loop: true,
                align: "start",
                watchDrag: false,
            }}
            orientation="vertical"
            className="w-fit max-w-full"
        >
            <CarouselContent className="h-8">
                {emails.map((reward, i) => (
                    <CarouselItem key={i} className="flex items-center">
                        <span className="flex items-center gap-1.5 whitespace-nowrap text-xs text-lnd-fg-muted">
                            <span
                                aria-hidden
                                className="lnd-live-dot inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-lnd-accent"
                            />
                            <span className="text-lnd-fg">{reward.email}</span>
                            received
                            <span className="font-semibold text-lnd-accent">
                                {reward.amount}
                            </span>
                            in reward
                        </span>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    )
}
