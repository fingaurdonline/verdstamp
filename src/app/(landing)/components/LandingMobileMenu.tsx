"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { useMutation } from "convex/react"
import { api } from "@convex/_generated/api"
import { useRouter } from "nextjs-toploader/app"
import { useTheme } from "next-themes"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, ChevronDown, Globe, Menu, X } from "lucide-react"
import LandingBrand from "./LandingBrand"
import { ACCOUNT_LINKS, LANGUAGES, NAV_GROUPS, NEWS_HREF } from "./landingNav"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    loggedIn: boolean
    user?: any
    emailVerified: boolean
    convertedTotal: number
    currenciesRates: Record<string, number>
    onLogout: () => void
}

export default function LandingMobileMenu({
    open,
    onOpenChange,
    loggedIn,
    user,
    emailVerified,
    convertedTotal,
    currenciesRates,
    onLogout,
}: Props) {
    const router = useRouter()
    const { resolvedTheme, setTheme } = useTheme()
    const updateLanguage = useMutation(api.user.update_language)
    const updateCurrency = useMutation(api.user.update_currency)
    const swapTheme = useMutation(api.user.swap_theme)

    const [langOpen, setLangOpen] = useState(false)
    const [currencyOpen, setCurrencyOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const close = () => onOpenChange(false)

    const toggleTheme = () => {
        const next = resolvedTheme === "light" ? "dark" : "light"
        swapTheme({ theme: next })
            .catch(() => {})
            .finally(() => setTheme(next))
    }

    return (
        <>
            <button
                onClick={() => onOpenChange(true)}
                aria-label="Open menu"
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full border border-lnd-border transition-colors hover:bg-lnd-surface-2"
            >
                <Menu className="w-5 h-5 text-lnd-fg" />
            </button>

            {mounted &&
                open &&
                createPortal(
                    <div className="lg:hidden fixed inset-0 z-[120] flex flex-col bg-lnd-bg text-lnd-fg">
                    {/* drawer header */}
                    <div className="flex items-center justify-between px-4 h-16 shrink-0 border-b border-lnd-border">
                        <LandingBrand />
                        <button
                            onClick={close}
                            aria-label="Close menu"
                            className="flex items-center justify-center w-9 h-9 rounded-full border border-lnd-border transition-colors hover:bg-lnd-surface-2"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <ScrollArea className="h-full">
                            <div className="flex flex-col gap-6 px-4 py-6">
                                {/* balance (logged in) */}
                                {loggedIn && (
                                    <div className="lnd-card p-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[0.7rem] uppercase tracking-wider text-lnd-fg-muted">
                                                Total Balance
                                            </p>
                                            <span
                                                className={`rounded-full px-2 py-px text-[0.65rem] font-medium ${
                                                    emailVerified
                                                        ? "bg-lnd-accent/15 text-lnd-accent"
                                                        : "bg-lnd-surface-2 text-lnd-fg-muted"
                                                }`}
                                            >
                                                {emailVerified ? "Verified" : "Unverified"}
                                            </span>
                                        </div>
                                        <p className="mt-1 flex items-baseline gap-1.5">
                                            <span className="text-2xl font-Manrope font-extrabold">
                                                {convertedTotal.toLocaleString()}
                                            </span>
                                            <span className="text-xs font-medium text-lnd-fg-muted">
                                                {user?.currency ?? "USD"}
                                            </span>
                                        </p>
                                        <div className="mt-3 flex gap-2">
                                            <Link
                                                href="/overview/spot/deposit"
                                                onClick={close}
                                                className="lnd-btn-accent flex-1 py-2 text-center text-[0.8rem]"
                                            >
                                                Deposit
                                            </Link>
                                            <Link
                                                href="/overview/spot/withdraw"
                                                onClick={close}
                                                className="lnd-btn-ghost flex-1 py-2 text-center text-[0.8rem]"
                                            >
                                                Withdraw
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                {/* nav groups */}
                                <Accordion type="single" collapsible className="w-full">
                                    {NAV_GROUPS.map((group, i) => (
                                        <AccordionItem
                                            key={group.label}
                                            value={`group-${i}`}
                                            className="border-b border-lnd-border"
                                        >
                                            <AccordionTrigger className="text-[0.95rem] font-Manrope font-medium hover:no-underline">
                                                {group.label}
                                            </AccordionTrigger>
                                            <AccordionContent className="flex flex-col gap-1 pb-3 pl-2">
                                                {group.items.map((item) => (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        onClick={close}
                                                        className="rounded-lg px-3 py-2 text-sm text-lnd-fg-muted transition-colors hover:bg-lnd-surface-2 hover:text-lnd-fg"
                                                    >
                                                        {item.title}
                                                    </Link>
                                                ))}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                                <Link
                                    href={NEWS_HREF}
                                    onClick={close}
                                    className="-mt-4 text-[0.95rem] font-Manrope font-medium"
                                >
                                    News
                                </Link>

                                {/* language */}
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => setLangOpen((v) => !v)}
                                        className="flex items-center justify-between rounded-xl border border-lnd-border px-4 py-3"
                                    >
                                        <span className="flex items-center gap-2.5 text-[0.95rem]">
                                            <Globe className="w-4 h-4 text-lnd-fg-muted" />
                                            Language
                                        </span>
                                        <span className="flex items-center gap-2 text-sm text-lnd-accent">
                                            <span className="uppercase">{user?.language ?? "EN"}</span>
                                            <ChevronDown
                                                className={`w-4 h-4 transition-transform ${langOpen ? "rotate-180" : ""}`}
                                            />
                                        </span>
                                    </button>
                                    {langOpen && (
                                        <div className="grid grid-cols-2 gap-2 px-1">
                                            {LANGUAGES.map((lang) => (
                                                <button
                                                    key={lang.code}
                                                    onClick={() => {
                                                        updateLanguage({ language: lang.code }).then(() =>
                                                            router.refresh(),
                                                        )
                                                        setLangOpen(false)
                                                    }}
                                                    className={`rounded-xl border px-3 py-2 text-sm transition-colors ${
                                                        user?.language === lang.code
                                                            ? "border-lnd-accent bg-lnd-surface-2 font-medium text-lnd-accent"
                                                            : "border-lnd-border text-lnd-fg"
                                                    }`}
                                                >
                                                    {lang.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* currency */}
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => setCurrencyOpen((v) => !v)}
                                        className="flex items-center justify-between rounded-xl border border-lnd-border px-4 py-3"
                                    >
                                        <span className="text-[0.95rem]">Currency</span>
                                        <span className="flex items-center gap-2 text-sm text-lnd-accent">
                                            <span>{user?.currency ?? "USD"}</span>
                                            <ChevronDown
                                                className={`w-4 h-4 transition-transform ${currencyOpen ? "rotate-180" : ""}`}
                                            />
                                        </span>
                                    </button>
                                    {currencyOpen && (
                                        <div className="max-h-56 overflow-y-auto rounded-xl border border-lnd-border">
                                            {Object.keys(currenciesRates ?? {}).map((code) => (
                                                <button
                                                    key={code}
                                                    onClick={() => {
                                                        updateCurrency({ currency: code }).then(() =>
                                                            router.refresh(),
                                                        )
                                                        setCurrencyOpen(false)
                                                    }}
                                                    className="flex w-full items-center justify-between border-b border-lnd-border px-4 py-2.5 text-sm last:border-b-0"
                                                >
                                                    <span
                                                        className={
                                                            user?.currency === code
                                                                ? "font-medium text-lnd-accent"
                                                                : "text-lnd-fg"
                                                        }
                                                    >
                                                        {code}
                                                    </span>
                                                    {user?.currency === code && (
                                                        <Check className="w-4 h-4 text-lnd-accent" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* theme */}
                                <div className="flex items-center justify-between rounded-xl border border-lnd-border px-4 py-3">
                                    <span className="text-[0.95rem]">Dark mode</span>
                                    <Switch
                                        checked={resolvedTheme === "dark"}
                                        onCheckedChange={toggleTheme}
                                    />
                                </div>

                                {/* auth / account */}
                                {loggedIn ? (
                                    <div className="flex flex-col gap-1">
                                        <p className="px-1 pb-1 text-[0.7rem] uppercase tracking-wider text-lnd-fg-muted">
                                            Account
                                        </p>
                                        {ACCOUNT_LINKS.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={close}
                                                className="rounded-lg px-3 py-2.5 text-[0.95rem] text-lnd-fg transition-colors hover:bg-lnd-surface-2"
                                            >
                                                {item.title}
                                            </Link>
                                        ))}
                                        <button
                                            onClick={() => {
                                                onLogout()
                                                close()
                                            }}
                                            className="mt-2 rounded-full border border-lnd-border px-4 py-3 text-[0.95rem] font-medium text-lnd-fg-muted transition-colors hover:bg-lnd-surface-2 hover:text-lnd-fg"
                                        >
                                            Log Out
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2.5">
                                        <Link
                                            href="/auth/signup"
                                            onClick={close}
                                            className="lnd-btn-accent py-3 text-center text-[0.95rem]"
                                        >
                                            Sign Up
                                        </Link>
                                        <Link
                                            href="/auth/login"
                                            onClick={close}
                                            className="lnd-btn-ghost py-3 text-center text-[0.95rem]"
                                        >
                                            Log In
                                        </Link>
                                    </div>
                                )}
                            </div>
                            <div className="h-8" />
                        </ScrollArea>
                    </div>
                    </div>,
                    document.body,
                )}
        </>
    )
}
