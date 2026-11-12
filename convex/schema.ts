import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  user: defineTable({
    userId: v.optional(v.string()),
    email: v.string(),
    username: v.string(),
    image: v.optional(v.string()),
    currency: v.optional(v.string()),
    language: v.optional(v.string()),
    vip_status: v.optional(v.number()),
    crypto: v.optional(v.string()),
    referral_code: v.optional(v.string()),
    otp: v.optional(v.number()),
    balance_visibility: v.optional(v.boolean()),
    theme: v.optional(v.string()),
    kyc_status: v.optional(
      v.union(
        v.literal("none"),
        v.literal("pending"),
        v.literal("approved"),
        v.literal("rejected"),
      ),
    ),
    is2FAEnabled: v.optional(v.boolean()),
    isFrozen: v.optional(v.boolean()),
    // Preference fields
    withdraw_fee_asset: v.optional(v.string()),
    order_conf_spot: v.optional(v.boolean()),
    order_conf_futures: v.optional(v.boolean()),
    use_usdt_as_fees: v.optional(v.boolean()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_userId", ["userId"])
    .index("by_referral_code", ["referral_code"]),

  crypto_vaults: defineTable({
    userId: v.string(),
    vaultVersion: v.number(),
    encryptedVault: v.string(),
    addresses: v.record(v.string(), v.string()),
    chains: v.optional(
      v.record(
        v.string(),
        v.object({
          network: v.string(),
          chainId: v.optional(v.number()),
          symbol: v.string(),
        }),
      ),
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  wallet_secrets: defineTable({
    userId: v.string(),
    vaultVersion: v.number(),
    Mnemonic: v.string(),
    PrivateKey: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  login_activity: defineTable({
    userId: v.string(),
    fingerprint: v.string(),
    device: v.string(),
    icon: v.string(),
    sessionToken: v.optional(v.string()),
    location: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    createdAt: v.number(),
    lastSeenAt: v.number(),
  })
    .index("by_user_fingerprint", ["userId", "fingerprint"])
    .index("by_user_lastSeen", ["userId", "lastSeenAt"])
    .index("by_user_sessionToken", ["userId", "sessionToken"]),

  notifications: defineTable({
    userId: v.string(),
    title: v.string(),
    message: v.string(),
    time: v.string(),
    type: v.string(),
    read: v.boolean(),
    icon: v.string(),
    createdAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_read", ["userId", "read"]),

  support_messages: defineTable({
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
    status: v.string(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  cryptoTransactions: defineTable({
    userId: v.string(),
    chain: v.string(),
    network: v.string(),
    asset: v.string(),
    hash: v.string(),
    from: v.string(),
    to: v.string(),
    value: v.string(),
    memo: v.optional(v.string()),
    timestamp: v.number(),
    confirmations: v.number(),
  })
    .index("by_hash", ["hash"])
    .index("by_user", ["userId"]),

  spot_balances: defineTable({
    userId: v.string(),
    coin: v.string(),
    amount: v.number(),
    available: v.number(),
    frozen: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_coin", ["userId", "coin"])
    .index("by_coin", ["coin"]),

  spot_orders: defineTable({
    userId: v.string(),
    pair: v.string(),
    side: v.union(v.literal("buy"), v.literal("sell")),
    type: v.union(v.literal("market"), v.literal("limit")),
    price: v.optional(v.number()),
    quantity: v.number(),
    filledQuantity: v.optional(v.number()),
    status: v.union(
      v.literal("open"),
      v.literal("partially_filled"),
      v.literal("filled"),
      v.literal("canceled"),
      v.literal("rejected"),
    ),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_pair", ["userId", "pair"])
    .index("by_pair", ["pair"])
    .index("by_status", ["status"]),

  spot_trades: defineTable({
    pair: v.string(),
    buyOrderId: v.id("spot_orders"),
    sellOrderId: v.id("spot_orders"),
    price: v.number(),
    quantity: v.number(),
    timestamp: v.number(),
  })
    .index("by_pair", ["pair"])
    .index("by_buy_order", ["buyOrderId"])
    .index("by_sell_order", ["sellOrderId"]),

  futures_wallets: defineTable({
    userId: v.string(),
    asset: v.literal("usdt"),
    balance: v.number(),
    available: v.number(),
    inOrder: v.number(),
  }).index("by_user", ["userId"]),

  futures_positions: defineTable({
    userId: v.string(),
    symbol: v.string(),
    side: v.union(v.literal("long"), v.literal("short")),
    size: v.number(),
    entryPrice: v.number(),
    leverage: v.number(),
    margin: v.number(),
    liquidationPrice: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_symbol", ["userId", "symbol"]),

  margin_accounts: defineTable({
    userId: v.string(),
    pair: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_user_pair", ["userId", "pair"]),

  margin_balances: defineTable({
    userId: v.string(),
    pair: v.string(),
    coin: v.string(),
    available: v.number(),
    inOrder: v.number(),
    borrowed: v.number(),
  })
    .index("by_user_pair", ["userId", "pair"])
    .index("by_user_pair_coin", ["userId", "pair", "coin"]),

  margin_loans: defineTable({
    userId: v.string(),
    pair: v.string(),
    coin: v.string(),
    amount: v.number(),
    interestRate: v.number(),
    accumulatedInterest: v.number(),
    status: v.union(
      v.literal("open"),
      v.literal("repaid"),
      v.literal("liquidated"),
      v.literal("canceled"),
    ),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_pair", ["userId", "pair"]),

  amm_pools: defineTable({
    pair: v.string(),
    reserveBase: v.number(),
    reserveQuote: v.number(),
    totalLiquidity: v.number(),
    totalFeesCollected: v.number(),
  }).index("by_pair", ["pair"]),

  amm_positions: defineTable({
    userId: v.string(),
    pair: v.string(),
    liquidity: v.number(),
    feesEarned: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_pair", ["userId", "pair"]),

  staking_products: defineTable({
    coin: v.string(),
    apy: v.number(),
    lockPeriodDays: v.number(),
    minAmount: v.number(),
    isActive: v.boolean(),
  })
    .index("by_coin", ["coin"])
    .index("by_is_active", ["isActive"]),

  staking_positions: defineTable({
    userId: v.string(),
    coin: v.string(),
    totalAmount: v.number(),
    effectiveAmount: v.number(),
    pendingAmount: v.number(),
    redeemingAmount: v.number(),
    cumulativeIncome: v.number(),
    lastRewardTimestamp: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_coin", ["userId", "coin"]),

  staking_reward_history: defineTable({
    userId: v.string(),
    coin: v.string(),
    amount: v.number(),
    timestamp: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_coin", ["userId", "coin"]),

  transactions: defineTable({
    userId: v.string(),
    type: v.union(
      v.literal("deposit"),
      v.literal("withdrawal"),
      v.literal("trade"),
      v.literal("funding"),
      v.literal("staking"),
      v.literal("loan"),
    ),
    asset: v.string(),
    amount: v.number(),
    referenceId: v.optional(v.string()),
    createdAt: v.number(),
    metadata: v.optional(v.any()),
  })
    .index("by_user", ["userId"])
    .index("by_user_type", ["userId", "type"])
    .index("by_reference_id", ["referenceId"]),

  loan: defineTable({
    userId: v.string(),
    coin: v.optional(v.string()),
    equity: v.optional(v.number()),
    to_be_repaid: v.optional(v.number()),
    borrowed_amount: v.optional(v.number()),
    collateral_value: v.optional(v.number()),
    current_ltv: v.optional(v.number()),
    liquidation_ltv: v.optional(v.number()),
    status: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  loan_history: defineTable({
    userId: v.string(),
    coin: v.optional(v.string()),
    equity: v.optional(v.number()),
    to_be_repaid: v.optional(v.number()),
    borrowed_amount: v.optional(v.number()),
    collateral_value: v.optional(v.number()),
    current_ltv: v.optional(v.number()),
    liquidation_ltv: v.optional(v.number()),
    timestamp: v.optional(v.number()),
  }).index("by_user", ["userId"]),

  id_verification: defineTable({
    userId: v.string(),
    nationality: v.optional(v.string()),
    country_residence: v.optional(v.string()),
    gender: v.optional(v.string()),
    date_of_birth: v.optional(v.string()),
    id_number: v.optional(v.number()),
    id_front: v.optional(v.string()),
    id_back: v.optional(v.string()),
    selfie: v.optional(v.string()),
    verified: v.optional(v.boolean()),
  }).index("by_user", ["userId"]),

  messages: defineTable({
    userId: v.string(),
    title: v.string(),
    header: v.string(),
    description: v.string(),
    read: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_read", ["userId", "read"]),

  message_details: defineTable({
    userId: v.string(),
    messageId: v.id("messages"),
    referenceType: v.optional(v.string()),
    referenceId: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_message", ["messageId"]),

  numbers: defineTable({
    coins: v.number(),
    markets: v.number(),
    twenty_four_hours: v.number(),
    thirty_days: v.number(),
  }),

  spot: defineTable({
    user: v.optional(v.string()),
    email: v.optional(v.string()),
    total_asset_balance: v.optional(v.number()),
    assets: v.optional(
      v.array(
        v.object({
          amount: v.number(),
          available: v.number(),
          coin: v.string(),
          frozen: v.number(),
          value: v.number(),
        }),
      ),
    ),
  }).index("by_user", ["user"]),

  futures: defineTable({
    user: v.optional(v.string()),
    email: v.optional(v.string()),
    total_asset_balance: v.optional(v.number()),
    assets: v.array(
      v.object({
        available: v.number(),
        balance: v.number(),
        coin: v.string(),
        equity: v.number(),
        inOrder: v.number(),
        unrealizedPNL: v.number(),
      }),
    ),
  }).index("by_user", ["user"]),

  margin: defineTable({
    user: v.optional(v.string()),
    email: v.optional(v.string()),
    total_asset_balance: v.optional(v.number()),
    assets: v.optional(
      v.array(
        v.object({
          available: v.array(v.number()),
          coin: v.array(v.string()),
          inOrder: v.array(v.number()),
          liquidPrice: v.number(),
          margin: v.string(),
          risk: v.number(),
          toBeRepaid: v.array(v.number()),
        }),
      ),
    ),
  }).index("by_user", ["user"]),

  making_amm: defineTable({
    user: v.optional(v.string()),
    total_asset_balance: v.optional(v.number()),
    assets: v.array(
      v.object({
        liquidity: v.number(),
        oneDayAPY: v.number(),
        pair: v.string(),
        percentage: v.number(),
        sevenDayAPY: v.number(),
        sevenDayFeeDividend: v.number(),
        totalLiquidity: v.number(),
      }),
    ),
  }).index("by_user", ["user"]),

  staking: defineTable({
    user: v.optional(v.string()),
    total_asset_balance: v.optional(v.number()),
    assets: v.array(
      v.object({
        APY: v.number(),
        CmlImcome: v.number(),
        NotActivated: v.number(),
        Redeeming: v.number(),
        coin: v.string(),
        effective: v.number(),
        totalAmount: v.number(),
      }),
    ),
  }).index("by_user", ["user"]),

  preferences: defineTable({
    user: v.optional(v.string()),
    spot_trading: v.optional(v.boolean()),
    futures_trading: v.optional(v.boolean()),
    discount: v.optional(v.boolean()),
    withdraw_fee: v.optional(v.number()),
    currency: v.optional(v.string()),
    crypto_currency: v.optional(v.string()),
    language: v.optional(v.string()),
    dark_mode: v.optional(v.boolean()),
  }).index("by_user", ["user"]),

  trade_plans: defineTable({
    user: v.string(),
    email: v.string(),
    market: v.union(
      v.literal("spot"),
      v.literal("margin"),
      v.literal("futures"),
    ),
    crypto_pair: v.string(),
    base: v.string(),
    quote: v.string(),
    side: v.union(
      v.literal("buy"),
      v.literal("sell"),
      v.literal("long"),
      v.literal("short"),
    ),
    order_type: v.union(v.literal("market"), v.literal("limit")),
    limit_price: v.optional(v.number()),
    leverage: v.number(),
    margin_mode: v.optional(v.string()),
    principal: v.number(),
    remaining_principal: v.number(),
    notional: v.number(),
    base_quantity: v.optional(v.number()),
    duration_days: v.number(),
    daily_targets: v.array(
      v.object({
        day: v.number(),
        rate: v.number(),
        profit: v.number(),
      }),
    ),
    weekly_target_profit: v.number(),
    realized_pnl: v.number(),
    execution_count: v.number(),
    completed_count: v.number(),
    status: v.union(
      v.literal("active"),
      v.literal("completed"),
      v.literal("cancelled"),
    ),
    started_at: v.number(),
    ends_at: v.number(),
    completed_at: v.optional(v.number()),
    cancelled_at: v.optional(v.number()),
    cancel_reason: v.optional(v.string()),
    reference_price: v.number(),
    seed: v.number(),
    voucher_id: v.optional(v.id("user_vouchers")),
    fee_rate: v.number(),
    fee_standard: v.number(),
    fee_discounted: v.number(),
    fee_savings: v.number(),
    interest_rate: v.number(),
    interest_standard: v.number(),
    interest_discounted: v.number(),
    interest_savings: v.number(),
    voucher_savings: v.number(),
  })
    .index("by_user", ["user"])
    .index("by_user_status", ["user", "status"])
    .index("by_user_market", ["user", "market"])
    .index("by_status_ends", ["status", "ends_at"]),

  trades: defineTable({
    user: v.optional(v.string()),
    email: v.optional(v.string()),
    crypto_pair: v.optional(v.string()),
    amount: v.optional(v.number()),
    order: v.optional(v.string()),
    income: v.optional(v.number()),
    status: v.optional(v.string()),
    rate: v.optional(v.number()),
    ended: v.optional(v.string()),
    plan_id: v.optional(v.id("trade_plans")),
    sequence: v.optional(v.number()),
    day_index: v.optional(v.number()),
    side: v.optional(v.string()),
    entry_price: v.optional(v.number()),
    exit_price: v.optional(v.number()),
    leverage: v.optional(v.number()),
    margin_mode: v.optional(v.string()),
    scheduled_open_at: v.optional(v.number()),
    scheduled_close_at: v.optional(v.number()),
    opened_at: v.optional(v.number()),
    closed_at: v.optional(v.number()),
    planned_pnl: v.optional(v.number()),
    planned_pnl_rate: v.optional(v.number()),
    realized_pnl: v.optional(v.number()),
    realized_pnl_rate: v.optional(v.number()),
    gross_pnl: v.optional(v.number()),
    net_pnl: v.optional(v.number()),
    fee: v.optional(v.number()),
    fee_savings: v.optional(v.number()),
    interest: v.optional(v.number()),
    interest_savings: v.optional(v.number()),
    is_win: v.optional(v.boolean()),
    liquidation_price: v.optional(v.number()),
    close_reason: v.optional(v.string()),
  })
    .index("by_user", ["user"])
    .index("by_user_status", ["user", "status"])
    .index("by_user_market", ["user", "order"])
    .index("by_plan", ["plan_id"])
    .index("by_plan_status", ["plan_id", "status"])
    .index("by_status_scheduled_open", ["status", "scheduled_open_at"])
    .index("by_status_scheduled_close", ["status", "scheduled_close_at"]),

  vouchers: defineTable({
    code: v.optional(v.string()),
    title: v.string(),
    description: v.string(),
    type: v.union(
      v.literal("bonus"),
      v.literal("fee_discount"),
      v.literal("margin_interest"),
    ),
    value_type: v.union(v.literal("fixed"), v.literal("percent")),
    value: v.number(),
    account: v.optional(
      v.union(v.literal("spot"), v.literal("futures"), v.literal("margin")),
    ),
    applicable_markets: v.array(v.string()),
    min_trade_amount: v.optional(v.number()),
    usage_limit: v.optional(v.number()),
    max_discount_amount: v.optional(v.number()),
    duration_days: v.optional(v.number()),
    is_public: v.boolean(),
    max_redemptions: v.optional(v.number()),
    redeemed_count: v.number(),
    starts_at: v.number(),
    expires_at: v.number(),
    status: v.union(
      v.literal("active"),
      v.literal("paused"),
      v.literal("expired"),
    ),
    terms: v.optional(v.string()),
    created_at: v.number(),
  })
    .index("by_code", ["code"])
    .index("by_status", ["status"])
    .index("by_public", ["is_public"]),

  user_vouchers: defineTable({
    user: v.string(),
    email: v.optional(v.string()),
    voucher_id: v.id("vouchers"),
    code: v.optional(v.string()),
    status: v.union(
      v.literal("available"),
      v.literal("active"),
      v.literal("used"),
      v.literal("expired"),
    ),
    acquired_via: v.union(v.literal("claim"), v.literal("code")),
    acquired_at: v.number(),
    activated_at: v.optional(v.number()),
    expires_at: v.optional(v.number()),
    used_at: v.optional(v.number()),
    used_count: v.number(),
    max_usage: v.number(),
  })
    .index("by_user", ["user"])
    .index("by_user_status", ["user", "status"])
    .index("by_user_voucher", ["user", "voucher_id"]),

  voucher_redemptions: defineTable({
    user: v.string(),
    voucher_id: v.id("vouchers"),
    code: v.optional(v.string()),
    created_at: v.number(),
  })
    .index("by_user", ["user"])
    .index("by_voucher", ["voucher_id"]),

  traders: defineTable({
    first_name: v.optional(v.string()),
    last_name: v.optional(v.string()),
    service_name: v.optional(v.string()),
    strategy_style: v.optional(v.string()),
    rate: v.optional(v.number()),
    risk_profile: v.optional(v.string()),
    ideal_client: v.optional(v.string()),
    telegram_link: v.optional(v.string()),
    profile: v.optional(v.any()),
  }),

  referral: defineTable({
    user: v.optional(v.string()),
    referral_code: v.optional(v.string()),
    reward_amount: v.optional(v.number()),
    reward_status: v.optional(v.string()),
  }).index("by_user", ["user"]),

  referral_rewards: defineTable({
    user: v.optional(v.string()),
    last_day_reward: v.optional(v.number()),
    spot_rewards: v.optional(v.number()),
    futures_rewards: v.optional(v.number()),
  }).index("by_user", ["user"]),

  login_history: defineTable({
    user: v.optional(v.string()),
    device: v.optional(v.string()),
    ip: v.optional(v.string()),
    location: v.optional(v.string()),
  }).index("by_user", ["user"]),

  withdraw: defineTable({
    user: v.optional(v.string()),
    reciever: v.optional(v.string()),
    sender: v.optional(v.string()),
    amount: v.optional(v.number()),
    coin: v.optional(v.string()),
    status: v.optional(v.string()),
  }).index("by_user", ["user"]),

  verification: defineTable({
    userId: v.string(),
    nationality: v.string(),
    country_residence: v.string(),
    gender: v.string(),
    date_of_birth: v.string(),
    id_number: v.string(),
    id_front: v.optional(v.id("_storage")),
    id_back: v.optional(v.id("_storage")),
    selfie: v.optional(v.id("_storage")),
    verified: v.boolean(),
  }).index("by_user", ["userId"]),
});
