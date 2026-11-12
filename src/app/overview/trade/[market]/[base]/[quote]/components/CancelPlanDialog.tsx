"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { TradePlanDoc } from "../types";

type CancelPlanDialogProps = {
  plan: TradePlanDoc | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancelled?: () => void;
};

function money(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function CancelPlanDialog({
  plan,
  open,
  onOpenChange,
  onCancelled,
}: CancelPlanDialogProps) {
  const preview = useQuery(
    api.trading.cancel_preview,
    plan && open ? { planId: plan.id } : "skip",
  );
  const cancelPlan = useMutation(api.trading.cancel_trade_plan);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!plan) return;
    setSubmitting(true);
    try {
      const result = await cancelPlan({ planId: plan.id });
      toast.success("Plan cancelled", {
        description: `$${money(result.principalReturned)} of principal released. Completed profit stays in your account.`,
      });
      onOpenChange(false);
      onCancelled?.();
    } catch (error: any) {
      toast.error(error?.message ?? "Could not cancel the plan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-[440px] rounded-2xl border-lnd-border bg-lnd-surface p-0">
        <DialogHeader className="border-b border-lnd-border p-5 pb-4">
          <DialogTitle className="font-Manrope text-lg font-bold text-lnd-fg">
            Cancel this plan?
          </DialogTitle>
          <DialogDescription className="text-[0.76rem] leading-relaxed text-lnd-fg-muted">
            {plan ? `${plan.base}/${plan.quote} · ${plan.market} · $${money(plan.principal)} principal` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 p-5">
          {!preview ? (
            <div className="space-y-2">
              <div className="h-9 animate-pulse rounded-lg bg-lnd-surface-2" />
              <div className="h-9 animate-pulse rounded-lg bg-lnd-surface-2" />
              <div className="h-9 animate-pulse rounded-lg bg-lnd-surface-2" />
            </div>
          ) : (
            <>
              <div className="space-y-2.5 rounded-xl bg-lnd-surface-2/70 p-3.5">
                <div className="flex items-center justify-between text-[0.74rem]">
                  <span className="text-lnd-fg-muted">Principal returned</span>
                  <span className="font-mono font-semibold text-lnd-fg">
                    ${money(preview.principalReturned)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[0.74rem]">
                  <span className="text-lnd-fg-muted">Completed profit</span>
                  <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    ${money(preview.realizedPnl)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[0.74rem]">
                  <span className="text-lnd-fg-muted">Open trade mark</span>
                  <span
                    className={`font-mono font-semibold ${
                      preview.openMark >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-500"
                    }`}
                  >
                    {preview.openMark >= 0 ? "+" : "−"}${money(Math.abs(preview.openMark))}
                  </span>
                </div>
                {preview.pendingCount > 0 ? (
                  <div className="flex items-center justify-between text-[0.74rem]">
                    <span className="text-lnd-fg-muted">Pending trades cancelled</span>
                    <span className="font-mono text-lnd-fg">{preview.pendingCount}</span>
                  </div>
                ) : null}
                <div className="h-px bg-lnd-border" />
                <div className="flex items-center justify-between text-[0.78rem]">
                  <span className="font-semibold text-lnd-fg">Credited on cancel</span>
                  <span className="font-mono font-bold text-lnd-fg">
                    ${money(preview.totalCreditedNow)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[0.72rem]">
                  <span className="text-lnd-fg-muted">Net plan result</span>
                  <span
                    className={`font-mono font-semibold ${
                      preview.netResult >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-500"
                    }`}
                  >
                    {preview.netResult >= 0 ? "+" : "−"}${money(Math.abs(preview.netResult))}
                  </span>
                </div>
              </div>

              <p className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2.5 text-[0.7rem] leading-relaxed text-amber-700 dark:text-amber-300">
                Remaining daily targets will be forfeited. The unfinished day is
                not guaranteed. There is no early-exit fee.
              </p>
            </>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border border-lnd-border px-4 py-2.5 text-[0.76rem] font-semibold text-lnd-fg transition-colors hover:bg-lnd-surface-2"
            >
              Keep plan
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={submitting || !preview}
              className="rounded-xl bg-red-500 px-4 py-2.5 text-[0.76rem] font-semibold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Cancelling…" : "Cancel plan"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
