import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "crypto listener all",
  { minutes: 20 },
  internal.listeners.poller.pollAllChains,
);

// Scheduled plan opens/closes are the primary path. This sweeper is the
// idempotent backup that catches delayed or missed scheduled jobs.
crons.interval("trading engine sweep", { minutes: 5 }, internal.trading.sweep_engine);

crons.interval("expire vouchers", { hours: 24 }, internal.vouchers.expire_vouchers);

export default crons;
