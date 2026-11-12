export async function requireUserId(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");
  return identity.subject as string;
}

export async function requireUserDoc(ctx: any) {
  const userId = await requireUserId(ctx);
  const record = await ctx.db
    .query("user")
    .withIndex("by_userId", (q: any) => q.eq("userId", userId))
    .first();
  if (!record) throw new Error("User not found");
  return record;
}
