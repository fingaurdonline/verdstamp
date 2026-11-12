import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

type CacheEntry = {
  candles: Candle[];
  fetchedAt: number;
};

const CACHE = new Map<string, CacheEntry>();
const INFLIGHT = new Map<string, Promise<Candle[]>>();
const COINS_CACHE = new Map<string, { at: number; coins: any[] }>();

const COINGECKO_IDS: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  USDT: "tether",
  USDC: "usd-coin",
  DAI: "dai",
  BUSD: "binance-usd",
  TUSD: "true-usd",
  FDUSD: "first-digital-usd",
  SOL: "solana",
  XRP: "ripple",
  DOGE: "dogecoin",
  ADA: "cardano",
  TRX: "tron",
  BNB: "binancecoin",
  LTC: "litecoin",
  BCH: "bitcoin-cash",
  TON: "the-open-network",
  DOT: "polkadot",
  MATIC: "matic-network",
  AVAX: "avalanche-2",
  LINK: "chainlink",
  ATOM: "cosmos",
  XLM: "stellar",
  NEAR: "near",
  APT: "aptos",
  ARB: "arbitrum",
  OP: "optimism",
  SUI: "sui",
  SEI: "sei-network",
  INJ: "injective-protocol",
  PEPE: "pepe",
  SHIB: "shiba-inu",
  UNI: "uniswap",
  AAVE: "aave",
  ETC: "ethereum-classic",
  FIL: "filecoin",
  ICP: "internet-computer",
  HBAR: "hedera-hashgraph",
  VET: "vechain",
  ALGO: "algorand",
  RNDR: "render-token",
  IMX: "immutable-x",
  GRT: "the-graph",
  SAND: "the-sandbox",
  MANA: "decentraland",
  AXS: "axie-infinity",
  THETA: "theta-token",
  EOS: "eos",
  XTZ: "tezos",
  FLOW: "flow",
  KAS: "kaspa",
  TIA: "celestia",
  JUP: "jupiter-exchange-solana",
  PYTH: "pyth-network",
  WIF: "dogwifcoin",
  BONK: "bonk",
};

const STABLE_QUOTES = new Set([
  "USDT",
  "USDC",
  "DAI",
  "BUSD",
  "TUSD",
  "FDUSD",
]);

const INTERVALS = {
  "30m": { days: 1, bucketMs: 30 * 60 * 1000, ttlMs: 30_000 },
  "1h": { days: 1, bucketMs: 60 * 60 * 1000, ttlMs: 30_000 },
  "4h": { days: 30, bucketMs: 4 * 60 * 60 * 1000, ttlMs: 5 * 60_000 },
  "1d": { days: 30, bucketMs: 24 * 60 * 60 * 1000, ttlMs: 5 * 60_000 },
} as const;

type Interval = keyof typeof INTERVALS;

function isInterval(value: string | null): value is Interval {
  return value === "30m" || value === "1h" || value === "4h" || value === "1d";
}

async function resolveCoinId(symbol: string) {
  const upper = symbol.toUpperCase();
  if (COINGECKO_IDS[upper]) return COINGECKO_IDS[upper];

  const cached = COINS_CACHE.get("list");
  let coins = cached?.coins;
  if (!cached || Date.now() - cached.at > 24 * 60 * 60 * 1000) {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/list?include_platform=false",
      {
        cache: "no-store",
        headers: { accept: "application/json" },
        signal: AbortSignal.timeout(20_000),
      },
    );
    if (!response.ok) return null;
    coins = await response.json();
    COINS_CACHE.set("list", { at: Date.now(), coins: coins ?? [] });
  }

  const exact = coins?.find(
    (coin: any) => String(coin.symbol).toUpperCase() === upper,
  );
  return exact?.id ?? null;
}

async function fetchOhlc(coinId: string, days: number): Promise<Candle[]> {
  const url = `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(
    coinId,
  )}/ohlc?vs_currency=usd&days=${days}`;
  const response = await fetch(url, {
    cache: "no-store",
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(20_000),
  });

  if (response.status === 429) {
    throw Object.assign(new Error("rate_limited"), { status: 429 });
  }
  if (!response.ok) {
    throw Object.assign(new Error(`upstream_${response.status}`), {
      status: response.status,
    });
  }

  const raw = (await response.json()) as number[][];
  if (!Array.isArray(raw)) return [];

  return raw
    .filter(
      (row) =>
        Array.isArray(row) &&
        row.length >= 5 &&
        row.every((value) => Number.isFinite(value)),
    )
    .map((row) => ({
      time: row[0],
      open: row[1],
      high: row[2],
      low: row[3],
      close: row[4],
    }))
    .sort((a, b) => a.time - b.time);
}

function aggregate(candles: Candle[], bucketMs: number): Candle[] {
  const buckets = new Map<number, Candle>();

  for (const candle of candles) {
    const time = Math.floor(candle.time / bucketMs) * bucketMs;
    const existing = buckets.get(time);
    if (!existing) {
      buckets.set(time, { ...candle, time });
    } else {
      existing.high = Math.max(existing.high, candle.high);
      existing.low = Math.min(existing.low, candle.low);
      existing.close = candle.close;
    }
  }

  return [...buckets.values()].sort((a, b) => a.time - b.time);
}

function dividePair(base: Candle[], quote: Candle[]) {
  const quoteByTime = new Map(quote.map((candle) => [candle.time, candle]));
  const result: Candle[] = [];

  for (const candle of base) {
    const q = quoteByTime.get(candle.time);
    if (!q || !q.close) continue;
    result.push({
      time: candle.time,
      open: candle.open / q.close,
      high: candle.high / q.close,
      low: candle.low / q.close,
      close: candle.close / q.close,
    });
  }

  return result;
}

async function loadCandles(
  base: string,
  quote: string,
  interval: Interval,
): Promise<{ candles: Candle[]; source: string }> {
  const config = INTERVALS[interval];
  const baseId = await resolveCoinId(base);
  if (!baseId) {
    throw Object.assign(new Error("unsupported_pair"), { status: 404 });
  }

  const baseOhlc = await fetchOhlc(baseId, config.days);
  let candles = baseOhlc;

  if (!STABLE_QUOTES.has(quote)) {
    const quoteId = await resolveCoinId(quote);
    if (!quoteId) {
      throw Object.assign(new Error("unsupported_pair"), { status: 404 });
    }
    const quoteOhlc = await fetchOhlc(quoteId, config.days);
    candles = dividePair(baseOhlc, quoteOhlc);
  }

  return {
    candles: aggregate(candles, config.bucketMs),
    source: "coingecko",
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const base = (searchParams.get("base") ?? "").trim().toUpperCase();
  const quote = (searchParams.get("quote") ?? "").trim().toUpperCase();
  const intervalParam = searchParams.get("interval") ?? "30m";

  if (!base || !quote || !isInterval(intervalParam)) {
    return NextResponse.json(
      {
        error: "Invalid chart request.",
        code: "bad_request",
      },
      { status: 400 },
    );
  }

  const interval = intervalParam;
  const config = INTERVALS[interval];
  const key = `${base}/${quote}/${interval}`;
  const cached = CACHE.get(key);

  if (cached && Date.now() - cached.fetchedAt < config.ttlMs) {
    return NextResponse.json(
      {
        candles: cached.candles,
        source: "coingecko",
        pair: `${base}/${quote}`,
        interval,
        cached: true,
        updatedAt: cached.fetchedAt,
      },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${Math.floor(
            config.ttlMs / 1000,
          )}, stale-while-revalidate=${Math.floor((config.ttlMs * 2) / 1000)}`,
        },
      },
    );
  }

  try {
    let pending = INFLIGHT.get(key);
    if (!pending) {
      pending = loadCandles(base, quote, interval).then((result) => {
        if (result.candles.length > 0) {
          CACHE.set(key, {
            candles: result.candles,
            fetchedAt: Date.now(),
          });
        }
        return result.candles;
      });
      INFLIGHT.set(key, pending);
      pending.finally(() => INFLIGHT.delete(key)).catch(() => {});
    }

    const candles = await pending;
    if (candles.length === 0) {
      return NextResponse.json(
        {
          error: "No OHLC history is available for this pair.",
          code: "no_data",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        candles,
        source: "coingecko",
        pair: `${base}/${quote}`,
        interval,
        cached: false,
        updatedAt: Date.now(),
      },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${Math.floor(
            config.ttlMs / 1000,
          )}, stale-while-revalidate=${Math.floor((config.ttlMs * 2) / 1000)}`,
        },
      },
    );
  } catch (error: any) {
    const status = error?.status === 429 ? 429 : 502;
    return NextResponse.json(
      {
        error:
          status === 429
            ? "Market history is rate-limited right now. Please retry shortly."
            : "Real OHLC history is temporarily unavailable. Please retry.",
        code: status === 429 ? "rate_limited" : "upstream_error",
      },
      {
        status,
        headers:
          status === 429
            ? { "Retry-After": "30", "Cache-Control": "no-store" }
            : { "Cache-Control": "no-store" },
      },
    );
  }
}
