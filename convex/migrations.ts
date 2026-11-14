import { v } from "convex/values";
import { makeFunctionReference } from "convex/server";
import { internalAction, internalMutation } from "./_generated/server";

const DEFAULT_BATCH_SIZE = 100;
const MAX_BATCH_SIZE = 500;

type BackfillBatchArgs = {
  cursor?: string;
  batchSize?: number;
};

type BackfillBatchResult = {
  scanned: number;
  patched: number;
  skipped: number;
  continueCursor: string;
  isDone: boolean;
};

// Using a function reference avoids depending on generated API types for this
// one-off migration module.
const backfillSpotEmailsBatch = makeFunctionReference<
  "mutation",
  BackfillBatchArgs,
  BackfillBatchResult
>("migrations:backfill_spot_emails_batch");

function normalizeBatchSize(batchSize?: number) {
  return Math.min(
    Math.max(Math.floor(batchSize ?? DEFAULT_BATCH_SIZE), 1),
    MAX_BATCH_SIZE,
  );
}

/**
 * Backfills the owner's email onto spot accounts that were created before the
 * email was available. Safe to run more than once: accounts that already have
 * the correct email are skipped.
 */
export const backfill_spot_emails_batch = internalMutation({
  args: {
    cursor: v.optional(v.string()),
    batchSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const page = await ctx.db.query("spot").paginate({
      cursor: args.cursor ?? null,
      numItems: normalizeBatchSize(args.batchSize),
    });

    let patched = 0;
    let skipped = 0;

    for (const account of page.page) {
      const userId = account.user;
      if (!userId) {
        skipped++;
        continue;
      }

      const userDoc = await ctx.db
        .query("user")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .first();

      if (!userDoc?.email || userDoc.email === account.email) {
        skipped++;
        continue;
      }

      await ctx.db.patch(account._id, { email: userDoc.email });
      patched++;
    }

    return {
      scanned: page.page.length,
      patched,
      skipped,
      continueCursor: page.continueCursor,
      isDone: page.isDone,
    };
  },
});

/**
 * One-time migration entry point. Processes every page in batches so it stays
 * within Convex mutation limits. Run with:
 *
 *   npx convex run --prod --push migrations:backfill_spot_emails
 */
export const backfill_spot_emails = internalAction({
  args: { batchSize: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const batchSize = normalizeBatchSize(args.batchSize);
    let cursor: string | undefined;
    let scanned = 0;
    let patched = 0;
    let skipped = 0;
    let batches = 0;

    while (true) {
      const batchArgs: BackfillBatchArgs = { batchSize };
      if (cursor) batchArgs.cursor = cursor;

      const result = await ctx.runMutation(backfillSpotEmailsBatch, batchArgs);

      scanned += result.scanned;
      patched += result.patched;
      skipped += result.skipped;
      batches++;

      if (result.isDone || !result.continueCursor) break;
      cursor = result.continueCursor;
    }

    return { scanned, patched, skipped, batches };
  },
});
