"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BarChart3, Scale, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/components/lib/utils";
import { MARKET_LABELS, type Market } from "../types";

type PairHeaderProps = {
  market: Market;
  base: string;
  quote: string;
  icon?: string;
  price?: number;
  change24h?: number;
  high24h?: number;
  low24h?: number;
  volume24h?: number;
  marketCap?: number;
};

function formatMoney(value?: number) {
  if (value === undefined || value === null || !Number.isFinite(value)) return "—";
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
}

function formatPrice(value?: number) {
  if (value === undefined || value === null || !Number.isFinite(value)) return "—";
  if (value >= 1000) return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (value >= 1) return value.toLocaleString("en-US", { maximumFractionDigits: 3 });
  return value.toLocaleString("en-US", { maximumFractionDigits: 7 });
}

const marketIcons = {
  spot: TrendingUp,
  margin: Scale,
  futures: BarChart3,
};

export default function PairHeader({
  market,
  base,
  quote,
  icon,
  price,
  change24h,
  high24h,
  low24h,
  volume24h,
  marketCap,
}: PairHeaderProps) {
  const positive = (change24h ?? 0) >= 0;

  return (
    <header className="db-card overflow-hidden">
      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3.5">
            <Link
              href="/overview"
              className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-lnd-border text-lnd-fg-muted transition-colors hover:bg-lnd-surface-2 hover:text-lnd-fg"
              aria-label="Back to overview"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="relative shrink-0">
              {icon ? (
                <Image
                  src={icon}
                  alt={base}
                  width={56}
                  height={56}
                  className="h-11 w-11 rounded-full sm:h-12 sm:w-12"
                />
              ) : (
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-lnd-surface-2 font-Manrope text-sm font-bold text-lnd-fg sm:h-12 sm:w-12">
                  {base.slice(0, 3)}
                </span>
              )}
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-lnd-surface bg-lnd-surface-2 text-[0.56rem] font-bold text-lnd-fg-muted">
                {quote.slice(0, 2)}
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="db-title truncate">
                  {base}
                  <span className="text-lnd-fg-muted">/{quote}</span>
                </h1>
                <span className="rounded-full bg-lnd-accent/10 px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-lnd-accent">
                  {MARKET_LABELS[market]}
                </span>
              </div>
              <p className="mt-1 text-[0.76rem] text-lnd-fg-muted">
                7-day trading plans · daily targets 27–30% · cancel anytime
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 rounded-full border border-lnd-border bg-lnd-surface-2/60 p-1">
            {(Object.keys(MARKET_LABELS) as Market[]).map((value) => {
              const Icon = marketIcons[value];
              return (
                <Link
                  key={value}
                  href={`/overview/trade/${value}/${base}/${quote}`}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.72rem] font-semibold transition-colors",
                    value === market
                      ? "bg-lnd-surface text-lnd-fg shadow-sm"
                      : "text-lnd-fg-muted hover:text-lnd-fg",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {MARKET_LABELS[value]}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
          <div>
            <p className="text-[0.66rem] font-medium uppercase tracking-[0.14em] text-lnd-fg-muted">
              Last price
            </p>
            <div className="mt-1 flex flex-wrap items-baseline gap-2.5">
              <span className="font-Manrope text-[1.9rem] font-extrabold leading-none tracking-tight text-lnd-fg sm:text-[2.25rem]">
                {formatPrice(price)}
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.7rem] font-semibold",
                  positive
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-500/10 text-red-600 dark:text-red-400",
                )}
              >
                {positive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {positive ? "+" : ""}
                {(change24h ?? 0).toFixed(2)}%
              </span>
            </div>
          </div>

          <dl className="grid w-full grid-cols-2 gap-x-4 gap-y-3 sm:w-auto sm:flex-1 sm:grid-cols-4 sm:gap-x-6">
            <div className="min-w-0">
              <dt className="text-[0.64rem] font-medium uppercase tracking-[0.12em] text-lnd-fg-muted">
                24h high
              </dt>
              <dd className="mt-1 truncate font-mono text-[0.76rem] font-medium text-lnd-fg sm:text-[0.8rem]">
                {formatPrice(high24h)}
              </dd>
            </div>
            <div className="min-w-0">
              <dt className="text-[0.64rem] font-medium uppercase tracking-[0.12em] text-lnd-fg-muted">
                24h low
              </dt>
              <dd className="mt-1 truncate font-mono text-[0.76rem] font-medium text-lnd-fg sm:text-[0.8rem]">
                {formatPrice(low24h)}
              </dd>
            </div>
            <div className="min-w-0">
              <dt className="text-[0.64rem] font-medium uppercase tracking-[0.12em] text-lnd-fg-muted">
                24h volume
              </dt>
              <dd className="mt-1 truncate font-mono text-[0.76rem] font-medium text-lnd-fg sm:text-[0.8rem]">
                {formatMoney(volume24h)}
              </dd>
            </div>
            <div className="min-w-0">
              <dt className="text-[0.64rem] font-medium uppercase tracking-[0.12em] text-lnd-fg-muted">
                Market cap
              </dt>
              <dd className="mt-1 truncate font-mono text-[0.76rem] font-medium text-lnd-fg sm:text-[0.8rem]">
                {formatMoney(marketCap)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </header>
  );
}
