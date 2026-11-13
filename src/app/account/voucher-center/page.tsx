"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { toast } from "sonner";
import {
  BadgeCheck,
  Gift,
  Loader2,
  Search,
  Ticket,
  TicketCheck,
  Wallet,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/components/lib/utils";
import { SelectType } from "./component/SelectType";
import { SelectStatus } from "./component/SelectStatus";
import VoucherCard, { type VoucherLike } from "./component/VoucherCard";

type Tab = "catalog" | "mine";

type CatalogVoucher = VoucherLike & {
  id: string;
  code: string;
  applicable_markets: string[];
  remaining: number | null;
};

type UserVoucher = VoucherLike & {
  id: string;
  voucher_id: string;
  code?: string;
  status: "available" | "active" | "used" | "expired";
  acquired_via: "claim" | "code";
  acquired_at: number;
  activated_at?: number;
  expires_at?: number;
  used_at?: number;
  voucher: VoucherLike & { id: string };
};

export default function VoucherCenter() {
  const [tab, setTab] = useState<Tab>("catalog");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [redeemOpen, setRedeemOpen] = useState(false);
  const [redeemCode, setRedeemCode] = useState("");
  const [redeeming, setRedeeming] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const catalog = useQuery(api.vouchers.list_voucher_catalog) as
    | CatalogVoucher[]
    | undefined;
  const mine = useQuery(api.vouchers.my_vouchers) as UserVoucher[] | undefined;

  const ensureSeed = useMutation(api.vouchers.ensure_voucher_seed);
  const claimVoucher = useMutation(api.vouchers.claim_voucher);
  const activateVoucher = useMutation(api.vouchers.activate_voucher);
  const useBonusVoucher = useMutation(api.vouchers.use_bonus_voucher);
  const redeemVoucher = useMutation(api.vouchers.redeem_voucher);

  const seeded = useRef(false);
  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    ensureSeed({}).catch(() => {
      // Seeding is best-effort; existing catalog data still renders.
    });
  }, [ensureSeed]);

  const filteredCatalog = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (catalog ?? []).filter((voucher) => {
      if (typeFilter !== "all" && voucher.type !== typeFilter) return false;
      if (!term) return true;
      return (
        voucher.title.toLowerCase().includes(term) ||
        voucher.description.toLowerCase().includes(term) ||
        voucher.code?.toLowerCase().includes(term)
      );
    });
  }, [catalog, typeFilter, search]);

  const filteredMine = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (mine ?? []).filter((voucher) => {
      const source = voucher.voucher ?? voucher;
      if (typeFilter !== "all" && source.type !== typeFilter) return false;
      if (statusFilter !== "all" && voucher.status !== statusFilter) return false;
      if (!term) return true;
      return (
        source.title.toLowerCase().includes(term) ||
        voucher.code?.toLowerCase().includes(term) ||
        source.description.toLowerCase().includes(term)
      );
    });
  }, [mine, typeFilter, statusFilter, search]);

  const availableCount = (mine ?? []).filter(
    (voucher) => voucher.status === "available",
  ).length;
  const activeCount = (mine ?? []).filter(
    (voucher) => voucher.status === "active",
  ).length;

  const runAction = async (
    id: string,
    action: () => Promise<unknown>,
    success: { title: string; description: string },
  ) => {
    setBusyId(id);
    try {
      await action();
      toast.success(success.title, { description: success.description });
    } catch (error: any) {
      toast.error(error?.message ?? "Something went wrong. Please retry.");
    } finally {
      setBusyId(null);
    }
  };

  const onClaim = (voucher: CatalogVoucher) =>
    runAction(
      `claim-${voucher.id}`,
      () => claimVoucher({ voucherId: voucher.id as any }),
      {
        title: "Voucher claimed",
        description:
          voucher.type === "bonus"
            ? `${voucher.title} is in My Vouchers. Use it to credit your balance.`
            : `${voucher.title} is in My Vouchers. Activate it before starting a plan.`,
      },
    );

  const onActivate = (voucher: UserVoucher) =>
    runAction(
      `activate-${voucher.id}`,
      () => activateVoucher({ userVoucherId: voucher.id as any }),
      {
        title: "Voucher activated",
        description:
          "It will appear in the trade order panel when you start a matching plan.",
      },
    );

  const onUseBonus = (voucher: UserVoucher) =>
    runAction(
      `use-${voucher.id}`,
      () => useBonusVoucher({ userVoucherId: voucher.id as any }),
      {
        title: "Balance credited",
        description: `${voucher.voucher?.title ?? voucher.title} added to your ${
          voucher.voucher?.account ?? voucher.account ?? "spot"
        } balance.`,
      },
    );

  const submitRedeem = async () => {
    const code = redeemCode.trim().toUpperCase();
    if (!code) {
      toast.error("Enter a voucher code.");
      return;
    }
    setRedeeming(true);
    try {
      const result: any = await redeemVoucher({ code });
      const title = result?.voucher?.title ?? "Voucher";
      toast.success("Code redeemed", {
        description: `${title} is now in My Vouchers.`,
      });
      setRedeemCode("");
      setRedeemOpen(false);
      setTab("mine");
      setStatusFilter("all");
      setTypeFilter("all");
    } catch (error: any) {
      toast.error(error?.message ?? "Could not redeem that code.");
    } finally {
      setRedeeming(false);
    }
  };

  const loadingCatalog = catalog === undefined;
  const loadingMine = mine === undefined;

  return (
    <div className="flex w-full flex-col gap-5">
      <section className="db-card overflow-hidden">
        <div className="flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3.5">
            <span className="db-icon-tile h-11 w-11">
              <TicketCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="db-eyebrow">Rewards</p>
              <h1 className="db-title mt-1">Voucher Center</h1>
              <p className="mt-1.5 max-w-xl text-[0.78rem] leading-relaxed text-lnd-fg-muted">
                Claim catalog rewards or redeem a code, then activate fee and
                margin-interest vouchers before you start a 7-day plan.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 rounded-xl border border-lnd-border bg-lnd-surface-2/60 px-3 py-2 text-[0.68rem] text-lnd-fg-muted">
              <Wallet className="h-3.5 w-3.5 text-lnd-accent" />
              <span>
                <span className="font-semibold text-lnd-fg">{availableCount}</span>{" "}
                ready
              </span>
              <span className="h-3 w-px bg-lnd-border" />
              <span>
                <span className="font-semibold text-lnd-fg">{activeCount}</span>{" "}
                active
              </span>
            </div>
            <button
              type="button"
              onClick={() => setRedeemOpen(true)}
              className="lnd-btn-accent inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[0.78rem] font-semibold"
            >
              <Gift className="h-4 w-4" />
              Redeem voucher
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-lnd-border px-4 py-3 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex rounded-full bg-lnd-surface-2 p-1">
            {(
              [
                { value: "catalog" as const, label: "Voucher Center", icon: Ticket },
                { value: "mine" as const, label: "My Vouchers", icon: BadgeCheck },
              ] as const
            ).map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    setTab(item.value);
                    setSearch("");
                  }}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.74rem] font-semibold transition-colors",
                    tab === item.value
                      ? "bg-lnd-surface text-lnd-fg shadow-sm"
                      : "text-lnd-fg-muted hover:text-lnd-fg",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                  {item.value === "mine" && mine ? (
                    <span className="rounded-full bg-lnd-surface-2 px-1.5 py-0.5 font-mono text-[0.58rem]">
                      {mine.length}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-lnd-fg-muted" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search vouchers"
                className="h-9 w-full rounded-xl border-lnd-border bg-lnd-surface pl-9 text-[0.74rem] sm:w-[190px]"
              />
            </div>
            <div className="grid grid-cols-1 gap-2 sm:flex sm:items-center">
              <SelectType value={typeFilter} onChange={setTypeFilter} />
              {tab === "mine" ? (
                <SelectStatus value={statusFilter} onChange={setStatusFilter} />
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {tab === "catalog" ? (
        <section className="space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="db-eyebrow">Catalog</p>
              <h2 className="db-section-title mt-1">Claim a reward</h2>
            </div>
            <p className="text-[0.68rem] text-lnd-fg-muted">
              {loadingCatalog
                ? "Loading catalog…"
                : `${filteredCatalog.length} voucher${
                    filteredCatalog.length === 1 ? "" : "s"
                  }`}
            </p>
          </div>

          {loadingCatalog ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="db-card h-[248px] animate-pulse bg-lnd-surface-2/40"
                />
              ))}
            </div>
          ) : filteredCatalog.length === 0 ? (
            <div className="db-card flex flex-col items-center gap-3 px-6 py-14 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-lnd-surface-2 text-lnd-fg-muted">
                <Ticket className="h-5 w-5" />
              </span>
              <p className="text-[0.86rem] font-semibold text-lnd-fg">
                No vouchers match these filters
              </p>
              <p className="max-w-sm text-[0.74rem] leading-relaxed text-lnd-fg-muted">
                Clear the type filter, or redeem a code if you have one.
              </p>
              <button
                type="button"
                onClick={() => {
                  setTypeFilter("all");
                  setSearch("");
                }}
                className="lnd-btn-ghost px-3 py-2 text-[0.72rem]"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filteredCatalog.map((voucher) => (
                <VoucherCard
                  key={voucher.id}
                  voucher={voucher}
                  mode="catalog"
                  busy={busyId === `claim-${voucher.id}`}
                  onClaim={() => onClaim(voucher)}
                  onViewMine={() => setTab("mine")}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="db-eyebrow">My vouchers</p>
              <h2 className="db-section-title mt-1">Your rewards</h2>
            </div>
            <p className="text-[0.68rem] text-lnd-fg-muted">
              {loadingMine
                ? "Loading vouchers…"
                : `${filteredMine.length} of ${mine?.length ?? 0}`}
            </p>
          </div>

          {loadingMine ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="db-card h-[248px] animate-pulse bg-lnd-surface-2/40"
                />
              ))}
            </div>
          ) : filteredMine.length === 0 ? (
            <div className="db-card flex flex-col items-center gap-3 px-6 py-14 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-lnd-surface-2 text-lnd-fg-muted">
                <TicketCheck className="h-5 w-5" />
              </span>
              <p className="text-[0.86rem] font-semibold text-lnd-fg">
                {mine?.length ? "No vouchers match these filters" : "No vouchers yet"}
              </p>
              <p className="max-w-sm text-[0.74rem] leading-relaxed text-lnd-fg-muted">
                {mine?.length
                  ? "Change the status or type filter to see the rest of your rewards."
                  : "Claim a reward from the catalog or redeem a code to get started."}
              </p>
              <button
                type="button"
                onClick={() => {
                  if (mine?.length) {
                    setStatusFilter("all");
                    setTypeFilter("all");
                    setSearch("");
                  } else {
                    setTab("catalog");
                  }
                }}
                className="lnd-btn-ghost px-3 py-2 text-[0.72rem]"
              >
                {mine?.length ? "Clear filters" : "Browse catalog"}
              </button>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filteredMine.map((voucher) => (
                <VoucherCard
                  key={voucher.id}
                  voucher={voucher}
                  mode="mine"
                  busy={
                    busyId === `activate-${voucher.id}` ||
                    busyId === `use-${voucher.id}`
                  }
                  onActivate={() => onActivate(voucher)}
                  onUse={() => onUseBonus(voucher)}
                  onViewMine={() => setTab("mine")}
                />
              ))}
            </div>
          )}
        </section>
      )}

      <section className="db-card grid gap-4 p-5 sm:grid-cols-3">
        <div>
          <p className="text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-lnd-fg-muted">
            Bonus credits
          </p>
          <p className="mt-1.5 text-[0.74rem] leading-relaxed text-lnd-fg-muted">
            Fixed bonuses are credited straight to your spot or futures balance
            from My Vouchers.
          </p>
        </div>
        <div>
          <p className="text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-lnd-fg-muted">
            Fee discounts
          </p>
          <p className="mt-1.5 text-[0.74rem] leading-relaxed text-lnd-fg-muted">
            Activate a fee voucher, then select it in the order panel. Savings
            are credited above the plan target.
          </p>
        </div>
        <div>
          <p className="text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-lnd-fg-muted">
            Margin interest
          </p>
          <p className="mt-1.5 text-[0.74rem] leading-relaxed text-lnd-fg-muted">
            Interest waivers apply to new margin plans and are reflected in each
            execution ledger.
          </p>
        </div>
      </section>

      <Dialog open={redeemOpen} onOpenChange={setRedeemOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-[420px] rounded-2xl border-lnd-border bg-lnd-surface p-0">
          <DialogHeader className="border-b border-lnd-border p-5 pb-4">
            <DialogTitle className="font-Manrope text-lg font-bold text-lnd-fg">
              Redeem a voucher code
            </DialogTitle>
            <DialogDescription className="text-[0.76rem] leading-relaxed text-lnd-fg-muted">
              Enter the code exactly as you received it. Codes are not
              case-sensitive.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 p-5">
            <div className="space-y-2">
              <label
                htmlFor="voucher-code"
                className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-lnd-fg-muted"
              >
                Voucher code
              </label>
              <Input
                id="voucher-code"
                value={redeemCode}
                onChange={(event) => setRedeemCode(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") void submitRedeem();
                }}
                placeholder="e.g. VERDSTAMP5"
                autoComplete="off"
                spellCheck={false}
                className="h-11 rounded-xl border-lnd-border bg-lnd-surface font-mono text-[0.86rem] uppercase tracking-wider"
              />
              <p className="text-[0.64rem] leading-relaxed text-lnd-fg-muted">
                Each code can be added once per account. Bonus codes credit
                immediately after you press Use.
              </p>
            </div>
            <DialogFooter className="gap-2 sm:gap-2">
              <button
                type="button"
                onClick={() => setRedeemOpen(false)}
                className="rounded-xl border border-lnd-border px-4 py-2.5 text-[0.76rem] font-semibold text-lnd-fg transition-colors hover:bg-lnd-surface-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitRedeem}
                disabled={redeeming}
                className="lnd-btn-accent inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-[0.76rem] font-semibold disabled:opacity-60"
              >
                {redeeming ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Gift className="h-3.5 w-3.5" />
                )}
                {redeeming ? "Redeeming…" : "Redeem code"}
              </button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
