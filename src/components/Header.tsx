"use client";

import LandingBrand from "@/app/(landing)/components/LandingBrand";
import { ACCOUNT_LINKS, ASSET_LINKS, LANGUAGES, ORDER_LINKS } from "@/app/(landing)/components/landingNav";
import Loader from "@/app/(landing)/components/Loader";
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
import { api } from "@convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { ArrowRight, ChevronRight, Globe, MessageSquare, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { BsCircleFill } from "react-icons/bs";
import { HiBadgeCheck } from "react-icons/hi";
import DropDownAccountMobile from "./DropDownAccountMobile";
import DropDownMobileMenu from "./DropDownMenuMobile";
import NoData from "./icons/NoData";
import SwapTheme from "./ThemeSwap";

const triggerClass =
    "h-9 rounded-full! bg-transparent px-3 text-[0.82rem] font-Manrope font-medium text-lnd-fg outline-none hover:bg-lnd-surface-2 focus:bg-lnd-surface-2 data-[state=open]:bg-lnd-surface-2";

const panelClass =
    "w-80! rounded-2xl! border-lnd-border! bg-lnd-surface! p-2! text-lnd-fg! shadow-xl! shadow-black/10!";

const iconButtonClass =
    "flex h-9 w-9 items-center justify-center rounded-full border border-lnd-border text-lnd-fg transition-colors hover:bg-lnd-surface-2";

const FINANCE_LINKS = [
    {
        title: "Trade",
        description: "Open a 7-day plan with real market charts",
        href: "/overview/trade/spot/BTC/USDT",
    },
    {
        title: "Spot",
        description: "Trade and manage your spot portfolio",
        href: "/overview/spot/assets",
    },
    {
        title: "Margin",
        description: "Borrow and trade with your margin account",
        href: "/overview/margin/assets",
    },
    {
        title: "Loans",
        description: "Borrow against your crypto holdings",
        href: "/overview/loan/assets",
    },
];

const MORE_LINKS = [
    {
        title: "Referral",
        description: "Receive up to 40% referral rewards",
        href: "/referral",
    },
    {
        title: "Verdstamp VIP",
        description: "Explore exclusive VIP privileges",
        href: "/vip",
    },
    {
        title: "Help",
        description: "Answers to all your questions",
        href: "/support",
    },
    {
        title: "Announcements",
        description: "Check out the latest platform notices",
        href: "/sta-article",
    },
];

type PanelLinkProps = {
    href: string;
    title: string;
    description?: string;
    onNavigate?: () => void;
};

function PanelLink({ href, title, description, onNavigate }: PanelLinkProps) {
    return (
        <Link
            href={href}
            onClick={onNavigate}
            className="group flex items-center justify-between gap-4 rounded-xl px-3.5 py-3 transition-colors hover:bg-lnd-surface-2"
        >
            <span className="flex min-w-0 flex-col gap-0.5">
                <span className="font-Manrope text-sm font-medium text-lnd-fg">{title}</span>
                {description && <span className="text-xs leading-5 text-lnd-fg-muted">{description}</span>}
            </span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-lnd-accent opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>
    );
}

function maskEmail(input?: string) {
    if (!input) return "";
    if (input.length <= 13) return input;
    return `${input.slice(0, 5)}***${input.slice(-5)}`;
}

export default function Header() {
    type RawMessage = {
        _id: string;
        read: boolean;
        title: string;
        description: string;
        createdAt: number;
    };
    type HeaderMessageView = {
        id: string;
        read: boolean;
        title: string;
        description: string;
        created: string;
    };

    const router = useRouter();
    const userData = useQuery(api.user.user);
    const auth = useQuery(api.auth.getCurrentUser);
    const spotAccounts = useQuery(api.accounts.view_all_spot_accounts);
    const futuresAccount = useQuery(api.accounts.view_all_futures_accounts);
    const marginAccount = useQuery(api.accounts.view_all_margin_accounts);
    const rawMessages = useQuery(api.messages.view_messages) as RawMessage[] | undefined;
    const { data: currencies } = useCurrencies();

    const updateCurrencyMutation = useMutation(api.user.update_currency);
    const updateLanguageMutation = useMutation(api.user.update_language);
    const updateMessageReadMutation = useMutation(api.messages.update_message_read);

    const userId = userData?.userId;
    const messages: HeaderMessageView[] | undefined = rawMessages?.map(message => ({
        id: String(message._id),
        read: message.read,
        title: message.title,
        description: message.description,
        created: new Date(message.createdAt).toLocaleString(),
    }));
    const unreadMessages = messages?.filter(message => !message.read).slice(0, 4) ?? [];
    const isLoadingMessages = rawMessages === undefined;

    const spot = (spotAccounts?.find((acc: any) => acc?.user === userId)?.total_asset ?? 0) as number;
    const futures = (futuresAccount?.find((acc: any) => acc?.user === userId)?.total_asset ?? 0) as number;
    const margin = (marginAccount?.find((acc: any) => acc?.user === userId)?.total_asset ?? 0) as number;
    const total = spot + futures + margin;

    const conversionRates = (currencies?.data?.conversion_rates ?? {}) as Record<string, number>;

    function currencyConvertion(amount: number) {
        if (!userData?.currency || userData.currency === "USD") return amount;
        return amount * (conversionRates[userData.currency] ?? 1);
    }

    const logout = async () => {
        await authClient.signOut();
        router.push("/auth/login");
        router.refresh();
    };

    const readMessage = (id: string) => {
        updateMessageReadMutation({ id });
    };

    return (
        <header className="sticky top-0 z-90 w-full border-b border-lnd-border bg-lnd-bg/85 backdrop-blur-md">
            <div className="mx-auto flex h-16 w-full max-w-[1560px] items-center gap-3 px-3 sm:px-5 lg:px-7">
                <div className="flex min-w-0 items-center gap-3 xl:gap-6">
                    <LandingBrand />

                    <div className="hidden lg:block">
                        <NavigationMenu viewport={false}>
                            <NavigationMenuList className="gap-0.5">
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className={triggerClass}>Buy Crypto</NavigationMenuTrigger>
                                    <NavigationMenuContent className={panelClass}>
                                        <div className="flex flex-col gap-0.5">
                                            <PanelLink
                                                href="/buy-crypto"
                                                title="Third-party Trading"
                                                description="Buy and sell crypto through institutions"
                                            />
                                            <PanelLink
                                                href="/swap"
                                                title="Swap"
                                                description="Instantly swap between supported assets"
                                            />
                                            <PanelLink
                                                href="/transfer"
                                                title="Transfer"
                                                description="Send and receive across supported networks"
                                            />
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className={triggerClass}>Finances</NavigationMenuTrigger>
                                    <NavigationMenuContent className={panelClass}>
                                        <div className="flex flex-col gap-0.5">
                                            {FINANCE_LINKS.map(item => (
                                                <PanelLink key={item.href} {...item} />
                                            ))}
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className={triggerClass}>More</NavigationMenuTrigger>
                                    <NavigationMenuContent className={panelClass}>
                                        <div className="flex flex-col gap-0.5">
                                            {MORE_LINKS.map(item => (
                                                <PanelLink key={item.href} {...item} />
                                            ))}
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                </div>

                <div className="ml-auto flex items-center gap-2">
                    <div className="hidden items-center gap-1.5 lg:flex">
                        {!userData ? (
                            <>
                                <Link href="/auth/login" className="lnd-btn-ghost px-4 py-2 text-[0.8rem]">
                                    Log In
                                </Link>
                                <Link href="/auth/signup" className="lnd-btn-accent px-4 py-2 text-[0.8rem]">
                                    Sign Up
                                </Link>
                            </>
                        ) : (
                            <>
                                <NavigationMenu viewport={false}>
                                    <NavigationMenuList>
                                        <NavigationMenuItem>
                                            <NavigationMenuTrigger className={triggerClass}>
                                                <span className="flex items-center gap-2">
                                                    <Wallet className="h-4 w-4" />
                                                    Assets
                                                </span>
                                            </NavigationMenuTrigger>
                                            <NavigationMenuContent className={panelClass}>
                                                <div className="flex flex-col gap-3">
                                                    <div className="rounded-xl border border-lnd-border bg-lnd-surface-2 p-3.5">
                                                        <p className="text-[0.65rem] uppercase tracking-[0.16em] text-lnd-fg-muted">
                                                            Total Balance
                                                        </p>
                                                        <p className="mt-1.5 flex items-baseline gap-1.5">
                                                            <span className="font-Manrope text-xl font-extrabold text-lnd-fg">
                                                                {Math.round(currencyConvertion(total) * 100) / 100}
                                                            </span>
                                                            <span className="text-[0.7rem] font-medium text-lnd-fg-muted">
                                                                {userData.currency ?? "USD"}
                                                            </span>
                                                        </p>
                                                        <div className="mt-3 flex gap-2">
                                                            <Link
                                                                href="/overview/spot/deposit"
                                                                className="lnd-btn-accent flex-1 py-2 text-center text-[0.78rem]"
                                                            >
                                                                Deposit
                                                            </Link>
                                                            <Link
                                                                href="/overview/spot/withdraw"
                                                                className="lnd-btn-ghost flex-1 py-2 text-center text-[0.78rem]"
                                                            >
                                                                Withdraw
                                                            </Link>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-0.5">
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

                                <NavigationMenu viewport={false}>
                                    <NavigationMenuList>
                                        <NavigationMenuItem>
                                            <NavigationMenuTrigger className={triggerClass}>
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

                                <NavigationMenu viewport={false}>
                                    <NavigationMenuList>
                                        <NavigationMenuItem>
                                            <NavigationMenuTrigger className="h-9 w-9 rounded-full! p-0! hover:bg-lnd-surface-2 focus:bg-lnd-surface-2 data-[state=open]:bg-lnd-surface-2 [&>svg]:hidden">
                                                <Globe className="h-4 w-4" />
                                            </NavigationMenuTrigger>
                                            <NavigationMenuContent className="w-lg! rounded-2xl! border-lnd-border! bg-lnd-surface! p-5! text-lnd-fg! shadow-xl! shadow-black/10!">
                                                <div className="mb-5">
                                                    <h3 className="db-section-title mb-3">Language</h3>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {LANGUAGES.map(language => (
                                                            <button
                                                                key={language.code}
                                                                onClick={() => {
                                                                    updateLanguageMutation({
                                                                        language: language.code,
                                                                    }).then(() => router.refresh());
                                                                }}
                                                                className={`rounded-xl border px-3 py-2 text-left text-xs transition-colors ${
                                                                    userData.language === language.code
                                                                        ? "border-lnd-accent/40 bg-lnd-accent/10 font-medium text-lnd-accent"
                                                                        : "border-lnd-border text-lnd-fg hover:bg-lnd-surface-2"
                                                                }`}
                                                            >
                                                                {language.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="db-section-title mb-3">Currency</h3>
                                                    <ScrollArea className="h-48">
                                                        <div className="grid grid-cols-4 gap-2">
                                                            {Object.keys(conversionRates).map(currencyCode => (
                                                                <button
                                                                    key={currencyCode}
                                                                    onClick={() => {
                                                                        updateCurrencyMutation({
                                                                            currency: currencyCode,
                                                                        }).then(() => router.refresh());
                                                                    }}
                                                                    className={`rounded-xl border px-3 py-2 text-xs transition-colors ${
                                                                        userData.currency === currencyCode
                                                                            ? "border-lnd-accent/40 bg-lnd-accent/10 font-medium text-lnd-accent"
                                                                            : "border-lnd-border text-lnd-fg hover:bg-lnd-surface-2"
                                                                    }`}
                                                                >
                                                                    {currencyCode}
                                                                </button>
                                                            ))}
                                                        </div>
                                                        <ScrollBar />
                                                    </ScrollArea>
                                                </div>
                                            </NavigationMenuContent>
                                        </NavigationMenuItem>
                                    </NavigationMenuList>
                                </NavigationMenu>

                                <NavigationMenu viewport={false}>
                                    <NavigationMenuList>
                                        <NavigationMenuItem>
                                            <NavigationMenuTrigger className="h-9 w-9 rounded-full! bg-transparent p-0! hover:bg-lnd-surface-2 focus:bg-lnd-surface-2 data-[state=open]:bg-lnd-surface-2 [&>svg]:hidden">
                                                <Image
                                                    src="/assets/userlogo.svg"
                                                    alt="Account"
                                                    width={100}
                                                    height={100}
                                                    className="h-7 w-7"
                                                />
                                            </NavigationMenuTrigger>
                                            <NavigationMenuContent className="w-76! rounded-2xl! border-lnd-border! bg-lnd-surface! p-2! text-lnd-fg! shadow-xl! shadow-black/10!">
                                                <div className="flex items-center gap-3 rounded-xl bg-lnd-surface-2 p-3">
                                                    <Image
                                                        src="/assets/userlogo.svg"
                                                        alt="Avatar"
                                                        width={100}
                                                        height={100}
                                                        className="h-11 w-11"
                                                    />
                                                    <div className="flex min-w-0 flex-col gap-1">
                                                        <span className="truncate font-Manrope text-sm font-semibold text-lnd-fg">
                                                            {maskEmail(userData.email ?? userData.username)}
                                                        </span>
                                                        <span className="flex items-center gap-1.5">
                                                            <span className="rounded-full border border-lnd-border px-2 py-px text-[0.63rem] font-medium text-lnd-fg-muted">
                                                                VIP {userData.vip_status ?? 0}
                                                            </span>
                                                            <span
                                                                className={`flex items-center gap-1 rounded-full px-2 py-px text-[0.63rem] font-medium ${
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

                                                <div className="mt-2 flex flex-col gap-0.5">
                                                    {ACCOUNT_LINKS.map(item => (
                                                        <Link
                                                            key={item.href}
                                                            href={item.href}
                                                            className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-lnd-fg transition-colors hover:bg-lnd-surface-2"
                                                        >
                                                            {item.title}
                                                            <ChevronRight className="h-3.5 w-3.5 text-lnd-fg-muted" />
                                                        </Link>
                                                    ))}
                                                    <button
                                                        onClick={logout}
                                                        className="mt-1 flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-lnd-fg-muted transition-colors hover:bg-lnd-surface-2 hover:text-lnd-fg"
                                                    >
                                                        Log Out
                                                        <ChevronRight className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </NavigationMenuContent>
                                        </NavigationMenuItem>
                                    </NavigationMenuList>
                                </NavigationMenu>

                                <NavigationMenu viewport={false}>
                                    <NavigationMenuList>
                                        <NavigationMenuItem>
                                            <NavigationMenuTrigger className="h-9 w-9 rounded-full! bg-transparent p-0! hover:bg-lnd-surface-2 focus:bg-lnd-surface-2 data-[state=open]:bg-lnd-surface-2 [&>svg]:hidden">
                                                <span className="relative flex items-center justify-center">
                                                    <MessageSquare className="h-[1.1rem] w-[1.1rem]" />
                                                    {unreadMessages.length > 0 && (
                                                        <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-lnd-accent px-1 text-[0.6rem] font-bold text-lnd-accent-fg">
                                                            {unreadMessages.length}
                                                        </span>
                                                    )}
                                                </span>
                                            </NavigationMenuTrigger>
                                            <NavigationMenuContent className="w-90! rounded-2xl! border-lnd-border! bg-lnd-surface! p-2! text-lnd-fg! shadow-xl! shadow-black/10!">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center justify-between rounded-xl bg-lnd-surface-2 px-3.5 py-2.5">
                                                        <span className="text-sm font-medium text-lnd-fg">
                                                            {unreadMessages.length} unread
                                                        </span>
                                                        <Link
                                                            href="/account/messages"
                                                            className="text-xs font-medium text-lnd-accent hover:underline"
                                                        >
                                                            View all
                                                        </Link>
                                                    </div>

                                                    {isLoadingMessages ? (
                                                        <div className="flex h-44 items-center justify-center">
                                                            <Loader />
                                                        </div>
                                                    ) : unreadMessages.length === 0 ? (
                                                        <div className="flex h-44 flex-col items-center justify-center gap-2 text-sm text-lnd-fg-muted">
                                                            <NoData className="h-16 w-16" />
                                                            No unread messages
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col">
                                                            {unreadMessages.map(message => (
                                                                <button
                                                                    key={message.id}
                                                                    onClick={() => {
                                                                        router.push(
                                                                            `/account/message_detail/${message.id}`,
                                                                        );
                                                                        readMessage(message.id);
                                                                    }}
                                                                    className="flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-lnd-surface-2"
                                                                >
                                                                    <BsCircleFill className="mt-1.5 h-2 w-2 shrink-0 text-lnd-accent" />
                                                                    <span className="flex min-w-0 flex-col gap-1">
                                                                        <span className="truncate font-Manrope text-sm font-semibold text-lnd-fg">
                                                                            {message.title}
                                                                        </span>
                                                                        <span className="line-clamp-2 text-xs leading-5 text-lnd-fg-muted">
                                                                            {message.description}
                                                                        </span>
                                                                        <span className="text-[0.65rem] text-lnd-fg-muted">
                                                                            {message.created}
                                                                        </span>
                                                                    </span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <Link
                                                        href="/account/messages"
                                                        className="lnd-btn-ghost py-2 text-center text-[0.78rem]"
                                                    >
                                                        Open message centre
                                                    </Link>
                                                </div>
                                            </NavigationMenuContent>
                                        </NavigationMenuItem>
                                    </NavigationMenuList>
                                </NavigationMenu>

                                <span className={iconButtonClass}>
                                    <SwapTheme />
                                </span>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-2 lg:hidden">
                        <DropDownAccountMobile />
                        <DropDownMobileMenu />
                    </div>
                </div>
            </div>
        </header>
    );
}
