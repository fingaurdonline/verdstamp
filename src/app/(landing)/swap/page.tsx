"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import useCryptoList from "@/hooks/useCryptoData";
import { CryptoCurrency, spotAssetType } from "@/lib/types";
import { api } from "@convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { ArrowUpDown, ChevronDown, Info } from "lucide-react";
import { BiSolidCoinStack } from "react-icons/bi";
import { toast } from "sonner";
import PageHero from "../components/PageHero";

type CryptoTableData = {
    id: string;
    name: string;
    symbol: string;
    abv: string;
    amount: number;
    available: number;
    price: number;
    frozen: number;
    value: number;
};

const roundToTwoDecimalPlaces = (num: number): number =>
    Math.round(num * 100) / 100;

const roundToFourDecimalPlaces = (num: number): number =>
    Math.round(num * 10000) / 10000;

const formatAmount = (value?: number) => {
    if (value === undefined || Number.isNaN(value)) return "—";
    return roundToTwoDecimalPlaces(value).toLocaleString("en-US", {
        maximumFractionDigits: 2,
    });
};

export default function Swap() {
    const user = useQuery(api.user.user);
    const userId = user?.userId;
    const updateSpotAccount = useMutation(api.accounts.update_spot_account);
    const updateSpotAsset = useMutation(api.accounts.update_spot_asset);
    const { data: cryptoData, isError: cryptoDataError } = useCryptoList();
    const spotAccounts = useQuery(api.accounts.view_all_spot_accounts);
    const accountDetail = spotAccounts?.find(
        (acc: any) => acc?.user === userId,
    );
    const spotAccount = useQuery(
        api.accounts.view_spot_account,
        accountDetail?.id ? { id: accountDetail.id as string } : "skip",
    );

    const [swapFromAmount, setSwapFromAmount] = useState<number | undefined>();
    const [swapToAmount, setSwapToAmount] = useState<number | undefined>();

    const data: CryptoTableData[] = useMemo(() => {
        return (
            cryptoData?.data?.data?.map(
                (crypto: CryptoCurrency): CryptoTableData => {
                    const existingCoin = spotAccount?.assets
                        ? Object.values(
                              spotAccount.assets as spotAssetType,
                          ).find(
                              (coin) =>
                                  coin?.coin ===
                                  crypto?.name?.toLocaleLowerCase(),
                          )
                        : undefined;

                    return {
                        id: String(crypto.id),
                        name: crypto.name,
                        symbol: `https://s2.coinmarketcap.com/static/img/coins/64x64/${crypto.id}.png`,
                        abv: crypto.symbol,
                        amount: existingCoin?.amount || 0,
                        available: existingCoin?.available || 0,
                        price: crypto?.quote?.USD?.price || 0,
                        frozen: existingCoin?.frozen || 0,
                        value: existingCoin?.value || 0,
                    };
                },
            ) || []
        );
    }, [cryptoData, spotAccount]);

    const tether = data.find(
        (crypto) => crypto?.name?.toLocaleLowerCase() === "tether usdt",
    );
    const bitcoin = data.find(
        (crypto) => crypto?.name?.toLocaleLowerCase() === "bitcoin",
    );

    const [swapFromCoin, setSwapFromCoin] = useState<
        CryptoTableData | undefined
    >(() => bitcoin);
    const [swapToCoin, setSwapToCoin] = useState<CryptoTableData | undefined>(
        () => tether,
    );

    useEffect(() => {
        if (!data?.length) return;

        if (swapFromCoin) {
            const freshFrom = data.find((c) => c.id === swapFromCoin.id);
            if (
                freshFrom &&
                (freshFrom.available !== swapFromCoin.available ||
                    freshFrom.amount !== swapFromCoin.amount ||
                    freshFrom.price !== swapFromCoin.price)
            ) {
                setSwapFromCoin(freshFrom);
            }
        } else if (bitcoin) {
            setSwapFromCoin(bitcoin);
        }

        if (swapToCoin) {
            const freshTo = data.find((c) => c.id === swapToCoin.id);
            if (
                freshTo &&
                (freshTo.available !== swapToCoin.available ||
                    freshTo.amount !== swapToCoin.amount ||
                    freshTo.price !== swapToCoin.price)
            ) {
                setSwapToCoin(freshTo);
            }
        } else if (tether) {
            setSwapToCoin(tether);
        }
    }, [data, swapFromCoin, swapToCoin, bitcoin, tether]);

    const swapFrom = data.filter((coin) => coin.id !== swapToCoin?.id);
    const swapTo = data.filter((coin) => coin.id !== swapFromCoin?.id);

    const available = swapFromCoin?.available ?? 0;
    const referenceRate =
        swapFromCoin?.price && swapToCoin?.price
            ? roundToFourDecimalPlaces(
                  swapFromCoin.price / swapToCoin.price,
              )
            : null;

    const convertedTo = (value: number) => {
        const fromPrice = swapFromCoin?.price ?? 0;
        const toPrice = swapToCoin?.price ?? 0;
        if (!fromPrice || !toPrice) return 0;
        return value * (fromPrice / toPrice);
    };

    const convertedFrom = (value: number) => {
        const fromPrice = swapFromCoin?.price ?? 0;
        const toPrice = swapToCoin?.price ?? 0;
        if (!fromPrice || !toPrice) return 0;
        return value * (toPrice / fromPrice);
    };

    const handleMax = () => {
        const max = roundToFourDecimalPlaces(available);
        setSwapFromAmount(max);
        setSwapToAmount(roundToFourDecimalPlaces(convertedTo(max)));
    };

    const handleSwapCryptos = async (
        fromSymbol: CryptoTableData,
        toSymbol: CryptoTableData,
        amountFrom: number,
        amountTo: number,
    ) => {
        const spot = spotAccounts?.find((acc: any) => acc?.user === userId);
        if (!spot) {
            toast.error("Spot account not found.");
            return;
        }

        const spotAssets = Object.values(spot.assets as spotAssetType);

        // Find crypto metadata (prices) by symbol
        const fromCrypto = cryptoData?.data?.data?.find(
            (c: CryptoCurrency) =>
                c.name.toLocaleLowerCase() ===
                fromSymbol.name.toLocaleLowerCase(),
        );
        const toCrypto = cryptoData?.data?.data?.find(
            (c: CryptoCurrency) =>
                c.name.toLocaleLowerCase() ===
                toSymbol.name.toLocaleLowerCase(),
        );
        if (!fromCrypto || !toCrypto) {
            toast.error("Selected cryptocurrencies not found in market data.");
            return;
        }

        // Find corresponding asset entries in spot account by matching coin name
        const fromIndex = spotAssets.findIndex(
            (a) => a.coin === fromCrypto.name?.toLowerCase(),
        );
        const toIndex = spotAssets.findIndex(
            (a) => a.coin === toCrypto.name?.toLowerCase(),
        );

        if (fromIndex === -1) {
            toast.error(`${fromSymbol.name} asset not found in spot account.`);
            return;
        }
        if (toIndex === -1) {
            toast.error(`${toSymbol.name} asset not found in spot account.`);
            return;
        }

        const fromAsset = spotAssets[fromIndex];
        const toAsset = spotAssets[toIndex];

        // Check available balance for fromAsset
        if (amountFrom > fromAsset.available) {
            toast.error("Insufficient balance to perform swap.");
            return;
        }

        // Prices in USD
        const fromPrice = fromCrypto?.quote?.USD?.price ?? 0;
        const toPrice = toCrypto?.quote?.USD?.price ?? 0;
        if (!fromPrice || !toPrice) {
            toast.error("Unable to fetch prices for selected cryptos.");
            return;
        }

        try {
            // Deduct from 'from' asset
            const newFromAmount = (fromAsset.amount as number) - amountFrom;
            const newFromAvailable = newFromAmount - fromAsset.frozen;
            const newFromValue = newFromAmount * fromPrice;
            spotAssets[fromIndex] = {
                ...spotAssets[fromIndex],
                amount: newFromAmount,
                available: newFromAvailable,
                value: newFromValue,
            };

            // Add to 'to' asset
            const newToAmount = (toAsset.amount as number) + amountTo;
            const newToAvailable = newToAmount - (toAsset.frozen ?? 0);
            const newToValue = newToAmount * toPrice;
            spotAssets[toIndex] = {
                ...spotAssets[toIndex],
                amount: newToAmount,
                available: newToAvailable,
                value: newToValue,
            };

            await updateSpotAsset({
                asset: spotAssets,
                id: spot?.id as string,
            });
            const newTotalAsset = spotAssets.reduce(
                (acc: number, a: any) => acc + (a.value ?? 0),
                0,
            );
            await updateSpotAccount({
                amount: newTotalAsset,
                spotID: spot?.id as string,
            });
            toast.success("Successfully swapped");
            setSwapFromAmount(undefined);
            setSwapToAmount(undefined);
        } catch (err) {
            console.error("Swap failed:", err);
            toast.error("Swap failed. Please try again.");
        }
    };

    return (
        <main className="w-full">
            <PageHero
                align="center"
                eyebrow="Swap"
                title={
                    <>
                        Fast <span className="text-lnd-accent">swap</span>
                    </>
                }
                subtitle="Swap assets effortlessly and securely with Verdstamp's self-developed algorithm."
            />

            <section className="mx-auto w-full max-w-[1280px] px-4 py-10 lg:px-6 lg:py-14">
                <div className="mx-auto w-full max-w-[560px]">
                    <div className="rounded-3xl border border-lnd-border bg-lnd-surface p-4 lg:p-6">
                        {/* From */}
                        <div className="rounded-2xl border border-lnd-border bg-lnd-surface-2 p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                                <span className="font-medium text-lnd-fg">
                                    From
                                </span>
                                <span className="flex items-center gap-1.5 text-lnd-fg-muted">
                                    Available:
                                    <span className="text-lnd-fg">
                                        {formatAmount(swapFromCoin?.available)}{" "}
                                        {swapFromCoin?.abv}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleMax}
                                        className="ml-1 font-semibold text-lnd-accent transition-opacity hover:opacity-80"
                                    >
                                        Max
                                    </button>
                                </span>
                            </div>

                            <div className="mt-3 flex items-center gap-3">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button
                                            type="button"
                                            className="flex shrink-0 items-center gap-2 rounded-full border border-lnd-border bg-lnd-surface px-3 py-2 text-lnd-fg transition-colors hover:border-lnd-accent/40"
                                        >
                                            {cryptoData === undefined ? (
                                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-lnd-accent/15">
                                                    <BiSolidCoinStack className="h-4 w-4 text-lnd-accent" />
                                                </span>
                                            ) : (
                                                <Image
                                                    src={
                                                        swapFromCoin?.symbol as string
                                                    }
                                                    alt={
                                                        swapFromCoin?.abv ?? ""
                                                    }
                                                    width={100}
                                                    height={100}
                                                    className="h-6 w-6 rounded-full"
                                                />
                                            )}
                                            <span className="font-Manrope text-sm font-semibold">
                                                {swapFromCoin?.abv ?? "Select"}
                                            </span>
                                            <ChevronDown className="h-4 w-4 text-lnd-fg-muted" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="start"
                                        className="w-[calc(100vw-2rem)] max-w-[300px] border-lnd-border bg-lnd-surface p-2 text-lnd-fg"
                                    >
                                        <ScrollArea
                                            className="h-56"
                                            type="always"
                                        >
                                            <div className="space-y-1 pr-2">
                                                {swapFrom.map(
                                                    (availableCoin) => (
                                                        <button
                                                            key={
                                                                availableCoin.id
                                                            }
                                                            type="button"
                                                            onClick={() =>
                                                                setSwapFromCoin(
                                                                    availableCoin,
                                                                )
                                                            }
                                                            className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-lnd-surface-2"
                                                        >
                                                            <Image
                                                                src={
                                                                    availableCoin.symbol
                                                                }
                                                                alt={
                                                                    availableCoin.abv
                                                                }
                                                                width={100}
                                                                height={100}
                                                                className="h-6 w-6 rounded-full"
                                                            />
                                                            <span className="text-sm font-medium">
                                                                {
                                                                    availableCoin.abv
                                                                }
                                                            </span>
                                                            <span className="ml-auto truncate text-xs text-lnd-fg-muted">
                                                                {availableCoin.name}
                                                            </span>
                                                        </button>
                                                    ),
                                                )}
                                            </div>
                                            <ScrollBar />
                                        </ScrollArea>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <Input
                                    type="number"
                                    inputMode="decimal"
                                    value={swapFromAmount ?? ""}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        setSwapFromAmount(value);
                                        setSwapToAmount(convertedTo(value));
                                    }}
                                    placeholder="0.00"
                                    className="h-12 min-w-0 flex-1 border-0 bg-transparent px-2 text-right font-Manrope text-2xl font-bold text-lnd-fg shadow-none outline-none placeholder:font-Manrope placeholder:text-lnd-fg-muted/60 focus-visible:ring-0"
                                />
                            </div>
                        </div>

                        {/* Switch */}
                        <div className="relative z-10 -my-3 flex justify-center">
                            <button
                                type="button"
                                aria-label="Switch swap direction"
                                onClick={() => {
                                    setSwapFromCoin(swapToCoin);
                                    setSwapToCoin(swapFromCoin);
                                }}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-lnd-border bg-lnd-surface text-lnd-fg-muted transition-colors hover:border-lnd-accent/40 hover:text-lnd-accent"
                            >
                                <ArrowUpDown className="h-4 w-4" />
                            </button>
                        </div>

                        {/* To */}
                        <div className="rounded-2xl border border-lnd-border bg-lnd-surface-2 p-4">
                            <div className="flex items-center justify-between gap-2 text-xs">
                                <span className="flex items-center gap-1.5 font-medium text-lnd-fg">
                                    To
                                    <Info
                                        className="h-3.5 w-3.5 text-lnd-fg-muted"
                                        aria-label="Converted amount based on the reference price"
                                    />
                                </span>
                                <span className="text-lnd-fg-muted">
                                    Balance:{" "}
                                    <span className="text-lnd-fg">
                                        {formatAmount(swapToCoin?.available)}{" "}
                                        {swapToCoin?.abv}
                                    </span>
                                </span>
                            </div>

                            <div className="mt-3 flex items-center gap-3">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button
                                            type="button"
                                            className="flex shrink-0 items-center gap-2 rounded-full border border-lnd-border bg-lnd-surface px-3 py-2 text-lnd-fg transition-colors hover:border-lnd-accent/40"
                                        >
                                            {cryptoData === undefined ? (
                                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-lnd-accent/15">
                                                    <BiSolidCoinStack className="h-4 w-4 text-lnd-accent" />
                                                </span>
                                            ) : (
                                                <Image
                                                    src={
                                                        swapToCoin?.symbol as string
                                                    }
                                                    alt={swapToCoin?.abv ?? ""}
                                                    width={100}
                                                    height={100}
                                                    className="h-6 w-6 rounded-full"
                                                />
                                            )}
                                            <span className="font-Manrope text-sm font-semibold">
                                                {swapToCoin?.abv ?? "Select"}
                                            </span>
                                            <ChevronDown className="h-4 w-4 text-lnd-fg-muted" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="start"
                                        className="w-[calc(100vw-2rem)] max-w-[300px] border-lnd-border bg-lnd-surface p-2 text-lnd-fg"
                                    >
                                        <ScrollArea
                                            className="h-56"
                                            type="always"
                                        >
                                            <div className="space-y-1 pr-2">
                                                {swapTo.map(
                                                    (availableCoin) => (
                                                        <button
                                                            key={
                                                                availableCoin.id
                                                            }
                                                            type="button"
                                                            onClick={() =>
                                                                setSwapToCoin(
                                                                    availableCoin,
                                                                )
                                                            }
                                                            className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-lnd-surface-2"
                                                        >
                                                            <Image
                                                                src={
                                                                    availableCoin.symbol
                                                                }
                                                                alt={
                                                                    availableCoin.abv
                                                                }
                                                                width={100}
                                                                height={100}
                                                                className="h-6 w-6 rounded-full"
                                                            />
                                                            <span className="text-sm font-medium">
                                                                {
                                                                    availableCoin.abv
                                                                }
                                                            </span>
                                                            <span className="ml-auto truncate text-xs text-lnd-fg-muted">
                                                                {availableCoin.name}
                                                            </span>
                                                        </button>
                                                    ),
                                                )}
                                            </div>
                                            <ScrollBar />
                                        </ScrollArea>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <Input
                                    type="number"
                                    inputMode="decimal"
                                    value={swapToAmount ?? ""}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        setSwapToAmount(value);
                                        setSwapFromAmount(convertedFrom(value));
                                    }}
                                    placeholder="0.00"
                                    className="h-12 min-w-0 flex-1 border-0 bg-transparent px-2 text-right font-Manrope text-2xl font-bold text-lnd-fg shadow-none outline-none placeholder:font-Manrope placeholder:text-lnd-fg-muted/60 focus-visible:ring-0"
                                />
                            </div>
                        </div>

                        {/* Reference */}
                        <div className="mt-5 flex flex-col gap-2 border-t border-lnd-border pt-4 text-xs text-lnd-fg-muted sm:flex-row sm:items-center sm:justify-between">
                            <span>
                                Reference price:{" "}
                                <span className="text-lnd-fg">
                                    1 {swapFromCoin?.abv ?? "—"} ={" "}
                                    {referenceRate ?? "—"}{" "}
                                    {swapToCoin?.abv ?? "—"}
                                </span>
                            </span>
                            <span>
                                Available:{" "}
                                <span className="text-lnd-fg">
                                    {formatAmount(swapFromCoin?.available)}{" "}
                                    {swapFromCoin?.abv}
                                </span>
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                if (
                                    !swapFromCoin ||
                                    !swapToCoin ||
                                    !swapFromAmount ||
                                    !swapToAmount
                                ) {
                                    toast.error(
                                        "Please enter an amount to swap.",
                                    );
                                    return;
                                }
                                handleSwapCryptos(
                                    swapFromCoin,
                                    swapToCoin,
                                    swapFromAmount,
                                    swapToAmount,
                                );
                            }}
                            disabled={!swapFromCoin || !swapToCoin}
                            className="lnd-btn-accent mt-5 w-full py-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Swap
                        </button>
                    </div>

                    {cryptoDataError && (
                        <div className="mt-4 rounded-xl border border-lnd-border bg-lnd-surface px-4 py-3 text-center text-xs leading-relaxed text-lnd-fg-muted">
                            Market data is temporarily unavailable. The swap
                            form will activate once prices load.
                        </div>
                    )}

                    <p className="mt-4 text-center text-xs leading-relaxed text-lnd-fg-muted">
                        Rates are indicative and update with the market. Review
                        the final amount before confirming.
                    </p>
                </div>
            </section>
        </main>
    );
}
