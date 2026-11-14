"use client";

import { Inbox } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/components/lib/utils";
import type { TradeDoc, TradePlanDoc } from "../types";

export type PositionRow = {
  plan: TradePlanDoc;
  trade: TradeDoc;
  mark: number;
};

type Groups = {
  open: PositionRow[];
  pending: PositionRow[];
  closed: PositionRow[];
  canceled: PositionRow[];
};

type Props = {
  groups: Groups;
  tab: string;
  onTabChange: (tab: string) => void;
};

const TABS = [
  { value: "open", label: "Open", empty: "No open executions right now." },
  { value: "pending", label: "Pending", empty: "No pending executions." },
  { value: "closed", label: "Closed", empty: "No closed executions yet." },
  { value: "canceled", label: "Canceled", empty: "No canceled executions." },
] as const;

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

function signedMoney(value?: number) {
  const amount = value ?? 0;
  return `${amount >= 0 ? "+" : "−"}$${money(Math.abs(amount))}`;
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

type Field = {
  label: string;
  value: ReactNode;
  full?: boolean;
  valueClassName?: string;
};

type PositionCardProps = {
  row: PositionRow;
  valueLabel: string;
  value: ReactNode;
  valueClassName?: string;
  fields: Field[];
};

function PositionCard({
  row,
  valueLabel,
  value,
  valueClassName,
  fields,
}: PositionCardProps) {
  const { plan, trade } = row;

  return (
    <li className="rounded-2xl border border-lnd-border bg-lnd-surface-2/30 p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-Manrope text-[0.86rem] font-bold text-lnd-fg">
            {plan.base}/{plan.quote}
          </p>
          <p className="mt-0.5 truncate text-[0.62rem] uppercase tracking-[0.1em] text-lnd-fg-muted">
            {plan.market} · #{trade.sequence ?? "—"} · D{trade.day_index ?? "—"}
          </p>
        </div>
        <Badge className={cn("shrink-0 capitalize", sideClass(trade.side))}>
          {trade.side ?? "—"}
        </Badge>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[0.58rem] uppercase tracking-[0.14em] text-lnd-fg-muted">
            {valueLabel}
          </p>
          <p
            className={cn(
              "mt-1 break-words font-mono text-[1.05rem] font-bold tabular-nums",
              valueClassName,
            )}
          >
            {value}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-[0.6rem] font-semibold capitalize",
            statusClass(trade.status),
          )}
        >
          {trade.status ?? "pending"}
        </span>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-lnd-border pt-3">
        {fields.map((field) => (
          <div
            key={field.label}
            className={cn("min-w-0", field.full && "col-span-2")}
          >
            <dt className="text-[0.56rem] uppercase tracking-[0.1em] text-lnd-fg-muted">
              {field.label}
            </dt>
            <dd
              className={cn(
                "mt-0.5 break-words font-mono text-[0.72rem] font-medium text-lnd-fg",
                field.valueClassName,
              )}
            >
              {field.value}
            </dd>
          </div>
        ))}
      </dl>
    </li>
  );
}

function OpenCard({ row }: { row: PositionRow }) {
  return (
    <PositionCard
      row={row}
      valueLabel="Unrealized mark"
      value={signedMoney(row.mark)}
      valueClassName={
        row.mark >= 0
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-red-500"
      }
      fields={[
        { label: "Entry", value: `$${money(row.trade.entry_price)}` },
        { label: "Planned net", value: `$${money(row.trade.net_pnl)}` },
        {
          label: "Liquidation",
          value: row.trade.liquidation_price
            ? `$${money(row.trade.liquidation_price)}`
            : "—",
        },
        { label: "Closes", value: formatDate(row.trade.scheduled_close_at) },
      ]}
    />
  );
}

function PendingCard({ row }: { row: PositionRow }) {
  return (
    <PositionCard
      row={row}
      valueLabel="Planned net"
      value={`$${money(row.trade.net_pnl)}`}
      fields={[
        {
          label: "Scheduled open",
          value: formatDate(row.trade.scheduled_open_at),
          full: true,
        },
      ]}
    />
  );
}

function ClosedCard({ row }: { row: PositionRow }) {
  const net = row.trade.realized_pnl ?? 0;
  const savings =
    (row.trade.fee_savings ?? 0) + (row.trade.interest_savings ?? 0);

  return (
    <PositionCard
      row={row}
      valueLabel="Net P&L"
      value={signedMoney(net)}
      valueClassName={
        net >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"
      }
      fields={[
        {
          label: "Entry → Exit",
          value: `${money(row.trade.entry_price)} → ${money(row.trade.exit_price)}`,
          full: true,
        },
        { label: "Gross", value: `$${money(row.trade.gross_pnl)}` },
        { label: "Fee", value: `$${money(row.trade.fee)}` },
        {
          label: "Savings",
          value: savings > 0 ? `+$${money(savings)}` : "—",
          valueClassName: savings > 0 ? "text-lnd-accent" : undefined,
        },
        {
          label: "Reason",
          value: (row.trade.close_reason ?? "completed").replaceAll("_", " "),
          valueClassName: "capitalize",
        },
        {
          label: "Closed",
          value: formatDate(row.trade.closed_at),
          full: true,
        },
      ]}
    />
  );
}

function CanceledCard({ row }: { row: PositionRow }) {
  return (
    <PositionCard
      row={row}
      valueLabel="Planned net"
      value={`$${money(row.trade.net_pnl)}`}
      fields={[
        {
          label: "Reason",
          value: (row.trade.close_reason ?? "plan cancelled").replaceAll(
            "_",
            " ",
          ),
          valueClassName: "capitalize",
          full: true,
        },
        {
          label: "Canceled",
          value: formatDate(row.trade.closed_at),
          full: true,
        },
      ]}
    />
  );
}

function Cards({
  rows,
  empty,
  render,
}: {
  rows: PositionRow[];
  empty: string;
  render: (row: PositionRow) => ReactNode;
}) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-lnd-border px-4 py-9 text-center">
        <Inbox className="h-5 w-5 text-lnd-fg-muted" />
        <p className="text-[0.76rem] text-lnd-fg-muted">{empty}</p>
      </div>
    );
  }

  return <ul className="space-y-2.5">{rows.map(render)}</ul>;
}

export default function PositionsMobile({ groups, tab, onTabChange }: Props) {
  return (
    <div className="lg:hidden">
      <Tabs value={tab} onValueChange={onTabChange}>
        <div className="px-3 pt-3">
          <TabsList className="grid h-auto w-full grid-cols-4 gap-1 rounded-xl bg-lnd-surface-2 p-1">
            {TABS.map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className="flex-col gap-0.5 rounded-lg px-1 py-1.5 text-[0.68rem] data-[state=active]:bg-lnd-surface data-[state=active]:text-lnd-fg"
              >
                {item.label}
                <span className="rounded-full bg-lnd-surface-2 px-1.5 py-0.5 font-mono text-[0.56rem] text-lnd-fg-muted">
                  {groups[item.value].length}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="open" className="mt-0 px-3 pb-4 pt-3">
          <Cards
            rows={groups.open}
            empty={TABS[0].empty}
            render={(row) => <OpenCard key={row.trade.id} row={row} />}
          />
        </TabsContent>
        <TabsContent value="pending" className="mt-0 px-3 pb-4 pt-3">
          <Cards
            rows={groups.pending}
            empty={TABS[1].empty}
            render={(row) => <PendingCard key={row.trade.id} row={row} />}
          />
        </TabsContent>
        <TabsContent value="closed" className="mt-0 px-3 pb-4 pt-3">
          <Cards
            rows={groups.closed}
            empty={TABS[2].empty}
            render={(row) => <ClosedCard key={row.trade.id} row={row} />}
          />
        </TabsContent>
        <TabsContent value="canceled" className="mt-0 px-3 pb-4 pt-3">
          <Cards
            rows={groups.canceled}
            empty={TABS[3].empty}
            render={(row) => <CanceledCard key={row.trade.id} row={row} />}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
