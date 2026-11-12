"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@convex/_generated/api"
import {
    PiInstagramLogoLight,
    PiMediumLogoFill,
    PiRedditLogoFill,
} from "react-icons/pi"
import { IoIosMail } from "react-icons/io"
import { BiLogoTelegram } from "react-icons/bi"
import { BsTwitterX } from "react-icons/bs"
import { FaDiscord, FaFacebookF, FaYoutube } from "react-icons/fa"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import LandingBrand, { BRAND } from "./LandingBrand"

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
    {
        title: "About",
        links: [
            { label: "About Us", href: "/about-us" },
            { label: "Contact Us", href: "/contact-us" },
            { label: "Terms of Service", href: "/service" },
            { label: "Privacy policy", href: "/privacy" },
            { label: "Disclaimer", href: "/disclaimer" },
        ],
    },
    {
        title: "Services",
        links: [
            { label: "Ambassador", href: "/ambassador" },
            { label: "VIP", href: "/vip" },
            { label: "Referral Reward", href: "/referral" },
            { label: "Fees Standard", href: "/fees-standard" },
            { label: "Proof of Reserve", href: "/proof-of-reserve" },
        ],
    },
    {
        title: "Support",
        links: [
            { label: "Contact Support", href: "/support" },
            { label: "Law Enforcement", href: "/law-enforcement" },
            { label: "Announcements", href: "/sta-article" },
        ],
    },
]

const SOCIALS = [
    { label: "Mail", icon: <IoIosMail className="w-5 h-5" /> },
    { label: "Telegram", icon: <BiLogoTelegram className="w-5 h-5" /> },
    { label: "X", icon: <BsTwitterX className="w-4 h-4" /> },
    { label: "Facebook", icon: <FaFacebookF className="w-4 h-4" /> },
    { label: "Medium", icon: <PiMediumLogoFill className="w-4 h-4" /> },
    { label: "Reddit", icon: <PiRedditLogoFill className="w-5 h-5" /> },
    { label: "Instagram", icon: <PiInstagramLogoLight className="w-5 h-5" /> },
    { label: "YouTube", icon: <FaYoutube className="w-5 h-5" /> },
    { label: "Discord", icon: <FaDiscord className="w-5 h-5" /> },
]

export default function LandingFooter() {
    const numbers = useQuery(api.misc.numbers)
    const [date, setDate] = useState<Date | null>(null)

    useEffect(() => {
        setDate(new Date())
    }, [])

    return (
        <footer className="w-full border-t border-lnd-border bg-lnd-surface">
            <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-6 py-12 flex flex-col lg:flex-row lg:justify-between gap-10">
                {/* brand + socials */}
                <div className="flex flex-col gap-6 max-w-sm">
                    <LandingBrand />
                    <p className="text-[0.95rem] leading-relaxed text-lnd-fg-muted">
                        Making crypto trading easier — buy, swap and transfer digital
                        assets across the networks you already use.
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                        {SOCIALS.map((social) => (
                            <span
                                key={social.label}
                                aria-label={social.label}
                                className="flex items-center justify-center w-9 h-9 rounded-full border border-lnd-border text-lnd-fg-muted transition-colors hover:bg-lnd-surface-2 hover:text-lnd-fg cursor-pointer"
                            >
                                {social.icon}
                            </span>
                        ))}
                    </div>
                </div>

                {/* link columns — desktop */}
                <div className="hidden lg:flex items-start gap-20">
                    {COLUMNS.map((column) => (
                        <div key={column.title} className="flex flex-col gap-4">
                            <p className="text-sm font-Manrope font-semibold uppercase tracking-wider text-lnd-fg">
                                {column.title}
                            </p>
                            <div className="flex flex-col gap-3">
                                {column.links.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="text-[0.9rem] text-lnd-fg-muted transition-colors hover:text-lnd-accent"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* link columns — mobile */}
                <Accordion type="single" collapsible className="w-full lg:hidden">
                    {COLUMNS.map((column, i) => (
                        <AccordionItem
                            key={column.title}
                            value={`column-${i}`}
                            className="border-b border-lnd-border"
                        >
                            <AccordionTrigger className="text-[0.95rem] font-Manrope font-medium hover:no-underline">
                                {column.title}
                            </AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-1 pb-3 pl-2">
                                {column.links.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="rounded-lg px-3 py-2 text-sm text-lnd-fg-muted transition-colors hover:bg-lnd-surface-2 hover:text-lnd-fg"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

            {/* bottom bar */}
            <div className="w-full border-t border-lnd-border">
                <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-6 py-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-2">
                    <p className="text-xs text-lnd-fg-muted">
                        © 2017-2026 {BRAND.domain} All rights reserved.
                    </p>
                    <p className="text-xs text-lnd-fg-muted">
                        {date ? date.toUTCString() : ""}
                    </p>
                    <p className="text-xs text-lnd-fg-muted">
                        24H value:{" "}
                        {numbers?.twenty_four_hours?.toLocaleString("en-US") ??
                            "—"}{" "}
                        USD
                    </p>
                </div>
            </div>
        </footer>
    )
}
