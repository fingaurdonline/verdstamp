"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";
import { Check, ChevronDown, Globe, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import LandingBrand from "./LandingBrand";
import { ACCOUNT_LINKS, LANGUAGES, NAV_GROUPS, NEWS_HREF } from "./landingNav";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    loggedIn: boolean;
    user?: any;
    currenciesRates: Record<string, number>;
    onLogout: () => void;
};

const PORTFOLIO = [
    {
        label: "Spot",
        links: [
            { label: "Assets", href: "/overview/spot/assets" },
            { label: "Deposit", href: "/overview/spot/deposit" },
            { label: "Withdraw", href: "/overview/spot/withdraw" },
            { label: "Transfer History", href: "/overview/spot/records" },
        ],
    },
    {
        label: "Margin",
        links: [
            { label: "Assets", href: "/overview/margin/assets" },
            { label: "Borrow Records", href: "/overview/margin/records" },
        ],
    },
    {
        label: "Loan",
        links: [
            { label: "Assets", href: "/overview/loan/assets" },
            { label: "Borrowing Records", href: "/overview/loan/loan_records" },
        ],
    },
    {
        label: "History",
        links: [
            { label: "Spot", href: "/overview/history/spot" },
            { label: "Margin", href: "/overview/history/margin" },
            { label: "Futures", href: "/overview/history/futures" },
            { label: "Loan", href: "/overview/history/loan" },
        ],
    },
];

export default function LandingMobileMenu({ open, onOpenChange, loggedIn, user, currenciesRates, onLogout }: Props) {
    const router = useRouter();
    const { resolvedTheme, setTheme } = useTheme();
    const updateLanguage = useMutation(api.user.update_language);
    const updateCurrency = useMutation(api.user.update_currency);
    const swapTheme = useMutation(api.user.swap_theme);

    const [langOpen, setLangOpen] = useState(false);
    const [currencyOpen, setCurrencyOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!open) return;
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") onOpenChange(false);
        };
        window.addEventListener("keydown", handleKey);
        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener("keydown", handleKey);
        };
    }, [open, onOpenChange]);

    const close = () => onOpenChange(false);

    const toggleTheme = () => {
        const next = resolvedTheme === "light" ? "dark" : "light";
        swapTheme({ theme: next })
            .catch(() => {})
            .finally(() => setTheme(next));
    };

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
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Menu"
                        className="fixed inset-x-0 top-0 z-[120] flex h-dvh flex-col bg-lnd-bg text-lnd-fg lg:hidden"
                    >
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

                        <div className="min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]">
                            <div className="flex flex-col gap-6 px-4 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-6">
                                {/* portfolio (logged in) */}
                                {loggedIn && (
                                    <div className="flex flex-col gap-2">
                                        <Link
                                            href="/overview"
                                            onClick={close}
                                            className="rounded-lg px-3 py-2.5 text-[0.95rem] text-lnd-fg transition-colors hover:bg-lnd-surface-2"
                                        >
                                            Overview
                                        </Link>
                                        <Accordion type="multiple" className="w-full border-t border-lnd-border">
                                            {PORTFOLIO.map((section, i) => (
                                                <AccordionItem
                                                    key={section.label}
                                                    value={`portfolio-${i}`}
                                                    className="border-b border-lnd-border"
                                                >
                                                    <AccordionTrigger className="text-[0.95rem] font-Manrope font-medium hover:no-underline">
                                                        {section.label}
                                                    </AccordionTrigger>
                                                    <AccordionContent className="flex flex-col gap-1 pb-3 pl-2">
                                                        {section.links.map(item => (
                                                            <Link
                                                                key={item.href}
                                                                href={item.href}
                                                                onClick={close}
                                                                className="rounded-lg px-3 py-2 text-sm text-lnd-fg-muted transition-colors hover:bg-lnd-surface-2 hover:text-lnd-fg"
                                                            >
                                                                {item.label}
                                                            </Link>
                                                        ))}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                        <div className="flex flex-col gap-1">
                                            <Link
                                                href="/overview/trade/spot/BTC/USDT"
                                                onClick={close}
                                                className="rounded-lg px-3 py-2.5 text-[0.95rem] text-lnd-fg transition-colors hover:bg-lnd-surface-2"
                                            >
                                                Trade
                                            </Link>
                                            <Link
                                                href="/overview/futures"
                                                onClick={close}
                                                className="rounded-lg px-3 py-2.5 text-[0.95rem] text-lnd-fg transition-colors hover:bg-lnd-surface-2"
                                            >
                                                Futures
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
                                                {group.items.map(item => (
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
                                        onClick={() => setLangOpen(v => !v)}
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
                                            {LANGUAGES.map(lang => (
                                                <button
                                                    key={lang.code}
                                                    onClick={() => {
                                                        updateLanguage({ language: lang.code }).then(() =>
                                                            router.refresh(),
                                                        );
                                                        setLangOpen(false);
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
                                        onClick={() => setCurrencyOpen(v => !v)}
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
                                            {Object.keys(currenciesRates ?? {}).map(code => (
                                                <button
                                                    key={code}
                                                    onClick={() => {
                                                        updateCurrency({ currency: code }).then(() => router.refresh());
                                                        setCurrencyOpen(false);
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
                                    <Switch checked={resolvedTheme === "dark"} onCheckedChange={toggleTheme} />
                                </div>

                                {/* auth / account */}
                                {loggedIn ? (
                                    <div className="flex flex-col gap-1">
                                        <p className="px-1 pb-1 text-[0.7rem] uppercase tracking-wider text-lnd-fg-muted">
                                            Account
                                        </p>
                                        {ACCOUNT_LINKS.map(item => (
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
                                                onLogout();
                                                close();
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
                        </div>
                    </div>,
                    document.body,
                )}
        </>
    );
}
