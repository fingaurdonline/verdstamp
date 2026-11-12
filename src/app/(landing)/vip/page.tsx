import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { TbHexagonFilled } from "react-icons/tb";
import PageHero from "../components/PageHero";
import SectionHead from "../components/SectionHead";

const VIP_BENEFITS = [
    "Fee discount",
    "Referral privileges",
    "Join quality projects",
];

const VIP_LEVELS = [
    {
        image: "vip1.png",
        level: "VIP 1",
        cet: "≥ 2,000",
        usd: "≥ 10,000",
        spot: "≥ 20,000",
        futures: "≥ 200,000",
    },
    {
        image: "vip2.png",
        level: "VIP 2",
        cet: "≥ 10,000",
        usd: "≥ 50,000",
        spot: "≥ 100,000",
        futures: "≥ 1,000,000",
    },
    {
        image: "vip3.png",
        level: "VIP 3",
        cet: "≥ 50,000",
        usd: "≥ 100,000",
        spot: "≥ 200,000",
        futures: "≥ 2,000,000",
    },
    {
        image: "vip4.png",
        level: "VIP 4",
        cet: "≥ 250,000",
        usd: "≥ 200,000",
        spot: "≥ 500,000",
        futures: "≥ 5,000,000",
    },
    {
        image: "vip5.png",
        level: "VIP 5",
        cet: "≥ 1,000,000",
        usd: "≥ 500,000",
        spot: "≥ 1,000,000",
        futures: "≥ 10,000,000",
    },
];

const VIP_FEES = [
    {
        level: "VIP0",
        spotFees: "0.2%",
        spotFeesDeduction: "0.16%",
        futuresRateMaker: "0.03%",
        futuresRateTaker: "0.05%",
    },
    {
        level: "VIP1",
        spotFees: "0.18%",
        spotFeesDeduction: "0.144%",
        futuresRateMaker: "0.028%",
        futuresRateTaker: "0.048%",
    },
    {
        level: "VIP2",
        spotFees: "0.16%",
        spotFeesDeduction: "0.128%",
        futuresRateMaker: "0.026%",
        futuresRateTaker: "0.046%",
    },
    {
        level: "VIP3",
        spotFees: "0.14%",
        spotFeesDeduction: "0.112%",
        futuresRateMaker: "0.024%",
        futuresRateTaker: "0.044%",
    },
    {
        level: "VIP4",
        spotFees: "0.12%",
        spotFeesDeduction: "0.096%",
        futuresRateMaker: "0.022%",
        futuresRateTaker: "0.042%",
    },
    {
        level: "VIP5",
        spotFees: "0.1%",
        spotFeesDeduction: "0.08%",
        futuresRateMaker: "0.02%",
        futuresRateTaker: "0.04%",
    },
];

const REMINDERS = [
    "All VIP levels are automatically updated on Verdstamp at 1:00 (UTC) daily.",
    "If your CET balances are bound with an off-site address, the amount of CET held by the off-site address will be included in the calculation.",
    "VIP fee discount is applicable on top of the discount using CET as fees.",
    "After your VIP level takes effect, you can enjoy trading fee discounts. Please see 'VIP Discount' for more details.",
    "The trading volume of market makers is not included in VIP calculations.",
    "No upper limit on API trading volume (market makers excepted).",
];

export default function Page() {
    return (
        <main className="w-full">
            <PageHero
                eyebrow="VIP program"
                title={
                    <>
                        Verdstamp <span className="text-lnd-accent">VIP</span>
                        <br />
                        <span className="text-lnd-fg-muted">
                            Unlock a world of privileges
                        </span>
                    </>
                }
                subtitle="Friendly entry plus great benefits. Enjoy multiple VIP exclusives designed for active traders."
                actions={
                    <>
                        <Link
                            href="/buy-crypto"
                            className="lnd-btn-accent inline-flex items-center gap-2 px-6 py-3 text-sm"
                        >
                            Buy USDT
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/fees-standard"
                            className="lnd-btn-ghost inline-flex items-center gap-2 px-6 py-3 text-sm"
                        >
                            Trading fees
                        </Link>
                    </>
                }
                aside={
                    <div className="relative overflow-hidden rounded-3xl border border-lnd-border bg-lnd-surface p-6 lg:p-8">
                        <div
                            aria-hidden
                            className="lnd-glow pointer-events-none absolute -right-24 -top-24 h-72 w-72"
                        />
                        <TbHexagonFilled
                            aria-hidden
                            className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 text-lnd-accent/5"
                        />
                        <div className="relative">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-lnd-fg-muted">
                                        VIP entry from
                                    </p>
                                    <p className="mt-2 font-Manrope text-4xl font-extrabold tracking-tight text-lnd-fg">
                                        2,000{" "}
                                        <span className="text-base font-medium text-lnd-fg-muted">
                                            USDT
                                        </span>
                                    </p>
                                </div>
                                <Image
                                    src="/assets/vip.webp"
                                    alt="Verdstamp VIP"
                                    width={1000}
                                    height={1000}
                                    className="h-16 w-16 object-contain"
                                />
                            </div>
                            <ul className="mt-6 space-y-3 border-t border-lnd-border pt-5">
                                {VIP_BENEFITS.map((benefit) => (
                                    <li
                                        key={benefit}
                                        className="flex items-center gap-3 text-sm text-lnd-fg"
                                    >
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-lnd-accent/10 text-lnd-accent">
                                            <Check className="h-3 w-3" />
                                        </span>
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-5 text-xs leading-relaxed text-lnd-fg-muted">
                                Friendly entry plus great benefits — enjoy
                                multiple VIP exclusives.
                            </p>
                        </div>
                    </div>
                }
            />

            {/* VIP levels */}
            <section className="mx-auto w-full max-w-[1280px] px-4 py-16 lg:px-6 lg:py-20">
                <SectionHead
                    eyebrow="Levels"
                    title="About VIP level"
                    description="Meet any one of the thresholds below to unlock the corresponding VIP level."
                />

                <div className="mt-8 overflow-hidden rounded-2xl border border-lnd-border bg-lnd-surface">
                    <div className="hidden grid-cols-[1.15fr_repeat(4,1fr)] gap-4 border-b border-lnd-border bg-lnd-surface-2 px-5 py-3 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-lnd-fg-muted lg:grid">
                        <span>VIP level</span>
                        <span>CET balance</span>
                        <span>Total asset value (USD)</span>
                        <span>Spot volume (30d)</span>
                        <span>Futures volume (30d)</span>
                    </div>

                    {VIP_LEVELS.map((row) => (
                        <div
                            key={row.level}
                            className="grid grid-cols-2 gap-x-4 gap-y-4 border-b border-lnd-border px-4 py-5 last:border-b-0 lg:grid-cols-[1.15fr_repeat(4,1fr)] lg:items-center lg:gap-4 lg:px-5 lg:py-4"
                        >
                            <div className="col-span-2 flex items-center gap-2.5 lg:col-span-1">
                                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-lnd-border bg-lnd-surface-2">
                                    <Image
                                        src={`/assets/${row.image}`}
                                        alt=""
                                        width={1000}
                                        height={1000}
                                        className="h-5 w-5 object-contain"
                                    />
                                </span>
                                <span className="font-Manrope text-sm font-semibold text-lnd-fg">
                                    {row.level}
                                </span>
                            </div>
                            {[
                                ["CET balance", row.cet],
                                ["Total assets", row.usd],
                                ["Spot volume (30d)", row.spot],
                                ["Futures volume (30d)", row.futures],
                            ].map(([label, value]) => (
                                <div key={label}>
                                    <p className="text-[0.6rem] font-medium uppercase tracking-[0.12em] text-lnd-fg-muted lg:hidden">
                                        {label}
                                    </p>
                                    <p className="mt-0.5 text-sm font-medium text-lnd-fg lg:mt-0">
                                        {value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </section>

            {/* VIP fee discount */}
            <section className="border-y border-lnd-border bg-lnd-surface/30">
                <div className="mx-auto w-full max-w-[1280px] px-4 py-16 lg:px-6 lg:py-20">
                    <SectionHead
                        eyebrow="Fees"
                        title="VIP rate discount"
                        description="Enjoy the double discount of VIP rate and USDT deduction at the same time!"
                    />

                    <div className="mt-8 overflow-hidden rounded-2xl border border-lnd-border bg-lnd-surface">
                        <div className="hidden grid-cols-[1.1fr_repeat(3,1fr)] gap-4 border-b border-lnd-border bg-lnd-surface-2 px-5 py-3 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-lnd-fg-muted lg:grid">
                            <span>VIP level</span>
                            <span>Spot fees</span>
                            <span>Spot fees (CET deduction)</span>
                            <span>Futures rate</span>
                        </div>

                        {VIP_FEES.map((row) => (
                            <div
                                key={row.level}
                                className="grid grid-cols-2 gap-x-4 gap-y-4 border-b border-lnd-border px-4 py-5 last:border-b-0 lg:grid-cols-[1.1fr_repeat(3,1fr)] lg:items-center lg:gap-4 lg:px-5 lg:py-4"
                            >
                                <div className="col-span-2 flex items-center gap-2.5 lg:col-span-1">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lnd-surface-2 font-Manrope text-[0.65rem] font-bold text-lnd-accent">
                                        {row.level.replace("VIP", "")}
                                    </span>
                                    <span className="font-Manrope text-sm font-semibold text-lnd-fg">
                                        {row.level}
                                    </span>
                                </div>
                                {[
                                    ["Spot fees", row.spotFees],
                                    [
                                        "Spot fees (CET deduction)",
                                        row.spotFeesDeduction,
                                    ],
                                ].map(([label, value]) => (
                                    <div key={label}>
                                        <p className="text-[0.6rem] font-medium uppercase tracking-[0.12em] text-lnd-fg-muted lg:hidden">
                                            {label}
                                        </p>
                                        <p className="mt-0.5 text-sm font-medium text-lnd-fg lg:mt-0">
                                            {value}
                                        </p>
                                    </div>
                                ))}
                                <div>
                                    <p className="text-[0.6rem] font-medium uppercase tracking-[0.12em] text-lnd-fg-muted lg:hidden">
                                        Futures rate
                                    </p>
                                    <p className="mt-0.5 flex flex-wrap gap-x-3 gap-y-1 text-sm font-medium text-lnd-fg lg:mt-0">
                                        <span>
                                            Maker{" "}
                                            <span className="text-lnd-accent">
                                                {row.futuresRateMaker}
                                            </span>
                                        </span>
                                        <span>
                                            Taker{" "}
                                            <span className="text-lnd-accent">
                                                {row.futuresRateTaker}
                                            </span>
                                        </span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reminder */}
            <section className="mx-auto w-full max-w-[1280px] px-4 py-16 lg:px-6 lg:py-20">
                <div className="rounded-2xl border border-lnd-border bg-lnd-surface p-6 lg:p-8">
                    <h2 className="font-Manrope text-xl font-bold text-lnd-fg">
                        Reminder
                    </h2>
                    <ol className="mt-5 space-y-3">
                        {REMINDERS.map((reminder, i) => (
                            <li
                                key={i}
                                className="flex gap-3 text-sm leading-relaxed text-lnd-fg-muted"
                            >
                                <span className="mt-0.5 font-Manrope text-xs font-bold tracking-[0.1em] text-lnd-accent">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <span>{reminder}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* Final CTA */}
            <section className="relative overflow-hidden border-t border-lnd-border">
                <div
                    aria-hidden
                    className="lnd-dot-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_80%_at_50%_50%,black,transparent)]"
                />
                <div className="relative mx-auto flex w-full max-w-[1280px] flex-col items-start justify-between gap-6 px-4 py-14 sm:flex-row sm:items-center lg:px-6 lg:py-16">
                    <div>
                        <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-lnd-accent">
                            VIP benefits
                        </p>
                        <h2 className="mt-2 font-Manrope text-2xl font-extrabold tracking-tight text-lnd-fg sm:text-3xl">
                            Ready to unlock VIP privileges?
                        </h2>
                        <p className="mt-2 text-sm text-lnd-fg-muted">
                            Buy USDT or start trading to reach your next level.
                        </p>
                    </div>
                    <Link
                        href="/buy-crypto"
                        className="lnd-btn-accent inline-flex shrink-0 items-center gap-2 px-7 py-3 text-sm"
                    >
                        Buy USDT
                        <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>
        </main>
    );
}
