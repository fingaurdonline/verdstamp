import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUserId } from "./helpers";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const create_id_verification = mutation({
  args: {
    nationality: v.string(),
    country_residence: v.string(),
    gender: v.string(),
    date_of_birth: v.string(),
    id_number: v.string(),
    id_front: v.optional(v.id("_storage")),
    id_back: v.optional(v.id("_storage")),
    selfie: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) =>
    await ctx.db.insert("verification", {
      ...args,
      userId: await requireUserId(ctx),
      verified: false,
    }),
});

export const view_id_verified = query({
  args: {},
  handler: async (ctx) => await ctx.db.query("verification").collect(),
});
