"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/components/lib/utils";
import type { TradePlanDoc } from "../types";

type PlanHistoryTableProps = {
  plans: TradePlanDoc[];
};

function money(value?: number) {
  return (value ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(value?: number) {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PlanHistoryTable({ plans }: PlanHistoryTableProps) {
  if (plans.length === 0) {
    return (
      <section className="db-card p-5">
        <p className="db-eyebrow">History</p>
        <h2 className="db-section-title mt-1">Plan history</h2>
        <p className="mt-3 text-[0.76rem] text-lnd-fg-muted">
          Completed and cancelled plans will appear here.
        </p>
      </section>
    );
  }

  return (
    <section className="db-card overflow-hidden">
      <div className="border-b border-lnd-border p-4 sm:p-5">
        <p className="db-eyebrow">History</p>
        <h2 className="db-section-title mt-1">Plan history</h2>
      </div>
      <div className="overflow-x-auto">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow className="border-lnd-border hover:bg-transparent">
              {[
                "Pair",
                "Market",
                "Side",
                "Principal",
                "7-day target",
                "Realized",
                "Voucher",
                "Status",
                "Started",
              ].map((label) => (
                <TableHead
                  key={label}
                  className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-lnd-fg-muted"
                >
                  {label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan.id} className="border-lnd-border">
                <TableCell className="font-semibold text-lnd-fg">
                  {plan.base}/{plan.quote}
                </TableCell>
                <TableCell className="text-[0.72rem] capitalize text-lnd-fg-muted">
                  {plan.market}
                </TableCell>
                <TableCell className="text-[0.72rem] capitalize text-lnd-fg-muted">
                  {plan.side}
                </TableCell>
                <TableCell className="font-mono text-[0.74rem]">
                  ${money(plan.principal)}
                </TableCell>
                <TableCell className="font-mono text-[0.74rem]">
                  ${money(plan.weekly_target_profit)}
                </TableCell>
                <TableCell
                  className={cn(
                    "font-mono text-[0.74rem] font-semibold",
                    plan.realized_pnl >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-500",
                  )}
                >
                  {plan.realized_pnl >= 0 ? "+" : "−"}$
                  {money(Math.abs(plan.realized_pnl))}
                </TableCell>
                <TableCell className="font-mono text-[0.72rem] text-lnd-accent">
                  {plan.voucher_savings > 0 ? `+$${money(plan.voucher_savings)}` : "—"}
                </TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      "capitalize",
                      plan.status === "completed"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : plan.status === "cancelled"
                          ? "bg-red-500/10 text-red-500"
                          : "bg-lnd-accent/10 text-lnd-accent",
                    )}
                  >
                    {plan.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-[0.68rem] text-lnd-fg-muted">
                  {formatDate(plan.started_at)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
