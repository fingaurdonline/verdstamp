import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUserId } from "./helpers";

export const ingest = mutation({
  args: {
    userId: v.string(),
    chain: v.string(),
    network: v.string(),
    asset: v.string(),
    hash: v.string(),
    from: v.string(),
    to: v.string(),
    value: v.string(),
    memo: v.optional(v.string()),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("cryptoTransactions")
      .withIndex("by_hash", (q) => q.eq("hash", args.hash))
      .first();

    if (existing) return { inserted: false };

    await ctx.db.insert("cryptoTransactions", {
      ...args,
      confirmations: 0,
    });

    return { inserted: true };
  },
});

export const updateConfirmations = mutation({
  args: {
    hash: v.string(),
    confirmations: v.number(),
  },
  handler: async (ctx, { hash, confirmations }) => {
    const tx = await ctx.db
      .query("cryptoTransactions")
      .withIndex("by_hash", (q) => q.eq("hash", hash))
      .first();

    if (!tx) return;

    await ctx.db.patch(tx._id, { confirmations });
  },
});

export const listForUser = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return ctx.db
      .query("cryptoTransactions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const view_all_transactions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    return ctx.db
      .query("cryptoTransactions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const ingestAndCreditSpot = mutation({
  args: {
    secret: v.string(),
    userId: v.string(),
    chain: v.string(),
    network: v.string(),
    asset: v.string(),
    hash: v.string(),
    from: v.string(),
    to: v.string(),
    value: v.string(),
    memo: v.optional(v.string()),
    timestamp: v.number(),
    fiatAmount: v.number(),
    fiatCurrency: v.string(),
    confirmations: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (!process.env.WEBHOOK_SHARED_SECRET) {
      throw new Error("Missing WEBHOOK_SHARED_SECRET");
    }
    if (args.secret !== process.env.WEBHOOK_SHARED_SECRET) {
      return { inserted: false as const };
    }

    const existing = await ctx.db
      .query("cryptoTransactions")
      .withIndex("by_hash", (q) => q.eq("hash", args.hash))
      .first();

    if (existing) return { inserted: false as const };

    const confirmations = args.confirmations ?? 0;

    await ctx.db.insert("cryptoTransactions", {
      userId: args.userId,
      chain: args.chain,
      asset: args.asset,
      network: args.network,
      hash: args.hash,
      from: args.from,
      to: args.to,
      value: args.value,
      memo: args.memo,
      confirmations,
      timestamp: args.timestamp,
    });

    // ── Look up the user's spot account ──
    const spotAccount = await ctx.db
      .query("spot")
      .withIndex("by_user", (q) => q.eq("user", args.userId))
      .first();

    if (!spotAccount)
      return { inserted: true as const, credited: false as const };

    // ── Find and update the matching crypto asset ──
    const cryptoAmount = parseFloat(args.value);
    const currentAssets = spotAccount.assets ?? [];

    // Normalize incoming asset name/symbol to match spot coin names
    const COIN_ALIASES: Record<string, string> = {
      btc: "bitcoin",
      eth: "ethereum",
      trx: "tron",
      sol: "solana",
      usdt: "tether usdt",
      xrp: "xrp",
      doge: "dogecoin",
      ltc: "litecoin",
      bnb: "smartchain",
      matic: "polygon",
      dot: "polkadot",
      atom: "atom",
      ton: "ton",
      sei: "sei",
      inj: "inj",
      dai: "dai",
      usdc: "usdc",
    };
    const rawName = args.asset.toLowerCase();
    const assetName = COIN_ALIASES[rawName] ?? rawName;

    const fiat = args.fiatAmount ?? 0;

    console.log("[DEBUG] ingestAndCreditSpot processing:", {
      incomingAsset: args.asset,
      mappedAsset: assetName,
      cryptoAmount: cryptoAmount,
      fiatAmount: fiat,
    });

    const updatedAssets = currentAssets.map((a) => {
      if (a.coin.toLowerCase() === assetName) {
        return {
          ...a,
          amount: Number(((a.amount || 0) + cryptoAmount).toFixed(8)),
          available: Number(((a.available || 0) + cryptoAmount).toFixed(8)),
          value: Number(((a.value || 0) + fiat).toFixed(2)),
        };
      }
      return a;
    });

    // ── Update spot total_asset_balance ──
    const currentTotal = spotAccount.total_asset_balance ?? 0;
    const nextTotal = Number((currentTotal + fiat).toFixed(2));

    await ctx.db.patch(spotAccount._id, {
      total_asset_balance: nextTotal,
      assets: updatedAssets,
    });

    return {
      inserted: true as const,
      credited: true as const,
      spotId: spotAccount._id,
    };
  },
});
