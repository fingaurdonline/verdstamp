import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUserId } from "./helpers";

export const create_messages = mutation({
  args: { title: v.string(), header: v.string(), description: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", {
      ...args,
      read: false,
      userId: await requireUserId(ctx),
      createdAt: Date.now(),
    });
  },
});

export const create_deposit_messages = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.insert("messages", {
      title: "Comfirmation of Deposit",
      header: "deposit Notice",
      description:
        "This is to confirm that a deposit has been successfully received into your account",
      read: false,
      userId: await requireUserId(ctx),
      createdAt: Date.now(),
    });
  },
});

export const view_messages = query({
  args: {},
  handler: async (ctx) => await ctx.db.query("messages").collect(),
});

export const create_message_details = mutation({
  args: { messageid: v.string(), transactionid: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("message_details", {
      userId: await requireUserId(ctx),
      messageId: args.messageid as any,
      referenceType: "transaction",
      referenceId: args.transactionid,
    });
  },
});

export const view_message = query({
  args: { id: v.id("messages") },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.id);
    if (!message) return null;

    const detail = await ctx.db
      .query("message_details")
      .withIndex("by_message", (q) => q.eq("messageId", message._id))
      .first();

    return {
      ...message,
      transaction_id: detail?.referenceId,
      referenceType: detail?.referenceType,
    };
  },
});

export const view_all_message_detail = query({
  args: {},
  handler: async (ctx) => await ctx.db.query("message_details").collect(),
});

export const update_message_read = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id as any, { read: true });
    return await ctx.db.get(args.id as any);
  },
});

export const referral_reward_message = mutation({
  args: { referredUser: v.string(), referrerUserId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", {
      title: "Referral Reward",
      header: "Referral Reward Notice",
      description: `This is to inform you that you have received a referral reward for referring ${args.referredUser}.`,
      read: false,
      userId: args.referrerUserId,
      createdAt: Date.now(),
    });
  },
});

export const referral_rewarded_message = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", {
      title: "Referral Reward",
      header: "Referral Reward Notice",
      description: "This is to inform you that you have received a referral reward.",
      read: false,
      userId: args.id,
      createdAt: Date.now(),
    });
  },
});

export const trade_info_message = mutation({
  args: {
    first_name: v.string(),
    last_name: v.string(),
    service_name: v.string(),
    strategy_style: v.string(),
    risk_profile: v.string(),
    ideal_client: v.string(),
    telegram_link: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", {
      title: "Trade Info",
      header: "Trade Info Notice",
      description: `You’ve been assigned an Algo Trader who will be assisting you throughout your trading journey.\n\nHere are the details of the trader supporting you:\n\n Trader: ${args.first_name} ${args.last_name}\n Service: ${args.service_name}\n Strategy Style: ${args.strategy_style}\n Risk Profile: ${args.risk_profile}\n Ideal Client: ${args.ideal_client}\n\n\nIf you ever need direct help, guidance, or clarification, feel free to reach out to them:\n\nTelegram: ${args.telegram_link}\n\nThey are here to ensure your trading experience is smooth, informed, and profitable.\n\nLet us know if you need anything else!`,
      read: false,
      userId: await requireUserId(ctx),
      createdAt: Date.now(),
    });
  },
});
