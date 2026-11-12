"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Info, Percent, ShieldCheck, Ticket, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { cn } from "@/components/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Market, PlanSide, VoucherOption } from "../types";

const FEE_RATES: Record<Market, number> = {
  spot: 0.001,
  margin: 0.0008,
  futures: 0.0006,
};

const LEVERAGE_PRESETS = [1, 2, 5, 10, 20, 50, 100];

type OrderPanelProps = {
  market: Market;
  base: string;
  quote: string;
  price?: number;
  available: number;
  onCreated?: () => void;
};

function round2(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function money(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function OrderPanel({
  market,
  base,
  quote,
  price,
  available,
  onCreated,
}: OrderPanelProps) {
  const isSpot = market === "spot";
  const [side, setSide] = useState<PlanSide>(isSpot ? "buy" : "long");
  const [amount, setAmount] = useState("");
  const [leverage, setLeverage] = useState(1);
  const [marginMode, setMarginMode] = useState<"cross" | "isolated">("cross");
  const [selectedVoucherId, setSelectedVoucherId] = useState("none");
  const [voucherTouched, setVoucherTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const principal = round2(Number.parseFloat(amount) || 0);
  const vouchers = (useQuery(api.vouchers.get_applicable_vouchers, {
    market,
    principal,
  }) ?? []) as VoucherOption[];

  useEffect(() => {
    setSide(isSpot ? "buy" : "long");
    setAmount("");
    setLeverage(1);
    setMarginMode("cross");
    setSelectedVoucherId("none");
    setVoucherTouched(false);
  }, [market, base, quote, isSpot]);

  useEffect(() => {
    if (voucherTouched) return;
    if (vouchers.length === 0) {
      if (selectedVoucherId !== "none") setSelectedVoucherId("none");
      return;
    }
    const best = vouchers[0];
    if (best && selectedVoucherId !== best.userVoucherId) {
      setSelectedVoucherId(best.userVoucherId);
    }
  }, [vouchers, voucherTouched, selectedVoucherId]);

  const selectedVoucher = useMemo(
    () => vouchers.find((voucher) => voucher.userVoucherId === selectedVoucherId),
    [vouchers, selectedVoucherId],
  );

  const createPlan = useMutation(api.trading.create_trade_plan);

  const dailyMin = principal * 0.27;
  const dailyMax = principal * 0.3;
  const weeklyMin = principal * 1.89;
  const weeklyMax = principal * 2.1;
  const notional = principal * (isSpot ? 1 : leverage);
  const baseQuantity = price && price > 0 ? notional / price : 0;
  const estimatedSavings = selectedVoucher?.estimatedSavings ?? 0;
  const feeStandardMin = principal * FEE_RATES[market] * 21;
  const feeStandardMax = principal * FEE_RATES[market] * 28;
  const liquidation =
    price && !isSpot
      ? side === "long"
        ? price * (1 - 0.9 / Math.max(1, leverage))
        : price * (1 + 0.9 / Math.max(1, leverage))
      : undefined;

  const invalidAmount = principal > 0 && principal < 10;
  const insufficient = principal > 0 && principal > available;
  const canSubmit =
    Boolean(price && price > 0) &&
    principal >= 10 &&
    principal <= available &&
    !submitting;

  const setPercent = (percent: number) => {
    const next = round2((available * percent) / 100);
    setAmount(next > 0 ? String(next) : "");
  };

  const submit = async () => {
    if (!price || price <= 0) {
      toast.error("Live price is not available yet. Please retry in a moment.");
      return;
    }
    if (principal < 10) {
      toast.error("The minimum plan amount is $10.");
      return;
    }
    if (principal > available) {
      toast.error("The amount exceeds your available balance.");
      return;
    }

    setSubmitting(true);
    try {
      await createPlan({
        market,
        base,
        quote,
        side,
        order_type: "market",
        leverage: isSpot ? 1 : leverage,
        margin_mode: isSpot ? undefined : marginMode,
        amount: principal,
        reference_price: price,
        userVoucherId:
          selectedVoucherId !== "none"
            ? (selectedVoucherId as any)
            : undefined,
      });
      toast.success("7-day plan started", {
        description: `${base}/${quote} · $${money(principal)} committed. Cancel anytime before day 7.`,
      });
      setAmount("");
      setSelectedVoucherId("none");
      setVoucherTouched(false);
      onCreated?.();
    } catch (error: any) {
      toast.error(error?.message ?? "Could not start the plan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="db-card flex flex-col gap-4 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="db-eyebrow">Trade</p>
          <h2 className="db-section-title mt-1">Start a 7-day plan</h2>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-lnd-surface-2 px-2.5 py-1 text-[0.66rem] font-semibold text-lnd-fg-muted">
          <Wallet className="h-3.5 w-3.5" />
          ${money(available)} available
        </span>
      </div>

      <div className="grid grid-cols-2 gap-1 rounded-full bg-lnd-surface-2 p-1">
        {(isSpot
          ? ([
              { value: "buy", label: "Buy", icon: TrendingUp },
              { value: "sell", label: "Sell", icon: TrendingDown },
            ] as const)
          : ([
              { value: "long", label: "Long", icon: TrendingUp },
              { value: "short", label: "Short", icon: TrendingDown },
            ] as const)
        ).map((option) => {
          const Icon = option.icon;
          const active = side === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setSide(option.value)}
              className={cn(
                "inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-[0.76rem] font-semibold transition-colors",
                active
                  ? option.value === "sell" || option.value === "short"
                    ? "bg-red-500/10 text-red-600 dark:text-red-400"
                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "text-lnd-fg-muted hover:text-lnd-fg",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between rounded-xl border border-lnd-border px-3 py-2.5">
        <span className="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-lnd-fg-muted">
          Order type
        </span>
        <span className="text-[0.76rem] font-semibold text-lnd-fg">Market execution</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[0.72rem] font-medium text-lnd-fg-muted">
            Plan amount ({quote})
          </span>
          <button
            type="button"
            onClick={() => setPercent(100)}
            className="text-[0.68rem] font-semibold text-lnd-accent hover:underline"
          >
            Max
          </button>
        </div>
        <div className="relative">
          <Input
            inputMode="decimal"
            value={amount}
            onChange={(event) => {
              const value = event.target.value;
              if (/^\d*\.?\d{0,2}$/.test(value)) setAmount(value);
            }}
            placeholder="0.00"
            className="h-11 rounded-xl border-lnd-border bg-lnd-surface pr-14 font-mono text-[0.9rem] focus-visible:ring-lnd-accent/40"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[0.68rem] font-semibold text-lnd-fg-muted">
            {quote}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {[25, 50, 75, 100].map((percent) => (
            <button
              key={percent}
              type="button"
              onClick={() => setPercent(percent)}
              className="rounded-lg border border-lnd-border py-1.5 text-[0.66rem] font-semibold text-lnd-fg-muted transition-colors hover:border-lnd-accent/40 hover:text-lnd-accent"
            >
              {percent}%
            </button>
          ))}
        </div>
        {invalidAmount ? (
          <p className="text-[0.68rem] text-red-500">Minimum plan is $10.</p>
        ) : null}
        {insufficient ? (
          <p className="text-[0.68rem] text-red-500">
            Available balance is ${money(available)}. Transfer more funds to this
            account first.
          </p>
        ) : null}
      </div>

      {!isSpot ? (
        <div className="space-y-3 rounded-xl border border-lnd-border p-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[0.72rem] font-medium text-lnd-fg-muted">Leverage</span>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                max={125}
                value={leverage}
                onChange={(event) => {
                  const next = Number(event.target.value);
                  if (!Number.isFinite(next)) return;
                  setLeverage(Math.max(1, Math.min(125, Math.round(next))));
                }}
                className="h-8 w-16 rounded-lg border-lnd-border bg-lnd-surface px-2 text-center font-mono text-[0.76rem]"
              />
              <span className="text-[0.72rem] font-semibold text-lnd-fg-muted">x</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {LEVERAGE_PRESETS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setLeverage(value)}
                className={cn(
                  "rounded-lg border px-2 py-1 text-[0.64rem] font-semibold transition-colors",
                  leverage === value
                    ? "border-lnd-accent/45 bg-lnd-accent/10 text-lnd-accent"
                    : "border-lnd-border text-lnd-fg-muted hover:text-lnd-fg",
                )}
              >
                {value}x
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[0.72rem] font-medium text-lnd-fg-muted">Margin mode</span>
            <div className="flex rounded-full bg-lnd-surface-2 p-0.5">
              {(["cross", "isolated"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMarginMode(value)}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[0.66rem] font-semibold capitalize transition-colors",
                    marginMode === value
                      ? "bg-lnd-surface text-lnd-fg shadow-sm"
                      : "text-lnd-fg-muted hover:text-lnd-fg",
                  )}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between text-[0.7rem]">
            <span className="text-lnd-fg-muted">Est. liquidation</span>
            <span className="font-mono font-semibold text-lnd-fg">
              {liquidation ? `$${money(liquidation)}` : "—"}
            </span>
          </div>
        </div>
      ) : null}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[0.72rem] font-medium text-lnd-fg-muted">
            <Ticket className="h-3.5 w-3.5" />
            Voucher
          </span>
          <Link
            href="/account/voucher-center"
            className="text-[0.68rem] font-semibold text-lnd-accent hover:underline"
          >
            Voucher Center
          </Link>
        </div>
        <Select
          value={selectedVoucherId}
          onValueChange={(value) => {
            setSelectedVoucherId(value);
            setVoucherTouched(true);
          }}
        >
          <SelectTrigger className="h-10 rounded-xl border-lnd-border bg-lnd-surface text-[0.76rem]">
            <SelectValue placeholder="No voucher applied" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No voucher</SelectItem>
            {vouchers.map((voucher) => (
              <SelectItem
                key={voucher.userVoucherId}
                value={voucher.userVoucherId}
              >
                {voucher.title} · save ≈ ${money(voucher.estimatedSavings)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedVoucher ? (
          <div className="rounded-xl border border-lnd-accent/25 bg-lnd-accent/5 px-3 py-2 text-[0.68rem] leading-relaxed text-lnd-fg-muted">
            <span className="font-semibold text-lnd-accent">
              ≈ ${money(estimatedSavings)} saved
            </span>{" "}
            on standard fees{selectedVoucher.type === "margin_interest" ? " and margin interest" : ""}.
            Savings are added above the plan target.
          </div>
        ) : principal > 0 && vouchers.length === 0 ? (
          <p className="text-[0.66rem] leading-relaxed text-lnd-fg-muted">
            No active voucher applies to this amount and market. Activate one in
            the Voucher Center first.
          </p>
        ) : null}
      </div>

      <div className="space-y-2.5 rounded-xl bg-lnd-surface-2/70 p-3.5">
        <div className="flex items-center justify-between text-[0.72rem]">
          <span className="text-lnd-fg-muted">Principal</span>
          <span className="font-mono font-semibold text-lnd-fg">${money(principal)}</span>
        </div>
        {!isSpot ? (
          <div className="flex items-center justify-between text-[0.72rem]">
            <span className="text-lnd-fg-muted">Notional ({leverage}x)</span>
            <span className="font-mono font-semibold text-lnd-fg">${money(notional)}</span>
          </div>
        ) : null}
        <div className="flex items-center justify-between text-[0.72rem]">
          <span className="text-lnd-fg-muted">Size</span>
          <span className="font-mono text-lnd-fg">
            {baseQuantity > 0 ? `${baseQuantity.toFixed(6)} ${base}` : "—"}
          </span>
        </div>
        <div className="h-px bg-lnd-border" />
        <div className="flex items-center justify-between text-[0.72rem]">
          <span className="text-lnd-fg-muted">Daily target</span>
          <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
            ${money(dailyMin)} – ${money(dailyMax)}
          </span>
        </div>
        <div className="flex items-center justify-between text-[0.72rem]">
          <span className="text-lnd-fg-muted">7-day target</span>
          <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
            ${money(weeklyMin)} – ${money(weeklyMax)}
          </span>
        </div>
        <div className="flex items-center justify-between text-[0.72rem]">
          <span className="text-lnd-fg-muted">Standard fees (est.)</span>
          <span className="font-mono text-lnd-fg">
            ${money(feeStandardMin)} – ${money(feeStandardMax)}
          </span>
        </div>
        {estimatedSavings > 0 ? (
          <div className="flex items-center justify-between text-[0.72rem]">
            <span className="text-lnd-fg-muted">Voucher boost</span>
            <span className="font-mono font-semibold text-lnd-accent">
              +${money(estimatedSavings)}
            </span>
          </div>
        ) : null}
        <div className="h-px bg-lnd-border" />
        <div className="flex items-center justify-between text-[0.74rem]">
          <span className="font-semibold text-lnd-fg">Projected payout</span>
          <span className="font-mono font-bold text-lnd-fg">
            ${money(principal + weeklyMin + estimatedSavings)} – $
            {money(principal + weeklyMax + estimatedSavings)}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={!canSubmit}
        className={cn(
          "w-full rounded-xl px-4 py-3 text-[0.8rem] font-semibold transition-all",
          canSubmit
            ? "lnd-btn-accent"
            : "cursor-not-allowed bg-lnd-surface-2 text-lnd-fg-muted",
        )}
      >
        {submitting
          ? "Starting plan…"
          : !price
            ? "Waiting for live price…"
            : principal <= 0
              ? "Enter an amount"
              : `Start 7-day ${side} plan`}
      </button>

      <div className="flex items-start gap-1.5 text-[0.64rem] leading-relaxed text-lnd-fg-muted">
        <Info className="mt-0.5 h-3 w-3 shrink-0" />
        <p>
          The principal is committed for 7 days. Daily targets are 27–30% of the
          committed amount, simple and not compounded. Cancel anytime to keep
          realized profit and release your remaining principal.
        </p>
      </div>
      <div className="flex items-center gap-1.5 text-[0.64rem] text-lnd-fg-muted">
        <ShieldCheck className="h-3 w-3" />
        <span>Fees and voucher savings are included in the plan ledger.</span>
      </div>
      {available < 10 ? (
        <Link
          href={
            market === "spot"
              ? "/overview/spot/deposit"
              : market === "margin"
                ? "/overview/margin/assets"
                : "/overview/futures"
          }
          className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-lnd-border px-3 py-2 text-[0.68rem] font-semibold text-lnd-accent hover:bg-lnd-accent/5"
        >
          <Percent className="h-3.5 w-3.5" />
          Add funds to {market} to start a plan
        </Link>
      ) : null}
    </section>
  );
}
