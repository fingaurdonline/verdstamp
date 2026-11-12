import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { requireUserId } from "./helpers";

export const deposit_history = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    return await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const view_transaction = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.id as any);
    if (!doc) return null;

    return {
      ...doc,
      amount: (doc as any).amount,
      asset: (doc as any).asset || (doc as any).coin,
      createdAt: (doc as any).createdAt || (doc as any).timestamp || doc._creationTime,
      sender: (doc as any).sender || (doc as any).from,
      receiver: (doc as any).reciever || (doc as any).receiver || (doc as any).to,
    };
  },
});

export const view_all_transactions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    return await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const create_withdraw_transaction = mutation({
  args: {
    reciever: v.string(),
    sender: v.string(),
    amount: v.number(),
    coin: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("withdraw", { ...args, user: await requireUserId(ctx) });
  },
});

export const view_withdraw_history = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    return await ctx.db
      .query("withdraw")
      .withIndex("by_user", (q) => q.eq("user", userId))
      .collect();
  },
});

export const upsertTransaction = internalMutation({
  args: {
    userId: v.string(),
    chain: v.string(),
    address: v.string(),
    txHash: v.string(),
    from: v.string(),
    to: v.string(),
    amount: v.string(),
    blockHeight: v.number(),
    timestamp: v.number(),
    status: v.string(),
    fiatAmount: v.optional(v.number()),
    fiatCurrency: v.optional(v.string()),
    assetSymbol: v.string(),
  },
  handler: async (ctx, args) => {
    // ── Deduplicate by txHash ──
    const existing = await ctx.db
      .query("cryptoTransactions")
      .withIndex("by_hash", (q) => q.eq("hash", args.txHash))
      .first();
    if (existing) return { inserted: false };

    // ── Insert into cryptoTransactions ──
    await ctx.db.insert("cryptoTransactions", {
      userId: args.userId,
      chain: args.chain,
      network: args.chain,
      asset: args.assetSymbol,
      hash: args.txHash,
      from: args.from,
      to: args.to,
      value: args.amount,
      confirmations: 1,
      timestamp: args.timestamp,
    });

    // ── Record in transactions ledger ──
    const numericAmount = parseFloat(args.amount);
    await ctx.db.insert("transactions", {
      userId: args.userId,
      type: "deposit",
      asset: args.assetSymbol,
      amount: Number.isFinite(numericAmount) ? numericAmount : 0,
      referenceId: args.txHash,
      createdAt: args.timestamp || Date.now(),
    });

    // ── Credit the user's spot account ──
    const spotAccount = await ctx.db
      .query("spot")
      .withIndex("by_user", (q) => q.eq("user", args.userId))
      .first();

    if (spotAccount && Number.isFinite(numericAmount)) {
      const COIN_ALIASES: Record<string, string> = {
        btc: "bitcoin",
        eth: "ethereum",
        trx: "tron",
        sol: "solana",
        usdt: "tether usdt",
        xrp: "ripple",
        doge: "doge",
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
      
      const rawName = args.assetSymbol.toLowerCase();
      const assetName = COIN_ALIASES[rawName] ?? rawName;
      
      const fiat = args.fiatAmount ?? 0;
      const currentAssets = spotAccount.assets ?? [];

      console.log("[DEBUG] upsertTransaction processing:", {
        incomingAsset: args.assetSymbol,
        mappedAsset: assetName,
        cryptoAmount: numericAmount,
        fiatAmount: fiat,
      });

      const updatedAssets = currentAssets.map((a) => {
        if (a.coin.toLowerCase() === assetName) {
          return {
            ...a,
            amount: Number(((a.amount || 0) + numericAmount).toFixed(8)),
            available: Number(((a.available || 0) + numericAmount).toFixed(8)),
            value: Number(((a.value || 0) + fiat).toFixed(2)),
          };
        }
        return a;
      });

      const currentTotal = spotAccount.total_asset_balance ?? 0;
      await ctx.db.patch(spotAccount._id, {
        total_asset_balance: Number((currentTotal + fiat).toFixed(2)),
        assets: updatedAssets,
      });
    }

    return { inserted: true };
  },
});
