"use client";

import Link from "next/link";
import {
  BadgeCheck,
  Clock3,
  Gift,
  Landmark,
  Percent,
  Ticket,
} from "lucide-react";
import { cn } from "@/components/lib/utils";

export type VoucherLike = {
  id?: string;
  title: string;
  description: string;
  type: "bonus" | "fee_discount" | "margin_interest";
  value: number;
  value_type?: "fixed" | "percent";
  code?: string;
  account?: string;
  min_trade_amount?: number;
  expires_at: number;
  applicable_markets?: string[];
  terms?: string;
  claimed?: boolean;
  soldOut?: boolean;
  status?: "available" | "active" | "used" | "expired";
  acquired_via?: "claim" | "code";
  acquired_at?: number;
  expiresAt?: number;
  used_at?: number;
  voucher?: VoucherLike;
};

type VoucherCardProps = {
  voucher: VoucherLike;
  mode: "catalog" | "mine";
  busy?: boolean;
  onClaim?: () => void;
  onUse?: () => void;
  onActivate?: () => void;
  onViewMine?: () => void;
};

const TYPE_META = {
  bonus: {
    label: "Bonus credit",
    icon: Gift,
    tile: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  fee_discount: {
    label: "Fee discount",
    icon: Percent,
    tile: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    badge: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  margin_interest: {
    label: "Margin interest",
    icon: Landmark,
    tile: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    badge: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
};

const STATUS_META = {
  available: "bg-lnd-accent/10 text-lnd-accent",
  active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  used: "bg-lnd-surface-2 text-lnd-fg-muted",
  expired: "bg-red-500/10 text-red-500",
};

function formatDate(value?: number) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function valueLabel(voucher: VoucherLike) {
  if (voucher.value_type === "percent" || voucher.type !== "bonus") {
    return `${voucher.value}%`;
  }
  return `$${voucher.value}`;
}

export default function VoucherCard({
  voucher,
  mode,
  busy,
  onClaim,
  onUse,
  onActivate,
  onViewMine,
}: VoucherCardProps) {
  const source = mode === "mine" && voucher.voucher ? voucher.voucher : voucher;
  const meta = TYPE_META[source.type];
  const Icon = meta.icon;
  const status = mode === "mine" ? voucher.status ?? "available" : undefined;
  const expiresAt =
    mode === "mine"
      ? voucher.expiresAt ?? voucher.expires_at
      : source.expires_at;

  const terminalHref =
    source.type === "margin_interest"
      ? "/overview/trade/margin/BTC/USDT"
      : "/overview/trade/spot/BTC/USDT";

  return (
    <article className="db-card flex flex-col gap-3.5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className={cn("db-icon-tile", meta.tile)}>
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-Manrope text-[0.92rem] font-bold leading-tight text-lnd-fg">
                {source.title}
              </h3>
              {status ? (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.1em]",
                    STATUS_META[status],
                  )}
                >
                  {status}
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-lnd-fg-muted">
              {meta.label}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-Manrope text-[1.3rem] font-extrabold leading-none text-lnd-fg">
            {valueLabel(source)}
          </p>
          <p className="mt-1 text-[0.56rem] uppercase tracking-[0.1em] text-lnd-fg-muted">
            {source.type === "bonus" ? (source.account ?? "spot") : "off"}
          </p>
        </div>
      </div>

      <p className="text-[0.72rem] leading-relaxed text-lnd-fg-muted">
        {source.description}
      </p>

      <div className="grid grid-cols-2 gap-x-3 gap-y-2 rounded-xl bg-lnd-surface-2/60 px-3 py-2.5 text-[0.64rem]">
        <div>
          <p className="text-lnd-fg-muted">Minimum plan</p>
          <p className="mt-0.5 font-semibold text-lnd-fg">
            {source.min_trade_amount ? `$${source.min_trade_amount}` : "None"}
          </p>
        </div>
        <div>
          <p className="text-lnd-fg-muted">Expires</p>
          <p className="mt-0.5 font-semibold text-lnd-fg">{formatDate(expiresAt)}</p>
        </div>
        {mode === "mine" && voucher.code ? (
          <div>
            <p className="text-lnd-fg-muted">Code</p>
            <p className="mt-0.5 font-mono font-semibold tracking-wider text-lnd-fg">
              {voucher.code}
            </p>
          </div>
        ) : null}
        {mode === "mine" && voucher.acquired_via ? (
          <div>
            <p className="text-lnd-fg-muted">Acquired</p>
            <p className="mt-0.5 font-semibold capitalize text-lnd-fg">
              {voucher.acquired_via === "claim" ? "Catalog claim" : "Code"}
            </p>
          </div>
        ) : null}
        {mode === "catalog" && source.applicable_markets?.length ? (
          <div className="col-span-2">
            <p className="text-lnd-fg-muted">Applies to</p>
            <p className="mt-0.5 font-semibold capitalize text-lnd-fg">
              {source.applicable_markets.join(" · ")}
            </p>
          </div>
        ) : null}
      </div>

      {mode === "catalog" ? (
        <div className="mt-auto flex items-center gap-2">
          {voucher.claimed ? (
            <>
              <button
                type="button"
                disabled
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-lnd-surface-2 px-3 py-2 text-[0.72rem] font-semibold text-lnd-fg-muted"
              >
                <BadgeCheck className="h-3.5 w-3.5" />
                Claimed
              </button>
              <button
                type="button"
                onClick={onViewMine}
                className="rounded-xl border border-lnd-border px-3 py-2 text-[0.7rem] font-semibold text-lnd-fg transition-colors hover:bg-lnd-surface-2"
              >
                View
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onClaim}
              disabled={busy || voucher.soldOut}
              className={cn(
                "inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[0.72rem] font-semibold transition-colors",
                voucher.soldOut
                  ? "cursor-not-allowed bg-lnd-surface-2 text-lnd-fg-muted"
                  : "lnd-btn-accent",
              )}
            >
              <Ticket className="h-3.5 w-3.5" />
              {voucher.soldOut ? "Sold out" : busy ? "Claiming…" : "Claim voucher"}
            </button>
          )}
        </div>
      ) : (
        <div className="mt-auto flex items-center gap-2">
          {status === "available" && source.type === "bonus" ? (
            <button
              type="button"
              onClick={onUse}
              disabled={busy}
              className="lnd-btn-accent inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[0.72rem] font-semibold disabled:opacity-60"
            >
              <Gift className="h-3.5 w-3.5" />
              {busy ? "Crediting…" : `Use $${source.value} bonus`}
            </button>
          ) : null}
          {status === "available" && source.type !== "bonus" ? (
            <button
              type="button"
              onClick={onActivate}
              disabled={busy}
              className="lnd-btn-accent inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[0.72rem] font-semibold disabled:opacity-60"
            >
              <BadgeCheck className="h-3.5 w-3.5" />
              {busy ? "Activating…" : "Activate voucher"}
            </button>
          ) : null}
          {status === "active" ? (
            <>
              <Link
                href={terminalHref}
                className="lnd-btn-accent inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[0.72rem] font-semibold"
              >
                Use in terminal
              </Link>
              <span className="inline-flex items-center gap-1 rounded-xl border border-lnd-border px-2.5 py-2 text-[0.64rem] font-medium text-lnd-fg-muted">
                <Clock3 className="h-3 w-3" />
                Active
              </span>
            </>
          ) : null}
          {status === "used" || status === "expired" ? (
            <button
              type="button"
              disabled
              className="w-full cursor-not-allowed rounded-xl bg-lnd-surface-2 px-3 py-2 text-[0.72rem] font-semibold capitalize text-lnd-fg-muted"
            >
              {status}
            </button>
          ) : null}
        </div>
      )}

      {source.terms ? (
        <p className="text-[0.58rem] leading-relaxed text-lnd-fg-muted/80">
          {source.terms}
        </p>
      ) : null}
    </article>
  );
}
