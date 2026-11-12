import { v } from "convex/values";
import { mutation, query, internalQuery } from "./_generated/server";
import { requireUserId, requireUserDoc } from "./helpers";

const formatAccount = (account: any) => {
  if (!account) return null;
  return {
    ...account,
    id: account._id,
    total_asset: account.total_asset_balance ?? 0,
  };
};

export const create_asset_spot = mutation({
  args: {},
  handler: async (ctx) => {
    const userDoc = await requireUserDoc(ctx);
    return await ctx.db.insert("spot", {
      total_asset_balance: 123,
      assets: [],
      user: userDoc.userId,
      email: userDoc.email,
    });
  },
});

export const spot = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const account = await ctx.db
      .query("spot")
      .withIndex("by_user", (q) => q.eq("user", userId))
      .first();
    return formatAccount(account);
  },
});

export const create_spot_account = mutation({
  args: { asset: v.any() },
  handler: async (ctx, args) => {
    const userDoc = await requireUserDoc(ctx);
    return await ctx.db.insert("spot", {
      total_asset_balance: 0,
      assets: args.asset,
      user: userDoc.userId,
      email: userDoc.email,
    });
  },
});

export const create_margin_account = mutation({
  args: { asset: v.any() },
  handler: async (ctx, args) => {
    const userDoc = await requireUserDoc(ctx);
    return await ctx.db.insert("margin", {
      total_asset_balance: 0,
      assets: args.asset,
      user: userDoc.userId,
      email: userDoc.email,
    });
  },
});

export const create_making_account = mutation({
  args: { asset: v.any() },
  handler: async (ctx, args) =>
    await ctx.db.insert("making_amm", {
      total_asset_balance: 0,
      assets: args.asset,
      user: await requireUserId(ctx),
    }),
});

export const create_futures_account = mutation({
  args: { asset: v.any() },
  handler: async (ctx, args) => {
    const userDoc = await requireUserDoc(ctx);
    return await ctx.db.insert("futures", {
      total_asset_balance: 0,
      assets: args.asset,
      user: userDoc.userId,
      email: userDoc.email,
    });
  },
});

export const create_staking_account = mutation({
  args: { asset: v.any() },
  handler: async (ctx, args) =>
    await ctx.db.insert("staking", {
      total_asset_balance: 0,
      assets: args.asset,
      user: await requireUserId(ctx),
    }),
});

export const ensure_user_accounts = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;
    const userId = identity.subject;

    const userDoc = await ctx.db
      .query("user")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    const email = userDoc?.email;

    const [spot, margin, making, futures, staking, preferences, loan] =
      await Promise.all([
        ctx.db
          .query("spot")
          .withIndex("by_user", (q) => q.eq("user", userId))
          .first(),
        ctx.db
          .query("margin")
          .withIndex("by_user", (q) => q.eq("user", userId))
          .first(),
        ctx.db
          .query("making_amm")
          .withIndex("by_user", (q) => q.eq("user", userId))
          .first(),
        ctx.db
          .query("futures")
          .withIndex("by_user", (q) => q.eq("user", userId))
          .first(),
        ctx.db
          .query("staking")
          .withIndex("by_user", (q) => q.eq("user", userId))
          .first(),
        ctx.db
          .query("preferences")
          .withIndex("by_user", (q) => q.eq("user", userId))
          .first(),
        ctx.db
          .query("loan")
          .withIndex("by_user", (q) => q.eq("userId", userId))
          .first(),
      ]);

    if (!spot) {
      await ctx.db.insert("spot", {
        total_asset_balance: 0,
        assets: [
          {
            amount: 0,
            available: 0,
            coin: "bitcoin",
            frozen: 0,
            value: 0,
          },
          {
            amount: 0,
            available: 0,
            coin: "ethereum",
            frozen: 0,
            value: 0,
          },
          {
            amount: 0,
            available: 0,
            coin: "tron",
            frozen: 0,
            value: 0,
          },
          {
            amount: 0,
            available: 0,
            coin: "solana",
            frozen: 0,
            value: 0,
          },
          {
            amount: 0,
            available: 0,
            coin: "tether usdt",
            frozen: 0,
            value: 0,
          },
          {
            amount: 0,
            available: 0,
            coin: "xrp",
            frozen: 0,
            value: 0,
          },
        ],
        user: userId,
        email,
      });
    }
    if (!margin) {
      await ctx.db.insert("margin", {
        total_asset_balance: 0,
        assets: [
          {
            available: [0, 0],
            coin: ["bitcoin", "usdt"],
            inOrder: [0, 0],
            liquidPrice: 0,
            margin: "bitcoin/usdt",
            risk: 0,
            toBeRepaid: [0, 0],
          },
          {
            available: [0, 0],
            coin: ["ethereum", "usdt"],
            inOrder: [0, 0],
            liquidPrice: 0,
            margin: "ethereum/usdt",
            risk: 0,
            toBeRepaid: [0, 0],
          },
          {
            available: [0, 0],
            coin: ["tron", "usdt"],
            inOrder: [0, 0],
            liquidPrice: 0,
            margin: "tron/usdt",
            risk: 0,
            toBeRepaid: [0, 0],
          },
          {
            available: [0, 0],
            coin: ["solana", "usdt"],
            inOrder: [0, 0],
            liquidPrice: 0,
            margin: "solana/usdt",
            risk: 0,
            toBeRepaid: [0, 0],
          },
          {
            available: [0, 0],
            coin: ["ripple", "usdt"],
            inOrder: [0, 0],
            liquidPrice: 0,
            margin: "ripple/usdt",
            risk: 0,
            toBeRepaid: [0, 0],
          },
        ],
        user: userId,
        email,
      });
    }
    if (!making) {
      await ctx.db.insert("making_amm", {
        total_asset_balance: 0,
        assets: [
          {
            liquidity: 0,
            oneDayAPY: 0,
            pair: "bitcoin/usdt",
            percentage: 0,
            sevenDayAPY: 0,
            sevenDayFeeDividend: 0,
            totalLiquidity: 0,
          },
          {
            liquidity: 0,
            oneDayAPY: 0,
            pair: "ethereum/usdt",
            percentage: 0,
            sevenDayAPY: 0,
            sevenDayFeeDividend: 0,
            totalLiquidity: 0,
          },
          {
            liquidity: 0,
            oneDayAPY: 0,
            pair: "tron/usdt",
            percentage: 0,
            sevenDayAPY: 0,
            sevenDayFeeDividend: 0,
            totalLiquidity: 0,
          },
          {
            liquidity: 0,
            oneDayAPY: 0,
            pair: "solana/usdt",
            percentage: 0,
            sevenDayAPY: 0,
            sevenDayFeeDividend: 0,
            totalLiquidity: 0,
          },
          {
            liquidity: 0,
            oneDayAPY: 0,
            pair: "ripple/usdt",
            percentage: 0,
            sevenDayAPY: 0,
            sevenDayFeeDividend: 0,
            totalLiquidity: 0,
          },
        ],
        user: userId,
      });
    }
    if (!futures) {
      await ctx.db.insert("futures", {
        total_asset_balance: 0,
        assets: [
          {
            available: 0,
            balance: 0,
            coin: "bitcoin",
            equity: 0,
            inOrder: 0,
            unrealizedPNL: 0,
          },
          {
            available: 0,
            balance: 0,
            coin: "ethereum",
            equity: 0,
            inOrder: 0,
            unrealizedPNL: 0,
          },
          {
            available: 0,
            balance: 0,
            coin: "usdt",
            equity: 0,
            inOrder: 0,
            unrealizedPNL: 0,
          },
        ],
        user: userId,
        email,
      });
    }
    if (!staking) {
      await ctx.db.insert("staking", {
        total_asset_balance: 0,
        assets: [
          {
            APY: 0,
            CmlImcome: 0,
            NotActivated: 0,
            Redeeming: 0,
            coin: "tron",
            effective: 0,
            totalAmount: 0,
          },
          {
            APY: 0,
            CmlImcome: 0,
            NotActivated: 0,
            Redeeming: 0,
            coin: "solana",
            effective: 0,
            totalAmount: 0,
          },
          {
            APY: 0,
            CmlImcome: 0,
            NotActivated: 0,
            Redeeming: 0,
            coin: "usdt",
            effective: 0,
            totalAmount: 0,
          },
        ],
        user: userId,
      });
    }
    if (!preferences) {
      await ctx.db.insert("preferences", {
        spot_trading: false,
        futures_trading: false,
        discount: false,
        withdraw_fee: 0,
        currency: "test",
        crypto_currency: "test",
        language: "test",
        dark_mode: true,
        user: userId,
      });
    }
    if (!loan) {
      await ctx.db.insert("loan", {
        userId,
        coin: "tether usdt",
        equity: 0,
        to_be_repaid: 0,
        borrowed_amount: 0,
        collateral_value: 0,
        current_ltv: 0,
        liquidation_ltv: 0,
        status: "low",
      });
    }

    return { ok: true };
  },
});

export const update_spot_account = mutation({
  args: { amount: v.number(), spotID: v.string() },
  handler: async (ctx, args) => {
    const userDoc = await requireUserDoc(ctx);
    return await ctx.db.patch(args.spotID as any, {
      total_asset_balance: args.amount,
      user: userDoc.userId,
      email: userDoc.email,
    });
  },
});

export const update_futures_account = mutation({
  args: { amount: v.number(), futuresID: v.string() },
  handler: async (ctx, args) => {
    const userDoc = await requireUserDoc(ctx);
    return await ctx.db.patch(args.futuresID as any, {
      total_asset_balance: args.amount,
      user: userDoc.userId,
      email: userDoc.email,
    });
  },
});

export const update_margin_account = mutation({
  args: { amount: v.number(), marginID: v.string() },
  handler: async (ctx, args) => {
    const userDoc = await requireUserDoc(ctx);
    return await ctx.db.patch(args.marginID as any, {
      total_asset_balance: args.amount,
      user: userDoc.userId,
      email: userDoc.email,
    });
  },
});

export const view_all_spot_accounts = query({
  args: {},
  handler: async (ctx) =>
    (await ctx.db.query("spot").collect()).map((account) =>
      formatAccount(account),
    ),
});

export const view_all_futures_accounts = query({
  args: {},
  handler: async (ctx) =>
    (await ctx.db.query("futures").collect()).map((account) =>
      formatAccount(account),
    ),
});

export const view_all_margin_accounts = query({
  args: {},
  handler: async (ctx) =>
    (await ctx.db.query("margin").collect()).map((account) =>
      formatAccount(account),
    ),
});

export const view_user_spot_accounts = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const userId = identity.subject;
    return (
      await ctx.db
        .query("spot")
        .withIndex("by_user", (q) => q.eq("user", userId))
        .collect()
    ).map((account) => formatAccount(account));
  },
});

export const view_user_futures_accounts = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const userId = identity.subject;
    return (
      await ctx.db
        .query("futures")
        .withIndex("by_user", (q) => q.eq("user", userId))
        .collect()
    ).map((account) => formatAccount(account));
  },
});

export const view_user_margin_accounts = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const userId = identity.subject;
    return (
      await ctx.db
        .query("margin")
        .withIndex("by_user", (q) => q.eq("user", userId))
        .collect()
    ).map((account) => formatAccount(account));
  },
});

export const view_spot_account = query({
  args: { id: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.id) return null;
    const account = await ctx.db.get(args.id as any);
    return formatAccount(account);
  },
});

export const view_margin_account = query({
  args: { id: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.id) return null;
    const account = await ctx.db.get(args.id as any);
    return formatAccount(account);
  },
});

export const view_futures_account = query({
  args: { id: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.id) return null;
    const account = await ctx.db.get(args.id as any);
    return formatAccount(account);
  },
});

export const update_spot_asset = mutation({
  args: { asset: v.any(), id: v.string() },
  handler: async (ctx, args) =>
    await ctx.db.patch(args.id as any, { assets: args.asset }),
});

export const update_futures_asset = mutation({
  args: { asset: v.any(), id: v.string() },
  handler: async (ctx, args) =>
    await ctx.db.patch(args.id as any, { assets: args.asset }),
});

export const update_margin_asset = mutation({
  args: { asset: v.any(), id: v.string() },
  handler: async (ctx, args) =>
    await ctx.db.patch(args.id as any, { assets: args.asset }),
});

export const update_financial_asset = mutation({
  args: { asset: v.any(), id: v.string() },
  handler: async (ctx, args) =>
    await ctx.db.patch(args.id as any, { assets: args.asset }),
});

export const create_preferences = mutation({
  args: {},
  handler: async (ctx) =>
    await ctx.db.insert("preferences", {
      spot_trading: false,
      futures_trading: false,
      discount: false,
      withdraw_fee: 0,
      currency: "test",
      crypto_currency: "test",
      language: "test",
      dark_mode: true,
      user: await requireUserId(ctx),
    }),
});

export const update_preferences = mutation({
  args: { crypto: v.string(), id: v.string() },
  handler: async (ctx, args) =>
    await ctx.db.patch(args.id as any, { crypto_currency: args.crypto }),
});

export const reciever_spot_account = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const account = await ctx.db
      .query("spot")
      .filter((q) => q.eq(q.field("user"), args.userId))
      .first();
    return formatAccount(account);
  },
});

export const getUserLocalCurrency = internalQuery({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const userDoc = await ctx.db
      .query("user")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    return userDoc?.currency ?? "USD";
  },
});

export const update_spot_by_email = mutation({
  args: {
    email: v.string(),
    coin: v.string(),
    amount: v.number(),
    value: v.number(),
    chain: v.string(),
    network: v.string(),
    txHash: v.string(),
    from: v.string(),
    to: v.string(),
  },
  handler: async (
    ctx,
    { email, coin, amount, value, chain, network, txHash, from, to },
  ) => {
    // 1. Look up the user by email
    const userDoc = await ctx.db
      .query("user")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    if (!userDoc || !userDoc.userId) {
      throw new Error(`No user found with email: ${email}`);
    }

    // 2. Find the user's spot account
    const spotAccount = await ctx.db
      .query("spot")
      .withIndex("by_user", (q) => q.eq("user", userDoc.userId))
      .first();
    if (!spotAccount) {
      throw new Error(`No spot account found for user: ${email}`);
    }

    // 3. Update the matching coin in the assets array
    const currentAssets = JSON.parse(JSON.stringify(spotAccount.assets ?? []));
    const assetIndex = currentAssets.findIndex(
      (a: any) => a.coin.toLowerCase() === coin.toLowerCase(),
    );
    if (assetIndex === -1) {
      throw new Error(
        `Coin "${coin}" not found in spot assets for user: ${email}`,
      );
    }

    currentAssets[assetIndex].amount = amount;
    currentAssets[assetIndex].available = amount;
    currentAssets[assetIndex].value = value;

    // 4. Patch the spot account with updated assets and new total balance
    const currentTotal = spotAccount.total_asset_balance ?? 0;
    await ctx.db.patch(spotAccount._id, {
      assets: currentAssets,
      total_asset_balance: currentTotal + value,
    });

    // 5. Record a crypto deposit transaction
    await ctx.db.insert("cryptoTransactions", {
      userId: userDoc.userId,
      chain,
      network,
      asset: coin,
      hash: txHash,
      from,
      to,
      value: String(amount),
      timestamp: Date.now(),
      confirmations: 0,
    });

    return { ok: true };
  },
});
