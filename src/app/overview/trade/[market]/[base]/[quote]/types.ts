import type { Doc, Id } from "@convex/_generated/dataModel";

export type Market = "spot" | "margin" | "futures";
export type PlanSide = "buy" | "sell" | "long" | "short";

export type TradeDoc = Doc<"trades"> & { id: Id<"trades"> };

export type TradePlanDoc = Doc<"trade_plans"> & {
  id: Id<"trade_plans">;
  trades: TradeDoc[];
};

export type TerminalData = {
  available: number;
  plans: TradePlanDoc[];
  activePlans: TradePlanDoc[];
  lastPlan: TradePlanDoc | null;
};

export type VoucherOption = {
  userVoucherId: Id<"user_vouchers">;
  voucherId: Id<"vouchers">;
  code?: string;
  title: string;
  description: string;
  type: "bonus" | "fee_discount" | "margin_interest";
  value: number;
  valueType: "fixed" | "percent";
  account?: "spot" | "futures" | "margin";
  maxDiscountAmount?: number;
  durationDays?: number;
  expiresAt: number;
  estimatedSavings: number;
};

export const MARKET_LABELS: Record<Market, string> = {
  spot: "Spot",
  margin: "Margin",
  futures: "Futures",
};

export const DAY_MS = 24 * 60 * 60 * 1000;
