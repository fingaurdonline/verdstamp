"use client";

import DropDownAccountMobile from "@/components/DropDownAccountMobile";
import SwapTheme from "@/components/ThemeSwap";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import useCurrencies from "@/hooks/useCurrency";
import { authClient } from "@/lib/auth-client";
import { ExchangeRate } from "@/lib/types";
import { api } from "@convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Check, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { HiBadgeCheck } from "react-icons/hi";
import LandingBrand from "./LandingBrand";
import LandingMobileMenu from "./LandingMobileMenu";
import { ACCOUNT_LINKS, ASSET_LINKS, LANGUAGES, NAV_GROUPS, NEWS_HREF, ORDER_LINKS } from "./landingNav";

const panelClass =
    "w-72! bg-lnd-surface! text-lnd-fg! border-lnd-border! rounded-2xl! shadow-xl! shadow-black/10! p-2!";

function maskEmail(input?: string) {
    try {
        if (!input || input.length <= 13) return input;
        return `${input.slice(0, 5)}***${input.slice(-5)}`;
    } catch {
        return input;
    }
}

function round2(num: number) {
    return Math.round(num * 100) / 100;
}

export default function LandingHeader() {
    const userData = useQuery(api.user.user);
    const auth = useQuery(api.auth.getCurrentUser);
    const spotAccounts = useQuery(api.accounts.view_all_spot_accounts);
    const futuresAccount = useQuery(api.accounts.view_all_futures_accounts);
    const marginAccount = useQuery(api.accounts.view_all_margin_accounts);
    const updateCurrencyMutation = useMutation(api.user.update_currency);
    const updateLanguageMutation = useMutation(api.user.update_language);
    const { data: currencies } = useCurrencies();
    const router = useRouter();
    const [openMobile, setOpenMobile] = useState(false);

    const loggedIn = !!userData;
    const userId = userData?.userId;
    const currenciesRates = (currencies?.data?.conversion_rates ?? {}) as Record<string, number>;

    const spot = (spotAccounts?.find((acc: any) => acc?.user === userId)?.total_asset ?? 0) as number;
    const futures = (futuresAccount?.find((acc: any) => acc?.user === userId)?.total_asset ?? 0) as number;
    const margin = (marginAccount?.find((acc: any) => acc?.user === userId)?.total_asset ?? 0) as number;
    const total = spot + futures + margin;

    function currencyConvertion(amount: number) {
        if (userData?.currency === "USD" || !userData?.currency) return amount;
        const rate = currenciesRates[userData.currency];
        return rate ? amount * rate : amount;
    }

    const logout = async () => {
        await authClient.signOut();
        router.push("/auth/login");
        router.refresh();
    };

    const CURRENCIES: ExchangeRate[] = currencies?.data?.conversion_rates;

    return (
        <header className="w-full sticky top-0 z-90 lnd-blur border-b border-lnd-border">
            <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-6 h-16 grid grid-cols-2 lg:grid-cols-[1fr_auto_1fr] items-center gap-4">
                {/* ------------------------------ left: nav ------------------------------ */}
                <div className="hidden lg:flex items-center">
                    <NavigationMenu viewport={false} className="justify-start">
                        <NavigationMenuList className="justify-start gap-1">
                            {NAV_GROUPS.map(group => (
                                <NavigationMenuItem key={group.label}>
                                    <NavigationMenuTrigger className="h-9 rounded-full! px-3.5 text-[0.85rem] font-Manrope font-medium text-lnd-fg bg-transparent hover:bg-lnd-surface-2 focus:bg-lnd-surface-2 data-[state=open]:bg-lnd-surface-2 outline-none">
                                        {group.label}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent className={panelClass}>
                                        <div className="flex flex-col gap-0.5">
                                            {group.items.map(item => (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className="flex flex-col gap-0.5 rounded-xl px-3.5 py-2.5 transition-colors hover:bg-lnd-surface-2"
                                                >
                                                    <span className="text-sm font-Manrope font-medium text-lnd-fg">
                                                        {item.title}
                                                    </span>
                                                    {item.description && (
                                                        <span className="text-xs text-lnd-fg-muted">
                                                            {item.description}
                                                        </span>
                                                    )}
                                                </Link>
                                            ))}
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            ))}
                            <NavigationMenuItem>
                                <Link
                                    href={NEWS_HREF}
                                    className="inline-flex h-9 items-center rounded-full px-3.5 text-[0.85rem] font-Manrope font-medium text-lnd-fg transition-colors hover:bg-lnd-surface-2"
                                >
                                    News
                                </Link>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* ----------------------------- center: brand ---------------------------- */}
                <div className="justify-self-start lg:justify-self-center">
                    <LandingBrand />
                </div>

                {/* --------------------------- right: actions ---------------------------- */}
                <div className="justify-self-end flex items-center gap-2">
                    {loggedIn ? (
                        <div className="hidden lg:flex items-center gap-2">
                            {/* Assets */}
                            <NavigationMenu viewport={false}>
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className="h-9 rounded-full! px-3.5 text-[0.85rem] font-Manrope font-medium text-lnd-fg bg-transparent hover:bg-lnd-surface-2 focus:bg-lnd-surface-2 data-[state=open]:bg-lnd-surface-2 outline-none">
                                            Assets
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent className="w-80! bg-lnd-surface! text-lnd-fg! border-lnd-border! rounded-2xl! shadow-xl! shadow-black/10! p-3!">
                                            <div className="flex flex-col gap-3">
                                                <div className="rounded-xl bg-lnd-surface-2 px-4 py-3">
                                                    <p className="text-[0.7rem] uppercase tracking-wider text-lnd-fg-muted">
                                                        Total Balance
                                                    </p>
                                                    <p className="mt-1 flex items-baseline gap-1.5">
                                                        <span className="text-2xl font-Manrope font-extrabold text-lnd-fg">
                                                            {round2(currencyConvertion(total)).toLocaleString()}
                                                        </span>
                                                        <span className="text-xs font-medium text-lnd-fg-muted">
                                                            {userData?.currency ?? "USD"}
                                                        </span>
                                                    </p>
                                                    <div className="mt-3 flex gap-2">
                                                        <Link
                                                            href="/overview/spot/deposit"
                                                            className="lnd-btn-accent flex-1 py-2 text-center text-[0.8rem]"
                                                        >
                                                            Deposit
                                                        </Link>
                                                        <Link
                                                            href="/overview/spot/withdraw"
                                                            className="lnd-btn-ghost flex-1 py-2 text-center text-[0.8rem]"
                                                        >
                                                            Withdraw
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-0.5 px-1">
                                                    {ASSET_LINKS.map(item => (
                                                        <Link
                                                            key={item.href}
                                                            href={item.href}
                                                            className="rounded-lg px-3 py-2 text-sm text-lnd-fg transition-colors hover:bg-lnd-surface-2"
                                                        >
                                                            {item.title}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>

                            {/* Orders */}
                            <NavigationMenu viewport={false}>
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className="h-9 rounded-full! px-3.5 text-[0.85rem] font-Manrope font-medium text-lnd-fg bg-transparent hover:bg-lnd-surface-2 focus:bg-lnd-surface-2 data-[state=open]:bg-lnd-surface-2 outline-none">
                                            Orders
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent className={panelClass}>
                                            <div className="flex flex-col gap-0.5">
                                                {ORDER_LINKS.map(item => (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        className="rounded-lg px-3 py-2 text-sm text-lnd-fg transition-colors hover:bg-lnd-surface-2"
                                                    >
                                                        {item.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>

                            {/* Account */}
                            <NavigationMenu viewport={false}>
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className="[&>svg]:hidden h-9 w-9 rounded-full! p-0! bg-transparent hover:bg-lnd-surface-2 focus:bg-lnd-surface-2 data-[state=open]:bg-lnd-surface-2 outline-none">
                                            <Image
                                                src="/assets/userlogo.svg"
                                                alt="account"
                                                width={100}
                                                height={100}
                                                className="w-6 h-6"
                                            />
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent className="w-80! left-auto! right-0! bg-lnd-surface! text-lnd-fg! border-lnd-border! rounded-2xl! shadow-xl! shadow-black/10! p-3!">
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center gap-3 rounded-xl bg-lnd-surface-2 p-3">
                                                    <Image
                                                        src="/assets/userlogo.svg"
                                                        alt="avatar"
                                                        width={100}
                                                        height={100}
                                                        className="w-11 h-11"
                                                    />
                                                    <div className="flex min-w-0 flex-col gap-1">
                                                        <span className="truncate text-sm font-Manrope font-semibold text-lnd-fg">
                                                            {maskEmail(userData?.email ?? userData?.username)}
                                                        </span>
                                                        <span className="flex items-center gap-1.5">
                                                            <span className="rounded-full border border-lnd-border px-2 py-px text-[0.65rem] font-medium text-lnd-fg-muted">
                                                                VIP {userData?.vip_status ?? 0}
                                                            </span>
                                                            <span
                                                                className={`flex items-center gap-1 rounded-full px-2 py-px text-[0.65rem] font-medium ${
                                                                    auth?.emailVerified
                                                                        ? "bg-lnd-accent/15 text-lnd-accent"
                                                                        : "bg-lnd-surface text-lnd-fg-muted"
                                                                }`}
                                                            >
                                                                <HiBadgeCheck />
                                                                {auth?.emailVerified ? "Verified" : "Unverified"}
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-0.5 px-1">
                                                    {ACCOUNT_LINKS.map(item => (
                                                        <Link
                                                            key={item.href}
                                                            href={item.href}
                                                            className="rounded-lg px-3 py-2 text-sm text-lnd-fg transition-colors hover:bg-lnd-surface-2"
                                                        >
                                                            {item.title}
                                                        </Link>
                                                    ))}
                                                    <button
                                                        onClick={logout}
                                                        className="rounded-lg px-3 py-2 text-start text-sm font-medium text-lnd-fg-muted transition-colors hover:bg-lnd-surface-2 hover:text-lnd-fg"
                                                    >
                                                        Log Out
                                                    </button>
                                                </div>
                                            </div>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>
                    ) : (
                        <div className="hidden lg:flex items-center gap-2">
                            <Link href="/auth/login" className="lnd-btn-ghost px-5 py-2 text-[0.85rem]">
                                Log In
                            </Link>
                            <Link href="/auth/signup" className="lnd-btn-accent px-5 py-2 text-[0.85rem]">
                                Sign Up
                            </Link>
                        </div>
                    )}

                    {/* Language + currency */}
                    <NavigationMenu viewport={false} className="hidden lg:flex">
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="[&>svg]:hidden h-9 rounded-full! px-3.5 gap-2 text-[0.85rem] font-Manrope font-medium text-lnd-fg bg-transparent hover:bg-lnd-surface-2 focus:bg-lnd-surface-2 data-[state=open]:bg-lnd-surface-2 outline-none">
                                    <span className="flex items-center">
                                        <Globe className="w-4 h-4" />
                                    </span>
                                    <span className="uppercase">{userData?.language ?? "EN"}</span>
                                </NavigationMenuTrigger>
                                <NavigationMenuContent className="w-[560px]! left-auto! right-0! bg-lnd-surface! text-lnd-fg! border-lnd-border! rounded-2xl! shadow-xl! shadow-black/10! p-5!">
                                    <div className="flex flex-col gap-5">
                                        <div>
                                            <h3 className="text-sm font-Manrope font-semibold text-lnd-fg">Language</h3>
                                            <div className="mt-3 grid grid-cols-4 gap-2">
                                                {LANGUAGES.map(lang => (
                                                    <button
                                                        key={lang.code}
                                                        onClick={() => {
                                                            updateLanguageMutation({ language: lang.code }).then(() =>
                                                                router.refresh(),
                                                            );
                                                        }}
                                                        className={`rounded-xl border px-3 py-2 text-sm transition-colors ${
                                                            userData?.language === lang.code
                                                                ? "border-lnd-accent bg-lnd-surface-2 font-medium text-lnd-accent"
                                                                : "border-lnd-border text-lnd-fg hover:border-lnd-accent"
                                                        }`}
                                                    >
                                                        {lang.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-Manrope font-semibold text-lnd-fg">Currency</h3>
                                            <ScrollArea className="mt-3 h-40">
                                                <div className="grid grid-cols-5 gap-2 pb-4">
                                                    {Object.entries(CURRENCIES ?? {})?.map(([currencyCode]) => (
                                                        <button
                                                            key={currencyCode}
                                                            onClick={() => {
                                                                updateCurrencyMutation({
                                                                    currency: currencyCode,
                                                                }).then(() => router.refresh());
                                                            }}
                                                            className={`flex items-center justify-center gap-1 rounded-xl border px-3 py-2 text-sm transition-colors ${
                                                                userData?.currency === currencyCode
                                                                    ? "border-lnd-accent bg-lnd-surface-2 font-medium text-lnd-accent"
                                                                    : "border-lnd-border text-lnd-fg hover:border-lnd-accent"
                                                            }`}
                                                        >
                                                            {currencyCode}
                                                            {userData?.currency === currencyCode && (
                                                                <Check className="w-3.5 h-3.5" />
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                                <ScrollBar />
                                            </ScrollArea>
                                        </div>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>

                    {/* Theme toggle (desktop) */}
                    <span className="hidden lg:flex items-center justify-center w-9 h-9 rounded-full border border-lnd-border transition-colors hover:bg-lnd-surface-2">
                        <SwapTheme />
                    </span>

                    <DropDownAccountMobile />

                    {/* Mobile menu trigger + drawer */}
                    <LandingMobileMenu
                        open={openMobile}
                        onOpenChange={setOpenMobile}
                        loggedIn={loggedIn}
                        user={userData}
                        currenciesRates={currenciesRates}
                        onLogout={logout}
                    />
                </div>
            </div>
        </header>
    );
}
