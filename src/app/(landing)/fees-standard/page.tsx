"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import PageHero from "../components/PageHero";
import PageCta from "../components/PageCta";

const vipData = [
    { level: "VIP 0", spotFees: "0.2%", discountFees: "0.16%" },
    { level: "VIP 1", spotFees: "0.18%", discountFees: "0.144%" },
    { level: "VIP 2", spotFees: "0.16%", discountFees: "0.128%" },
    { level: "VIP 3", spotFees: "0.14%", discountFees: "0.112%" },
    { level: "VIP 4", spotFees: "0.12%", discountFees: "0.096%" },
    { level: "VIP 5", spotFees: "0.1%", discountFees: "0.08%" },
];

const futuresVipData = [
    { level: "VIP 0", makerFees: "0.03%", takerFees: "0.05%" },
    { level: "VIP 1", makerFees: "0.028%", takerFees: "0.048%" },
    { level: "VIP 2", makerFees: "0.026%", takerFees: "0.046%" },
    { level: "VIP 3", makerFees: "0.024%", takerFees: "0.044%" },
    { level: "VIP 4", makerFees: "0.022%", takerFees: "0.042%" },
    { level: "VIP 5", makerFees: "0.02%", takerFees: "0.04%" },
];

const FEE_NOTES = [
    "The snapshots of CET balance (Holding in the non-Verdstamp address included) will be taken at 0:00 (UTC) everyday.",
    "The snapshots of 30-day trading volume will be taken at 0:00 (UTC) and calculated in accordance with the USD exchange rate at that time.",
    "All VIP Level will be updated at 1:00 (UTC) on a daily basis, all Market Making Level will be updated at 1:00 (UTC) on the 1st of each month.",
    "User's actual fees is determined by the lower number between VIP Discount and Market Maker Discount.",
];

type FeeTab = "spot" | "futures";

function FeeTable({ tab }: { tab: FeeTab }) {
    const isSpot = tab === "spot";
    const columns = isSpot
        ? ["VIP level", "Spot maker fees", "Spot taker fees", "Discounted spot fees"]
        : ["VIP level", "Futures maker fees", "Futures taker fees"];
    const rows = isSpot
        ? vipData.map((row) => ({
              level: row.level,
              values: [row.spotFees, row.spotFees, row.discountFees],
          }))
        : futuresVipData.map((row) => ({
              level: row.level,
              values: [row.makerFees, row.takerFees],
          }));
    const mobileLabels = isSpot
        ? ["Maker", "Taker", "Discounted"]
        : ["Maker", "Taker"];

    return (
        <div className="overflow-hidden rounded-2xl border border-lnd-border bg-lnd-surface">
            <div
                className={`hidden gap-4 border-b border-lnd-border bg-lnd-surface-2 px-5 py-3 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-lnd-fg-muted sm:grid ${
                    isSpot ? "sm:grid-cols-4" : "sm:grid-cols-3"
                }`}
            >
                {columns.map((column) => (
                    <span
                        key={column}
                        className={
                            column === columns[0] ? "" : "text-right"
                        }
                    >
                        {column}
                    </span>
                ))}
            </div>

            {rows.map((row) => (
                <div
                    key={row.level}
                    className={`grid grid-cols-3 gap-x-4 gap-y-4 border-b border-lnd-border px-4 py-5 last:border-b-0 sm:items-center sm:gap-4 sm:px-5 sm:py-4 ${
                        isSpot ? "sm:grid-cols-4" : "sm:grid-cols-3"
                    }`}
                >
                    <div className="col-span-3 flex items-center gap-2.5 sm:col-span-1">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lnd-surface-2 font-Manrope text-[0.65rem] font-bold text-lnd-accent">
                            {row.level.replace("VIP ", "")}
                        </span>
                        <span className="font-Manrope text-sm font-semibold text-lnd-fg">
                            {row.level}
                        </span>
                    </div>
                    {row.values.map((value, index) => (
                        <div key={columns[index + 1]} className="text-left sm:text-right">
                            <p className="text-[0.58rem] font-medium uppercase tracking-[0.12em] text-lnd-fg-muted sm:hidden">
                                {mobileLabels[index]}
                            </p>
                            <p className="mt-0.5 font-Manrope text-sm font-semibold text-lnd-fg sm:mt-0">
                                {value}
                            </p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default function FeesStandard() {
    const [tab, setTab] = useState<FeeTab>("spot");

    return (
        <main className="w-full">
            <PageHero
                align="center"
                eyebrow="Fees"
                title={
                    <>
                        Fees <span className="text-lnd-accent">standard</span>
                    </>
                }
                subtitle="Transparent trading fees across every VIP level. The more you trade, the less you pay."
                actions={
                    <Link
                        href="/vip"
                        className="lnd-btn-ghost inline-flex items-center gap-2 px-6 py-3 text-sm"
                    >
                        Explore VIP
                        <ArrowUpRight className="h-4 w-4" />
                    </Link>
                }
            />

            <section className="mx-auto w-full max-w-[1280px] px-4 py-16 lg:px-6 lg:py-20">
                <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
                    <div>
                        <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-lnd-accent">
                            Overview
                        </p>
                        <h2 className="mt-2 font-Manrope text-3xl font-bold tracking-tight text-lnd-fg lg:text-4xl">
                            How fees are calculated
                        </h2>
                        <p className="mt-4 text-sm leading-relaxed text-lnd-fg-muted">
                            Verdstamp trading fee rate varies by different VIP
                            Levels and Market Making Levels.
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-lnd-fg-muted">
                            VIP levels are categorized based on meeting any of
                            the conditions for CET balance, total asset value,
                            30-day spot trading volume, or 30-day futures
                            trading volume, while market maker levels are
                            determined based on varying trading volumes, with
                            main and sub-accounts combined for calculation.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-lnd-border bg-lnd-surface p-5 lg:p-7">
                        <h3 className="font-Manrope text-base font-semibold text-lnd-fg">
                            Good to know
                        </h3>
                        <ul className="mt-4 space-y-3">
                            {FEE_NOTES.map((note) => (
                                <li
                                    key={note}
                                    className="flex gap-2.5 text-sm leading-relaxed text-lnd-fg-muted"
                                >
                                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-lnd-accent" />
                                    {note}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-5 rounded-xl border border-lnd-border bg-lnd-surface-2 p-4 text-xs leading-relaxed text-lnd-fg-muted">
                            <p>
                                <strong className="font-semibold text-lnd-fg">
                                    Maker:
                                </strong>{" "}
                                Market makers are those who buy or sell at a
                                certain price. They provide the liquidity/depth
                                for the market.{" "}
                                <strong className="font-semibold text-lnd-fg">
                                    Taker:
                                </strong>{" "}
                                Market takers are those who look for a suitable
                                proposed buy/sell order actively and execute it
                                once conditions are right. These orders reduce
                                the market depth.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-14">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="inline-flex self-start rounded-full border border-lnd-border bg-lnd-surface p-1">
                            {(["spot", "futures"] as const).map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => setTab(option)}
                                    aria-pressed={tab === option}
                                    className={`rounded-full px-5 py-2 text-sm font-semibold capitalize transition-colors ${
                                        tab === option
                                            ? "bg-lnd-accent-fill text-lnd-accent-fg"
                                            : "text-lnd-fg-muted hover:text-lnd-fg"
                                    }`}
                                >
                                    {option} trading fee
                                </button>
                            ))}
                        </div>
                        <Link
                            href="/vip"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-lnd-accent hover:underline"
                        >
                            View VIP levels
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    <div className="mt-5">
                        <FeeTable tab={tab} />
                    </div>

                    <p className="mt-5 max-w-4xl text-xs leading-relaxed text-lnd-fg-muted">
                        <strong className="font-semibold text-lnd-fg">
                            Note:
                        </strong>{" "}
                        The current VIP level is also determined by the most
                        recent evaluations of CET balance, 30-day{" "}
                        {tab === "spot" ? "spot" : "futures"} trading volume,
                        and total asset value, meeting any one of the specified
                        conditions.
                    </p>
                </div>
            </section>

            <PageCta
                title="Trade with transparent fees"
                description="Create an account and trade with clear, tier-based pricing from your first order."
            />
        </main>
    );
}
