import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUserId } from "./helpers";
import { Id } from "./_generated/dataModel";

export const create_referral = mutation({
  args: { code: v.string() },
  handler: async (ctx, args) =>
    await ctx.db.insert("referral", {
      referral_code: args.code,
      reward_amount: 0,
      reward_status: "not accepted",
      user: await requireUserId(ctx),
    }),
});

export const update_referral_reward = mutation({
  args: { reward: v.number(), id: v.string() },
  handler: async (ctx, args) =>
    await ctx.db.patch(args.id as any, { reward_amount: args.reward }),
});

export const update_referral_status = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const referralId = args.id as Id<"referral">;
    const referral = await ctx.db.get(referralId);
    if (!referral) throw new Error("Referral not found");
    // Ensure we don't double-pay if it's already "Accepted"
    if (referral.reward_status === "accepted") return;

    await ctx.db.patch(args.id as any, { reward_status: "accepted" });

    if (!referral.referral_code) return;

    // Find the original referrer who owns the specific code
    const referrer = await ctx.db
      .query("user")
      .withIndex("by_referral_code", (q) =>
        q.eq("referral_code", referral.referral_code!),
      )
      .first();

    if (!referrer || !referrer.userId) return;

    // Locate the referrer's Spot account to increase their USDT
    const spotAcc = await ctx.db
      .query("spot")
      .withIndex("by_user", (q) => q.eq("user", referrer.userId))
      .first();

    if (spotAcc) {
      const REWARD_USD = 10;
      const currentTotal = spotAcc.total_asset_balance ?? 0;
      const newAssets = JSON.parse(JSON.stringify(spotAcc.assets || []));
      let foundUsdt = false;

      for (let i = 0; i < newAssets.length; i++) {
        if (newAssets[i].coin === "tether usdt") {
          newAssets[i].amount = (newAssets[i].amount || 0) + REWARD_USD;
          newAssets[i].available = (newAssets[i].available || 0) + REWARD_USD;
          newAssets[i].value = (newAssets[i].value || 0) + REWARD_USD;
          foundUsdt = true;
          break;
        }
      }

      if (!foundUsdt) {
        newAssets.push({
          amount: REWARD_USD,
          available: REWARD_USD,
          coin: "tether usdt",
          frozen: 0,
          value: REWARD_USD,
        });
      }

      await ctx.db.patch(spotAcc._id, {
        total_asset_balance: Number((currentTotal + REWARD_USD).toFixed(2)),
        assets: newAssets,
      });
    }
  },
});

export const view_referrals = query({
  args: {},
  handler: async (ctx) => await ctx.db.query("referral").collect(),
});

export const create_referral_reward = mutation({
  args: {},
  handler: async (ctx) =>
    await ctx.db.insert("referral_rewards", {
      last_day_reward: 0,
      spot_rewards: 0,
      futures_rewards: 0,
      user: await requireUserId(ctx),
    }),
});

export const view_referral_reward = query({
  args: {},
  handler: async (ctx) => await ctx.db.query("referral_rewards").collect(),
});

export const upate_referral_reward_spot = mutation({
  args: { reward: v.number(), referralId: v.string() },
  handler: async (ctx, args) =>
    await ctx.db.patch(args.referralId as any, { spot_rewards: args.reward }),
});

export const upate_referral_reward_futures = mutation({
  args: { reward: v.number(), referralId: v.string() },
  handler: async (ctx, args) =>
    await ctx.db.patch(args.referralId as any, {
      futures_rewards: args.reward,
    }),
});
