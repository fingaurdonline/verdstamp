import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUserId } from "./helpers";

export const numbers = query({
  args: {},
  handler: async (ctx) => await ctx.db.query("numbers").first(),
});

export const create_login_location = mutation({
  args: { device: v.string(), ip: v.string(), location: v.string() },
  handler: async (ctx, args) =>
    await ctx.db.insert("login_history", {
      ...args,
      user: await requireUserId(ctx),
    }),
});

export const view_login_status = query({
  args: {},
  handler: async (ctx) => await ctx.db.query("login_history").collect(),
});
