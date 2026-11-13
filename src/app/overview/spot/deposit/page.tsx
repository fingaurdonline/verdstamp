"use client"
import { Label } from "@/components/ui/label";
import { CryptoSelector } from "../components/CryptoSelector";
import { PiWarningCircleThin } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import TotalAsset from "../components/TotalAsset";
import { BiChevronRight } from "react-icons/bi";
import { BsQuestionCircleFill } from "react-icons/bs";
import { Checkbox } from "@/components/ui/checkbox";
import DepositTable from "../components/DepositTable";
import { Icon } from "@iconify/react"
import * as React from "react"
import { CryptoCurrency } from "@/lib/types";
import useCryptoList from "@/hooks/useCryptoData";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import cryptoNetworks, { CryptoNetwork } from "@/lib/cryptoNetworks"
import { Check, Copy, QrCode } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { toast } from "sonner";
import QRCode from "react-qr-code";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function Deposit() {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("Bitcoin")
    const [checked, setChecked] = React.useState(false)
    const [showAddress, setShowAddress] = React.useState(false)
    const [qrOpen, setQrOpen] = React.useState(false)
    const [copied, setCopied] = React.useState(false)
    const { data: cryptoData } = useCryptoList()
    const crypto = cryptoData?.data?.data?.find((crypto: CryptoCurrency) => crypto?.name === value) as CryptoCurrency
    const btc = useQuery(api.wallet.myWalletAddressByChain, { chain: "bitcoin" })
    const eth = useQuery(api.wallet.myWalletAddressByChain, { chain: "ethereum" })
    const xrp = useQuery(api.wallet.myWalletAddressByChain, { chain: "xrp" })
    const sol = useQuery(api.wallet.myWalletAddressByChain, { chain: "solana" })
    const trx = useQuery(api.wallet.myWalletAddressByChain, { chain: "tron" })
    const bitcoin_wallet = btc ? [btc] : undefined
    const ethereum_wallet = eth ? [eth] : undefined
    const ripple_wallet = xrp ? [xrp] : undefined
    const solana_wallet = sol ? [sol] : undefined
    const tron_wallet = trx ? [trx] : undefined

    let cryptoName = "";
    let selectedNetwork: CryptoNetwork[] = [];

    // Check if value exists in cryptoNetworks
    const exists = Object.keys(cryptoNetworks).some(
        coin => coin.toLocaleLowerCase() === value.toLocaleLowerCase()
    );
    if (!exists) {
        selectedNetwork = [{ name: value, token_standard: "", contract_address: "-" }];
    } else {
        for (const [coin, { networks }] of Object.entries(cryptoNetworks)) {
            if (coin.toLocaleLowerCase() === value.toLocaleLowerCase()) {
                cryptoName = coin;
                // If Bitcoin, set contract_address to bitcoin_wallet[0].address
                if (coin.toLocaleLowerCase() === "bitcoin" && bitcoin_wallet && bitcoin_wallet[0]?.address) {
                    selectedNetwork =
                        [{
                            name: "Bitcoin",
                            type: "Mainnet",
                            symbol: "BTC",
                            token_standard: "",
                            contract_address: bitcoin_wallet[0].address,
                        }]
                }
                else if (coin.toLocaleLowerCase() === "ethereum" && ethereum_wallet && ethereum_wallet[0]?.address) {
                    selectedNetwork = [
                        {
                            name: "Ethereum",
                            type: "Mainnet",
                            symbol: "ETH",
                            token_standard: "ERC-20",
                            contract_address: ethereum_wallet[0]?.address,
                        },
                    ]
                }
                else if (coin.toLocaleLowerCase() === "xrp" && ripple_wallet && ripple_wallet[0]?.address) {
                    selectedNetwork = [
                        {
                            name: "XRP",
                            type: "Mainnet",
                            symbol: "XRP",
                            token_standard: "Ledger",
                            contract_address: ripple_wallet[0]?.address,
                        },
                    ]
                } else if (coin.toLocaleLowerCase() === "solana" && solana_wallet && solana_wallet[0]?.address) {
                    selectedNetwork = [
                        {
                            name: "Solana",
                            type: "Mainnet",
                            symbol: "SOL",
                            token_standard: "SPL",
                            contract_address: solana_wallet[0]?.address,
                        }
                    ]
                } else if (coin.toLocaleLowerCase() === "tron" && tron_wallet && tron_wallet[0]?.address) {
                    selectedNetwork = [
                        {
                            name: "Tron",
                            type: "Mainnet",
                            symbol: "TRX",
                            token_standard: "TRC-20",
                            contract_address: tron_wallet[0]?.address,
                        },
                    ]
                }
                else if (coin.toLocaleLowerCase() === "tether usdt" && ethereum_wallet && ethereum_wallet[0]?.address) {
                    selectedNetwork = [
                        { name: "Ethereum", token_standard: "ERC-20", contract_address: ethereum_wallet[0]?.address },
                        {
                            name: "Tron",
                            token_standard: "TRC-20",
                            contract_address: "TWe4sZUd4kYj3xENv1UhgWKMK1XK6ZowYc",
                        },
                        {
                            name: "Binance Smart Chain",
                            token_standard: "BEP-20",
                            contract_address: "0x1924e1f0db0d1711831a1a6b90e96c3be0cd5c65",
                        },
                        {
                            name: "Polygon",
                            token_standard: "ERC-20",
                            contract_address: "0x13860bc00cced338ecb27e2a62177e531e317b3f",
                        },
                    ]
                }
                else {
                    selectedNetwork = networks;
                }
                break;
            }
            if (cryptoName) break;
        }
    }
    const handleCopy = async (address: string | undefined) => {
        if (!address) return;
        try {
            await navigator.clipboard.writeText(address);
            setCopied(true);
            toast.success("Deposit address copied");
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Could not copy the address. Select it manually.");
        }
    }
    const [network, setNetwork] = React.useState<string | undefined>('');
    const [address, setAddress] = React.useState<string | undefined>('');

    React.useEffect(() => {
        const defaultNetwork = selectedNetwork && selectedNetwork.length > 0 ? selectedNetwork[0] : undefined;
        setNetwork(defaultNetwork?.name);
        setAddress(defaultNetwork?.contract_address);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

const minimal_deposit = crypto?.quote?.USD?.price && crypto.quote.USD.price > 0
        ? Number((10 / crypto.quote.USD.price).toFixed(8))
        : 0;

    return (
        <div className="flex w-full flex-col gap-5">
            <div className="flex items-center gap-2.5">
                <span className="relative flex h-6 w-fit items-center bg-blend-darken">
                    <Icon icon="icon-park-solid:hexagon-one" className="relative left-3.5 top-3 z-10 h-4 w-4 text-lnd-fg-muted/50" />
                    <Icon icon="mdi:stop-circle" className="relative -top-4 z-50 h-6 w-6 rotate-45 text-lnd-accent/30" />
                </span>
                <h1 className="db-title">Deposit</h1>
            </div>

            <div className="flex w-full flex-col gap-6 rounded-[1.25rem] bg-lnd-surface px-4 py-5 pb-8 sm:p-6 lg:flex-row lg:justify-between lg:gap-8 lg:px-8">
                <div className="flex w-full min-w-0 gap-3 lg:w-[57%]">
                    <div className="hidden shrink-0 flex-col items-center lg:flex">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-lnd-accent text-[.85rem] text-lnd-accent-fg">
                            1
                        </span>
                        <span className="my-1 h-24 border-l border-dashed border-lnd-border" aria-hidden="true" />
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-lnd-accent text-[.85rem] text-lnd-accent-fg">
                            2
                        </span>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-start gap-6">
                        <CryptoSelector
                            value={value}
                            setValue={setValue}
                            open={open}
                            setOpen={setOpen}
                        />

                        <div className="flex min-w-0 flex-col gap-3">
                            <Label className="flex items-center gap-2 font-Manrope text-[.87rem] font-bold text-lnd-fg lg:gap-0">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-lnd-accent text-[.85rem] text-lnd-accent-fg lg:hidden">
                                    2
                                </span>
                                Generate Deposit Address
                            </Label>
                            <div className="flex items-center gap-1.5">
                                <span className="font-Manrope text-[.89rem] text-lnd-fg-muted">
                                    Select Network
                                </span>
                                <PiWarningCircleThin className="mt-[2px] h-4 w-4 shrink-0 text-lnd-fg-muted" />
                            </div>
                            <RadioGroup
                                value={network}
                                onValueChange={(name) => {
                                    setNetwork(name);
                                    const selected = selectedNetwork.find((item) => item.name === name);
                                    setAddress(selected?.contract_address);
                                }}
                                className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {selectedNetwork?.map((network: CryptoNetwork) => (
                                    <Label key={network.name} className="flex min-w-0 cursor-pointer items-center gap-2.5 rounded-md border border-muted bg-lnd-surface-2 px-3 py-2.5 text-sm font-semibold transition-all duration-300 hover:border-lnd-accent/55 hover:bg-lnd-accent/10 dark:border-lnd-border dark:bg-lnd-surface dark:text-lnd-fg dark:hover:border-lnd-accent/55 dark:hover:bg-lnd-accent/15 [&:has([data-state=checked])]:border-lnd-accent/55 [&:has([data-state=checked])]:bg-lnd-accent/10 dark:[&:has([data-state=checked])]:border-lnd-accent/55 dark:[&:has([data-state=checked])]:bg-lnd-accent/20">
                                        <RadioGroupItem value={network.name} className="sr-only" />
                                        <span className="min-w-0 break-words">
                                            {network.name}
                                        </span>
                                        {network?.token_standard !== "" &&
                                            <span className="text-lnd-fg-muted">
                                                ({network?.token_standard})
                                            </span>}
                                    </Label>
                                ))}
                            </RadioGroup>
                        </div>

                        <div className="w-full min-w-0 space-y-4">
                            {
                                showAddress === false ? (
                                    <>
                                        <div className="flex w-full flex-col items-center gap-3 rounded-md border border-dashed border-lnd-border px-4 py-4 dark:bg-lnd-surface sm:px-5 sm:py-5">
                                            <h2 className="text-center text-[.96rem] font-bold dark:text-lnd-fg">
                                                <span className="text-amber-600 dark:text-amber-400">{crypto?.symbol}-{crypto?.name}</span> Risk Reminder
                                            </h2>
                                            <p className="pb-1 text-center text-[.78rem] leading-relaxed text-lnd-fg-muted dark:text-lnd-fg-muted">
                                                * The address is ONLY available for <span className="text-amber-500 dark:text-amber-400">{crypto?.symbol}-{crypto?.name}</span> deposit. Deposit of other assets will lead to permanent asset loss.
                                            </p>
                                            <span className="flex max-w-full items-start gap-1.5 text-left text-[.782rem] dark:text-lnd-fg-muted">
                                                <Checkbox
                                                    checked={checked}
                                                    onCheckedChange={checked => setChecked(checked === true)}
                                                    className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border border-lnd-border hover:border-lnd-accent/55 dark:border-lnd-border dark:hover:border-lnd-accent/55"
                                                />
                                                <span className="min-w-0">I&apos;m aware of the risk and would like to proceed</span>
                                            </span>
                                        </div>
                                        <Button onClick={() => setShowAddress(true)} className={checked === true ? "h-auto w-full rounded-[1.25rem] bg-lnd-accent py-3 text-base font-normal text-lnd-accent-fg hover:bg-lnd-accent/90" : "h-auto w-full rounded-[1.25rem] bg-lnd-surface-2 py-3 text-base font-normal text-lnd-fg-muted hover:bg-lnd-surface-2 dark:bg-lnd-surface-2 dark:text-lnd-fg-muted dark:hover:bg-lnd-surface-2"} disabled={checked === false}>
                                            Confirm
                                        </Button>
                                    </>
                                ) : (
                                    <div className="space-y-3">
                                        <span className="text-sm font-medium dark:text-lnd-fg">Deposit To</span>
                                        <div className="w-full rounded-xl bg-lnd-surface-2 p-3 dark:bg-lnd-surface">
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                                <p className="min-w-0 flex-1 select-all break-all font-mono text-[0.72rem] leading-relaxed text-lnd-fg-muted dark:text-lnd-fg sm:text-[0.82rem]">
                                                    {address}
                                                </p>
                                                <div className="flex shrink-0 items-center gap-1 self-end sm:self-auto">
                                                    <Button
                                                        onClick={() => handleCopy(address)}
                                                        aria-label="Copy deposit address"
                                                        className="h-auto w-auto rounded-md bg-lnd-surface-2 p-2 text-lnd-fg-muted hover:bg-lnd-surface-2 dark:bg-lnd-surface-2 dark:text-lnd-fg-muted dark:hover:bg-lnd-surface-2"
                                                    >
                                                        {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                                                    </Button>
                                                    <Button
                                                        onClick={() => setQrOpen(true)}
                                                        aria-label="Show deposit address QR code"
                                                        className="h-auto w-auto rounded-md bg-lnd-surface-2 p-2 text-lnd-fg-muted hover:bg-lnd-surface-2 dark:bg-lnd-surface-2 dark:text-lnd-fg-muted dark:hover:bg-lnd-surface-2"
                                                    >
                                                        <QrCode className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex w-full flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                                            <div className="flex min-w-0 items-start gap-2 sm:w-1/2">
                                                <PiWarningCircleThin className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                                                <span className="text-[.78rem] leading-relaxed text-lnd-fg-muted dark:text-lnd-fg-muted">
                                                    Only send {crypto?.symbol} to this address.
                                                </span>
                                            </div>
                                            <a href="#deposit-records" className="flex items-center gap-1 self-start text-[.78rem] text-lnd-accent hover:text-lnd-accent sm:self-auto">
                                                <span>Deposit History</span>
                                                <BiChevronRight className="h-4 w-4" />
                                            </a>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>

                <div className="flex w-full flex-col gap-4 lg:w-[40%]">
                    <TotalAsset value={value} />
                    <div className="flex w-full flex-col gap-3">
                        <span className="font-Manrope text-[.92rem] font-bold text-lnd-fg dark:text-lnd-fg">
                            Deposit Instructions
                        </span>
                        <div className="flex w-full flex-col gap-2.5">
                            <div className="flex w-full items-start gap-2">
                                <BsQuestionCircleFill className="mt-0.5 h-4 w-4 shrink-0 text-lnd-accent dark:text-lnd-accent" />
                                <span className="min-w-0 text-[.82rem] leading-relaxed text-lnd-fg-muted dark:text-lnd-fg-muted">
                                    Minimum deposit: {minimal_deposit} {crypto?.symbol}
                                </span>
                            </div>
                            <div className="flex w-full items-start gap-2">
                                <BsQuestionCircleFill className="mt-0.5 h-4 w-4 shrink-0 text-lnd-accent dark:text-lnd-accent" />
                                <span className="min-w-0 text-[.82rem] leading-relaxed text-lnd-fg-muted dark:text-lnd-fg-muted">
                                    Deposits below the minimum will not be credited.
                                </span>
                            </div>
                            <div className="flex w-full items-start gap-2">
                                <BsQuestionCircleFill className="mt-0.5 h-4 w-4 shrink-0 text-lnd-accent dark:text-lnd-accent" />
                                <span className="min-w-0 text-[.82rem] leading-relaxed text-lnd-fg-muted dark:text-lnd-fg-muted">
                                    Only deposit {crypto?.name} to this address.
                                </span>
                            </div>
                            <div className="flex w-full items-start gap-2">
                                <BsQuestionCircleFill className="mt-0.5 h-4 w-4 shrink-0 text-lnd-accent dark:text-lnd-accent" />
                                <span className="min-w-0 text-[.82rem] leading-relaxed text-lnd-fg-muted dark:text-lnd-fg-muted">
                                    Deposits require 1 network confirmation.
                                </span>
                            </div>
                            <div className="flex w-full items-start gap-2">
                                <BsQuestionCircleFill className="mt-0.5 h-4 w-4 shrink-0 text-lnd-accent dark:text-lnd-accent" />
                                <span className="min-w-0 text-[.82rem] leading-relaxed text-lnd-fg-muted dark:text-lnd-fg-muted">
                                    Please ensure your deposit address is correct.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DepositTable />

            <Dialog open={qrOpen} onOpenChange={setQrOpen}>
                <DialogContent className="w-[calc(100vw-2rem)] max-w-sm rounded-2xl border-lnd-border bg-lnd-surface p-0">
                    <DialogHeader className="px-5 pb-0 pt-5">
                        <DialogTitle className="font-Manrope text-lg font-bold text-lnd-fg">
                            {crypto?.symbol} deposit address
                        </DialogTitle>
                        <DialogDescription className="text-[.78rem] leading-relaxed text-lnd-fg-muted">
                            Scan or copy this address to deposit {crypto?.name}
                            {network ? ` on ${network}` : ""}. Only send {crypto?.symbol} to it.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-4 px-5 pb-6 pt-4">
                        <div className="rounded-2xl bg-white p-3">
                            <QRCode value={address ?? ""} size={176} />
                        </div>
                        <code className="w-full select-all break-all rounded-lg bg-lnd-surface-2 px-3 py-2 text-center font-mono text-[0.7rem] leading-relaxed text-lnd-fg">
                            {address}
                        </code>
                        <Button
                            onClick={() => handleCopy(address)}
                            className="h-auto w-full rounded-xl bg-lnd-accent py-2.5 text-sm font-semibold text-lnd-accent-fg hover:bg-lnd-accent/90"
                        >
                            {copied ? "Copied" : "Copy address"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}