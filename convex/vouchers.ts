import { v } from "convex/values";
import {
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import { requireUserDoc } from "./helpers";
import { settleResult } from "./accountOps";
import { FEE_RATES, MARGIN_DAILY_INTEREST_RATE, round2 } from "./simulation";

const DAY_MS = 24 * 60 * 60 * 1000;

const SEED_VOUCHERS = [
  {
    code: "WELCOME10",
    title: "Welcome Bonus",
    description:
      "Start your first plan with a $10 spot bonus. Claim it once and use it whenever you are ready.",
    type: "bonus" as const,
    value_type: "fixed" as const,
    value: 10,
    account: "spot" as const,
    applicable_markets: ["spot", "margin", "futures"],
    min_trade_amount: 0,
    usage_limit: 1,
    is_public: true,
    max_redemptions: 25000,
    duration_days: undefined as number | undefined,
    terms: "One welcome bonus per account. Credited to your spot balance.",
  },
  {
    code: "FEE50",
    title: "50% Fee Discount",
    description:
      "Take 50% off every execution fee on your next 7-day trading plan.",
    type: "fee_discount" as const,
    value_type: "percent" as const,
    value: 50,
    account: undefined as "spot" | "futures" | "margin" | undefined,
    applicable_markets: ["spot", "margin", "futures"],
    min_trade_amount: 100,
    usage_limit: 1,
    max_discount_amount: 1000,
    is_public: true,
    max_redemptions: 10000,
    duration_days: 30,
    terms:
      "Applies to one plan. Activate the voucher before starting the plan. Discount is capped at $1,000 in fees.",
  },
  {
    code: "MARGIN25",
    title: "25% Margin Interest Waiver",
    description:
      "Reduce the margin interest charged on a funded margin plan by 25% for 30 days.",
    type: "margin_interest" as const,
    value_type: "percent" as const,
    value: 25,
    account: undefined as "spot" | "futures" | "margin" | undefined,
    applicable_markets: ["margin"],
    min_trade_amount: 100,
    usage_limit: 1,
    max_discount_amount: 500,
    is_public: false,
    max_redemptions: 5000,
    duration_days: 30,
    terms: "Code-only voucher. Applies to one margin plan after activation.",
  },
  {
    code: "FUTURES20",
    title: "Futures Bonus",
    description:
      "A $20 bonus for your futures account. Use it to fund your next futures plan.",
    type: "bonus" as const,
    value_type: "fixed" as const,
    value: 20,
    account: "futures" as const,
    applicable_markets: ["futures"],
    min_trade_amount: 0,
    usage_limit: 1,
    is_public: true,
    max_redemptions: 10000,
    duration_days: undefined as number | undefined,
    terms: "Credited to your futures balance once per account.",
  },
  {
    code: "VERDSTAMP5",
    title: "$5 Verdstamp Bonus",
    description:
      "A small thank-you from Verdstamp. Redeem the code for a $5 spot credit.",
    type: "bonus" as const,
    value_type: "fixed" as const,
    value: 5,
    account: "spot" as const,
    applicable_markets: ["spot", "margin", "futures"],
    min_trade_amount: 0,
    usage_limit: 1,
    is_public: false,
    max_redemptions: 25000,
    duration_days: undefined as number | undefined,
    terms: "Code-only voucher. Credited to your spot balance once per account.",
  },
];

async function seedVoucherData(ctx: any) {
  const now = Date.now();
  let created = 0;

  for (const seed of SEED_VOUCHERS) {
    const existing = await ctx.db
      .query("vouchers")
      .withIndex("by_code", (q: any) => q.eq("code", seed.code))
      .first();
    if (existing) continue;

    await ctx.db.insert("vouchers", {
      code: seed.code,
      title: seed.title,
      description: seed.description,
      type: seed.type,
      value_type: seed.value_type,
      value: seed.value,
      account: seed.account,
      applicable_markets: seed.applicable_markets,
      min_trade_amount: seed.min_trade_amount,
      usage_limit: seed.usage_limit,
      max_discount_amount: seed.max_discount_amount,
      duration_days: seed.duration_days,
      is_public: seed.is_public,
      max_redemptions: seed.max_redemptions,
      redeemed_count: 0,
      starts_at: now - DAY_MS,
      expires_at: now + 365 * DAY_MS,
      status: "active",
      terms: seed.terms,
      created_at: now,
    });
    created += 1;
  }

  return { created };
}

/** Idempotent seeding so the catalog is never empty on a fresh deployment. */
export const ensure_voucher_seed = mutation({
  args: {},
  handler: async (ctx) => seedVoucherData(ctx),
});

export const seed_vouchers = internalMutation({
  args: {},
  handler: async (ctx) => seedVoucherData(ctx),
});

export const list_voucher_catalog = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    const now = Date.now();
    const vouchers = await ctx.db
      .query("vouchers")
      .withIndex("by_public", (q) => q.eq("is_public", true))
      .collect();

    const result = [];
    for (const voucher of vouchers) {
      if (
        voucher.status !== "active" ||
        voucher.starts_at > now ||
        voucher.expires_at <= now
      ) {
        continue;
      }
      const soldOut =
        voucher.max_redemptions !== undefined &&
        voucher.redeemed_count >= voucher.max_redemptions;
      let claimed = false;
      if (userId) {
        const existing = await ctx.db
          .query("user_vouchers")
          .withIndex("by_user_voucher", (q) =>
            q.eq("user", userId).eq("voucher_id", voucher._id),
          )
          .first();
        claimed = Boolean(existing);
      }

      result.push({
        ...voucher,
        id: voucher._id,
        claimed,
        soldOut,
        remaining:
          voucher.max_redemptions !== undefined
            ? Math.max(0, voucher.max_redemptions - voucher.redeemed_count)
            : null,
      });
    }

    return result.sort((a, b) => {
      if (a.claimed !== b.claimed) return a.claimed ? 1 : -1;
      return b.value - a.value;
    });
  },
});

export const my_vouchers = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const userDoc = await ctx.db
      .query("user")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();
    if (!userDoc?.userId) return [];
    const userId = userDoc.userId;
    const now = Date.now();
    const records = await ctx.db
      .query("user_vouchers")
      .withIndex("by_user", (q) => q.eq("user", userId))
      .collect();

    const result = [];
    for (const record of records) {
      const voucher = await ctx.db.get(record.voucher_id);
      if (!voucher) continue;
      const expired =
        record.status !== "used" &&
        ((record.expires_at !== undefined && record.expires_at <= now) ||
          voucher.expires_at <= now);
      result.push({
        ...record,
        id: record._id,
        status: expired ? "expired" : record.status,
        voucher: { ...voucher, id: voucher._id },
        expired,
      });
    }

    return result.sort((a, b) => b.acquired_at - a.acquired_at);
  },
});

function messageFor(ctx: any, userId: string, title: string, description: string) {
  return ctx.db.insert("messages", {
    userId,
    title,
    header: "Voucher Notice",
    description,
    read: false,
    createdAt: Date.now(),
  });
}

async function grantVoucher(
  ctx: any,
  args: {
    userId: string;
    email?: string;
    voucher: any;
    acquiredVia: "claim" | "code";
  },
) {
  const now = Date.now();
  const { voucher } = args;
  if (voucher.status !== "active") {
    throw new Error("This voucher is no longer active.");
  }
  if (voucher.starts_at > now) {
    throw new Error("This voucher is not available yet.");
  }
  if (voucher.expires_at <= now) {
    throw new Error("This voucher has expired.");
  }
  if (
    voucher.max_redemptions !== undefined &&
    voucher.redeemed_count >= voucher.max_redemptions
  ) {
    throw new Error("This voucher has reached its redemption limit.");
  }

  const existing = await ctx.db
    .query("user_vouchers")
    .withIndex("by_user_voucher", (q: any) =>
      q.eq("user", args.userId).eq("voucher_id", voucher._id),
    )
    .first();
  if (existing) {
    throw new Error("You already have this voucher.");
  }

  const userVoucherId = await ctx.db.insert("user_vouchers", {
    user: args.userId,
    email: args.email,
    voucher_id: voucher._id,
    code: voucher.code,
    status: "available",
    acquired_via: args.acquiredVia,
    acquired_at: now,
    expires_at: voucher.expires_at,
    used_count: 0,
    max_usage: voucher.usage_limit ?? 1,
  });

  await ctx.db.patch(voucher._id, {
    redeemed_count: voucher.redeemed_count + 1,
  });

  await ctx.db.insert("voucher_redemptions", {
    user: args.userId,
    voucher_id: voucher._id,
    code: voucher.code,
    created_at: now,
  });

  await messageFor(
    ctx,
    args.userId,
    "Voucher added",
    `${voucher.title} is now in My Vouchers. ${
      voucher.type === "bonus"
        ? "Use it to credit your balance."
        : "Activate it before starting a trading plan."
    }`,
  );

  return userVoucherId;
}

export const claim_voucher = mutation({
  args: { voucherId: v.id("vouchers") },
  handler: async (ctx, args) => {
    const userDoc = await requireUserDoc(ctx);
    const voucher = await ctx.db.get(args.voucherId);
    if (!voucher) throw new Error("Voucher not found.");
    if (!voucher.is_public) throw new Error("This voucher is code-only.");
    return await grantVoucher(ctx, {
      userId: userDoc.userId,
      email: userDoc.email,
      voucher,
      acquiredVia: "claim",
    });
  },
});

export const redeem_voucher = mutation({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const userDoc = await requireUserDoc(ctx);
    const code = args.code.trim().toUpperCase();
    if (!code) throw new Error("Enter a voucher code.");

    const voucher = await ctx.db
      .query("vouchers")
      .withIndex("by_code", (q) => q.eq("code", code))
      .first();
    if (!voucher) throw new Error("That code is not valid.");

    const userVoucherId = await grantVoucher(ctx, {
      userId: userDoc.userId,
      email: userDoc.email,
      voucher,
      acquiredVia: "code",
    });

    return { userVoucherId, voucher };
  },
});

export const activate_voucher = mutation({
  args: { userVoucherId: v.id("user_vouchers") },
  handler: async (ctx, args) => {
    const userDoc = await requireUserDoc(ctx);
    const record = await ctx.db.get(args.userVoucherId);
    if (!record || record.user !== userDoc.userId) {
      throw new Error("Voucher not found.");
    }
    const voucher = await ctx.db.get(record.voucher_id);
    if (!voucher) throw new Error("Voucher not found.");
    if (voucher.type === "bonus") {
      throw new Error("Bonus vouchers are used directly, not activated.");
    }
    if (record.status === "used") throw new Error("This voucher is already used.");
    if (record.status === "expired") throw new Error("This voucher has expired.");

    const now = Date.now();
    if (voucher.expires_at <= now) {
      await ctx.db.patch(record._id, { status: "expired" });
      throw new Error("This voucher has expired.");
    }
    if (record.status === "active") return record._id;

    const duration =
      voucher.duration_days !== undefined
        ? now + voucher.duration_days * DAY_MS
        : voucher.expires_at;
    const expiresAt = Math.min(voucher.expires_at, duration);

    await ctx.db.patch(record._id, {
      status: "active",
      activated_at: now,
      expires_at: expiresAt,
    });

    await messageFor(
      ctx,
      userDoc.userId,
      "Voucher activated",
      `${voucher.title} is active until ${new Date(
        expiresAt,
      ).toLocaleDateString()}. It will appear in the order panel when you start a matching plan.`,
    );

    return record._id;
  },
});

export const use_bonus_voucher = mutation({
  args: { userVoucherId: v.id("user_vouchers") },
  handler: async (ctx, args) => {
    const userDoc = await requireUserDoc(ctx);
    const record = await ctx.db.get(args.userVoucherId);
    if (!record || record.user !== userDoc.userId) {
      throw new Error("Voucher not found.");
    }
    const voucher = await ctx.db.get(record.voucher_id);
    if (!voucher) throw new Error("Voucher not found.");
    if (voucher.type !== "bonus" || voucher.value_type !== "fixed") {
      throw new Error("Only fixed bonus vouchers can be credited.");
    }
    if (record.status === "used") throw new Error("This voucher is already used.");
    if (record.status === "expired") throw new Error("This voucher has expired.");

    const now = Date.now();
    if (
      (record.expires_at !== undefined && record.expires_at <= now) ||
      voucher.expires_at <= now
    ) {
      await ctx.db.patch(record._id, { status: "expired" });
      throw new Error("This voucher has expired.");
    }

    const account = voucher.account ?? "spot";
    const amount = round2(voucher.value);
    await settleResult(ctx, {
      userId: userDoc.userId,
      market: account,
      base: "USDT",
      quote: "USDT",
      pnl: amount,
    });

    await ctx.db.patch(record._id, {
      status: "used",
      used_at: now,
      used_count: record.used_count + 1,
    });

    await messageFor(
      ctx,
      userDoc.userId,
      "Voucher credited",
      `${voucher.title} added $${amount.toFixed(2)} to your ${account} balance.`,
    );

    return { amount, account };
  },
});

export const get_applicable_vouchers = query({
  args: {
    market: v.union(v.literal("spot"), v.literal("margin"), v.literal("futures")),
    principal: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const userId = identity.subject;
    const now = Date.now();
    const records = await ctx.db
      .query("user_vouchers")
      .withIndex("by_user_status", (q) =>
        q.eq("user", userId).eq("status", "active"),
      )
      .collect();

    const result = [];
    for (const record of records) {
      if (record.expires_at !== undefined && record.expires_at <= now) continue;
      const voucher = await ctx.db.get(record.voucher_id);
      if (!voucher || voucher.status !== "active" || voucher.expires_at <= now) {
        continue;
      }
      if (
        !voucher.applicable_markets.includes(args.market) &&
        !voucher.applicable_markets.includes("all")
      ) {
        continue;
      }
      if (
        voucher.min_trade_amount !== undefined &&
        args.principal < voucher.min_trade_amount
      ) {
        continue;
      }
      if (voucher.type === "bonus") continue;

      let estimatedSavings = 0;
      if (voucher.type === "fee_discount") {
        const expectedExecutions = 21;
        estimatedSavings =
          args.principal *
          FEE_RATES[args.market] *
          expectedExecutions *
          (voucher.value / 100);
      } else if (voucher.type === "margin_interest") {
        estimatedSavings =
          args.principal *
          MARGIN_DAILY_INTEREST_RATE *
          7 *
          (voucher.value / 100);
      }
      if (voucher.max_discount_amount !== undefined) {
        estimatedSavings = Math.min(
          estimatedSavings,
          voucher.max_discount_amount,
        );
      }

      result.push({
        userVoucherId: record._id,
        voucherId: voucher._id,
        code: voucher.code,
        title: voucher.title,
        description: voucher.description,
        type: voucher.type,
        value: voucher.value,
        valueType: voucher.value_type,
        account: voucher.account,
        maxDiscountAmount: voucher.max_discount_amount,
        durationDays: voucher.duration_days,
        expiresAt: record.expires_at ?? voucher.expires_at,
        estimatedSavings: round2(estimatedSavings),
      });
    }

    return result.sort((a, b) => b.estimatedSavings - a.estimatedSavings);
  },
});

export const expire_vouchers = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    let expiredUsers = 0;

    const allUserVouchers = await ctx.db.query("user_vouchers").collect();
    for (const record of allUserVouchers) {
      if (
        record.status !== "used" &&
        record.expires_at !== undefined &&
        record.expires_at <= now
      ) {
        await ctx.db.patch(record._id, { status: "expired" });
        expiredUsers += 1;
      }
    }

    const activeVouchers = await ctx.db
      .query("vouchers")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();
    for (const voucher of activeVouchers) {
      if (voucher.expires_at <= now) {
        await ctx.db.patch(voucher._id, { status: "expired" });
      }
    }

    return { expiredUsers };
  },
});
