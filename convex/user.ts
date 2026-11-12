import { v } from "convex/values";
import {
  mutation,
  query,
  internalQuery,
  internalMutation,
} from "./_generated/server";
import { requireUserDoc } from "./helpers";

export const user = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return await ctx.db
      .query("user")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();
  },
});

async function generateUniqueReferralCode(
  ctx: any,
  length = 5,
): Promise<string> {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let exists = true;
  let finalCode = "";

  while (exists) {
    let code = "";
    let numCount = 0;
    for (let i = 0; i < length; i++) {
      const char = chars.charAt(Math.floor(Math.random() * chars.length));
      if (/\d/.test(char)) {
        if (numCount >= 3) {
          const letter = "abcdefghijklmnopqrstuvwxyz".charAt(
            Math.floor(Math.random() * 26),
          );
          code += letter;
        } else {
          code += char;
          numCount++;
        }
      } else {
        code += char;
      }
    }
    if (numCount < 2 || numCount > 3) continue;

    const result = await ctx.db
      .query("user")
      .withIndex("by_referral_code", (q: any) => q.eq("referral_code", code))
      .first();

    if (!result) {
      exists = false;
      finalCode = code;
    }
  }
  return finalCode;
}

export const ensure_user = mutation({
  args: { email: v.string(), username: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const existing = await ctx.db
      .query("user")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email,
        username: args.username,
        updatedAt: now,
      });
      return existing._id;
    }

    const newCode = await generateUniqueReferralCode(ctx, 5);

    return await ctx.db.insert("user", {
      userId: identity.subject,
      email: args.email,
      username: args.username,
      theme: "light",
      currency: "USD",
      language: "en",
      crypto: "bitcoin",
      vip_status: 0,
      referral_code: newCode,
      balance_visibility: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update_username = mutation({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch((await requireUserDoc(ctx))._id, {
      username: args.username,
    });
  },
});

export const update_balance_visibility = mutation({
  args: { balance_visibility: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch((await requireUserDoc(ctx))._id, {
      balance_visibility: args.balance_visibility,
    });
  },
});

export const update_user_crypto = mutation({
  args: { crypto: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch((await requireUserDoc(ctx))._id, {
      crypto: args.crypto,
    });
  },
});

export const view_theme = query({
  args: {},
  handler: async (ctx) => await requireUserDoc(ctx),
});

export const swap_theme = mutation({
  args: { theme: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch((await requireUserDoc(ctx))._id, { theme: args.theme });
  },
});

export const update_enable_otp = mutation({
  args: { enableOtp: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch((await requireUserDoc(ctx))._id, {
      is2FAEnabled: args.enableOtp,
    });
  },
});

export const update_language = mutation({
  args: { language: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch((await requireUserDoc(ctx))._id, {
      language: args.language,
    });
  },
});

export const update_currency = mutation({
  args: { currency: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch((await requireUserDoc(ctx))._id, {
      currency: args.currency,
    });
  },
});

export const update_withdraw_fee = mutation({
  args: { asset: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch((await requireUserDoc(ctx))._id, {
      withdraw_fee_asset: args.asset,
    });
  },
});

export const update_order_confirmation = mutation({
  args: { spot: v.optional(v.boolean()), futures: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const userDoc = await requireUserDoc(ctx);
    const patch: any = {};
    if (args.spot !== undefined) patch.order_conf_spot = args.spot;
    if (args.futures !== undefined) patch.order_conf_futures = args.futures;
    await ctx.db.patch(userDoc._id, patch);
  },
});

export const updateUser = mutation({
  args: {
    balance_visibility: v.optional(v.boolean()),
    crypto: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const patch: { balance_visibility?: boolean; crypto?: string } = {};
    if (args.balance_visibility !== undefined) {
      patch.balance_visibility = args.balance_visibility;
    }
    if (args.crypto !== undefined) {
      patch.crypto = args.crypto;
    }
    if (Object.keys(patch).length === 0) return;
    await ctx.db.patch((await requireUserDoc(ctx))._id, patch);
  },
});

export const reciever = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("user")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("user")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const getMyCryptoVault = internalQuery({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    return await ctx.db
      .query("crypto_vaults")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .first();
  },
});

export const setMyCryptoVaultChains = internalMutation({
  args: { chains: v.any() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const vault = await ctx.db
      .query("crypto_vaults")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .first();
    if (vault) {
      await ctx.db.patch(vault._id, {
        chains: args.chains,
        updatedAt: Date.now(),
      });
    }
  },
});

export const storeMyCryptoVault = internalMutation({
  args: { encryptedVault: v.string(), addresses: v.any(), chains: v.any() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const now = Date.now();
    await ctx.db.insert("crypto_vaults", {
      userId: identity.subject,
      vaultVersion: 1,
      encryptedVault: args.encryptedVault,
      addresses: args.addresses,
      chains: args.chains,
      createdAt: now,
      updatedAt: now,
    });
    return { created: true, addresses: args.addresses };
  },
});

export const storeMyWalletSecrets = internalMutation({
  args: { mnemonic: v.string(), privateKey: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const now = Date.now();
    await ctx.db.insert("wallet_secrets", {
      userId: identity.subject,
      vaultVersion: 1,
      Mnemonic: args.mnemonic,
      PrivateKey: args.privateKey,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const generate_otp = mutation({
  args: {},
  handler: async (ctx) => {
    const userDoc = await requireUserDoc(ctx);
    const otp = Math.floor(100000 + Math.random() * 900000);
    await ctx.db.patch(userDoc._id, { otp });
    return otp;
  },
});

export const verify_otp = mutation({
  args: { otp: v.number() },
  handler: async (ctx, args) => {
    const userDoc = await requireUserDoc(ctx);
    if (userDoc.otp === args.otp) {
      // Clear OTP after successful verification
      await ctx.db.patch(userDoc._id, { otp: undefined });
      return { success: true };
    }
    return { success: false };
  },
});
