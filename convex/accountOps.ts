/**
 * Account balance helpers shared by trading plans and vouchers.
 *
 * Plans move the committed principal from "available" into the account's
 * locked bucket. Profits are credited as available balance, while losses are
 * absorbed by the locked principal first. This keeps the account total correct
 * and prevents an intraday losing execution from producing a negative available
 * balance.
 */

import type { Market } from "./simulation";
import { round2, round8 } from "./simulation";

export const COIN_NAMES: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  TRX: "tron",
  SOL: "solana",
  USDT: "tether usdt",
  USDC: "usdc",
  XRP: "ripple",
  DOGE: "doge",
  LTC: "litecoin",
  BNB: "smartchain",
  MATIC: "polygon",
  DOT: "polkadot",
  ATOM: "atom",
  TON: "ton",
  SEI: "sei",
  INJ: "inj",
  DAI: "dai",
  ADA: "cardano",
  AVAX: "avalanche",
  LINK: "chainlink",
  BCH: "bitcoin cash",
  XLM: "stellar",
  NEAR: "near",
  APT: "aptos",
  ARB: "arbitrum",
  OP: "optimism",
  SUI: "sui",
  PEPE: "pepe",
  SHIB: "shiba inu",
  UNI: "uniswap",
  AAVE: "aave",
  ETC: "ethereum classic",
  FIL: "filecoin",
  ICP: "internet computer",
  HBAR: "hedera",
  VET: "vechain",
  ALGO: "algorand",
  RNDR: "render",
  IMX: "immutable",
  GRT: "the graph",
  SAND: "the sandbox",
  MANA: "decentraland",
  AXS: "axie infinity",
  THETA: "theta",
  EOS: "eos",
  XTZ: "tezos",
  FLOW: "flow",
  KAS: "kaspa",
  TIA: "celestia",
  JUP: "jupiter",
  PYTH: "pyth network",
  WIF: "dogwifcoin",
  BONK: "bonk",
};

const STABLE_QUOTES = new Set(["USDT", "USDC"]);

export function coinName(symbol: string) {
  const upper = symbol.toUpperCase();
  return COIN_NAMES[upper] ?? symbol.toLowerCase();
}

export function stableCoinName(quote: string) {
  return quote.toUpperCase() === "USDC" ? "usdc" : "tether usdt";
}

export function isStableQuote(quote: string) {
  return STABLE_QUOTES.has(quote.toUpperCase());
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function spotCoinCandidates(quote: string) {
  const upper = quote.toUpperCase();
  if (upper === "USDT") return ["tether usdt", "usdt", "tether"];
  if (upper === "USDC") return ["usdc", "usd coin"];
  if (upper === "DAI") return ["dai"];
  return [coinName(upper)];
}

function findSpotAssetIndex(assets: any[], quote: string) {
  const candidates = spotCoinCandidates(quote).map((item) => item.toLowerCase());
  return assets.findIndex((asset) =>
    candidates.includes(String(asset?.coin ?? "").toLowerCase()),
  );
}

function ensureSpotAsset(assets: any[], quote: string) {
  let index = findSpotAssetIndex(assets, quote);
  if (index >= 0) return index;

  assets.push({
    amount: 0,
    available: 0,
    coin: stableCoinName(quote),
    frozen: 0,
    value: 0,
  });
  index = assets.length - 1;
  return index;
}

function findMarginAssetIndex(assets: any[], base: string) {
  const baseName = coinName(base).toLowerCase();
  return assets.findIndex((asset) => {
    const pairBase = String(asset?.coin?.[0] ?? "").toLowerCase();
    const marginBase = String(asset?.margin ?? "").split("/")[0]?.toLowerCase();
    return pairBase === baseName || marginBase === baseName;
  });
}

export async function getMarketAccount(
  ctx: any,
  userId: string,
  market: Market,
) {
  const table =
    market === "spot" ? "spot" : market === "margin" ? "margin" : "futures";
  return await ctx.db
    .query(table)
    .withIndex("by_user", (q: any) => q.eq("user", userId))
    .first();
}

export async function getAvailableBalance(
  ctx: any,
  args: { userId: string; market: Market; base: string; quote: string },
) {
  const account = await getMarketAccount(ctx, args.userId, args.market);
  if (!account) return 0;

  if (args.market === "spot") {
    const assets = account.assets ?? [];
    const index = findSpotAssetIndex(assets, args.quote);
    return index >= 0 ? Number(assets[index]?.available ?? 0) : 0;
  }

  if (args.market === "futures") {
    const assets = account.assets ?? [];
    const asset = assets.find((item: any) =>
      ["usdt", "tether usdt", "usdc"].includes(
        String(item?.coin ?? "").toLowerCase(),
      ),
    );
    return Number(asset?.available ?? 0);
  }

  const assets = account.assets ?? [];
  const index = findMarginAssetIndex(assets, args.base);
  if (index < 0) return 0;
  return Number(assets[index]?.available?.[1] ?? 0);
}

export async function lockPrincipal(
  ctx: any,
  args: {
    userId: string;
    market: Market;
    base: string;
    quote: string;
    amount: number;
  },
) {
  const account = await getMarketAccount(ctx, args.userId, args.market);
  if (!account) throw new Error("Account not found. Please refresh the page.");
  const amount = round2(args.amount);

  if (args.market === "spot") {
    const assets = clone(account.assets ?? []);
    const index = ensureSpotAsset(assets, args.quote);
    const asset = assets[index];
    const available = Number(asset.available ?? 0);
    if (available + 0.000001 < amount) {
      throw new Error("Insufficient available balance for this plan.");
    }
    asset.available = round8(available - amount);
    asset.frozen = round8(Number(asset.frozen ?? 0) + amount);
    await ctx.db.patch(account._id, { assets });
    return;
  }

  if (args.market === "futures") {
    const assets = clone(account.assets ?? []);
    let asset = assets.find((item: any) =>
      ["usdt", "tether usdt", "usdc"].includes(
        String(item?.coin ?? "").toLowerCase(),
      ),
    );
    if (!asset) {
      asset = {
        available: 0,
        balance: 0,
        coin: "usdt",
        equity: 0,
        inOrder: 0,
        unrealizedPNL: 0,
      };
      assets.push(asset);
    }
    const available = Number(asset.available ?? 0);
    if (available + 0.000001 < amount) {
      throw new Error("Insufficient available balance for this plan.");
    }
    asset.available = round2(available - amount);
    asset.inOrder = round2(Number(asset.inOrder ?? 0) + amount);
    await ctx.db.patch(account._id, { assets });
    return;
  }

  const assets = clone(account.assets ?? []);
  const index = findMarginAssetIndex(assets, args.base);
  if (index < 0) {
    throw new Error(
      "This margin pair is not funded. Transfer USDT to this pair first.",
    );
  }
  const asset = assets[index];
  const available = Number(asset.available?.[1] ?? 0);
  if (available + 0.000001 < amount) {
    throw new Error("Insufficient available balance for this plan.");
  }
  asset.available = [Number(asset.available?.[0] ?? 0), round2(available - amount)];
  asset.inOrder = [
    Number(asset.inOrder?.[0] ?? 0),
    round2(Number(asset.inOrder?.[1] ?? 0) + amount),
  ];
  await ctx.db.patch(account._id, { assets });
}

/**
 * Settle a realized result. Positive values are credited to available balance.
 * Negative values consume the locked principal first (lossAbsorb) and any
 * remainder from available balance.
 */
export async function settleResult(
  ctx: any,
  args: {
    userId: string;
    market: Market;
    base: string;
    quote: string;
    pnl: number;
    lossAbsorb?: number;
  },
) {
  const account = await getMarketAccount(ctx, args.userId, args.market);
  if (!account) throw new Error("Account not found");
  const pnl = round2(args.pnl);
  if (pnl === 0) return;

  if (args.market === "spot") {
    const assets = clone(account.assets ?? []);
    const index = ensureSpotAsset(assets, args.quote);
    const asset = assets[index];
    const total = round2(Number(account.total_asset_balance ?? 0) + pnl);

    if (pnl > 0) {
      asset.amount = round8(Number(asset.amount ?? 0) + pnl);
      asset.available = round8(Number(asset.available ?? 0) + pnl);
      asset.value = round2(Number(asset.value ?? 0) + pnl);
    } else {
      const loss = Math.abs(pnl);
      const fromLocked = Math.min(loss, Math.max(0, args.lossAbsorb ?? 0));
      const fromAvailable = round2(loss - fromLocked);
      asset.frozen = round8(
        Math.max(0, Number(asset.frozen ?? 0) - fromLocked),
      );
      asset.available = round8(Number(asset.available ?? 0) - fromAvailable);
      asset.amount = round8(Number(asset.amount ?? 0) - loss);
      asset.value = round2(Math.max(0, Number(asset.value ?? 0) - loss));
    }

    await ctx.db.patch(account._id, {
      assets,
      total_asset_balance: total,
    });
    return;
  }

  if (args.market === "futures") {
    const assets = clone(account.assets ?? []);
    let asset = assets.find((item: any) =>
      ["usdt", "tether usdt", "usdc"].includes(
        String(item?.coin ?? "").toLowerCase(),
      ),
    );
    if (!asset) {
      asset = {
        available: 0,
        balance: 0,
        coin: "usdt",
        equity: 0,
        inOrder: 0,
        unrealizedPNL: 0,
      };
      assets.push(asset);
    }
    const total = round2(Number(account.total_asset_balance ?? 0) + pnl);

    if (pnl > 0) {
      asset.available = round2(Number(asset.available ?? 0) + pnl);
      asset.balance = round2(Number(asset.balance ?? 0) + pnl);
      asset.equity = round2(Number(asset.equity ?? 0) + pnl);
    } else {
      const loss = Math.abs(pnl);
      const fromLocked = Math.min(loss, Math.max(0, args.lossAbsorb ?? 0));
      const fromAvailable = round2(loss - fromLocked);
      asset.inOrder = round2(Math.max(0, Number(asset.inOrder ?? 0) - fromLocked));
      asset.available = round2(Number(asset.available ?? 0) - fromAvailable);
      asset.balance = round2(Number(asset.balance ?? 0) - loss);
      asset.equity = round2(Number(asset.equity ?? 0) - loss);
    }

    await ctx.db.patch(account._id, {
      assets,
      total_asset_balance: total,
    });
    return;
  }

  const assets = clone(account.assets ?? []);
  const index = findMarginAssetIndex(assets, args.base);
  if (index < 0) throw new Error("Margin pair not found");
  const asset = assets[index];
  const total = round2(Number(account.total_asset_balance ?? 0) + pnl);

  if (pnl > 0) {
    asset.available = [
      Number(asset.available?.[0] ?? 0),
      round2(Number(asset.available?.[1] ?? 0) + pnl),
    ];
  } else {
    const loss = Math.abs(pnl);
    const fromLocked = Math.min(loss, Math.max(0, args.lossAbsorb ?? 0));
    const fromAvailable = round2(loss - fromLocked);
    asset.inOrder = [
      Number(asset.inOrder?.[0] ?? 0),
      round2(Math.max(0, Number(asset.inOrder?.[1] ?? 0) - fromLocked)),
    ];
    asset.available = [
      Number(asset.available?.[0] ?? 0),
      round2(Number(asset.available?.[1] ?? 0) - fromAvailable),
    ];
  }

  await ctx.db.patch(account._id, {
    assets,
    total_asset_balance: total,
  });
}

export async function unlockPrincipal(
  ctx: any,
  args: {
    userId: string;
    market: Market;
    base: string;
    quote: string;
    amount: number;
  },
) {
  const amount = round2(args.amount);
  if (amount <= 0) return;
  const account = await getMarketAccount(ctx, args.userId, args.market);
  if (!account) return;

  if (args.market === "spot") {
    const assets = clone(account.assets ?? []);
    const index = ensureSpotAsset(assets, args.quote);
    const asset = assets[index];
    asset.frozen = round8(
      Math.max(0, Number(asset.frozen ?? 0) - amount),
    );
    asset.available = round8(Number(asset.available ?? 0) + amount);
    await ctx.db.patch(account._id, { assets });
    return;
  }

  if (args.market === "futures") {
    const assets = clone(account.assets ?? []);
    let asset = assets.find((item: any) =>
      ["usdt", "tether usdt", "usdc"].includes(
        String(item?.coin ?? "").toLowerCase(),
      ),
    );
    if (!asset) {
      asset = {
        available: 0,
        balance: 0,
        coin: "usdt",
        equity: 0,
        inOrder: 0,
        unrealizedPNL: 0,
      };
      assets.push(asset);
    }
    asset.inOrder = round2(
      Math.max(0, Number(asset.inOrder ?? 0) - amount),
    );
    asset.available = round2(Number(asset.available ?? 0) + amount);
    await ctx.db.patch(account._id, { assets });
    return;
  }

  const assets = clone(account.assets ?? []);
  const index = findMarginAssetIndex(assets, args.base);
  if (index < 0) return;
  const asset = assets[index];
  asset.inOrder = [
    Number(asset.inOrder?.[0] ?? 0),
    round2(Math.max(0, Number(asset.inOrder?.[1] ?? 0) - amount)),
  ];
  asset.available = [
    Number(asset.available?.[0] ?? 0),
    round2(Number(asset.available?.[1] ?? 0) + amount),
  ];
  await ctx.db.patch(account._id, { assets });
}
