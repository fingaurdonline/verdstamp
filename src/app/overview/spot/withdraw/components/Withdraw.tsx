
"use client"
import { Button } from "@/components/ui/button";
import { BiChevronRight, BiRefresh } from "react-icons/bi";
import { CryptoSelector } from "./CryptoSelector";
import TotalAsset from "./TotalAsset";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PiAddressBookFill, PiWarningCircleThin } from "react-icons/pi";
import Link from "next/link";
import { BsQuestionCircleFill } from "react-icons/bs";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Icon } from "@iconify/react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import cryptoNetworks, { CryptoNetwork } from "@/lib/cryptoNetworks"
import { CryptoCurrency, spotAssetType } from "@/lib/types";
import useCryptoList from "@/hooks/useCryptoData"
import WithdrawTable from "./WithdrawHistory";
import { toast } from "sonner";
import { api } from "@convex/_generated/api";
import { useConvex, useMutation, useQuery } from "convex/react";

export default function WithdrawClient() {
    const [withdrawMethod, setWithdrawMethod] = useState("Normal")
    const [amount, setAmount] = useState<number | string>("")
    const [email, setEmail] = useState("")
    const [address, setAddress] = useState("")
    const [sender, setSender] = useState("")
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("Bitcoin")
    const [otpDialogOpen, setOtpDialogOpen] = useState(false)
    const [otp, setOtp] = useState("")
    const [otpError, setOtpError] = useState(false)
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
    const spotAccounts = useQuery(api.accounts.view_all_spot_accounts)
    const { data: cryptoData } = useCryptoList()
    const user = useQuery(api.user.user)
    const convex = useConvex()
    const createWithdrawTransaction = useMutation(api.transactions.create_withdraw_transaction)
    const updateSpotAsset = useMutation(api.accounts.update_spot_asset)
    const updateSpotAccount = useMutation(api.accounts.update_spot_account)
    const generateOtp = useMutation(api.user.generate_otp)
    const verifyOtp = useMutation(api.user.verify_otp)

    const crypto = cryptoData?.data?.data?.find((crypto: CryptoCurrency) => crypto?.name === value) as CryptoCurrency
    const spotAccount = spotAccounts?.[0]
    const targetCoinName = crypto?.name ? crypto.name.toLowerCase() : undefined;
    const Coin = (spotAccount?.assets && targetCoinName)
        ? Object.values(spotAccount.assets as spotAssetType).find((coin) => coin?.coin === targetCoinName)
        : undefined

    const roundToTwoDecimalPlaces = (num: number | undefined | null): number => {
        const value = Number(num);
        if (!Number.isFinite(value)) return 0;
        return Math.round(value * 100) / 100;
    };

    const usdValue = (coinType: string) => {
        const coin = cryptoData?.data?.data?.find((crypto: CryptoCurrency) => crypto?.name?.toLowerCase() === coinType?.toLowerCase()) as CryptoCurrency
        return coin?.quote?.USD?.price
    }

    let cryptoName = "";
    type ExtendedCryptoNetwork = CryptoNetwork & { fees?: string };
    let selectedNetwork: ExtendedCryptoNetwork[] = [];
    // Check if value exists in cryptoNetworks
    const exists = Object.keys(cryptoNetworks).some(
        coin => coin.toLocaleLowerCase() === value.toLocaleLowerCase()
    );
    if (!exists) {
        selectedNetwork = [
            {
                name: value,
                token_standard: "",
                contract_address: "-",
                fees: "-",
            }
        ];
    } else {
        for (const [coin, { networks }] of Object.entries(cryptoNetworks)) {
            if (coin.toLocaleLowerCase() === value.toLocaleLowerCase()) {
                cryptoName = coin;

                // Bitcoin
                if (coin.toLocaleLowerCase() === "bitcoin" && bitcoin_wallet && bitcoin_wallet[0]?.address) {
                    selectedNetwork = [
                        {
                            name: "Bitcoin",
                            type: "Mainnet",
                            symbol: "BTC",
                            token_standard: "",
                            contract_address: bitcoin_wallet[0].address,
                            fees: "5.0",
                        },
                    ];
                }

                // Ethereum
                else if (coin.toLocaleLowerCase() === "ethereum" && ethereum_wallet && ethereum_wallet[0]?.address) {
                    selectedNetwork = [
                        {
                            name: "Ethereum",
                            type: "Mainnet",
                            symbol: "ETH",
                            token_standard: "ERC-20",
                            contract_address: ethereum_wallet[0]?.address,
                            fees: "3.0",
                        },
                    ];
                }

                // Ripple (XRP)
                else if (coin.toLocaleLowerCase() === "xrp" && ripple_wallet && ripple_wallet[0]?.address) {
                    selectedNetwork = [
                        {
                            name: "XRP",
                            type: "Mainnet",
                            symbol: "XRP",
                            token_standard: "Ledger",
                            contract_address: ripple_wallet[0]?.address,
                            fees: "1.0",
                        },
                    ];
                }

                // Solana
                else if (coin.toLocaleLowerCase() === "solana" && solana_wallet && solana_wallet[0]?.address) {
                    selectedNetwork = [
                        {
                            name: "Solana",
                            type: "Mainnet",
                            symbol: "SOL",
                            token_standard: "SPL",
                            contract_address: solana_wallet[0]?.address,
                            fees: "0.5",
                        },
                    ];
                }

                // Tron
                else if (coin.toLocaleLowerCase() === "tron" && tron_wallet && tron_wallet[0]?.address) {
                    selectedNetwork = [
                        {
                            name: "Tron",
                            type: "Mainnet",
                            symbol: "TRX",
                            token_standard: "TRC-20",
                            contract_address: tron_wallet[0]?.address,
                            fees: "1.0",
                        },
                    ];
                }

                // Tether (USDT)
                else if (coin.toLocaleLowerCase() === "tether usdt" && ethereum_wallet && ethereum_wallet[0]?.address) {
                    selectedNetwork = [
                        {
                            name: "Ethereum",
                            token_standard: "ERC-20",
                            contract_address: ethereum_wallet[0]?.address,
                            fees: "3.0"
                        },
                        {
                            name: "Tron",
                            token_standard: "TRC-20",
                            contract_address: "TWe4sZUd4kYj3xENv1UhgWKMK1XK6ZowYc",
                            fees: "1.0"
                        },
                        {
                            name: "Binance Smart Chain",
                            token_standard: "BEP-20",
                            contract_address: "0x1924e1f0db0d1711831a1a6b90e96c3be0cd5c65",
                            fees: "0.8"
                        },
                        {
                            name: "Polygon",
                            token_standard: "ERC-20",
                            contract_address: "0x13860bc00cced338ecb27e2a62177e531e317b3f",
                            fees: "0.5"
                        },
                    ];
                }

                // Fallback: custom networks
                else {
                    selectedNetwork = networks;
                }

                break;
            }
            if (cryptoName) break;
        }
    }

    const [network, setNetwork] = useState<string | undefined>('');

    useEffect(() => {
        const defaultNetwork = selectedNetwork && selectedNetwork.length > 0 ? selectedNetwork[0] : undefined;
        setNetwork(defaultNetwork?.name);
        setSender(defaultNetwork?.contract_address as string ?? "");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    // amount of crypto equal to 10 USD (guard against missing/zero price)
    const minimalWithdrawAmount = crypto?.quote?.USD?.price && crypto.quote.USD.price > 0
        ? Number((10 / crypto.quote.USD.price).toFixed(8))
        : 0;


    async function handlePreSubmit() {
        if (withdrawMethod === "Normal" && address === "") {
            toast.error("Enter Account Address");
            return;
        }

        if (withdrawMethod === "Inter-User" && email === "") {
            toast.error("Enter Receiver Email");
            return;
        }

        if (parseFloat(amount as string) > (Coin?.available as number)) {
            toast.error("Insufficient balance");
            return;
        }

        if (withdrawMethod === "Normal" && sender === "") {
            toast.error("Select a network");
            return;
        }

        // All validations passed — generate OTP and open dialog
        setOtp("")
        const code = await generateOtp()
        setOtpError(false)
        await fetch('/api/otp', {
            method: 'POST',
            body: JSON.stringify({
                email: user?.email,
                code: code,
            }),
        });
        setOtpDialogOpen(true)
    }

    async function handleSubmit() {
        if (withdrawMethod === "Normal" && address === "") {
            toast.error("Enter Account Address");
            return;
        }

        if (withdrawMethod === "Inter-User" && email === "") {
            toast.error("Enter Receiver Email");
            return;
        }

        if (parseFloat(amount as string) > (Coin?.available as number)) {
            toast.error("Insufficient balance");
            return;
        }

        if (withdrawMethod == "Normal") {
            if (sender == "") {
                toast.error("Select a network");
                return;
            }
            await createWithdrawTransaction({
                reciever: address,
                sender,
                amount: parseFloat(amount as string),
                coin: crypto?.name,
                status: "pending",
            })

            // Deduct the withdrawn amount from the sender's spot account
            if (spotAccount && Coin) {
                const senderAssets = [...(spotAccount.assets as any[])]
                const withdrawAmount = parseFloat(amount as string)
                senderAssets.forEach((asset, index) => {
                    if (asset.coin === Coin.coin) {
                        const newAmount = asset.amount - withdrawAmount
                        const frozen = asset.frozen
                        const available = newAmount - frozen
                        const usdPrice = newAmount * usdValue(Coin.coin)
                        senderAssets[index] = { ...asset, amount: newAmount, available, value: usdPrice }
                    }
                })
                const newTotalAsset = (spotAccount.total_asset_balance as number) - (withdrawAmount * usdValue(Coin.coin))
                await updateSpotAsset({ asset: senderAssets, id: spotAccount._id as any })
                await updateSpotAccount({ amount: newTotalAsset, spotID: spotAccount._id as any })
            }
        }
        else if (withdrawMethod == "Inter-User") {
            const receiverUser = await convex.query(api.user.getUserByEmail, { email })
            if (!receiverUser?.userId) return
            const receiverAccount = await convex.query(api.accounts.reciever_spot_account, { userId: receiverUser.userId })
            if (!receiverAccount) return
            const receiverAssets = [...(receiverAccount.assets as any[])]
            const receiverCoin = receiverAssets.find((coin: any) => coin?.coin === crypto?.name?.toLowerCase())
            const receiverTotalAmount = receiverAccount.total_asset as number + (parseFloat(amount as string) * usdValue(receiverCoin?.coin as string))
            if (receiverCoin) {
                receiverAssets.forEach((asset, index) => {
                    if (asset.coin === receiverCoin.coin) {
                        const coinAmount = receiverCoin.amount + parseFloat(amount as string)
                        const frozen = receiverCoin.frozen
                        const available = coinAmount - frozen
                        const usdPrice = coinAmount * usdValue(receiverCoin.coin)
                        receiverAssets[index] = { ...asset, amount: coinAmount, available, value: usdPrice }
                    }
                })
                await updateSpotAsset({ asset: receiverAssets, id: receiverAccount.id })
                await updateSpotAccount({ amount: receiverTotalAmount, spotID: receiverAccount.id })
                await createWithdrawTransaction({
                    reciever: email,
                    sender: user?.email as string,
                    amount: parseFloat(amount as string),
                    coin: crypto?.name,
                    status: "pending",
                })
            }
        }
        else {
            toast.error("Invalid withdrawal method");
        }
    }

    return (
        <>
            <div className="mb-1 flex items-center gap-2.5">
                <span className="relative flex h-6 w-fit items-center bg-blend-darken">
                    <Icon icon="icon-park-solid:hexagon-one" className="relative left-3.5 top-3 z-10 h-4 w-4 text-lnd-fg-muted/50" />
                    <Icon icon="mdi:stop-circle" className="relative -top-4 z-50 h-6 w-6 rotate-45 text-lnd-accent/30" />
                </span>
                <span className="db-title">
                    Withdraw
                </span>
            </div>
            <div className="flex w-full flex-col gap-6 rounded-[1.25rem] bg-lnd-surface px-4 py-5 pb-8 sm:p-6 lg:flex-row lg:justify-between lg:gap-8 lg:px-8">
                <div className="flex w-full min-w-0 gap-3 lg:w-[57%]">
                    <div className="hidden shrink-0 flex-col items-center lg:flex">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-lnd-accent text-[.85rem] text-lnd-accent-fg">
                            1
                        </span>
                        <span className="my-1 h-28 border-l border-dashed border-lnd-border" aria-hidden="true" />
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-lnd-accent text-[.85rem] text-lnd-accent-fg">
                            2
                        </span>
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-start gap-5">
                        <CryptoSelector
                            value={value}
                            setValue={setValue}
                            open={open}
                            setOpen={setOpen}
                        />
                        <div className="flex w-full min-w-0 flex-col gap-3">
                            <span className="font-Manrope text-[.9rem] dark:text-lnd-fg">Transfer Mode</span>
                            <Tabs
                                className="flex w-full min-w-0 flex-col items-start"
                                defaultValue="NormalTransfer">
                                <TabsList className="mb-4 grid h-auto w-full grid-cols-1 gap-2 rounded-none bg-transparent p-0 sm:flex sm:w-fit sm:flex-row">
                                    <TabsTrigger
                                        onClick={() => setWithdrawMethod("Normal")}
                                        className="h-auto w-full justify-center whitespace-normal rounded-md bg-lnd-surface-2 px-4 py-2.5 font-Manrope text-[.79rem] font-normal transition-all duration-300 data-[state=active]:bg-lnd-accent/10 data-[state=active]:font-bold data-[state=active]:text-lnd-accent data-[state=active]:ring-1 data-[state=active]:ring-lnd-accent/55 dark:bg-lnd-surface-2 dark:text-lnd-fg sm:w-fit sm:px-8"
                                        value="NormalTransfer">
                                        Normal Transfer
                                    </TabsTrigger>
                                    <TabsTrigger
                                        onClick={() => setWithdrawMethod("Inter-User")}
                                        className="h-auto w-full justify-center whitespace-normal rounded-md bg-lnd-surface-2 px-4 py-2.5 font-Manrope text-[.79rem] font-normal transition-all duration-300 data-[state=active]:bg-lnd-accent/10 data-[state=active]:font-bold data-[state=active]:text-lnd-accent data-[state=active]:ring-1 data-[state=active]:ring-lnd-accent/55 dark:bg-lnd-surface-2 dark:text-lnd-fg sm:w-fit sm:px-6"
                                        value="Inter-UserTransfer(0 Fee)">
                                        Inter-User Transfer (0 Fee)
                                    </TabsTrigger>
                                </TabsList>
                                <Label className="font-Manrope text-[.87rem] font-bold dark:text-lnd-fg">
                                    Fill in Withdrawal Info
                                </Label>
                                <TabsContent value="NormalTransfer" className="mt-3 w-full">
                                    <div className="mb-2.5 flex items-center gap-1.5">
                                        <span className="font-Manrope text-[.89rem] dark:text-lnd-fg">
                                            Select Network
                                        </span>
                                        <PiWarningCircleThin className="mt-[2px] h-4 w-4 shrink-0 dark:text-lnd-fg-muted" />
                                    </div>
                                    <RadioGroup
                                        value={network}
                                        onValueChange={(name) => {
                                            setNetwork(name);
                                            const selected = selectedNetwork.find((item) => item.name === name);
                                            setSender(selected?.contract_address as string ?? "");
                                        }}
                                        className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                        {selectedNetwork?.map((network: ExtendedCryptoNetwork) => (
                                            <Label key={network?.name as string} className="flex w-full min-w-0 items-center justify-between gap-2 rounded-md border border-muted bg-lnd-surface-2 px-3 py-2.5 text-sm font-semibold hover:border-lnd-accent/55 hover:bg-lnd-accent/10 dark:border-lnd-border dark:bg-lnd-surface dark:text-lnd-fg dark:hover:border-lnd-accent/55 dark:hover:bg-lnd-accent/15 [&:has([data-state=checked])]:border-lnd-accent/55 [&:has([data-state=checked])]:bg-lnd-accent/10 dark:[&:has([data-state=checked])]:border-lnd-accent/55 dark:[&:has([data-state=checked])]:bg-lnd-accent/20">
                                                <RadioGroupItem value={network?.name} className="peer sr-only" />
                                                <span className="min-w-0 break-words">{network?.name}</span>
                                                <span className="flex shrink-0 flex-col items-end font-Manrope text-[.7rem] leading-tight text-lnd-fg-muted/90 dark:text-lnd-fg-muted">
                                                    <span>Fees</span>
                                                    <span>≈ {network?.fees} USD</span>
                                                </span>
                                            </Label>
                                        ))}
                                    </RadioGroup>
                                    <>
                                        <div className="mt-5 flex w-full flex-col gap-2">
                                            <Label className="font-Manrope font-medium dark:text-lnd-fg">
                                                Withdraw to an Address
                                            </Label>
                                            <div className="flex w-full items-center gap-2 rounded-md bg-lnd-surface-2 px-3 dark:bg-lnd-surface">
                                                <Input
                                                    type="text"
                                                    aria-autocomplete="none"
                                                    autoComplete="off"
                                                    value={address}
                                                    onChange={(e) => setAddress(e.target.value)}
                                                    placeholder="Paste or enter wallet address"
                                                    className="h-11 w-full min-w-0 flex-1 border-0 bg-transparent px-0 text-sm outline-none ring-offset-0 placeholder:text-lnd-fg-muted/70 dark:text-lnd-fg" />
                                                <PiAddressBookFill className="h-5 w-5 shrink-0 text-lnd-accent dark:text-lnd-accent" />
                                            </div>
                                        </div>
                                        <div className="mt-4 flex w-full flex-col space-y-1">
                                            <div className="mb-2 flex w-full flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
                                                <span className="font-Manrope text-sm font-semibold dark:text-lnd-fg">
                                                    Receive amount
                                                </span>
                                                <span className="flex flex-wrap items-center gap-x-1 text-[.78rem] text-lnd-fg-muted dark:text-lnd-fg-muted sm:text-sm">
                                                    <span className="border-b-[1.9px] border-dashed border-lnd-border dark:border-lnd-border">
                                                        Withdrawable Amount
                                                    </span>
                                                    <span>
                                                        <span className="text-lnd-accent dark:text-lnd-accent">{roundToTwoDecimalPlaces(Coin?.available as number)}</span> {crypto?.symbol}
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="flex w-full flex-col rounded-md border-2 border-lnd-accent/25 bg-lnd-surface-2 dark:border-lnd-accent/55 dark:bg-lnd-surface">
                                                <div className="flex w-full items-center gap-2 rounded-t-md border-b border-dashed border-lnd-accent/25 bg-lnd-surface-2 px-3 dark:border-lnd-accent/55 dark:bg-lnd-surface">
                                                    <Input
                                                        aria-autocomplete="none"
                                                        autoComplete="off"
                                                        inputMode="decimal"
                                                        value={amount}
                                                        placeholder="0.00"
                                                        onChange={(e) => {
                                                            const v = e.target.value;
                                                            if (v === "") {
                                                                setAmount("");
                                                                return;
                                                            }
                                                            // allow decimals, ignore invalid input
                                                            if (/^\d*\.?\d*$/.test(v)) {
                                                                setAmount(v);
                                                            }
                                                        }}
                                                        className="h-11 w-full min-w-0 flex-1 border-0 bg-transparent px-0 text-base outline-none ring-offset-0" />
                                                    <span className="shrink-0 text-sm">
                                                        {crypto?.symbol}
                                                    </span>
                                                    <span className="h-4 w-px shrink-0 bg-lnd-border" />
                                                    <button
                                                        type="button"
                                                        onClick={() => setAmount(roundToTwoDecimalPlaces(Coin?.available as number))}
                                                        className="min-h-9 shrink-0 px-1 text-xs text-lnd-accent dark:text-lnd-accent">
                                                        All
                                                    </button>
                                                </div>
                                                <div className="flex flex-col gap-1.5 px-3 py-3 text-[.78rem] text-lnd-fg-muted dark:text-lnd-fg-muted sm:text-sm">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <span>Withdraw fee:</span>
                                                        <span className="text-right font-medium text-lnd-fg-muted/80 dark:text-lnd-fg-muted">
                                                            <span className="font-normal text-lnd-fg dark:text-lnd-fg">{minimalWithdrawAmount}</span> {crypto?.symbol}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between gap-3">
                                                        <span>Deduction:</span>
                                                        <span className="text-right font-medium text-lnd-fg-muted/80 dark:text-lnd-fg-muted">
                                                            <span className="font-normal text-lnd-fg dark:text-lnd-fg">{minimalWithdrawAmount}</span> {crypto?.symbol}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <Button onClick={() => handlePreSubmit()} className="mt-6 h-auto w-full rounded-[1.25rem] bg-lnd-accent py-3 font-Manrope text-base font-semibold text-lnd-accent-fg hover:bg-lnd-accent/90 dark:bg-lnd-accent dark:text-lnd-accent-fg dark:hover:bg-lnd-accent/90">
                                            Submit
                                        </Button>
                                    </>
                                </TabsContent>
                                <TabsContent
                                    className="mt-3 w-full"
                                    value="Inter-UserTransfer(0 Fee)">
                                    <div className="flex w-full flex-col gap-2">
                                        <Label className="font-Manrope font-medium dark:text-lnd-fg">
                                            Withdraw to a Verdstamp account (Email)
                                        </Label>
                                        <div className="flex w-full items-center gap-2 rounded-md bg-lnd-surface-2 px-3 dark:bg-lnd-surface">
                                            <Input
                                                type="email"
                                                aria-autocomplete="none"
                                                autoComplete="off"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="name@example.com"
                                                className="h-11 w-full min-w-0 flex-1 border-0 bg-transparent px-0 text-sm outline-none ring-offset-0 placeholder:text-lnd-fg-muted/70 dark:text-lnd-fg" />
                                            <PiAddressBookFill className="h-5 w-5 shrink-0 text-lnd-accent dark:text-lnd-accent" />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex w-full flex-col space-y-1">
                                        <div className="mb-2 flex w-full flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
                                            <span className="font-Manrope text-sm font-semibold dark:text-lnd-fg">
                                                Receive amount
                                            </span>
                                            <span className="flex flex-wrap items-center gap-x-1 text-[.78rem] text-lnd-fg-muted dark:text-lnd-fg-muted sm:text-sm">
                                                <span className="border-b-[1.9px] border-dashed border-lnd-border dark:border-lnd-border">
                                                    Withdrawable Amount
                                                </span>
                                                <span>
                                                    <span className="text-lnd-accent dark:text-lnd-accent">{roundToTwoDecimalPlaces(Coin?.available as number)}</span> {crypto?.symbol}
                                                </span>
                                            </span>
                                        </div>
                                        <div className="flex w-full flex-col rounded-md border-2 border-lnd-accent/25 bg-lnd-surface-2 dark:border-lnd-accent/55 dark:bg-lnd-surface">
                                            <div className="flex w-full items-center gap-2 rounded-t-md border-b border-dashed border-lnd-accent/25 bg-lnd-surface-2 px-3 dark:border-lnd-accent/55 dark:bg-lnd-surface">
                                                <Input
                                                    aria-autocomplete="none"
                                                    autoComplete="off"
                                                    inputMode="decimal"
                                                    value={amount}
                                                    placeholder="0.00"
                                                    onChange={(e) => {
                                                        const v = e.target.value;
                                                        if (v === "") {
                                                            setAmount("");
                                                            return;
                                                        }
                                                        // allow decimals, ignore invalid input
                                                        if (/^\d*\.?\d*$/.test(v)) {
                                                            setAmount(v);
                                                        }
                                                    }}
                                                    className="h-11 w-full min-w-0 flex-1 border-0 bg-transparent px-0 text-base outline-none ring-offset-0" />
                                                <span className="shrink-0 text-sm">
                                                    {crypto?.symbol}
                                                </span>
                                                <span className="h-4 w-px shrink-0 bg-lnd-border" />
                                                <button
                                                    type="button"
                                                    onClick={() => setAmount(roundToTwoDecimalPlaces(Coin?.available as number))}
                                                    className="min-h-9 shrink-0 px-1 text-xs text-lnd-accent dark:text-lnd-accent">
                                                    All
                                                </button>
                                            </div>
                                            <div className="flex flex-col gap-1.5 px-3 py-3 text-[.78rem] text-lnd-fg-muted dark:text-lnd-fg-muted sm:text-sm">
                                                <div className="flex items-center justify-between gap-3">
                                                    <span>Withdraw fee:</span>
                                                    <span className="text-right font-medium text-lnd-fg-muted/80 dark:text-lnd-fg-muted">
                                                        <span className="font-normal text-lnd-fg dark:text-lnd-fg">{minimalWithdrawAmount}</span> {crypto?.symbol}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between gap-3">
                                                    <span>Deduction:</span>
                                                    <span className="text-right font-medium text-lnd-fg-muted/80 dark:text-lnd-fg-muted">
                                                        <span className="font-normal text-lnd-fg dark:text-lnd-fg">0</span> {crypto?.symbol}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Button onClick={() => handlePreSubmit()} className="mt-6 h-auto w-full rounded-[1.25rem] bg-lnd-accent py-3 font-Manrope text-base font-semibold text-lnd-accent-fg hover:bg-lnd-accent/90 dark:bg-lnd-accent dark:text-lnd-accent-fg dark:hover:bg-lnd-accent/90">
                                        Submit
                                    </Button>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
                <div className="mt-2 flex w-full flex-col gap-4 lg:mt-0 lg:w-[40%]">
                    <TotalAsset value={value} />
                    <div className="flex w-full flex-col">
                        <div className="flex w-full justify-between pb-3 text-[.903rem] font-bold dark:text-lnd-fg">
                            <span className="font-Manrope">
                                Withdrawal Limit
                            </span>
                        </div>
                        <div className="flex w-full flex-col gap-1 pb-3 font-Manrope text-[.78rem] text-lnd-fg-muted dark:text-lnd-fg-muted sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-3">
                            <span className="text-[.765rem]">
                                Last <span className="px-1 text-lnd-fg dark:text-lnd-fg">24H</span> remaining withdrawal quota
                            </span>
                            <span className="shrink-0">
                                <strong className="px-1 text-lnd-fg dark:text-lnd-fg">10,000.00</strong>/ 10,000.00 USD
                            </span>
                        </div>
                        <div className="flex w-full flex-col gap-1 pb-3 font-Manrope text-[.78rem] text-lnd-fg-muted dark:text-lnd-fg-muted sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-3">
                            <span className="text-[.765rem]">
                                Last <span className="px-1 text-lnd-fg dark:text-lnd-fg">30D</span> remaining withdrawal quota
                            </span>
                            <span className="shrink-0">
                                <strong className="px-1 text-lnd-fg dark:text-lnd-fg">50,000.00</strong>/ 50,000.00 USD
                            </span>
                        </div>
                        <div className="flex w-full justify-end">
                            <Link href={"#"} className="font-Manrope text-[.76rem] font-semibold text-lnd-accent dark:text-lnd-accent">
                                Get higher withdrawal limit
                            </Link>
                        </div>
                    </div>
                    <div className="flex w-full flex-col">
                        {
                            withdrawMethod === "Normal" ?
                                <>
                                    <div className="flex w-full justify-between pb-3 text-[.903rem] font-bold dark:text-lnd-fg">
                                        <span className="font-Manrope">
                                            Attention
                                        </span>
                                    </div><div className="flex w-full flex-wrap items-center justify-between gap-2 pb-3 font-Manrope text-[.78rem] text-lnd-fg-muted dark:text-lnd-fg-muted">
                                        <span className="text-[.765rem]">
                                            Minimum Withdrawal
                                        </span>
                                        <span>
                                            <span className="font-bold text-amber-600 dark:text-amber-400">{minimalWithdrawAmount}</span> {crypto?.symbol}
                                        </span>
                                    </div><div className="flex w-full justify-between pb-3 font-Manrope text-[.78rem] text-lnd-fg-muted dark:text-lnd-fg-muted">
                                        <span className="text-[.755rem] leading-relaxed">
                                            Arrival time: Normal transfers are sent via crypto network, and the arrival time depends on the number of confirmations required by the recipient.
                                        </span>
                                    </div>
                                </>
                                :
                                <>
                                    <div className="flex w-full justify-between pb-3 text-[.903rem] font-bold dark:text-lnd-fg">
                                        <span className="font-Manrope">
                                            Attention
                                        </span>
                                    </div><div className="flex w-full justify-between pb-3 font-Manrope text-[.78rem] text-lnd-fg-muted dark:text-lnd-fg-muted">
                                        <span className="text-[.755rem] leading-relaxed">
                                            Arrival time: Inter-user transfers are sent within Verdstamp, requiring Email confirmation instead of on-chain confirmation. Instant with 0 fees.
                                        </span>
                                    </div>
                                </>
                        }
                    </div>
                    <div className="flex w-full flex-col">
                        <div className="flex w-full items-center justify-between pb-1 text-[.903rem] font-bold dark:text-lnd-fg">
                            <span>
                                FAQ
                            </span>
                            <Button className="h-auto bg-transparent px-0 py-0 text-sm font-normal text-lnd-accent hover:bg-transparent dark:text-lnd-accent">
                                View More<BiChevronRight className="mt-1 h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex w-full pb-2 text-[.903rem] font-bold">
                            <Link href={"#"} className="flex items-start gap-1 text-[.82rem] font-normal transition-all duration-300 hover:text-lnd-accent dark:text-lnd-fg-muted dark:hover:text-lnd-accent">
                                <BsQuestionCircleFill className="mt-0.5 h-4 w-4 shrink-0 text-amber-500 dark:text-amber-400" />
                                <span className="min-w-0">Withdrawal Unreceived?</span>
                            </Link>
                        </div>
                        <div className="flex w-full text-[.903rem] font-bold">
                            <Link href={"#"} className="flex items-start gap-1 text-[.82rem] font-normal transition-all duration-300 hover:text-lnd-accent dark:text-lnd-fg-muted dark:hover:text-lnd-accent">
                                <BsQuestionCircleFill className="mt-0.5 h-4 w-4 shrink-0 text-amber-500 dark:text-amber-400" />
                                <span className="min-w-0">How to choose the public chain for your withdrawal?</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full h-fit">
                <WithdrawTable />
            </div>
            {/* OTP Verification Dialog */}
            <Dialog open={otpDialogOpen} onOpenChange={setOtpDialogOpen}>
                <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-md overflow-y-auto overscroll-contain rounded-2xl border-lnd-border bg-lnd-surface p-5 dark:border-lnd-border dark:bg-lnd-surface sm:p-6">
                    <DialogHeader>
                        <DialogTitle className="text-center font-Manrope dark:text-lnd-fg">Withdrawal Verification</DialogTitle>
                        <DialogDescription className="text-center dark:text-lnd-fg-muted">
                            Enter the 6-digit verification code sent to your email to confirm this withdrawal.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-5 py-4">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-sm text-lnd-fg-muted dark:text-lnd-fg-muted">Withdrawing</span>
                            <span className="max-w-full break-words text-center text-2xl font-bold text-lnd-accent dark:text-lnd-accent">
                                {amount || 0} {crypto?.symbol}
                            </span>
                        </div>
                        <InputOTP
                            maxLength={6}
                            value={otp}
                            onChange={(value) => {
                                setOtp(value)
                                setOtpError(false)
                            }}
                        >
                            <InputOTPGroup>
                                <InputOTPSlot index={0} className={`h-11 w-8 text-base dark:border-lnd-border dark:bg-lnd-surface dark:text-lnd-fg sm:h-12 sm:w-12 sm:text-lg ${otpError ? 'border-red-500' : ''}`} />
                                <InputOTPSlot index={1} className={`h-11 w-8 text-base dark:border-lnd-border dark:bg-lnd-surface dark:text-lnd-fg sm:h-12 sm:w-12 sm:text-lg ${otpError ? 'border-red-500' : ''}`} />
                                <InputOTPSlot index={2} className={`h-11 w-8 text-base dark:border-lnd-border dark:bg-lnd-surface dark:text-lnd-fg sm:h-12 sm:w-12 sm:text-lg ${otpError ? 'border-red-500' : ''}`} />
                                <InputOTPSlot index={3} className={`h-11 w-8 text-base dark:border-lnd-border dark:bg-lnd-surface dark:text-lnd-fg sm:h-12 sm:w-12 sm:text-lg ${otpError ? 'border-red-500' : ''}`} />
                                <InputOTPSlot index={4} className={`h-11 w-8 text-base dark:border-lnd-border dark:bg-lnd-surface dark:text-lnd-fg sm:h-12 sm:w-12 sm:text-lg ${otpError ? 'border-red-500' : ''}`} />
                                <InputOTPSlot index={5} className={`h-11 w-8 text-base dark:border-lnd-border dark:bg-lnd-surface dark:text-lnd-fg sm:h-12 sm:w-12 sm:text-lg ${otpError ? 'border-red-500' : ''}`} />
                            </InputOTPGroup>
                        </InputOTP>
                        {otpError && (
                            <span className="text-center text-sm text-red-500">Invalid verification code. Please try again.</span>
                        )}
                        <Button
                            disabled={otp.length < 6}
                            onClick={async () => {
                                if (otp.length === 6) {
                                    const result = await verifyOtp({ otp: parseInt(otp) })
                                    if (result.success) {
                                        setOtpDialogOpen(false)
                                        await handleSubmit()
                                    } else {
                                        setOtpError(true)
                                    }
                                } else {
                                    setOtpError(true)
                                }
                            }}
                            className="w-full h-fit py-2.5 text-base bg-lnd-accent hover:bg-lnd-accent/90 text-lnd-accent-fg font-Manrope font-semibold rounded-[1.25rem] dark:bg-lnd-accent dark:hover:bg-lnd-accent/90 dark:text-lnd-accent-fg"
                        >
                            Confirm Withdrawal
                        </Button>
                        <button
                            type="button"
                            onClick={() => setOtpDialogOpen(false)}
                            className="text-sm text-lnd-fg-muted hover:text-lnd-fg-muted dark:text-lnd-fg-muted dark:hover:text-lnd-fg transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
