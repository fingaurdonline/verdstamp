"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/components/lib/utils";
import type { TradeDoc, TradePlanDoc } from "../types";
import PositionsMobile, { type PositionRow } from "./PositionsMobile";

type PositionsTablesProps = {
  plans: TradePlanDoc[];
  now: number;
};

type Row = PositionRow;

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
    hour: "2-digit",
    minute: "2-digit",
  });
}

function sideClass(side?: string) {
  return side === "sell" || side === "short"
    ? "bg-red-500/10 text-red-500"
    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
}

function statusClass(status?: string) {
  if (status === "open") return "bg-lnd-accent/10 text-lnd-accent";
  if (status === "closed") return "bg-lnd-surface-2 text-lnd-fg-muted";
  if (status === "canceled") return "bg-red-500/10 text-red-500";
  return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
}

function tradeMark(trade: TradeDoc, now: number) {
  if (trade.status !== "open" || !trade.opened_at || !trade.scheduled_close_at) {
    return 0;
  }
  const progress = Math.min(
    1,
    Math.max(
      0,
      (now - trade.opened_at) /
        Math.max(1, trade.scheduled_close_at - trade.opened_at),
    ),
  );
  return (trade.net_pnl ?? 0) * progress;
}

function PlanCell({ row }: { row: Row }) {
  return (
    <div className="flex min-w-[120px] flex-col">
      <span className="font-semibold text-lnd-fg">
        {row.plan.base}/{row.plan.quote}
      </span>
      <span className="text-[0.66rem] uppercase tracking-wide text-lnd-fg-muted">
        {row.plan.market} · #{row.trade.sequence}
      </span>
    </div>
  );
}

export default function PositionsTables({ plans, now }: PositionsTablesProps) {
  const [tab, setTab] = useState("open");

  const rows = useMemo<Row[]>(() => {
    const all: Row[] = [];
    for (const plan of plans) {
      for (const trade of plan.trades) {
        all.push({ plan, trade, mark: tradeMark(trade, now) });
      }
    }
    return all.sort(
      (a, b) =>
        (b.trade.scheduled_open_at ?? b.trade._creationTime) -
        (a.trade.scheduled_open_at ?? a.trade._creationTime),
    );
  }, [plans, now]);

  const pending = rows.filter((row) => row.trade.status === "pending");
  const open = rows.filter((row) => row.trade.status === "open");
  const closed = rows.filter((row) => row.trade.status === "closed");
  const canceled = rows.filter((row) => row.trade.status === "canceled");

  return (
    <section className="db-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-lnd-border p-4 sm:p-5">
        <div>
          <p className="db-eyebrow">Positions</p>
          <h2 className="db-section-title mt-1">Plan executions</h2>
        </div>
        <span className="text-[0.68rem] text-lnd-fg-muted">
          {rows.length} executions in the last {plans.length} plans
        </span>
      </div>

      <PositionsMobile
        groups={{ open, pending, closed, canceled }}
        tab={tab}
        onTabChange={setTab}
      />

      <Tabs value={tab} onValueChange={setTab} className="hidden lg:block">
        <div className="overflow-x-auto px-3 pt-3 sm:px-4">
          <TabsList className="h-auto w-full justify-start gap-1 rounded-xl bg-lnd-surface-2 p-1 sm:w-fit">
            {[
              { value: "open", label: "Open", count: open.length },
              { value: "pending", label: "Pending", count: pending.length },
              { value: "closed", label: "Closed", count: closed.length },
              { value: "canceled", label: "Canceled", count: canceled.length },
            ].map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className="gap-1.5 rounded-lg px-3 py-1.5 text-[0.72rem] data-[state=active]:bg-lnd-surface data-[state=active]:text-lnd-fg"
              >
                {item.label}
                <span className="rounded-full bg-lnd-surface-2 px-1.5 py-0.5 font-mono text-[0.6rem] text-lnd-fg-muted">
                  {item.count}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
          <p className="px-1 pb-2 pt-1.5 text-[0.62rem] text-lnd-fg-muted">
            Scroll the table sideways to see every column →
          </p>
        </div>

        <TabsContent value="open" className="mt-0">
          <div className="overflow-x-auto">
            <Table className="min-w-[820px]">
              <TableHeader>
                <TableRow className="border-lnd-border hover:bg-transparent">
                  {["Plan", "Day", "Side", "Entry", "Mark", "Planned", "Liquidation", "Closes"].map(
                    (label) => (
                      <TableHead
                        key={label}
                        className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-lnd-fg-muted"
                      >
                        {label}
                      </TableHead>
                    ),
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {open.length ? (
                  open.map((row) => (
                    <TableRow key={row.trade.id} className="border-lnd-border">
                      <TableCell><PlanCell row={row} /></TableCell>
                      <TableCell className="font-mono text-[0.74rem]">D{row.trade.day_index}</TableCell>
                      <TableCell>
                        <Badge className={cn("capitalize", sideClass(row.trade.side))}>
                          {row.trade.side}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-[0.74rem]">{money(row.trade.entry_price)}</TableCell>
                      <TableCell
                        className={cn(
                          "font-mono text-[0.74rem] font-semibold",
                          row.mark >= 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-500",
                        )}
                      >
                        {row.mark >= 0 ? "+" : "−"}${money(Math.abs(row.mark))}
                      </TableCell>
                      <TableCell className="font-mono text-[0.74rem]">
                        ${money(row.trade.net_pnl)}
                      </TableCell>
                      <TableCell className="font-mono text-[0.74rem]">
                        {row.trade.liquidation_price
                          ? `$${money(row.trade.liquidation_price)}`
                          : "—"}
                      </TableCell>
                      <TableCell className="text-[0.7rem] text-lnd-fg-muted">
                        {formatDate(row.trade.scheduled_close_at)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <EmptyRow colSpan={8} label="No open executions right now." />
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="pending" className="mt-0">
          <div className="overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow className="border-lnd-border hover:bg-transparent">
                  {["Plan", "Day", "Side", "Planned", "Scheduled open", "Status"].map((label) => (
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
                {pending.length ? (
                  pending.map((row) => (
                    <TableRow key={row.trade.id} className="border-lnd-border">
                      <TableCell><PlanCell row={row} /></TableCell>
                      <TableCell className="font-mono text-[0.74rem]">D{row.trade.day_index}</TableCell>
                      <TableCell>
                        <Badge className={cn("capitalize", sideClass(row.trade.side))}>
                          {row.trade.side}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-[0.74rem]">
                        ${money(row.trade.net_pnl)}
                      </TableCell>
                      <TableCell className="text-[0.7rem] text-lnd-fg-muted">
                        {formatDate(row.trade.scheduled_open_at)}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusClass(row.trade.status)}>{row.trade.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <EmptyRow colSpan={6} label="No pending executions." />
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="closed" className="mt-0">
          <div className="overflow-x-auto">
            <Table className="min-w-[1000px]">
              <TableHeader>
                <TableRow className="border-lnd-border hover:bg-transparent">
                  {["Plan", "Day", "Side", "Entry → Exit", "Gross", "Fee", "Savings", "Net", "Reason", "Closed"].map(
                    (label) => (
                      <TableHead
                        key={label}
                        className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-lnd-fg-muted"
                      >
                        {label}
                      </TableHead>
                    ),
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {closed.length ? (
                  closed.map((row) => {
                    const net = row.trade.realized_pnl ?? 0;
                    return (
                      <TableRow key={row.trade.id} className="border-lnd-border">
                        <TableCell><PlanCell row={row} /></TableCell>
                        <TableCell className="font-mono text-[0.74rem]">D{row.trade.day_index}</TableCell>
                        <TableCell>
                          <Badge className={cn("capitalize", sideClass(row.trade.side))}>
                            {row.trade.side}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-[0.72rem]">
                          {money(row.trade.entry_price)} → {money(row.trade.exit_price)}
                        </TableCell>
                        <TableCell className="font-mono text-[0.72rem]">
                          ${money(row.trade.gross_pnl)}
                        </TableCell>
                        <TableCell className="font-mono text-[0.72rem] text-lnd-fg-muted">
                          ${money(row.trade.fee)}
                        </TableCell>
                        <TableCell className="font-mono text-[0.72rem] text-lnd-accent">
                          {row.trade.fee_savings || row.trade.interest_savings
                            ? `+$${money(
                                (row.trade.fee_savings ?? 0) +
                                  (row.trade.interest_savings ?? 0),
                              )}`
                            : "—"}
                        </TableCell>
                        <TableCell
                          className={cn(
                            "font-mono text-[0.74rem] font-semibold",
                            net >= 0
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-red-500",
                          )}
                        >
                          {net >= 0 ? "+" : "−"}${money(Math.abs(net))}
                        </TableCell>
                        <TableCell className="text-[0.68rem] capitalize text-lnd-fg-muted">
                          {(row.trade.close_reason ?? "completed").replaceAll("_", " ")}
                        </TableCell>
                        <TableCell className="text-[0.68rem] text-lnd-fg-muted">
                          {formatDate(row.trade.closed_at)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <EmptyRow colSpan={10} label="No closed executions yet." />
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="canceled" className="mt-0">
          <div className="overflow-x-auto">
            <Table className="min-w-[780px]">
              <TableHeader>
                <TableRow className="border-lnd-border hover:bg-transparent">
                  {["Plan", "Day", "Side", "Planned", "Reason", "Canceled"].map((label) => (
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
                {canceled.length ? (
                  canceled.map((row) => (
                    <TableRow key={row.trade.id} className="border-lnd-border">
                      <TableCell><PlanCell row={row} /></TableCell>
                      <TableCell className="font-mono text-[0.74rem]">D{row.trade.day_index}</TableCell>
                      <TableCell>
                        <Badge className={cn("capitalize", sideClass(row.trade.side))}>
                          {row.trade.side}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-[0.74rem]">
                        ${money(row.trade.net_pnl)}
                      </TableCell>
                      <TableCell className="text-[0.68rem] capitalize text-lnd-fg-muted">
                        {(row.trade.close_reason ?? "plan cancelled").replaceAll("_", " ")}
                      </TableCell>
                      <TableCell className="text-[0.68rem] text-lnd-fg-muted">
                        {formatDate(row.trade.closed_at)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <EmptyRow colSpan={6} label="No canceled executions." />
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}

function EmptyRow({ colSpan, label }: { colSpan: number; label: string }) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={colSpan} className="h-28 text-center text-[0.76rem] text-lnd-fg-muted">
        {label}
      </TableCell>
    </TableRow>
  );
}
