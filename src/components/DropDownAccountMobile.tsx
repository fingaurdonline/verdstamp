"use client";

import LandingBrand from "@/app/(landing)/components/LandingBrand";
import { ACCOUNT_LINKS } from "@/app/(landing)/components/landingNav";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { signOut, useSession } from "@/lib/auth-client";
import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import {
    BadgeCheck,
    CandlestickChart,
    ChevronRight,
    Landmark,
    LayoutDashboard,
    LineChart,
    LogOut,
    MessageSquare,
    Scale,
    ShieldCheck,
    SlidersHorizontal,
    Ticket,
    UserCircle,
    Wallet,
    X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const PORTFOLIO = [
    {
        value: "spot",
        label: "Spot",
        icon: Wallet,
        links: [
            { label: "Assets", href: "/overview/spot/assets" },
            { label: "Deposit", href: "/overview/spot/deposit" },
            { label: "Withdraw", href: "/overview/spot/withdraw" },
            { label: "Transfer History", href: "/overview/spot/records" },
        ],
    },
    {
        value: "margin",
        label: "Margin",
        icon: Scale,
        links: [
            { label: "Assets", href: "/overview/margin/assets" },
            { label: "Borrow Records", href: "/overview/margin/records" },
        ],
    },
    {
        value: "loan",
        label: "Loan",
        icon: Landmark,
        links: [
            { label: "Assets", href: "/overview/loan/assets" },
            { label: "Borrowing Records", href: "/overview/loan/loan_records" },
        ],
    },
    {
        value: "history",
        label: "History",
        icon: LineChart,
        links: [
            { label: "Spot", href: "/overview/history/spot" },
            { label: "Margin", href: "/overview/history/margin" },
            { label: "Futures", href: "/overview/history/futures" },
            { label: "Loan", href: "/overview/history/loan" },
        ],
    },
];

const ACCOUNT_ICONS = [LayoutDashboard, ShieldCheck, BadgeCheck, SlidersHorizontal, MessageSquare, Ticket];

function maskEmail(input: string | undefined) {
    try {
        if (!input || input.length <= 11) return input ?? "";
        return `${input.slice(0, 5)}***${input.slice(-5)}`;
    } catch {
        return input ?? "";
    }
}

export default function DropDownAccountMobile() {
    const { data: session } = useSession();
    const user = useQuery(api.user.user);
    const auth = useQuery(api.auth.getCurrentUser);
    const allMessages = useQuery(api.messages.view_messages);
    const spotAccounts = useQuery(api.accounts.view_all_spot_accounts);
    const futuresAccount = useQuery(api.accounts.view_all_futures_accounts);
    const marginAccount = useQuery(api.accounts.view_all_margin_accounts);
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const userId = session?.user?.id;
    // view_messages already scopes results to the signed-in user.
    const userMessages = allMessages ?? [];
    const unreadCount = userMessages.filter((message: any) => message?.read === false).length;

    const spot = (spotAccounts?.find((acc: any) => acc?.user === user?.userId)?.total_asset ?? 0) as number;
    const futures = (futuresAccount?.find((acc: any) => acc?.user === user?.userId)?.total_asset ?? 0) as number;
    const margin = (marginAccount?.find((acc: any) => acc?.user === user?.userId)?.total_asset ?? 0) as number;
    const total = spot + futures + margin;

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!open) return;
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", handleKey);
        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener("keydown", handleKey);
        };
    }, [open]);

    const close = () => setOpen(false);
    const logout = async () => {
        await signOut();
        close();
        router.push("/");
        router.refresh();
    };

    return (
        <>
            {!userId ? (
                <button
                    onClick={() => router.push("/auth/login")}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-lnd-border text-lnd-fg lg:hidden"
                    aria-label="Log in"
                >
                    <UserCircle className="h-5 w-5" />
                </button>
            ) : (
                <button
                    onClick={() => setOpen(true)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-lnd-border bg-lnd-surface-2 lg:hidden"
                    aria-label="Open account menu"
                >
                    <Image src="/assets/userlogo.svg" alt="Account" width={100} height={100} className="h-6 w-6" />
                </button>
            )}

            {mounted &&
                open &&
                createPortal(
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Account menu"
                        className="fixed inset-x-0 top-0 z-[120] flex h-dvh flex-col bg-lnd-bg text-lnd-fg lg:hidden"
                    >
                        <div className="flex h-16 shrink-0 items-center justify-between border-b border-lnd-border px-4">
                            <LandingBrand />
                            <button
                                onClick={close}
                                aria-label="Close account menu"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-lnd-border transition-colors hover:bg-lnd-surface-2"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]">
                            <div className="flex flex-col gap-5 px-4 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-5">
                                <div className="db-card p-4">
                                    <div className="mt-4 rounded-xl bg-lnd-surface-2 p-3.5">
                                        <p className="text-[0.65rem] uppercase tracking-[0.16em] text-lnd-fg-muted">
                                            Total Balance
                                        </p>
                                        <p className="mt-1 flex items-baseline gap-1.5">
                                            <span className="font-Manrope text-2xl font-extrabold text-lnd-fg">
                                                {Math.round(total * 100) / 100}
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
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Accordion type="multiple" defaultValue={["spot"]} className="db-card px-2 py-1">
                                        <Link
                                            href="/overview"
                                            onClick={close}
                                            className="flex items-center gap-3 rounded-xl px-1 py-3 text-[0.9rem] font-Manrope font-medium text-lnd-fg-muted transition-colors hover:bg-lnd-surface-2 hover:text-lnd-fg"
                                        >
                                            <LayoutDashboard className="h-4 w-4" strokeWidth={1.7} />
                                            Overview
                                        </Link>
                                        {PORTFOLIO.map(section => {
                                            const Icon = section.icon;
                                            return (
                                                <AccordionItem
                                                    key={section.value}
                                                    value={section.value}
                                                    className="border-b-0"
                                                >
                                                    <AccordionTrigger className="py-3 text-[0.9rem] font-Manrope font-medium text-lnd-fg hover:no-underline [&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-lnd-fg-muted">
                                                        <span className="flex items-center gap-3">
                                                            <Icon
                                                                className="h-4 w-4 text-lnd-fg-muted"
                                                                strokeWidth={1.7}
                                                            />
                                                            {section.label}
                                                        </span>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="pb-2">
                                                        {section.links.map(link => (
                                                            <Link
                                                                key={link.href}
                                                                href={link.href}
                                                                onClick={close}
                                                                className="flex items-center justify-between rounded-lg py-2 pl-7 pr-3 text-sm text-lnd-fg-muted transition-colors hover:bg-lnd-surface-2 hover:text-lnd-fg"
                                                            >
                                                                {link.label}
                                                                <ChevronRight className="h-3.5 w-3.5" />
                                                            </Link>
                                                        ))}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            );
                                        })}
                                        <Link
                                            href="/overview/trade/spot/BTC/USDT"
                                            onClick={close}
                                            className="flex items-center gap-3 rounded-xl px-1 py-3 text-[0.9rem] font-Manrope font-medium text-lnd-fg-muted transition-colors hover:bg-lnd-surface-2 hover:text-lnd-fg"
                                        >
                                            <CandlestickChart className="h-4 w-4" strokeWidth={1.7} />
                                            Trade
                                        </Link>
                                        <Link
                                            href="/overview/futures"
                                            onClick={close}
                                            className="flex items-center gap-3 rounded-xl px-1 py-3 text-[0.9rem] font-Manrope font-medium text-lnd-fg-muted transition-colors hover:bg-lnd-surface-2 hover:text-lnd-fg"
                                        >
                                            <LineChart className="h-4 w-4" strokeWidth={1.7} />
                                            Futures
                                        </Link>
                                    </Accordion>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <p className="db-eyebrow px-1">Account</p>
                                    <div className="db-card flex flex-col gap-0.5 p-2">
                                        {ACCOUNT_LINKS.map((item, index) => {
                                            const Icon = ACCOUNT_ICONS[index] ?? LayoutDashboard;
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={close}
                                                    className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[0.85rem] font-Manrope font-medium text-lnd-fg-muted transition-colors hover:bg-lnd-surface-2 hover:text-lnd-fg"
                                                >
                                                    <Icon className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.7} />
                                                    <span className="flex-1">{item.title}</span>
                                                    {item.href === "/account/messages" && unreadCount > 0 && (
                                                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-lnd-accent px-1.5 text-[0.65rem] font-bold text-lnd-accent-fg">
                                                            {unreadCount}
                                                        </span>
                                                    )}
                                                    <ChevronRight className="h-3.5 w-3.5 text-lnd-fg-muted" />
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>

                                <button
                                    onClick={logout}
                                    className="flex w-full items-center justify-center gap-2 rounded-full border border-lnd-border px-4 py-3 text-sm font-medium text-lnd-fg-muted transition-colors hover:bg-lnd-surface-2 hover:text-lnd-fg"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Log Out
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body,
                )}
        </>
    );
}
