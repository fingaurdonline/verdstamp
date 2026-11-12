/**
 * Pure simulation math for 7-day trading plans.
 *
 * A plan always lasts seven days. Each day samples a fresh rate between
 * 27.00% and 30.00% of the original principal (simple, never compounded) and
 * splits that day's target across three or four sequential sub-trades. Every
 * day contains at least one winner and one loser, and the sub-trade results sum
 * exactly to the sampled daily target.
 */

export const PLAN_DURATION_DAYS = 7;
export const DAILY_RATE_MIN = 0.27;
export const DAILY_RATE_MAX = 0.3;
export const DAY_MS = 24 * 60 * 60 * 1000;
export const TRADES_PER_DAY_MIN = 3;
export const TRADES_PER_DAY_MAX = 4;

export type Market = "spot" | "margin" | "futures";
export type PlanSide = "buy" | "sell" | "long" | "short";

export const FEE_RATES: Record<Market, number> = {
  spot: 0.001,
  margin: 0.0008,
  futures: 0.0006,
};

export const MARGIN_DAILY_INTEREST_RATE = 0.0002;

export type DailyTarget = {
  day: number;
  rate: number;
  profit: number;
};

export type SimulatedTrade = {
  day: number;
  sequence: number;
  scheduledOpenAt: number;
  scheduledCloseAt: number;
  plannedPnl: number;
  plannedPnlRate: number;
  isWin: boolean;
  side: PlanSide;
  entryPrice: number;
  exitPrice: number;
  liquidationPrice?: number;
  feeStandard: number;
  feeDiscounted: number;
  feeSavings: number;
  interestStandard: number;
  interestDiscounted: number;
  interestSavings: number;
  grossPnl: number;
  netPnl: number;
};

export type PlanSimulation = {
  dailyTargets: DailyTarget[];
  weeklyTargetProfit: number;
  trades: SimulatedTrade[];
  totalExecutions: number;
  feeStandardTotal: number;
  feeDiscountedTotal: number;
  feeSavingsTotal: number;
  interestStandardTotal: number;
  interestDiscountedTotal: number;
  interestSavingsTotal: number;
  voucherSavingsTotal: number;
};

export function round2(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function round8(value: number) {
  return Math.round((value + Number.EPSILON) * 1e8) / 1e8;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Small deterministic PRNG so stored schedules can be reproduced from a seed. */
export function createRng(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sampleDailyTargets(principal: number, rng: () => number): DailyTarget[] {
  const minProfit = Math.ceil(principal * DAILY_RATE_MIN * 100) / 100;
  const maxProfit = Math.floor(principal * DAILY_RATE_MAX * 100) / 100;

  return Array.from({ length: PLAN_DURATION_DAYS }, (_, index) => {
    const sampledRate = DAILY_RATE_MIN + rng() * (DAILY_RATE_MAX - DAILY_RATE_MIN);
    const sampledProfit = round2(principal * sampledRate);
    const profit = clamp(sampledProfit, minProfit, maxProfit);
    return {
      day: index + 1,
      rate: principal > 0 ? profit / principal : sampledRate,
      profit,
    };
  });
}

type DayOutcome = {
  pnl: number;
  isWin: boolean;
};

function buildDayOutcomes(
  principal: number,
  dailyProfit: number,
  rng: () => number,
): DayOutcome[] {
  const count =
    rng() < 0.5 ? TRADES_PER_DAY_MIN : TRADES_PER_DAY_MAX;
  const lossCount = count === TRADES_PER_DAY_MAX && rng() < 0.35 ? 2 : 1;
  const winCount = count - lossCount;

  const outcomes: DayOutcome[] = [];

  for (let i = 0; i < lossCount; i++) {
    const lossRate = 0.035 + rng() * 0.045;
    outcomes.push({ pnl: -round2(principal * lossRate), isWin: false });
  }

  const lossTotal = outcomes.reduce((sum, item) => sum + Math.abs(item.pnl), 0);
  const winsTotalNeeded = round2(dailyProfit + lossTotal);
  const weights = Array.from({ length: winCount }, () => 0.6 + rng() * 0.8);
  const weightTotal = weights.reduce((sum, weight) => sum + weight, 0);

  let allocated = 0;
  for (let i = 0; i < winCount; i++) {
    const isLast = i === winCount - 1;
    const pnl = isLast
      ? round2(winsTotalNeeded - allocated)
      : round2((weights[i] / weightTotal) * winsTotalNeeded);
    allocated = round2(allocated + pnl);
    outcomes.push({ pnl, isWin: pnl >= 0 });
  }

  // Shuffle so wins and losses are interleaved rather than grouped.
  for (let i = outcomes.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [outcomes[i], outcomes[j]] = [outcomes[j], outcomes[i]];
  }

  const total = round2(outcomes.reduce((sum, item) => sum + item.pnl, 0));
  const diff = round2(dailyProfit - total);
  if (diff !== 0) {
    const winner = outcomes.find((item) => item.isWin);
    if (winner) {
      winner.pnl = round2(winner.pnl + diff);
    }
  }

  return outcomes;
}

function planDirection(side: PlanSide) {
  return side === "buy" || side === "long" ? 1 : -1;
}

function oppositeSide(side: PlanSide): PlanSide {
  if (side === "buy") return "sell";
  if (side === "sell") return "buy";
  if (side === "long") return "short";
  return "long";
}

export function generatePlanSimulation(args: {
  principal: number;
  side: PlanSide;
  market: Market;
  referencePrice: number;
  leverage: number;
  startAt: number;
  seed: number;
  feeDiscountPercent?: number;
  interestDiscountPercent?: number;
}): PlanSimulation {
  const {
    principal,
    side,
    market,
    referencePrice,
    leverage,
    startAt,
    seed,
    feeDiscountPercent = 0,
    interestDiscountPercent = 0,
  } = args;

  const rng = createRng(seed);
  const dailyTargets = sampleDailyTargets(principal, rng);
  const weeklyTargetProfit = round2(
    dailyTargets.reduce((sum, target) => sum + target.profit, 0),
  );

  const feeRate = FEE_RATES[market];
  const feeStandardPerTrade = round2(principal * feeRate);
  const feeDiscount = clamp(feeDiscountPercent, 0, 100) / 100;
  const feeDiscountedPerTrade = round2(
    feeStandardPerTrade * (1 - feeDiscount),
  );
  const feeSavingsPerTrade = round2(
    feeStandardPerTrade - feeDiscountedPerTrade,
  );

  const interestDailyStandard =
    market === "margin" ? round2(principal * MARGIN_DAILY_INTEREST_RATE) : 0;
  const interestDiscount = clamp(interestDiscountPercent, 0, 100) / 100;

  const trades: SimulatedTrade[] = [];
  const direction = planDirection(side);
  const effectiveLeverage = Math.max(1, leverage || 1);
  let sequence = 0;

  for (const target of dailyTargets) {
    const dayStart = startAt + (target.day - 1) * DAY_MS;
    const outcomes = buildDayOutcomes(principal, target.profit, rng);

    const count = outcomes.length;
    const slot = DAY_MS / count;
    const interestStandardPerTrade =
      interestDailyStandard > 0 ? round2(interestDailyStandard / count) : 0;
    const interestDiscountedPerTrade = round2(
      interestStandardPerTrade * (1 - interestDiscount),
    );
    const interestSavingsPerTrade = round2(
      interestStandardPerTrade - interestDiscountedPerTrade,
    );

    let interestAllocated = 0;

    outcomes.forEach((outcome, index) => {
      sequence += 1;
      const isLast = index === count - 1;
      const interestStandard = isLast
        ? round2(interestDailyStandard - interestAllocated)
        : interestStandardPerTrade;
      interestAllocated = round2(interestAllocated + interestStandard);

      const proposedInterestDiscounted = isLast
        ? round2(interestStandard * (1 - interestDiscount))
        : interestDiscountedPerTrade;
      const interestSavings = round2(
        interestStandard - proposedInterestDiscounted,
      );

      const openJitter = slot * 0.25;
      const proposedOpen =
        dayStart + index * slot + Math.floor(rng() * openJitter);
      const maxDuration = Math.max(
        5 * 60 * 1000,
        Math.min(75 * 60 * 1000, slot * 0.55),
      );
      const duration =
        15 * 60 * 1000 +
        Math.floor(rng() * (maxDuration - 15 * 60 * 1000));
      const latestClose = Math.min(
        dayStart + (index + 1) * slot - 60 * 1000,
        startAt + PLAN_DURATION_DAYS * DAY_MS - 1000,
      );
      const scheduledOpenAt = proposedOpen;
      const scheduledCloseAt = Math.max(
        scheduledOpenAt + 5 * 60 * 1000,
        Math.min(scheduledOpenAt + duration, latestClose),
      );

      const entryJitter = (rng() - 0.5) * 0.003;
      const entryPrice = round8(referencePrice * (1 + entryJitter));
      const priceMove =
        referencePrice > 0
          ? Math.abs(outcome.pnl) / (principal * effectiveLeverage)
          : 0;
      const moveDirection = outcome.isWin ? direction : -direction;
      const exitPrice = round8(entryPrice * (1 + moveDirection * priceMove));

      const liquidationPrice =
        market === "spot"
          ? undefined
          : round8(
              entryPrice *
                (direction === 1
                  ? 1 - 0.9 / effectiveLeverage
                  : 1 + 0.9 / effectiveLeverage),
            );

      const grossPnl = round2(
        outcome.pnl + feeStandardPerTrade + interestStandard,
      );
      const netPnl = round2(
        outcome.pnl + feeSavingsPerTrade + interestSavings,
      );

      trades.push({
        day: target.day,
        sequence,
        scheduledOpenAt,
        scheduledCloseAt,
        plannedPnl: outcome.pnl,
        plannedPnlRate: principal > 0 ? outcome.pnl / principal : 0,
        isWin: outcome.isWin,
        side: outcome.isWin ? side : oppositeSide(side),
        entryPrice,
        exitPrice,
        liquidationPrice,
        feeStandard: feeStandardPerTrade,
        feeDiscounted: feeDiscountedPerTrade,
        feeSavings: feeSavingsPerTrade,
        interestStandard,
        interestDiscounted: proposedInterestDiscounted,
        interestSavings,
        grossPnl,
        netPnl,
      });
    });
  }

  const sum = (key: keyof SimulatedTrade) =>
    round2(
      trades.reduce((total, trade) => {
        const value = trade[key];
        return total + (typeof value === "number" ? value : 0);
      }, 0),
    );

  const feeStandardTotal = sum("feeStandard");
  const feeDiscountedTotal = sum("feeDiscounted");
  const feeSavingsTotal = round2(feeStandardTotal - feeDiscountedTotal);
  const interestStandardTotal = sum("interestStandard");
  const interestDiscountedTotal = sum("interestDiscounted");
  const interestSavingsTotal = round2(
    interestStandardTotal - interestDiscountedTotal,
  );

  return {
    dailyTargets,
    weeklyTargetProfit,
    trades,
    totalExecutions: trades.length,
    feeStandardTotal,
    feeDiscountedTotal,
    feeSavingsTotal,
    interestStandardTotal,
    interestDiscountedTotal,
    interestSavingsTotal,
    voucherSavingsTotal: round2(feeSavingsTotal + interestSavingsTotal),
  };
}

/** Mark-to-market fraction for an open execution, clamped to 0..1. */
export function executionProgress(
  openedAt: number,
  scheduledCloseAt: number,
  now = Date.now(),
) {
  if (!openedAt || scheduledCloseAt <= openedAt) return 0;
  return clamp((now - openedAt) / (scheduledCloseAt - openedAt), 0, 1);
}

export function cancellationMark(
  trade: { opened_at?: number; scheduled_close_at?: number; net_pnl?: number },
  now = Date.now(),
) {
  if (!trade.opened_at || !trade.scheduled_close_at) return 0;
  return round2(
    (trade.net_pnl ?? 0) *
      executionProgress(trade.opened_at, trade.scheduled_close_at, now),
  );
}
