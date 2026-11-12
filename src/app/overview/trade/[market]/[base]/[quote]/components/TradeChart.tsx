"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import {
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  LineStyle,
  createChart,
  type CandlestickData,
  type IChartApi,
  type IPriceLine,
  type ISeriesApi,
  type UTCTimestamp,
} from "lightweight-charts";
import { cn } from "@/components/lib/utils";
import type { ChartInterval, MarketCandle } from "@/hooks/useMarketCandles";

export type ChartPriceLine = {
  price: number;
  title: string;
  color: string;
  dashed?: boolean;
};

type TradeChartProps = {
  candles: MarketCandle[];
  interval: ChartInterval;
  onIntervalChange: (interval: ChartInterval) => void;
  loading: boolean;
  refreshing?: boolean;
  error: string | null;
  onRetry: () => void;
  priceLines?: ChartPriceLine[];
  className?: string;
};

const INTERVALS: ChartInterval[] = ["30m", "1h", "4h", "1d"];

function pricePrecision(price: number) {
  if (!price) return 2;
  if (price >= 100) return 2;
  if (price >= 1) return 3;
  if (price >= 0.01) return 5;
  return 7;
}

function formatPrice(price: number, precision: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(price);
}

export default function TradeChart({
  candles,
  interval,
  onIntervalChange,
  loading,
  refreshing,
  error,
  onRetry,
  priceLines = [],
  className,
}: TradeChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const linesRef = useRef<IPriceLine[]>([]);
  const lastIntervalRef = useRef<ChartInterval | null>(null);
  const lastLengthRef = useRef(0);
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  const [hovered, setHovered] = useState<MarketCandle | null>(null);

  const precision = useMemo(() => {
    const last = candles[candles.length - 1]?.close ?? 0;
    return pricePrecision(last);
  }, [candles]);

  const activeCandle = hovered ?? candles[candles.length - 1] ?? null;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: dark ? "rgb(152 162 155)" : "rgb(92 102 94)",
        fontFamily: "Manrope, sans-serif",
        fontSize: 11,
      },
      grid: {
        vertLines: {
          color: dark ? "rgba(34, 46, 39, 0.55)" : "rgba(228, 233, 227, 0.8)",
        },
        horzLines: {
          color: dark ? "rgba(34, 46, 39, 0.55)" : "rgba(228, 233, 227, 0.8)",
        },
      },
      rightPriceScale: {
        borderColor: dark ? "rgb(34 46 39)" : "rgb(228 233 227)",
        scaleMargins: { top: 0.08, bottom: 0.08 },
      },
      timeScale: {
        borderColor: dark ? "rgb(34 46 39)" : "rgb(228 233 227)",
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 4,
        barSpacing: 8,
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: dark ? "rgba(160, 234, 130, 0.45)" : "rgba(62, 155, 47, 0.4)",
          style: LineStyle.Dashed,
          labelBackgroundColor: dark ? "#203028" : "#e4ebe3",
        },
        horzLine: {
          color: dark ? "rgba(160, 234, 130, 0.45)" : "rgba(62, 155, 47, 0.4)",
          style: LineStyle.Dashed,
          labelBackgroundColor: dark ? "#203028" : "#e4ebe3",
        },
      },
      handleScale: true,
      handleScroll: true,
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: dark ? "#8ee06d" : "#2f9e44",
      downColor: "#e05a5a",
      borderVisible: false,
      wickUpColor: dark ? "#8ee06d" : "#2f9e44",
      wickDownColor: "#e05a5a",
      priceLineColor: dark ? "#a0ea82" : "#3e9b2f",
      priceLineStyle: LineStyle.Dotted,
    });

    chartRef.current = chart;
    seriesRef.current = series;

    const onCrosshair = (param: any) => {
      if (!param?.seriesData || !seriesRef.current) {
        setHovered(null);
        return;
      }
      const data = param.seriesData.get(seriesRef.current) as
        | CandlestickData<UTCTimestamp>
        | undefined;
      if (!data || data.open === undefined) {
        setHovered(null);
        return;
      }
      setHovered({
        time: Number(data.time) * 1000,
        open: data.open,
        high: data.high,
        low: data.low,
        close: data.close,
      });
    };
    chart.subscribeCrosshairMove(onCrosshair);

    return () => {
      chart.unsubscribeCrosshairMove(onCrosshair);
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
      linesRef.current = [];
    };
  }, []);

  useEffect(() => {
    const chart = chartRef.current;
    const series = seriesRef.current;
    if (!chart || !series) return;

    chart.applyOptions({
      layout: {
        textColor: dark ? "rgb(152 162 155)" : "rgb(92 102 94)",
      },
      grid: {
        vertLines: {
          color: dark ? "rgba(34, 46, 39, 0.55)" : "rgba(228, 233, 227, 0.8)",
        },
        horzLines: {
          color: dark ? "rgba(34, 46, 39, 0.55)" : "rgba(228, 233, 227, 0.8)",
        },
      },
      rightPriceScale: {
        borderColor: dark ? "rgb(34 46 39)" : "rgb(228 233 227)",
      },
      timeScale: {
        borderColor: dark ? "rgb(34 46 39)" : "rgb(228 233 227)",
      },
      crosshair: {
        vertLine: {
          color: dark ? "rgba(160, 234, 130, 0.45)" : "rgba(62, 155, 47, 0.4)",
          labelBackgroundColor: dark ? "#203028" : "#e4ebe3",
        },
        horzLine: {
          color: dark ? "rgba(160, 234, 130, 0.45)" : "rgba(62, 155, 47, 0.4)",
          labelBackgroundColor: dark ? "#203028" : "#e4ebe3",
        },
      },
    });
    series.applyOptions({
      upColor: dark ? "#8ee06d" : "#2f9e44",
      downColor: "#e05a5a",
      wickUpColor: dark ? "#8ee06d" : "#2f9e44",
      wickDownColor: "#e05a5a",
      priceLineColor: dark ? "#a0ea82" : "#3e9b2f",
    });
  }, [dark]);

  useEffect(() => {
    const chart = chartRef.current;
    const series = seriesRef.current;
    if (!chart || !series) return;

    const data = candles
      .map((candle) => ({
        time: Math.floor(candle.time / 1000) as UTCTimestamp,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      }))
      .sort((a, b) => Number(a.time) - Number(b.time));

    series.setData(data);
    series.applyOptions({
      priceFormat: {
        type: "price",
        precision,
        minMove: 1 / 10 ** precision,
      },
    });

    const intervalChanged = lastIntervalRef.current !== interval;
    if (
      intervalChanged ||
      Math.abs(candles.length - lastLengthRef.current) > 1
    ) {
      chart.timeScale().fitContent();
      lastIntervalRef.current = interval;
    }
    lastLengthRef.current = candles.length;
  }, [candles, interval, precision]);

  useEffect(() => {
    const series = seriesRef.current;
    if (!series) return;
    for (const line of linesRef.current) {
      try {
        series.removePriceLine(line);
      } catch {
        // The series may have been recreated by a theme change.
      }
    }
    linesRef.current = priceLines.map((line) =>
      series.createPriceLine({
        price: line.price,
        color: line.color,
        lineWidth: 1,
        lineStyle: line.dashed ? LineStyle.Dashed : LineStyle.Solid,
        axisLabelVisible: true,
        title: line.title,
      }),
    );
  }, [priceLines, dark, candles.length]);

  return (
    <div className={cn("flex min-h-0 flex-col", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-lnd-border px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-full bg-lnd-surface-2 p-0.5">
            {INTERVALS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => onIntervalChange(value)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wide transition-colors",
                  interval === value
                    ? "bg-lnd-accent/15 text-lnd-accent"
                    : "text-lnd-fg-muted hover:text-lnd-fg",
                )}
              >
                {value}
              </button>
            ))}
          </div>
          <span className="flex items-center gap-1.5 text-[0.66rem] font-medium uppercase tracking-[0.14em] text-lnd-fg-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Real OHLC · CoinGecko
          </span>
        </div>
        {activeCandle ? (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.68rem] text-lnd-fg-muted">
            <span>
              O <span className="text-lnd-fg">{formatPrice(activeCandle.open, precision)}</span>
            </span>
            <span>
              H <span className="text-lnd-fg">{formatPrice(activeCandle.high, precision)}</span>
            </span>
            <span>
              L <span className="text-lnd-fg">{formatPrice(activeCandle.low, precision)}</span>
            </span>
            <span>
              C <span className="text-lnd-fg">{formatPrice(activeCandle.close, precision)}</span>
            </span>
            {refreshing ? (
              <span className="text-lnd-accent/70">updating…</span>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="relative min-h-[300px] flex-1">
        <div
          ref={containerRef}
          className="absolute inset-0 h-full w-full"
          aria-label="Real OHLC candlestick chart"
        />

        {loading && candles.length === 0 ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-lnd-surface/70 backdrop-blur-[1px]">
            <div className="flex flex-col items-center gap-3">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-lnd-accent/30 border-t-lnd-accent" />
              <span className="text-[0.78rem] text-lnd-fg-muted">
                Loading real OHLC history…
              </span>
            </div>
          </div>
        ) : null}

        {error && candles.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center bg-lnd-surface px-6">
            <div className="flex max-w-sm flex-col items-center gap-3 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-lnd-surface-2 text-lnd-fg-muted">
                !
              </span>
              <p className="text-[0.86rem] font-medium text-lnd-fg">
                Chart temporarily unavailable
              </p>
              <p className="text-[0.76rem] leading-relaxed text-lnd-fg-muted">
                {error} Real candles are never replaced with generated data.
              </p>
              <button
                type="button"
                onClick={onRetry}
                className="lnd-btn-accent px-4 py-2 text-[0.76rem]"
              >
                Retry
              </button>
            </div>
          </div>
        ) : null}

        {error && candles.length > 0 ? (
          <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-[0.72rem] text-amber-700 dark:text-amber-300">
            <span>{error} Showing the last real candles.</span>
            <button type="button" onClick={onRetry} className="font-semibold underline">
              Retry
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
