"use client";

import { useMemo } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarClock,
  Clock3,
  Ticket,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/components/lib/utils";
import { DAY_MS, type TradePlanDoc } from "../types";

type PlanCardProps = {
  plan: TradePlanDoc;
  now: number;
  onCancel?: (plan: TradePlanDoc) => void;
};

function money(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(value?: number) {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCountdown(ms: number) {
  if (ms <= 0) return "now";
  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  return `${Math.max(1, minutes)}m`;
}

function openMark(plan: TradePlanDoc, now: number) {
  return plan.trades.reduce((sum, trade) => {
    if (trade.status !== "open" || !trade.opened_at || !trade.scheduled_close_at) {
      return sum;
    }
    const progress = Math.min(
      1,
      Math.max(
        0,
        (now - trade.opened_at) /
          Math.max(1, trade.scheduled_close_at - trade.opened_at),
      ),
    );
    return sum + (trade.net_pnl ?? 0) * progress;
  }, 0);
}

export default function PlanCard({ plan, now, onCancel }: PlanCardProps) {
  const currentDay = Math.min(
    7,
    Math.max(1, Math.floor((now - plan.started_at) / DAY_MS) + 1),
  );
  const isActive = plan.status === "active";
  const mark = openMark(plan, now);
  const nextPending = plan.trades.find(
    (trade) => trade.status === "pending" && (trade.scheduled_open_at ?? 0) > now,
  );
  const openTrade = plan.trades.find((trade) => trade.status === "open");

  const dayStats = useMemo(
    () =>
      plan.daily_targets.map((target) => {
        const trades = plan.trades.filter(
          (trade) => trade.day_index === target.day,
        );
        const realized = trades
          .filter((trade) => trade.status === "closed")
          .reduce((sum, trade) => sum + (trade.realized_pnl ?? 0), 0);
        const open = trades
          .filter((trade) => trade.status === "open")
          .reduce((sum, trade) => {
            if (!trade.opened_at || !trade.scheduled_close_at) return sum;
            const progress = Math.min(
              1,
              Math.max(
                0,
                (now - trade.opened_at) /
                  Math.max(1, trade.scheduled_close_at - trade.opened_at),
              ),
            );
            return sum + (trade.net_pnl ?? 0) * progress;
          }, 0);
        const progress =
          target.profit > 0
            ? Math.min(1, Math.max(0, (realized + Math.max(0, open)) / target.profit))
            : 0;
        return { ...target, realized, open, progress, trades };
      }),
    [plan.daily_targets, plan.trades, now],
  );

  const today = dayStats[currentDay - 1];
  const totalProgress =
    plan.weekly_target_profit > 0
      ? Math.min(1, Math.max(0, (plan.realized_pnl + Math.max(0, mark)) / plan.weekly_target_profit))
      : 0;

  const statusStyles =
    plan.status === "active"
      ? "bg-lnd-accent/10 text-lnd-accent"
      : plan.status === "completed"
        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        : "bg-red-500/10 text-red-500";

  return (
    <section
      id={`plan-${plan.id}`}
      className="db-card overflow-hidden"
      data-plan-id={plan.id}
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-lnd-border p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="db-icon-tile">
            <TrendingUp className="h-5 w-5" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-Manrope text-[1.02rem] font-bold text-lnd-fg">
                {plan.base}/{plan.quote}
              </h3>
              <span className="rounded-full bg-lnd-surface-2 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-lnd-fg-muted">
                {plan.market}
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em]",
                  plan.side === "sell" || plan.side === "short"
                    ? "bg-red-500/10 text-red-500"
                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                )}
              >
                {plan.side === "sell" || plan.side === "short" ? (
                  <ArrowDownRight className="h-3 w-3" />
                ) : (
                  <ArrowUpRight className="h-3 w-3" />
                )}
                {plan.side}
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em]",
                  statusStyles,
                )}
              >
                {plan.status}
              </span>
            </div>
            <p className="mt-1 text-[0.72rem] text-lnd-fg-muted">
              ${money(plan.principal)} principal · {plan.leverage}x ·{" "}
              {plan.duration_days} days · started {formatDate(plan.started_at)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isActive && onCancel ? (
            <button
              type="button"
              onClick={() => onCancel(plan)}
              className="rounded-xl border border-red-500/30 px-3 py-2 text-[0.7rem] font-semibold text-red-500 transition-colors hover:bg-red-500/10"
            >
              Cancel plan
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[1.05fr_1fr]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[0.64rem] font-medium uppercase tracking-[0.14em] text-lnd-fg-muted">
                {isActive ? `Day ${currentDay} of 7` : plan.status === "completed" ? "Cycle complete" : "Cycle cancelled"}
              </p>
              <p className="mt-1 font-Manrope text-[1.5rem] font-extrabold leading-none text-lnd-fg">
                ${money(plan.realized_pnl)}
              </p>
              <p className="mt-1 text-[0.68rem] text-lnd-fg-muted">
                Realized profit ·{" "}
                <span className="text-lnd-accent">
                  {plan.principal > 0
                    ? ((plan.realized_pnl / plan.principal) * 100).toFixed(2)
                    : "0.00"}
                  %
                </span>{" "}
                of principal
              </p>
            </div>
            <div className="text-right">
              <p className="text-[0.64rem] font-medium uppercase tracking-[0.14em] text-lnd-fg-muted">
                Weekly target
              </p>
              <p className="mt-1 font-mono text-[0.86rem] font-semibold text-lnd-fg">
                ${money(plan.weekly_target_profit)}
              </p>
              <p className="mt-1 text-[0.68rem] text-lnd-fg-muted">
                {totalProgress > 0 ? `${(totalProgress * 100).toFixed(1)}% reached` : "Not started"}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[0.66rem] text-lnd-fg-muted">
              <span>7-day progress</span>
              <span className="text-right">
                {plan.status === "active"
                  ? `Ends ${formatDate(plan.ends_at)}`
                  : plan.completed_at
                    ? `Completed ${formatDate(plan.completed_at)}`
                    : plan.cancelled_at
                      ? `Cancelled ${formatDate(plan.cancelled_at)}`
                      : ""}
              </span>
            </div>
            <div className="mt-2 grid grid-cols-7 gap-1 sm:gap-1.5">
              {dayStats.map((day) => {
                const isPast = day.day < currentDay || plan.status !== "active";
                const isCurrent = day.day === currentDay && plan.status === "active";
                return (
                  <div
                    key={day.day}
                    className={cn(
                      "min-w-0 rounded-lg border px-0.5 py-2 text-center transition-colors sm:px-1.5",
                      isCurrent
                        ? "border-lnd-accent/40 bg-lnd-accent/5"
                        : "border-lnd-border bg-lnd-surface-2/40",
                    )}
                  >
                    <p className="text-[0.54rem] font-semibold uppercase tracking-wide text-lnd-fg-muted sm:text-[0.58rem]">
                      D{day.day}
                    </p>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-lnd-border">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          day.progress >= 1
                            ? "bg-emerald-500"
                            : isCurrent
                              ? "bg-lnd-accent"
                              : isPast
                                ? "bg-amber-500"
                                : "bg-lnd-fg-muted/30",
                        )}
                        style={{ width: `${Math.max(day.progress * 100, day.trades.length ? 4 : 0)}%` }}
                      />
                    </div>
                    <p className="mt-1.5 font-mono text-[0.54rem] font-semibold text-lnd-fg sm:text-[0.58rem]">
                      {(day.rate * 100).toFixed(1)}%
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            <div className="rounded-xl bg-lnd-surface-2/60 px-3 py-2.5">
              <p className="text-[0.6rem] uppercase tracking-[0.12em] text-lnd-fg-muted">
                Today's target
              </p>
              <p className="mt-1 font-mono text-[0.78rem] font-semibold text-lnd-fg">
                {isActive && today ? `$${money(today.profit)}` : "—"}
              </p>
            </div>
            <div className="rounded-xl bg-lnd-surface-2/60 px-3 py-2.5">
              <p className="text-[0.6rem] uppercase tracking-[0.12em] text-lnd-fg-muted">
                Today realized
              </p>
              <p className="mt-1 font-mono text-[0.78rem] font-semibold text-lnd-fg">
                {isActive && today ? `$${money(today.realized)}` : "—"}
              </p>
            </div>
            <div className="rounded-xl bg-lnd-surface-2/60 px-3 py-2.5">
              <p className="text-[0.6rem] uppercase tracking-[0.12em] text-lnd-fg-muted">
                Open mark
              </p>
              <p
                className={cn(
                  "mt-1 font-mono text-[0.78rem] font-semibold",
                  mark >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500",
                )}
              >
                {isActive ? `${mark >= 0 ? "+" : "−"}$${money(Math.abs(mark))}` : "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-lnd-border p-3.5">
            <p className="text-[0.64rem] font-medium uppercase tracking-[0.14em] text-lnd-fg-muted">
              Execution schedule
            </p>
            <div className="mt-2.5 space-y-2 text-[0.72rem]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-lnd-fg-muted">
                  <CalendarClock className="h-3.5 w-3.5" />
                  Executions
                </span>
                <span className="font-mono font-semibold text-lnd-fg">
                  {plan.completed_count}/{plan.execution_count}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-lnd-fg-muted">
                  <Clock3 className="h-3.5 w-3.5" />
                  {openTrade ? "Open trade closes in" : "Next trade"}
                </span>
                <span className="font-mono font-semibold text-lnd-fg">
                  {isActive
                    ? openTrade?.scheduled_close_at
                      ? formatCountdown(openTrade.scheduled_close_at - now)
                      : nextPending?.scheduled_open_at
                        ? formatCountdown(nextPending.scheduled_open_at - now)
                        : "—"
                    : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lnd-fg-muted">Standard fees</span>
                <span className="font-mono text-lnd-fg">${money(plan.fee_standard)}</span>
              </div>
              {plan.voucher_savings > 0 ? (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-lnd-fg-muted">
                    <Ticket className="h-3.5 w-3.5" />
                    Voucher savings
                  </span>
                  <span className="font-mono font-semibold text-lnd-accent">
                    +${money(plan.voucher_savings)}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-xl bg-lnd-surface-2/60 px-3.5 py-3">
            <p className="text-[0.64rem] font-medium uppercase tracking-[0.12em] text-lnd-fg-muted">
              Sampled daily rates
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {dayStats.map((day) => (
                <span
                  key={day.day}
                  className="rounded-full border border-lnd-border bg-lnd-surface px-2 py-0.5 font-mono text-[0.62rem] font-semibold text-lnd-fg-muted"
                  title={`Day ${day.day}: $${money(day.profit)} target`}
                >
                  D{day.day} {(day.rate * 100).toFixed(2)}%
                </span>
              ))}
            </div>
            <p className="mt-2 text-[0.62rem] leading-relaxed text-lnd-fg-muted">
              Base target is simple, calculated on the original principal. Voucher
              savings are credited above it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
