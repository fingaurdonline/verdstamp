import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUserId } from "./helpers";

const formatLoan = (loan: any) => {
  if (!loan) return null;
  return {
    ...loan,
    id: loan._id,
    user: loan.userId,
  };
};

export const create_loan_account = mutation({
  args: {},
  handler: async (ctx) =>
    await ctx.db.insert("loan", {
      userId: await requireUserId(ctx),
      coin: "tether usdt",
      equity: 0,
      to_be_repaid: 0,
      borrowed_amount: 0,
      collateral_value: 0,
      current_ltv: 0,
      liquidation_ltv: 0,
      status: "low",
    }),
});

export const view_Loan_account = query({
  args: {},
  handler: async (ctx) => (await ctx.db.query("loan").collect()).map((loan) => formatLoan(loan)),
});

export const update_loan_account = mutation({
  args: {
    equity: v.number(),
    to_be_repaid: v.number(),
    borrowed_amount: v.number(),
    collateral_value: v.number(),
    current_ltv: v.number(),
    liquidation_ltv: v.number(),
    status: v.string(),
    id: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id as any, {
      equity: args.equity,
      to_be_repaid: args.to_be_repaid,
      borrowed_amount: args.borrowed_amount,
      collateral_value: args.collateral_value,
      current_ltv: args.current_ltv,
      liquidation_ltv: args.liquidation_ltv,
      status: args.status,
    });
    return await ctx.db.get(args.id as any);
  },
});

export const create_loan = mutation({
  args: {
    coin: v.string(),
    equity: v.number(),
    to_be_repaid: v.number(),
    borrowed_amount: v.number(),
    collateral_value: v.number(),
    current_ltv: v.number(),
  },
  handler: async (ctx, args) =>
    await ctx.db.insert("loan_history", {
      ...args,
      userId: await requireUserId(ctx),
      timestamp: Date.now(),
    }),
});

export const loan_history = query({
  args: {},
  handler: async (ctx) =>
    (await ctx.db.query("loan_history").collect()).map((loan) => ({
      ...loan,
      id: loan._id,
      user: loan.userId,
    })),
});
