import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { internalMutation, mutation, query } from "./_generated/server";
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
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return await ctx.db
      .query("messages")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .collect();
  },
});

export const create_message_details = mutation({
  args: { messageid: v.string(), transactionid: v.string() },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const message = await ctx.db.get(args.messageid as Id<"messages">);
    if (!message || message.userId !== userId) {
      throw new Error("Message not found");
    }

    return await ctx.db.insert("message_details", {
      userId,
      messageId: message._id,
      referenceType: "transaction",
      referenceId: args.transactionid,
    });
  },
});

export const view_message = query({
  args: { id: v.id("messages") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const message = await ctx.db.get(args.id);
    if (!message || message.userId !== identity.subject) return null;

    const details = await ctx.db
      .query("message_details")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .collect();
    const detail = details.find((entry) => entry.messageId === message._id);

    return {
      ...message,
      transaction_id: detail?.referenceId,
      referenceType: detail?.referenceType,
    };
  },
});

export const view_all_message_detail = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return await ctx.db
      .query("message_details")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .collect();
  },
});

export const update_message_read = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const message = await ctx.db.get(args.id as Id<"messages">);
    if (!message || message.userId !== userId) {
      throw new Error("Message not found");
    }

    await ctx.db.patch(message._id, { read: true });
    return await ctx.db.get(message._id);
  },
});

/**
 * Internal-only: rewards are issued by the backend for a specific user, never
 * created directly by clients.
 */
export const referral_reward_message = internalMutation({
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

/**
 * Internal-only: see referral_reward_message.
 */
export const referral_rewarded_message = internalMutation({
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
