import { v } from "convex/values";
import {
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { requireUserDoc } from "./helpers";
import {
  lockPrincipal,
  settleResult,
  unlockPrincipal,
  getAvailableBalance,
  isStableQuote,
} from "./accountOps";
import {
  generatePlanSimulation,
  PLAN_DURATION_DAYS,
  DAY_MS,
  cancellationMark,
  round2,
  type Market,
} from "./simulation";

const marketValidator = v.union(
  v.literal("spot"),
  v.literal("margin"),
  v.literal("futures"),
);

const sideValidator = v.union(
  v.literal("buy"),
  v.literal("sell"),
  v.literal("long"),
  v.literal("short"),
);

function nowIso() {
  return new Date().toISOString();
}

async function pushMessage(
  ctx: any,
  userId: string,
  title: string,
  description: string,
) {
  await ctx.db.insert("messages", {
    userId,
    title,
    header: "Trading Notice",
    description,
    read: false,
    createdAt: Date.now(),
  });
}

async function tradePlanTrades(ctx: any, planId: any) {
  return await ctx.db
    .query("trades")
    .withIndex("by_plan", (q: any) => q.eq("plan_id", planId))
    .collect();
}

function sortTrades(trades: any[]) {
  return [...trades].sort(
    (a, b) => (a.sequence ?? 0) - (b.sequence ?? 0),
  );
}

async function closePlanTrade(
  ctx: any,
  args: {
    trade: any;
    plan: any;
    pnl: number;
    closeReason: string;
    closedAt: number;
  },
) {
  const { trade, plan, closeReason, closedAt } = args;
  const pnl = round2(args.pnl);
  const lossAbsorbed =
    pnl < 0 ? Math.min(Math.abs(pnl), Math.max(0, plan.remaining_principal)) : 0;

  await settleResult(ctx, {
    userId: plan.user,
    market: plan.market,
    base: plan.base,
    quote: plan.quote,
    pnl,
    lossAbsorb: lossAbsorbed,
  });

  await ctx.db.patch(trade._id, {
    status: "closed",
    opened_at: trade.opened_at ?? trade.scheduled_open_at ?? closedAt,
    closed_at: closedAt,
    realized_pnl: pnl,
    realized_pnl_rate:
      plan.principal > 0 ? pnl / plan.principal : 0,
    income: pnl,
    rate:
      plan.principal > 0 ? (pnl / plan.principal) * 100 : 0,
    close_reason: closeReason,
    ended: new Date(closedAt).toISOString(),
  });

  const nextPlan = {
    realized_pnl: round2((plan.realized_pnl ?? 0) + pnl),
    completed_count: (plan.completed_count ?? 0) + 1,
    remaining_principal: round2(
      Math.max(0, (plan.remaining_principal ?? 0) - lossAbsorbed),
    ),
  };
  await ctx.db.patch(plan._id, nextPlan);

  return { pnl, lossAbsorbed, nextPlan };
}

export const create_trade_plan = mutation({
  args: {
    market: marketValidator,
    base: v.string(),
    quote: v.string(),
    side: sideValidator,
    order_type: v.union(v.literal("market"), v.literal("limit")),
    limit_price: v.optional(v.number()),
    leverage: v.optional(v.number()),
    margin_mode: v.optional(v.string()),
    amount: v.number(),
    reference_price: v.number(),
    userVoucherId: v.optional(v.id("user_vouchers")),
  },
  handler: async (ctx, args) => {
    const userDoc = await requireUserDoc(ctx);
    const userId = userDoc.userId as string;
    if (!userId) throw new Error("User not found.");

    const market = args.market as Market;
    const base = args.base.trim().toUpperCase();
    const quote = args.quote.trim().toUpperCase();
    const amount = round2(args.amount);

    if (!base || !quote) throw new Error("Choose a trading pair.");
    if (amount < 10) throw new Error("The minimum plan amount is $10.");
    if (!isStableQuote(quote)) {
      throw new Error(
        "Trading plans are settled in USDT or USDC. Switch to a stablecoin pair to start a plan.",
      );
    }

    const isSpot = market === "spot";
    if (isSpot && args.side !== "buy" && args.side !== "sell") {
      throw new Error("Spot plans require a buy or sell direction.");
    }
    if (!isSpot && args.side !== "long" && args.side !== "short") {
      throw new Error("Margin and futures plans require long or short.");
    }

    const leverage = isSpot
      ? 1
      : Math.max(1, Math.min(125, Math.round(args.leverage ?? 1)));
    const referencePrice = args.reference_price;
    if (!referencePrice || referencePrice <= 0) {
      throw new Error("A live reference price is required.");
    }
    if (args.order_type === "limit" && (!args.limit_price || args.limit_price <= 0)) {
      throw new Error("Enter a valid limit price.");
    }

    const available = await getAvailableBalance(ctx, {
      userId,
      market,
      base,
      quote,
    });
    if (available + 0.000001 < amount) {
      throw new Error(
        `Insufficient available balance. You have $${available.toFixed(
          2,
        )} available in ${market}.`,
      );
    }

    let voucher: any = null;
    let userVoucher: any = null;
    let feeDiscountPercent = 0;
    let interestDiscountPercent = 0;
    let voucherId: any = undefined;

    if (args.userVoucherId) {
      userVoucher = await ctx.db.get(args.userVoucherId);
      if (!userVoucher || userVoucher.user !== userId) {
        throw new Error("Voucher not found.");
      }
      if (userVoucher.status !== "active") {
        throw new Error("Activate this voucher before using it on a plan.");
      }
      const now = Date.now();
      if (
        (userVoucher.expires_at !== undefined &&
          userVoucher.expires_at <= now) ||
        userVoucher.status === "expired"
      ) {
        throw new Error("This voucher has expired.");
      }

      voucher = await ctx.db.get(userVoucher.voucher_id);
      if (
        !voucher ||
        voucher.status !== "active" ||
        voucher.expires_at <= now
      ) {
        throw new Error("This voucher is no longer active.");
      }
      if (voucher.type === "bonus") {
        throw new Error("Bonus vouchers are credited directly, not applied to a plan.");
      }
      if (
        !voucher.applicable_markets.includes(market) &&
        !voucher.applicable_markets.includes("all")
      ) {
        throw new Error("This voucher does not apply to the selected market.");
      }
      if (
        voucher.min_trade_amount !== undefined &&
        amount < voucher.min_trade_amount
      ) {
        throw new Error(
          `This voucher requires a minimum plan of $${voucher.min_trade_amount}.`,
        );
      }

      if (voucher.type === "fee_discount") {
        feeDiscountPercent = voucher.value;
      } else if (voucher.type === "margin_interest") {
        if (market !== "margin") {
          throw new Error("This voucher only applies to margin plans.");
        }
        interestDiscountPercent = voucher.value;
      }
      voucherId = userVoucher._id;
    }

    const seed = Math.floor(Math.random() * 0x7fffffff) + 1;
    const startedAt = Date.now();
    const endsAt = startedAt + PLAN_DURATION_DAYS * DAY_MS;

    const simulation = generatePlanSimulation({
      principal: amount,
      side: args.side,
      market,
      referencePrice,
      leverage,
      startAt: startedAt,
      seed,
      feeDiscountPercent,
      interestDiscountPercent,
    });

    let feeSavingsTotal = simulation.feeSavingsTotal;
    let interestSavingsTotal = simulation.interestSavingsTotal;

    // Enforce the voucher's discount cap without changing the base target.
    const capSavings = (
      key: "feeSavings" | "interestSavings",
      cap: number | undefined,
    ) => {
      if (cap === undefined) return;
      const current = round2(
        simulation.trades.reduce((sum, trade) => sum + trade[key], 0),
      );
      if (current <= cap) return;
      const scale = cap / current;
      let allocated = 0;
      simulation.trades.forEach((trade, index) => {
        const isLast = index === simulation.trades.length - 1;
        const next = isLast
          ? round2(cap - allocated)
          : round2(trade[key] * scale);
        allocated = round2(allocated + next);
        trade[key] = Math.max(0, next);
        trade.netPnl = round2(
          trade.plannedPnl + trade.feeSavings + trade.interestSavings,
        );
      });
    };

    if (voucher) {
      if (voucher.type === "fee_discount") {
        capSavings("feeSavings", voucher.max_discount_amount);
      } else if (voucher.type === "margin_interest") {
        capSavings("interestSavings", voucher.max_discount_amount);
      }
    }

    if (voucher) {
      feeSavingsTotal = round2(
        simulation.trades.reduce((sum, trade) => sum + trade.feeSavings, 0),
      );
      interestSavingsTotal = round2(
        simulation.trades.reduce(
          (sum, trade) => sum + trade.interestSavings,
          0,
        ),
      );
    }

    const feeStandardTotal = simulation.feeStandardTotal;
    const feeDiscountedTotal = round2(
      feeStandardTotal - feeSavingsTotal,
    );
    const interestStandardTotal = simulation.interestStandardTotal;
    const interestDiscountedTotal = round2(
      interestStandardTotal - interestSavingsTotal,
    );
    const voucherSavingsTotal = round2(
      feeSavingsTotal + interestSavingsTotal,
    );

    await lockPrincipal(ctx, {
      userId,
      market,
      base,
      quote,
      amount,
    });

    const cryptoPair = `${base}/${quote}`;
    const planId = await ctx.db.insert("trade_plans", {
      user: userId,
      email: userDoc.email,
      market,
      crypto_pair: cryptoPair,
      base,
      quote,
      side: args.side,
      order_type: args.order_type,
      limit_price: args.limit_price,
      leverage,
      margin_mode: args.margin_mode,
      principal: amount,
      remaining_principal: amount,
      notional: round2(amount * leverage),
      base_quantity:
        referencePrice > 0
          ? round2((amount * leverage) / referencePrice)
          : undefined,
      duration_days: PLAN_DURATION_DAYS,
      daily_targets: simulation.dailyTargets,
      weekly_target_profit: simulation.weeklyTargetProfit,
      realized_pnl: 0,
      execution_count: simulation.totalExecutions,
      completed_count: 0,
      status: "active",
      started_at: startedAt,
      ends_at: endsAt,
      reference_price: referencePrice,
      seed,
      voucher_id: voucherId,
      fee_rate: simulation.feeStandardTotal / Math.max(1, simulation.totalExecutions) / amount,
      fee_standard: feeStandardTotal,
      fee_discounted: feeDiscountedTotal,
      fee_savings: feeSavingsTotal,
      interest_rate: market === "margin" ? 0.0002 : 0,
      interest_standard: interestStandardTotal,
      interest_discounted: interestDiscountedTotal,
      interest_savings: interestSavingsTotal,
      voucher_savings: voucherSavingsTotal,
    });

    for (const trade of simulation.trades) {
      const tradeId = await ctx.db.insert("trades", {
        user: userId,
        email: userDoc.email,
        crypto_pair: cryptoPair,
        amount,
        order: market,
        income: 0,
        status: "pending",
        rate: trade.plannedPnlRate * 100,
        ended: new Date(trade.scheduledCloseAt).toISOString(),
        plan_id: planId,
        sequence: trade.sequence,
        day_index: trade.day,
        side: trade.side,
        entry_price: trade.entryPrice,
        exit_price: trade.exitPrice,
        leverage,
        margin_mode: args.margin_mode,
        scheduled_open_at: trade.scheduledOpenAt,
        scheduled_close_at: trade.scheduledCloseAt,
        planned_pnl: trade.plannedPnl,
        planned_pnl_rate: trade.plannedPnlRate,
        gross_pnl: trade.grossPnl,
        net_pnl: trade.netPnl,
        fee: trade.feeStandard,
        fee_savings: trade.feeSavings,
        interest: trade.interestStandard,
        interest_savings: trade.interestSavings,
        is_win: trade.isWin,
        liquidation_price: trade.liquidationPrice,
      });

      await ctx.scheduler.runAt(
        trade.scheduledOpenAt,
        internal.trading.open_execution,
        { tradeId },
      );
      await ctx.scheduler.runAt(
        trade.scheduledCloseAt,
        internal.trading.close_execution,
        { tradeId },
      );
    }

    await ctx.scheduler.runAt(
      endsAt,
      internal.trading.finalize_plan,
      { planId },
    );

    if (userVoucher && voucher) {
      await ctx.db.patch(userVoucher._id, {
        status: "used",
        used_at: Date.now(),
        used_count: (userVoucher.used_count ?? 0) + 1,
      });
    }

    await pushMessage(
      ctx,
      userId,
      "7-day plan started",
      `Your ${market} plan on ${cryptoPair} is active. The committed principal is $${amount.toFixed(
        2,
      )}. Each day targets ${(27).toFixed(0)}–30% of that amount, and you can cancel at any time.`,
    );

    return { planId, weeklyTargetProfit: simulation.weeklyTargetProfit };
  },
});

export const open_execution = internalMutation({
  args: { tradeId: v.id("trades") },
  handler: async (ctx, args) => {
    const trade = await ctx.db.get(args.tradeId);
    if (!trade || trade.status !== "pending" || !trade.plan_id) return;
    const plan = await ctx.db.get(trade.plan_id);
    if (!plan) return;

    if (plan.status !== "active") {
      await ctx.db.patch(trade._id, {
        status: "canceled",
        closed_at: Date.now(),
        close_reason:
          plan.status === "cancelled" ? "plan_cancelled" : "plan_completed",
        ended: nowIso(),
      });
      return;
    }

    const now = Date.now();
    if (
      trade.scheduled_open_at !== undefined &&
      now + 2000 < trade.scheduled_open_at
    ) {
      return;
    }

    await ctx.db.patch(trade._id, {
      status: "open",
      opened_at: now,
    });
  },
});

export const close_execution = internalMutation({
  args: { tradeId: v.id("trades") },
  handler: async (ctx, args) => {
    const trade = await ctx.db.get(args.tradeId);
    if (!trade || !trade.plan_id) return;
    if (trade.status === "closed" || trade.status === "canceled") return;

    const plan = await ctx.db.get(trade.plan_id);
    if (!plan) return;

    if (plan.status !== "active") {
      await ctx.db.patch(trade._id, {
        status: "canceled",
        closed_at: Date.now(),
        realized_pnl: 0,
        close_reason:
          plan.status === "cancelled" ? "plan_cancelled" : "plan_completed",
        ended: nowIso(),
      });
      return;
    }

    if (trade.status === "pending") {
      await ctx.db.patch(trade._id, {
        status: "open",
        opened_at: trade.scheduled_open_at ?? Date.now(),
      });
    }

    const current = (await ctx.db.get(trade._id)) as any;
    if (!current || current.status !== "open") return;

    await closePlanTrade(ctx, {
      trade: current,
      plan,
      pnl: current.net_pnl ?? 0,
      closeReason: "completed",
      closedAt: Date.now(),
    });
  },
});

export const finalize_plan = internalMutation({
  args: { planId: v.id("trade_plans") },
  handler: async (ctx, args) => {
    let plan = await ctx.db.get(args.planId);
    if (!plan || plan.status !== "active") return;

    const now = Date.now();
    if (now + 2000 < plan.ends_at) {
      // A stray early run should not end the plan before its seventh day.
      await ctx.scheduler.runAt(
        plan.ends_at,
        internal.trading.finalize_plan,
        { planId: args.planId },
      );
      return;
    }

    const trades = sortTrades(await tradePlanTrades(ctx, plan._id));
    for (const original of trades) {
      const trade = (await ctx.db.get(original._id)) as any;
      if (!trade) continue;
      if (trade.status === "pending" || trade.status === "open") {
        // Completion guarantees the full simulated target, even if a
        // scheduled job was missed. Pending trades settle at their planned
        // result instead of being silently dropped.
        await closePlanTrade(ctx, {
          trade,
          plan: (await ctx.db.get(plan._id)) as any,
          pnl: trade.net_pnl ?? 0,
          closeReason: "plan_completed",
          closedAt: now,
        });
      }
    }

    plan = (await ctx.db.get(plan._id)) as any;
    if (!plan || plan.status !== "active") return;

    await unlockPrincipal(ctx, {
      userId: plan.user,
      market: plan.market,
      base: plan.base,
      quote: plan.quote,
      amount: plan.remaining_principal,
    });

    await ctx.db.patch(plan._id, {
      status: "completed",
      completed_at: now,
      remaining_principal: 0,
    });

    await pushMessage(
      ctx,
      plan.user,
      "7-day plan completed",
      `Your ${plan.market} plan on ${plan.crypto_pair} completed. Realized profit: $${round2(
        plan.realized_pnl,
      ).toFixed(2)}. Your principal has been released.`,
    );
  },
});

export const cancel_trade_plan = mutation({
  args: {
    planId: v.id("trade_plans"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userDoc = await requireUserDoc(ctx);
    const plan = await ctx.db.get(args.planId);
    if (!plan || plan.user !== userDoc.userId) {
      throw new Error("Plan not found.");
    }
    if (plan.status !== "active") {
      throw new Error("This plan is not active.");
    }

    const now = Date.now();
    const trades = sortTrades(await tradePlanTrades(ctx, plan._id));
    let sawOpenedTrade = false;
    let openMark = 0;
    let openLossAbsorbed = 0;

    for (const original of trades) {
      const trade = (await ctx.db.get(original._id)) as any;
      if (!trade) continue;
      if (trade.status === "open" || (trade.status === "pending" && trade.opened_at)) {
        sawOpenedTrade = true;
        const mark = cancellationMark(trade, now);
        openMark = round2(openMark + mark);
        if (mark < 0) {
          const currentPlan = (await ctx.db.get(plan._id)) as any;
          const absorbed = Math.min(
            Math.abs(mark),
            currentPlan?.remaining_principal ?? 0,
          );
          openLossAbsorbed = round2(openLossAbsorbed + absorbed);
        }
        await closePlanTrade(ctx, {
          trade,
          plan: (await ctx.db.get(plan._id)) as any,
          pnl: mark,
          closeReason: "plan_cancelled",
          closedAt: now,
        });
      } else if (trade.status === "pending") {
        await ctx.db.patch(trade._id, {
          status: "canceled",
          closed_at: now,
          realized_pnl: 0,
          close_reason: "plan_cancelled",
          ended: nowIso(),
        });
      }
      if (trade.status === "open" || trade.opened_at) {
        sawOpenedTrade = true;
      }
    }

    let latest = (await ctx.db.get(plan._id)) as any;
    const principalReturned = round2(
      Math.max(0, latest?.remaining_principal ?? 0),
    );

    await unlockPrincipal(ctx, {
      userId: plan.user,
      market: plan.market,
      base: plan.base,
      quote: plan.quote,
      amount: principalReturned,
    });

    await ctx.db.patch(plan._id, {
      status: "cancelled",
      cancelled_at: now,
      cancel_reason: args.reason ?? "user_cancelled",
      remaining_principal: 0,
    });

    if (plan.voucher_id && !sawOpenedTrade) {
      const userVoucher = await ctx.db.get(plan.voucher_id);
      if (userVoucher && userVoucher.status === "used") {
        await ctx.db.patch(userVoucher._id, {
          status: "active",
          used_at: undefined,
          used_count: Math.max(0, (userVoucher.used_count ?? 1) - 1),
        });
      }
    }

    latest = (await ctx.db.get(plan._id)) as any;

    await pushMessage(
      ctx,
      plan.user,
      "Plan cancelled",
      `Your ${plan.market} plan on ${plan.crypto_pair} was cancelled. $${principalReturned.toFixed(
        2,
      )} of principal was released. Completed profit stays in your account.`,
    );

    return {
      planId: plan._id,
      principalReturned,
      openMark,
      openLossAbsorbed,
      realizedPnl: latest?.realized_pnl ?? 0,
      totalCreditedNow: round2(
        principalReturned + Math.max(0, openMark),
      ),
    };
  },
});

export const cancel_preview = query({
  args: { planId: v.id("trade_plans") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const plan = await ctx.db.get(args.planId);
    if (!plan || plan.user !== identity.subject) return null;
    if (plan.status !== "active") return null;

    const now = Date.now();
    const trades = sortTrades(await tradePlanTrades(ctx, plan._id));
    let openMark = 0;
    let openWins = 0;
    let openLosses = 0;
    let pendingCount = 0;

    for (const trade of trades) {
      if (trade.status === "open") {
        const mark = cancellationMark(trade, now);
        openMark = round2(openMark + mark);
        if (mark >= 0) openWins = round2(openWins + mark);
        else openLosses = round2(openLosses + Math.abs(mark));
      } else if (trade.status === "pending") {
        pendingCount += 1;
      }
    }

    const principalReturned = round2(
      Math.max(
        0,
        plan.remaining_principal - Math.min(openLosses, plan.remaining_principal),
      ),
    );

    return {
      planId: plan._id,
      principal: plan.principal,
      remainingPrincipal: plan.remaining_principal,
      realizedPnl: plan.realized_pnl,
      openMark,
      openWins,
      openLosses,
      pendingCount,
      principalReturned,
      totalCreditedNow: round2(principalReturned + openWins),
      netResult: round2(plan.realized_pnl + openMark),
    };
  },
});

export const plan_details = query({
  args: { planId: v.id("trade_plans") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const plan = await ctx.db.get(args.planId);
    if (!plan || plan.user !== identity.subject) return null;
    const trades = sortTrades(await tradePlanTrades(ctx, plan._id));
    return {
      ...plan,
      id: plan._id,
      trades: trades.map((trade) => ({ ...trade, id: trade._id })),
    };
  },
});

export const terminal_data = query({
  args: {
    market: marketValidator,
    base: v.string(),
    quote: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const userId = identity.subject;
    const base = args.base.toUpperCase();
    const quote = args.quote.toUpperCase();

    const available = await getAvailableBalance(ctx, {
      userId,
      market: args.market as Market,
      base,
      quote,
    });

    const allPlans = await ctx.db
      .query("trade_plans")
      .withIndex("by_user", (q) => q.eq("user", userId))
      .collect();

    const plans = allPlans
      .filter(
        (plan) =>
          plan.market === args.market &&
          plan.base === base &&
          plan.quote === quote,
      )
      .sort((a, b) => b.started_at - a.started_at)
      .slice(0, 12);

    const withTrades = [];
    for (const plan of plans) {
      const trades = sortTrades(await tradePlanTrades(ctx, plan._id));
      withTrades.push({
        ...plan,
        id: plan._id,
        trades: trades.map((trade) => ({ ...trade, id: trade._id })),
      });
    }

    return {
      available,
      plans: withTrades,
      activePlans: withTrades.filter((plan) => plan.status === "active"),
      lastPlan: withTrades[0] ?? null,
    };
  },
});

export const trade_history = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const trades = await ctx.db
      .query("trades")
      .withIndex("by_user", (q) => q.eq("user", identity.subject))
      .collect();

    return trades
      .sort((a, b) => b._creationTime - a._creationTime)
      .map((trade) => ({
        ...trade,
        id: trade._id,
        cryptoPair: trade.crypto_pair,
        created: new Date(trade._creationTime).toISOString(),
        ended:
          trade.ended ??
          (trade.closed_at ? new Date(trade.closed_at).toISOString() : undefined),
      }));
  },
});

export const sweep_engine = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    const pending = await ctx.db
      .query("trades")
      .withIndex("by_status_scheduled_open", (q) => q.eq("status", "pending"))
      .collect();
    let opened = 0;
    for (const trade of pending) {
      if (
        trade.scheduled_open_at !== undefined &&
        trade.scheduled_open_at <= now
      ) {
        await ctx.scheduler.runAt(now, internal.trading.open_execution, {
          tradeId: trade._id,
        });
        opened += 1;
      }
    }

    const open = await ctx.db
      .query("trades")
      .withIndex("by_status_scheduled_close", (q) => q.eq("status", "open"))
      .collect();
    let closed = 0;
    for (const trade of open) {
      if (
        trade.scheduled_close_at !== undefined &&
        trade.scheduled_close_at <= now
      ) {
        await ctx.scheduler.runAt(now, internal.trading.close_execution, {
          tradeId: trade._id,
        });
        closed += 1;
      }
    }

    const activePlans = await ctx.db
      .query("trade_plans")
      .withIndex("by_status_ends", (q) => q.eq("status", "active"))
      .collect();
    let finalized = 0;
    for (const plan of activePlans) {
      if (plan.ends_at <= now) {
        await ctx.scheduler.runAt(now, internal.trading.finalize_plan, {
          planId: plan._id,
        });
        finalized += 1;
      }
    }

    return { opened, closed, finalized };
  },
});

export const view_traders = query({
  args: {},
  handler: async (ctx) =>
    (await ctx.db.query("traders").collect()).map((trader) => ({
      ...trader,
      id: trader._id,
    })),
});
