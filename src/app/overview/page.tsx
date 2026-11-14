"use client";
import ArchiveUp from "@/components/icons/ArchiveUp";
import HandMoney from "@/components/icons/HandMoney";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import useCryptoList from "@/hooks/useCryptoData";
import useCurrencies from "@/hooks/useCurrency";
import { CryptoCurrency } from "@/lib/types";
import { api } from "@convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { ArrowRight, CreditCard, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { RxEyeClosed } from "react-icons/rx";
import { Label, PolarAngleAxis, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import DropDown from "./components/DropDown";

export default function Overview() {
    const user = useQuery(api.user.user);
    const userId = user?.userId;
    const updateUser = useMutation(api.user.updateUser);
    const spotAccounts = useQuery(api.accounts.view_user_spot_accounts) ?? [];
    const futuresAccount = useQuery(api.accounts.view_user_futures_accounts) ?? [];
    const marginAccount = useQuery(api.accounts.view_user_margin_accounts) ?? [];
    const { data: cryptoData } = useCryptoList();
    const { data: currency } = useCurrencies();
    const router = useRouter();

    const toggleBalanceVisibility = async () => {
        if (!user) return;
        try {
            await updateUser({ balance_visibility: !user.balance_visibility });
        } catch {
            return;
        }
    };

    const rates = (currency?.data?.conversion_rates ?? {}) as Record<string, number>;
    function currencyConvertion(amount: number) {
        const rate = user?.currency ? rates[user.currency] : undefined;
        if (user?.currency == "USD") {
            return amount;
        }
        return rate ? amount * rate : amount;
    }
    const spot = spotAccounts?.find((acc: any) => acc?.user === userId);
    const futures = futuresAccount?.find((acc: any) => acc?.user === userId);
    const margin = marginAccount?.find((acc: any) => acc?.user === userId);

    const spotTotal = (spot?.total_asset ?? 0) as number;
    const futuresTotal = (futures?.total_asset ?? 0) as number;
    const marginTotal = (margin?.total_asset ?? 0) as number;
    const total = spotTotal + futuresTotal + marginTotal;

    const getCoinPrice = (userCrypto?: string) => {
        if (!userCrypto) return 0;
        const coin = cryptoData?.data?.data?.find(
            (crypto: CryptoCurrency) => crypto?.name?.toLowerCase() === userCrypto?.toLowerCase(),
        );
        const usdPrice = coin?.quote?.USD?.price;
        if (!usdPrice) return 0;
        return total / usdPrice;
    };

    const chartData = [{ total, spot: spotTotal }];
    const chartConfig = {
        desktop: {
            label: "total",
        },
        mobile: {
            label: "spot",
        },
    } satisfies ChartConfig;

    const roundToTwoDecimalPlaces = (num: number): number => {
        return Math.round(num * 100) / 100;
    };

    const roundToFourDecimalPlaces = (num: number): number => {
        return Math.round(num * 10000) / 10000;
    };
    const percentage = total > 0 ? roundToTwoDecimalPlaces((spotTotal / total) * 100) : 0;

    return (
        <div className="flex w-full flex-col gap-5">
            <div>
                <h1 className="db-title mt-1">Overview</h1>
                <p className="mt-1.5 text-[0.86rem] text-lnd-fg-muted">
                    A snapshot of your balances, allocation and quick actions.
                </p>
            </div>

            <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
                <section className="db-card flex flex-col gap-5 p-5 sm:p-6">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-[0.72rem] font-medium uppercase tracking-[0.14em] text-lnd-fg-muted">
                            Est. Total Assets (
                            {user?.crypto === "tether usdt" ? "USDT" : user?.crypto === "bitcoin" ? "BTC" : "ETH"})
                        </span>
                        {user?.balance_visibility === false ? <DropDown /> : null}
                        <button
                            onClick={toggleBalanceVisibility}
                            disabled={!user}
                            aria-label="Toggle balance visibility"
                            className="flex h-7 w-7 items-center justify-center rounded-full text-lnd-fg-muted transition-colors hover:bg-lnd-surface-2 hover:text-lnd-fg disabled:pointer-events-none disabled:opacity-50"
                        >
                            {user?.balance_visibility === false ? (
                                <Eye className="h-[1.1rem] w-[1.1rem]" />
                            ) : (
                                <RxEyeClosed className="h-[1.1rem] w-[1.1rem]" />
                            )}
                        </button>
                    </div>

                    <div className="flex flex-col gap-3 font-Manrope lg:flex-row lg:items-end lg:gap-5">
                        {user?.balance_visibility === false ? (
                            <>
                                <span className="break-all text-[2rem] font-extrabold leading-none tracking-tight text-lnd-fg sm:text-[2.4rem]">
                                    {roundToFourDecimalPlaces(getCoinPrice(user?.crypto))}
                                </span>
                                <span className="text-[0.95rem] font-medium text-lnd-fg-muted">
                                    ≈ {roundToTwoDecimalPlaces(currencyConvertion(total))} {user?.currency}
                                </span>
                            </>
                        ) : (
                            <span className="text-[2rem] font-extrabold leading-none tracking-[0.12em] text-lnd-fg">
                                ********
                            </span>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                        <button
                            onClick={() => router.push("/buy-crypto")}
                            className="lnd-btn-accent inline-flex items-center gap-2 px-4 py-2.5 text-[0.8rem] font-semibold"
                        >
                            <CreditCard className="h-4 w-4" />
                            Buy Crypto via Third-Party
                        </button>
                        <Link
                            href="/overview/spot/deposit"
                            className="lnd-btn-ghost inline-flex items-center gap-2 px-4 py-2.5 text-[0.8rem]"
                        >
                            Deposit
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </section>

                <section className="db-card hidden flex-col items-center gap-2 p-5 lg:flex">
                    <h2 className="db-section-title">Asset Portfolio</h2>
                    <ChartContainer config={chartConfig} className="h-40 w-full max-w-[15rem]">
                        <RadialBarChart data={chartData} endAngle={180} innerRadius={65} outerRadius={115} cy={130}>
                            <PolarAngleAxis
                                type="number"
                                scale="linear"
                                domain={[0, Math.max(total, 1)]}
                                tick={false}
                                tickLine={false}
                                axisLine={false}
                            />
                            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                            return (
                                                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) - 42}
                                                        className="fill-lnd-fg-muted font-Manrope text-sm font-semibold"
                                                    >
                                                        Spot
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) - 10}
                                                        className="fill-lnd-fg font-Manrope text-3xl font-extrabold"
                                                    >
                                                        {user?.balance_visibility === false
                                                            ? `${percentage}%`
                                                            : "********"}
                                                    </tspan>
                                                </text>
                                            );
                                        }
                                    }}
                                />
                            </PolarRadiusAxis>
                            <RadialBar
                                dataKey="spot"
                                fill="rgb(var(--lnd-accent))"
                                background={{ fill: "rgb(var(--lnd-border))" }}
                                cornerRadius={4}
                                className="stroke-transparent stroke-2"
                            />
                        </RadialBarChart>
                    </ChartContainer>
                    <p className="text-[0.75rem] text-lnd-fg-muted">Spot share of total assets</p>
                </section>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Link
                    href="/overview/spot/deposit"
                    className="db-card group flex items-center gap-4 p-5 transition-colors hover:border-lnd-accent/40 hover:bg-lnd-accent/[0.04] sm:p-6"
                >
                    <span className="db-icon-tile h-12 w-12">
                        <ArchiveUp className="h-7 w-7 fill-lnd-accent" />
                    </span>
                    <span className="min-w-0 flex-1">
                        <span className="block font-Manrope text-[1.02rem] font-bold text-lnd-fg transition-colors group-hover:text-lnd-accent">
                            I want to deposit
                        </span>
                        <span className="mt-1 block text-[0.82rem] leading-5 text-lnd-fg-muted">
                            Got crypto? Deposit to your Verdstamp account from other platforms.
                        </span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-lnd-fg-muted transition-transform group-hover:translate-x-1 group-hover:text-lnd-accent" />
                </Link>

                <Link
                    href="/buy-crypto"
                    className="db-card group flex items-center gap-4 p-5 transition-colors hover:border-lnd-accent/40 hover:bg-lnd-accent/[0.04] sm:p-6"
                >
                    <span className="db-icon-tile h-12 w-12">
                        <HandMoney className="h-7 w-7 fill-lnd-accent" />
                    </span>
                    <span className="min-w-0 flex-1">
                        <span className="block font-Manrope text-[1.02rem] font-bold text-lnd-fg transition-colors group-hover:text-lnd-accent">
                            I want to buy
                        </span>
                        <span className="mt-1 block text-[0.82rem] leading-5 text-lnd-fg-muted">
                            Buy BTC, ETH, USDT and more with your credit card.
                        </span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-lnd-fg-muted transition-transform group-hover:translate-x-1 group-hover:text-lnd-accent" />
                </Link>
            </div>
        </div>
    );
}
