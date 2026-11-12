"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type MarketCandle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

export type ChartInterval = "30m" | "1h" | "4h" | "1d";

type CandleResponse = {
  candles?: MarketCandle[];
  error?: string;
  code?: string;
};

export function useMarketCandles(args: {
  base: string;
  quote: string;
  interval: ChartInterval;
}) {
  const { base, quote, interval } = args;
  const [candles, setCandles] = useState<MarketCandle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);
  const requestId = useRef(0);
  const hasData = useRef(false);

  const load = useCallback(
    async (mode: "initial" | "refresh" = "initial") => {
      const id = ++requestId.current;
      if (mode === "initial") {
        setLoading(true);
        setCandles([]);
        hasData.current = false;
      } else {
        setRefreshing(true);
      }
      setError(null);

      try {
        const params = new URLSearchParams({
          base,
          quote,
          interval,
        });
        const response = await fetch(`/api/market/candles?${params.toString()}`, {
          cache: "no-store",
        });
        const body = (await response.json().catch(() => ({}))) as CandleResponse;

        if (id !== requestId.current) return;
        if (!response.ok || !body.candles?.length) {
          setCandles([]);
          hasData.current = false;
          setError(
            body.error ??
              "Real OHLC history is temporarily unavailable. Please retry.",
          );
          return;
        }

        setCandles(body.candles);
        hasData.current = true;
        setUpdatedAt(Date.now());
      } catch {
        if (id !== requestId.current) return;
        if (!hasData.current) setCandles([]);
        setError(
          "Could not reach the market history service. Check your connection and retry.",
        );
      } finally {
        if (id === requestId.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [base, quote, interval],
  );

  useEffect(() => {
    void load("initial");
    const pollMs =
      interval === "30m" || interval === "1h" ? 60_000 : 5 * 60_000;
    const timer = window.setInterval(() => {
      void load("refresh");
    }, pollMs);
    return () => {
      requestId.current += 1;
      window.clearInterval(timer);
    };
  }, [load, interval]);

  return {
    candles,
    loading,
    refreshing,
    error,
    updatedAt,
    retry: () => load(hasData.current ? "refresh" : "initial"),
  };
}
