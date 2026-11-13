"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Activity, ArrowRight, Sparkles } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import useCryptoList from "@/hooks/useCryptoData";
import type { CryptoCurrency } from "@/lib/types";
import { useMarketCandles, type ChartInterval } from "@/hooks/useMarketCandles";
import PairHeader from "./components/PairHeader";
import TradeChart, { type ChartPriceLine } from "./components/TradeChart";
import OrderPanel from "./components/OrderPanel";
import PlanCard from "./components/PlanCard";
import CancelPlanDialog from "./components/CancelPlanDialog";
import PositionsTables from "./components/PositionsTables";
import PlanHistoryTable from "./components/PlanHistoryTable";
import type { Market, TerminalData, TradePlanDoc } from "./types";

const VALID_MARKETS: Market[] = ["spot", "margin", "futures"];
const STABLE_QUOTES = new Set(["USDT", "USDC"]);

export default function TradeTerminalPage() {
  const params = useParams();
  const rawMarket = String(params.market ?? "").toLowerCase();
  const market = (VALID_MARKETS.includes(rawMarket as Market)
    ? rawMarket
    : "spot") as Market;
  const base = String(params.base ?? "BTC").toUpperCase();
  const quote = String(params.quote ?? "USDT").toUpperCase();

  const [chartInterval, setChartInterval] = useState<ChartInterval>("1h");
  const [now, setNow] = useState(() => Date.now());
  const [cancelPlan, setCancelPlan] = useState<TradePlanDoc | null>(null);

  const { data: cryptoData } = useCryptoList();
  const coins = cryptoData?.data?.data ?? [];
  const baseCoin = coins.find(
    (coin: CryptoCurrency) => coin.symbol?.toUpperCase() === base,
  );
  const quoteCoin = coins.find(
    (coin: CryptoCurrency) => coin.symbol?.toUpperCase() === quote,
  );
  const basePrice = baseCoin?.quote?.USD?.price;
  const quotePrice = quoteCoin?.quote?.USD?.price ?? 1;
  const price =
    basePrice && quotePrice ? basePrice / quotePrice : undefined;
  const baseChange = baseCoin?.quote?.USD?.percent_change_24h ?? 0;
  const quoteChange = quoteCoin?.quote?.USD?.percent_change_24h ?? 0;
  const change24h =
    quoteCoin !== undefined
      ? ((1 + baseChange / 100) / (1 + quoteChange / 100) - 1) * 100
      : baseChange;

  const {
    candles,
    loading: candlesLoading,
    refreshing,
    error: candlesError,
    retry: retryCandles,
  } = useMarketCandles({ base, quote, interval: chartInterval });

  const terminal = useQuery(api.trading.terminal_data, {
    market,
    base,
    quote,
  }) as TerminalData | undefined;
  const plans = terminal?.plans ?? [];
  const activePlans = terminal?.activePlans ?? [];

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setChartInterval("1h");
  }, [base, quote]);

  const stats24h = useMemo(() => {
    if (candles.length === 0) return { high: undefined, low: undefined };
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    const recent = candles.filter((candle) => candle.time >= cutoff);
    const source = recent.length > 0 ? recent : candles;
    return {
      high: Math.max(...source.map((candle) => candle.high)),
      low: Math.min(...source.map((candle) => candle.low)),
    };
  }, [candles]);

  const priceLines = useMemo<ChartPriceLine[]>(() => {
    const latest = activePlans[0];
    if (!latest) return [];
    const lines: ChartPriceLine[] = [
      {
        price: latest.reference_price,
        title: `${latest.side} entry`,
        color: latest.side === "sell" || latest.side === "short" ? "#e05a5a" : "#3e9b2f",
        dashed: true,
      },
    ];
    if (latest.market !== "spot") {
      const liquidation =
        latest.side === "long" || latest.side === "buy"
          ? latest.reference_price * (1 - 0.9 / Math.max(1, latest.leverage))
          : latest.reference_price * (1 + 0.9 / Math.max(1, latest.leverage));
      lines.push({
        price: liquidation,
        title: "liq.",
        color: "#e05a5a",
        dashed: true,
      });
    }
    return lines;
  }, [activePlans]);

  const scrollToPlans = () => {
    window.setTimeout(() => {
      document
        .getElementById("active-plans")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 500);
  };

  if (!VALID_MARKETS.includes(rawMarket as Market)) {
    return (
      <div className="db-card p-6">
        <p className="db-eyebrow">Trade</p>
        <h1 className="db-title mt-1">Unsupported market</h1>
        <p className="mt-2 text-[0.8rem] text-lnd-fg-muted">
          Choose spot, margin or futures to continue.
        </p>
        <Link
          href="/overview/trade/spot/BTC/USDT"
          className="lnd-btn-accent mt-4 inline-flex px-4 py-2 text-[0.76rem]"
        >
          Open BTC/USDT spot terminal
        </Link>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-5">
      <PairHeader
        market={market}
        base={base}
        quote={quote}
        icon={
          baseCoin
            ? `https://s2.coinmarketcap.com/static/img/coins/64x64/${baseCoin.id}.png`
            : undefined
        }
        price={price}
        change24h={change24h}
        high24h={stats24h.high}
        low24h={stats24h.low}
        volume24h={baseCoin?.quote?.USD?.volume_24h}
        marketCap={baseCoin?.quote?.USD?.market_cap}
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_310px] lg:items-start xl:grid-cols-[minmax(0,1fr)_370px]">
        <section className="db-card min-w-0 self-start overflow-hidden lg:col-start-1 lg:row-start-1">
          <TradeChart
            candles={candles}
            interval={chartInterval}
            onIntervalChange={setChartInterval}
            loading={candlesLoading}
            refreshing={refreshing}
            error={candlesError}
            onRetry={retryCandles}
            priceLines={priceLines}
            className="h-[clamp(260px,42dvh,440px)]"
          />
        </section>

        <div className="min-w-0 self-start lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="lg:sticky lg:top-20">
            {STABLE_QUOTES.has(quote) ? (
              <OrderPanel
                market={market}
                base={base}
                quote={quote}
                price={price}
                available={terminal?.available ?? 0}
                onCreated={scrollToPlans}
              />
            ) : (
              <section className="db-card space-y-4 p-5">
                <div>
                  <p className="db-eyebrow">Trade</p>
                  <h2 className="db-section-title mt-1">Stablecoin settlement</h2>
                </div>
                <p className="text-[0.78rem] leading-relaxed text-lnd-fg-muted">
                  This cross pair uses {quote} as its quote currency. Trading
                  plans are settled in USDT or USDC, so the terminal can show the{" "}
                  {base}/{quote} chart but cannot start a plan on it.
                </p>
                <Link
                  href={`/overview/trade/${market}/${base}/USDT`}
                  className="lnd-btn-accent inline-flex items-center gap-1.5 px-4 py-2.5 text-[0.76rem]"
                >
                  Trade {base}/USDT
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </section>
            )}
          </div>
        </div>

        <section
          id="active-plans"
          className="min-w-0 scroll-mt-4 space-y-4 self-start lg:col-start-1 lg:row-start-2"
        >
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="db-eyebrow">Active plans</p>
                <h2 className="db-section-title mt-1">7-day cycle progress</h2>
              </div>
              {activePlans.length > 0 ? (
                <span className="flex items-center gap-1.5 rounded-full bg-lnd-accent/10 px-2.5 py-1 text-[0.66rem] font-semibold text-lnd-accent">
                  <Activity className="h-3.5 w-3.5" />
                  {activePlans.length} running
                </span>
              ) : null}
            </div>

            {activePlans.length > 0 ? (
              activePlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  now={now}
                  onCancel={(selected) => setCancelPlan(selected)}
                />
              ))
            ) : (
              <div className="db-card flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <span className="db-icon-tile">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-Manrope text-[0.95rem] font-bold text-lnd-fg">
                      No active plan on {base}/{quote}
                    </h3>
                    <p className="mt-1 max-w-xl text-[0.76rem] leading-relaxed text-lnd-fg-muted">
                      Start a 7-day plan from the order panel. Each day targets
                      27–30% of the committed amount, and you can cancel at any
                      time.
                    </p>
                  </div>
                </div>
                {terminal && terminal.available < 10 ? (
                  <Link
                    href={
                      market === "spot"
                        ? "/overview/spot/deposit"
                        : market === "margin"
                          ? "/overview/margin/assets"
                          : "/overview/futures"
                    }
                    className="lnd-btn-ghost inline-flex items-center gap-1.5 px-3 py-2 text-[0.72rem]"
                  >
                    Add funds
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ) : null}
              </div>
            )}
          </section>
      </div>

      <PositionsTables plans={plans} now={now} />
      <PlanHistoryTable plans={plans.filter((plan) => plan.status !== "active")} />

      <CancelPlanDialog
        plan={cancelPlan}
        open={Boolean(cancelPlan)}
        onOpenChange={(open) => {
          if (!open) setCancelPlan(null);
        }}
        onCancelled={() => setCancelPlan(null)}
      />
    </div>
  );
}
