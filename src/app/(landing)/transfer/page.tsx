"use client";

import { useState } from "react";
import {
    futuresAssetType,
    marginAssetType,
    spotAssetType,
} from "@/lib/types";
import { api } from "@convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import {
    ArrowUpDown,
    ChevronDown,
    Landmark,
    LineChart,
    Wallet,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select";
import { toast } from "sonner";
import PageHero from "../components/PageHero";

const MARGIN_PAIRS = [
    { label: "BTC/USDT", value: "bitcoin/usdt" },
    { label: "ETH/USDT", value: "ethereum/usdt" },
    { label: "TRX/USDT", value: "tron/usdt" },
    { label: "SOL/USDT", value: "solana/usdt" },
    { label: "XRP/USDT", value: "ripple/usdt" },
];

const ACCOUNT_ICONS = {
    Spot: Wallet,
    Futures: LineChart,
    Margin: Landmark,
} as const;

type AccountName = keyof typeof ACCOUNT_ICONS;

function AccountBadge({ name }: { name: AccountName }) {
    const Icon = ACCOUNT_ICONS[name];

    return (
        <span className="flex h-10 items-center gap-2 rounded-full border border-lnd-border bg-lnd-surface px-4 text-sm font-medium text-lnd-fg">
            <Icon className="h-4 w-4 text-lnd-accent" />
            {name}
        </span>
    );
}

function AccountSelect({
    value,
    onChange,
}: {
    value: string;
    onChange: (value: string) => void;
}) {
    const Icon =
        ACCOUNT_ICONS[value as AccountName] ?? ACCOUNT_ICONS.Futures;

    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="h-10 w-[160px] gap-2 rounded-full border-lnd-border bg-lnd-surface px-4 text-sm font-medium text-lnd-fg">
                <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-lnd-accent" />
                    {value}
                </span>
                <ChevronDown className="h-3.5 w-3.5 shrink-0 text-lnd-fg-muted" />
            </SelectTrigger>
            <SelectContent className="border-lnd-border bg-lnd-surface text-lnd-fg">
                <SelectItem value="Futures">Futures</SelectItem>
                <SelectItem value="Margin">Margin</SelectItem>
            </SelectContent>
        </Select>
    );
}

export default function Transfer() {
    const user = useQuery(api.user.user);
    const userId = user?.userId;

    const updateFuturesAccount = useMutation(
        api.accounts.update_futures_account,
    );
    const updateFuturesAsset = useMutation(api.accounts.update_futures_asset);
    const updateMarginAccount = useMutation(api.accounts.update_margin_account);
    const updateMarginAsset = useMutation(api.accounts.update_margin_asset);
    const updateSpotAccount = useMutation(api.accounts.update_spot_account);
    const updateSpotAsset = useMutation(api.accounts.update_spot_asset);

    const spotAccounts = useQuery(api.accounts.view_all_spot_accounts);
    const futuresAccounts = useQuery(api.accounts.view_all_futures_accounts);
    const marginAccounts = useQuery(api.accounts.view_all_margin_accounts);

    const [fromAccount, setFromAccount] = useState<AccountName>("Spot");
    const [toAccount, setToAccount] = useState<AccountName>("Futures");
    const [activeAccount, setActiveAccount] = useState<"futures" | "margin">(
        "futures",
    );
    const [amount, setAmount] = useState("");
    const [marginPair, setMarginPair] = useState("bitcoin/usdt");

    const spotDetail = spotAccounts?.find(
        (account: any) => account?.user === userId,
    );
    const spotAccount = useQuery(
        api.accounts.view_spot_account,
        spotDetail?.id ? { id: spotDetail.id } : "skip",
    );

    const futuresDetail = futuresAccounts?.find(
        (account: any) => account?.user === userId,
    );
    const marginDetail = marginAccounts?.find(
        (account: any) => account?.user === userId,
    );

    const spotUsdt = spotDetail
        ? (Object.values(spotDetail.assets as spotAssetType) as any[]).find(
              (asset) => asset?.coin === "tether usdt",
          )
        : undefined;
    const futuresUsdt = futuresDetail
        ? (
              Object.values(futuresDetail.assets as futuresAssetType) as any[]
          ).find((asset) => asset?.coin === "usdt")
        : undefined;
    const marginUsdt = marginDetail
        ? (Object.values(marginDetail.assets as marginAssetType) as any[]).find(
              (asset) => asset?.margin === marginPair,
          )
        : undefined;

    const availableBalance =
        fromAccount === "Spot"
            ? spotUsdt?.available ?? 0
            : fromAccount === "Futures"
              ? futuresUsdt?.available ?? 0
              : marginUsdt?.available?.[1] ?? 0;

    const handleSwapAccounts = () => {
        if (fromAccount === toAccount) return;
        setFromAccount(toAccount);
        setToAccount(fromAccount);
    };

    const handleMax = () => {
        if (availableBalance > 0) {
            setAmount(availableBalance.toFixed(2));
        }
    };

    const handleFuturesTransfer = async () => {
        const transferAmount = parseFloat(amount);
        if (Number.isNaN(transferAmount) || transferAmount <= 0) {
            toast.error("Please enter a valid amount.");
            return;
        }

        const spot = spotAccounts?.find(
            (account: any) => account?.user === userId,
        );
        if (!spot) {
            toast.error("Spot account not found.");
            return;
        }

        const futures = futuresAccounts?.find(
            (account: any) => account?.user === userId,
        );
        if (!futures) {
            toast.error("Futures account not found.");
            return;
        }

        const spotAssets = Object.values(
            spot.assets as spotAssetType,
        ) as any[];
        const futuresAssets = Object.values(
            futures.assets as futuresAssetType,
        ) as any[];

        const spotIndex = spotAssets.findIndex(
            (asset) => asset?.coin === "tether usdt",
        );
        const futuresIndex = futuresAssets.findIndex(
            (asset) => asset?.coin === "usdt",
        );

        if (spotIndex === -1 || futuresIndex === -1) {
            toast.error("USDT balance not found in one of the accounts.");
            return;
        }

        if (fromAccount === "Spot" && toAccount === "Futures") {
            if (transferAmount > (spotAssets[spotIndex].available ?? 0)) {
                toast.error("Insufficient USDT balance.");
                return;
            }

            spotAssets[spotIndex] = {
                ...spotAssets[spotIndex],
                amount:
                    (spotAssets[spotIndex].amount ?? 0) - transferAmount,
                available:
                    (spotAssets[spotIndex].available ?? 0) - transferAmount,
                value: (spotAssets[spotIndex].value ?? 0) - transferAmount,
            };
            futuresAssets[futuresIndex] = {
                ...futuresAssets[futuresIndex],
                balance:
                    (futuresAssets[futuresIndex].balance ?? 0) +
                    transferAmount,
                available:
                    (futuresAssets[futuresIndex].available ?? 0) +
                    transferAmount,
                equity:
                    (futuresAssets[futuresIndex].equity ?? 0) +
                    transferAmount,
            };
        } else if (fromAccount === "Futures" && toAccount === "Spot") {
            if (transferAmount > (futuresAssets[futuresIndex].available ?? 0)) {
                toast.error("Insufficient USDT balance.");
                return;
            }

            futuresAssets[futuresIndex] = {
                ...futuresAssets[futuresIndex],
                balance:
                    (futuresAssets[futuresIndex].balance ?? 0) -
                    transferAmount,
                available:
                    (futuresAssets[futuresIndex].available ?? 0) -
                    transferAmount,
                equity:
                    (futuresAssets[futuresIndex].equity ?? 0) -
                    transferAmount,
            };
            spotAssets[spotIndex] = {
                ...spotAssets[spotIndex],
                amount:
                    (spotAssets[spotIndex].amount ?? 0) + transferAmount,
                available:
                    (spotAssets[spotIndex].available ?? 0) + transferAmount,
                value: (spotAssets[spotIndex].value ?? 0) + transferAmount,
            };
        } else {
            return;
        }

        try {
            const direction = fromAccount === "Spot" ? 1 : -1;

            await updateFuturesAccount({
                amount:
                    (futures.total_asset ?? 0) +
                    transferAmount * direction,
                futuresID: futures.id,
            });
            await updateFuturesAsset({
                asset: futuresAssets,
                id: futures.id,
            });
            await updateSpotAsset({ asset: spotAssets, id: spot.id });
            await updateSpotAccount({
                amount:
                    (spotAccount?.total_asset ?? spot.total_asset ?? 0) -
                    transferAmount * direction,
                spotID: spot.id,
            });

            toast.success("Transfer was successful.");
            setAmount("");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update accounts.");
        }
    };

    const handleMarginTransfer = async () => {
        const transferAmount = parseFloat(amount);
        if (Number.isNaN(transferAmount) || transferAmount <= 0) {
            toast.error("Please enter a valid amount.");
            return;
        }

        const spot = spotAccounts?.find(
            (account: any) => account?.user === userId,
        );
        if (!spot) {
            toast.error("Spot account not found.");
            return;
        }

        const margin = marginAccounts?.find(
            (account: any) => account?.user === userId,
        );
        if (!margin) {
            toast.error("Margin account not found.");
            return;
        }

        const spotAssets = Object.values(
            spot.assets as spotAssetType,
        ) as any[];
        const marginAssets = Object.values(
            margin.assets as marginAssetType,
        ) as any[];

        const spotIndex = spotAssets.findIndex(
            (asset) => asset?.coin === "tether usdt",
        );
        const marginIndex = marginAssets.findIndex(
            (asset) => asset?.margin === marginPair,
        );

        if (spotIndex === -1 || marginIndex === -1) {
            toast.error("USDT balance not found in one of the accounts.");
            return;
        }

        const marginAvailable = marginAssets[marginIndex].available ?? [0, 0];

        if (fromAccount === "Spot" && toAccount === "Margin") {
            if (transferAmount > (spotAssets[spotIndex].available ?? 0)) {
                toast.error("Insufficient USDT balance.");
                return;
            }

            spotAssets[spotIndex] = {
                ...spotAssets[spotIndex],
                amount:
                    (spotAssets[spotIndex].amount ?? 0) - transferAmount,
                available:
                    (spotAssets[spotIndex].available ?? 0) - transferAmount,
                value: (spotAssets[spotIndex].value ?? 0) - transferAmount,
            };
            marginAssets[marginIndex] = {
                ...marginAssets[marginIndex],
                available: [
                    marginAvailable[0] ?? 0,
                    (marginAvailable[1] ?? 0) + transferAmount,
                ],
            };
        } else if (fromAccount === "Margin" && toAccount === "Spot") {
            if (transferAmount > (marginAvailable[1] ?? 0)) {
                toast.error("Insufficient USDT balance.");
                return;
            }

            marginAssets[marginIndex] = {
                ...marginAssets[marginIndex],
                available: [
                    marginAvailable[0] ?? 0,
                    (marginAvailable[1] ?? 0) - transferAmount,
                ],
            };
            spotAssets[spotIndex] = {
                ...spotAssets[spotIndex],
                amount:
                    (spotAssets[spotIndex].amount ?? 0) + transferAmount,
                available:
                    (spotAssets[spotIndex].available ?? 0) + transferAmount,
                value: (spotAssets[spotIndex].value ?? 0) + transferAmount,
            };
        } else {
            return;
        }

        try {
            const direction = fromAccount === "Spot" ? 1 : -1;

            await updateMarginAsset({
                asset: marginAssets,
                id: margin.id,
            });
            await updateSpotAsset({ asset: spotAssets, id: spot.id });
            await updateMarginAccount({
                amount:
                    (margin.total_asset ?? 0) +
                    transferAmount * direction,
                marginID: margin.id,
            });
            await updateSpotAccount({
                amount:
                    (spotAccount?.total_asset ?? spot.total_asset ?? 0) -
                    transferAmount * direction,
                spotID: spot.id,
            });

            toast.success("Transfer was successful.");
            setAmount("");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update accounts.");
        }
    };

    return (
        <main className="w-full">
            <PageHero
                align="center"
                eyebrow="Accounts"
                title={
                    <>
                        <span className="text-lnd-accent">Transfer</span>{" "}
                        between accounts
                    </>
                }
                subtitle="Transfer assets effortlessly and securely between your spot, futures and margin accounts."
            />

            <section className="mx-auto w-full max-w-[1280px] px-4 py-10 lg:px-6 lg:py-14">
                <div className="mx-auto w-full max-w-[520px]">
                    <div className="rounded-3xl border border-lnd-border bg-lnd-surface p-4 lg:p-6">
                        {/* From / To */}
                        <div className="rounded-2xl border border-lnd-border bg-lnd-surface-2 p-4">
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-xs font-medium uppercase tracking-[0.12em] text-lnd-fg-muted">
                                    From
                                </span>
                                {fromAccount === "Spot" ? (
                                    <AccountBadge name="Spot" />
                                ) : (
                                    <AccountSelect
                                        value={fromAccount}
                                        onChange={(value) => {
                                            setFromAccount(
                                                value as AccountName,
                                            );
                                            setActiveAccount(
                                                value.toLowerCase() as
                                                    | "futures"
                                                    | "margin",
                                            );
                                        }}
                                    />
                                )}
                            </div>

                            <div className="my-2 flex justify-center">
                                <button
                                    type="button"
                                    aria-label="Switch from and to accounts"
                                    onClick={handleSwapAccounts}
                                    className="flex h-8 w-8 items-center justify-center rounded-full border border-lnd-border bg-lnd-surface text-lnd-fg-muted transition-colors hover:border-lnd-accent/40 hover:text-lnd-accent"
                                >
                                    <ArrowUpDown className="h-3.5 w-3.5" />
                                </button>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <span className="text-xs font-medium uppercase tracking-[0.12em] text-lnd-fg-muted">
                                    To
                                </span>
                                {fromAccount === "Spot" ? (
                                    <AccountSelect
                                        value={toAccount}
                                        onChange={(value) => {
                                            setToAccount(
                                                value as AccountName,
                                            );
                                            setActiveAccount(
                                                value.toLowerCase() as
                                                    | "futures"
                                                    | "margin",
                                            );
                                        }}
                                    />
                                ) : (
                                    <AccountBadge name="Spot" />
                                )}
                            </div>
                        </div>

                        {/* Amount */}
                        <div className="mt-5">
                            <div className="flex items-center justify-between gap-3">
                                <Label
                                    htmlFor="transfer-amount"
                                    className="text-xs font-medium text-lnd-fg-muted"
                                >
                                    Amount
                                </Label>
                                <span className="text-xs text-lnd-fg-muted">
                                    Available:{" "}
                                    <span className="font-medium text-lnd-fg">
                                        {availableBalance.toLocaleString(
                                            "en-US",
                                            {
                                                maximumFractionDigits: 2,
                                            },
                                        )}{" "}
                                        USDT
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleMax}
                                        className="ml-2 font-semibold text-lnd-accent transition-opacity hover:opacity-80"
                                    >
                                        Max
                                    </button>
                                </span>
                            </div>
                            <div className="relative mt-2">
                                <Input
                                    id="transfer-amount"
                                    type="text"
                                    inputMode="decimal"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="h-12 rounded-xl border-lnd-border bg-lnd-surface-2 pr-16 text-base text-lnd-fg placeholder:text-lnd-fg-muted/60 focus-visible:ring-lnd-accent"
                                />
                                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-lnd-fg-muted">
                                    USDT
                                </span>
                            </div>
                        </div>

                        {/* Margin pair */}
                        {activeAccount === "margin" && (
                            <div className="mt-4">
                                <Label className="text-xs font-medium text-lnd-fg-muted">
                                    Margin pair
                                </Label>
                                <Select
                                    value={marginPair}
                                    onValueChange={setMarginPair}
                                >
                                    <SelectTrigger className="mt-2 h-11 w-full rounded-xl border-lnd-border bg-lnd-surface-2 text-sm text-lnd-fg">
                                        <span>
                                            {MARGIN_PAIRS.find(
                                                (pair) =>
                                                    pair.value === marginPair,
                                            )?.label ?? "Select pair"}
                                        </span>
                                        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-lnd-fg-muted" />
                                    </SelectTrigger>
                                    <SelectContent className="border-lnd-border bg-lnd-surface text-lnd-fg">
                                        {MARGIN_PAIRS.map((pair) => (
                                            <SelectItem
                                                key={pair.value}
                                                value={pair.value}
                                            >
                                                {pair.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={
                                activeAccount === "futures"
                                    ? handleFuturesTransfer
                                    : handleMarginTransfer
                            }
                            className="lnd-btn-accent mt-5 w-full py-3.5 text-sm"
                        >
                            Confirm transfer
                        </button>
                    </div>

                    <p className="mt-4 text-center text-xs leading-relaxed text-lnd-fg-muted">
                        Transfers between your own accounts are instant. This
                        page currently supports USDT only.
                    </p>
                </div>
            </section>
        </main>
    );
}
