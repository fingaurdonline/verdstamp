
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

    const roundToTwoDecimalPlaces = (num: number): number => {
        return Math.round(num * 100) / 100;
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    // amount of crypto equal to 10 USD (guard against missing/zero price)
    const minimalWithdrawAmount = crypto?.quote?.USD?.price && crypto.quote.USD.price > 0
        ? Number((10 / crypto.quote.USD.price).toFixed(8))
        : 0;


    async function handlePreSubmit() {
        if (withdrawMethod === "Normal" && address === "") {
            toast.custom(
                (id) => (
                    <div className="w-80 lg:w-140 h-8 flex items-center justify-center space-x-2 text-red-900 bg-red-100">
                        <span>Enter Account Address</span>
                    </div>
                ))
            return;
        }

        if (withdrawMethod === "Inter-User" && email === "") {
            toast.custom(
                (id) => (
                    <div className="w-80 lg:w-140 h-8 flex items-center justify-center space-x-2 text-red-900 bg-red-100">
                        <span>Enter Receiver Email</span>
                    </div>
                ))
            return;
        }

        if (parseFloat(amount as string) > (Coin?.available as number)) {
            toast.custom(
                (id) => (
                    <div className="w-80 lg:w-140 h-8 flex items-center justify-center space-x-2 text-red-900 bg-red-100">
                        <span>Insufficient</span>
                    </div>
                ))
            return;
        }

        if (withdrawMethod === "Normal" && sender === "") {
            toast.custom(
                (id) => (
                    <div className="w-80 lg:w-140 h-8 flex items-center justify-center space-x-2 text-red-900 bg-red-100">
                        <span>Add Network</span>
                    </div>
                ))
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
            toast.custom(
                (id) => (
                    <div className="w-80 lg:w-140 h-8 flex items-center justify-center space-x-2 text-red-900 bg-red-100">
                        <span>Enter Account Address</span>
                    </div>
                ))
            return;
        }

        if (withdrawMethod === "Inter-User" && email === "") {
            toast.custom(
                (id) => (
                    <div className="w-80 lg:w-140 h-8 flex items-center justify-center space-x-2 text-red-900 bg-red-100">
                        <span>Enter Receiver Email</span>
                    </div>
                ))
            return;
        }

        if (parseFloat(amount as string) > (Coin?.available as number)) {
            toast.custom(
                (id) => (
                    <div className="w-80 lg:w-140 h-8 flex items-center justify-center space-x-2 text-red-900 bg-red-100">
                        <span>Insufficient</span>
                    </div>
                ))
            return;
        }

        if (withdrawMethod == "Normal") {
            if (sender == "") {
                toast.custom(
                    (id) => (
                        <div className="w-80 lg:w-140 h-8 flex items-center justify-center space-x-2 text-red-900 bg-red-100">
                            <span>Add Network</span>
                        </div>
                    ))
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
            toast.custom(
                (id) => (
                    <div className="w-80 lg:w-140 h-8 flex items-center justify-center space-x-2 text-red-900 bg-red-100">
                        <span>Invalid Method</span>
                    </div>
                ))
        }
    }

    return (
        <>
            <div className="w-full lg:w-auto h-auto flex items-center space-x-2.5 mb-1">
                <span className="w-fit h-6 bg-blend-darken">
                    <Icon icon="icon-park-solid:hexagon-one" className="w-4 h-4 text-lnd-fg-muted/50 relative left-3.5 top-3 z-10" />
                    <Icon icon="mdi:stop-circle" className="w-6 h-6 text-lnd-accent/30 rotate-45 relative  -top-4 z-50" />
                </span>
                <span className="db-title">
                    Withdraw
                </span>
            </div>
            <div className="w-full h-auto py-6 px-6 pb-8 flex flex-col lg:flex-row lg:justify-between bg-lnd-surface dark:bg-lnd-surface rounded-[1.25rem]">
                <div className="w-full lg:w-[57%] h-auto flex space-x-3">
                    <div className="hidden lg:flex flex-col items-center space-y-1">
                        <span className="flex w-5 h-5 justify-center items-center bg-lnd-accent text-lnd-accent-fg text-[.85rem] rounded-full">
                            1
                        </span>
                        <div className="flex flex-col items-center justify-center space-y-[1.5px]">
                            <span className="w-px h-[3px] bg-lnd-surface-2/90" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90" />
                        </div>
                        <span className="flex w-5 h-5 justify-center items-center bg-lnd-accent text-lnd-accent-fg text-[.85rem] rounded-full">
                            2
                        </span>
                    </div>
                    <div className="flex flex-col w-full h-auto justify-start gap-5">
                        <CryptoSelector
                            value={value}
                            setValue={setValue}
                            open={open}
                            setOpen={setOpen}
                        />
                        <div className="w-auto h-auto flex flex-col gap-4 lg:gap-2">
                            <span className="text-[.9rem] font-Manrope">Transfer Mode</span>
                            <Tabs
                                className="flex flex-col items-start"
                                defaultValue="NormalTransfer">
                                <TabsList className="flex-col lg:flex-row items-start lg:items-center space-y-3 lg:space-y-0 lg:space-x-2 p-0 bg-transparent mb-5">
                                    <TabsTrigger
                                        onClick={() => setWithdrawMethod("Normal")}
                                        className="w-fit h-fit text-[.79rem] font-normal font-Manrope py-[.25rem] px-8 bg-lnd-surface-2 rounded-sm transition-all duration-300 data-[state=active]:py-[.22rem] data-[state=active]:font-bold data-[state=active]:text-lnd-accent data-[state=active]:bg-lnd-accent/10 data-[state=active]:border data-[state=active]:border-lnd-accent/55"
                                        value="NormalTransfer">
                                        Normal Transfer
                                    </TabsTrigger>
                                    <TabsTrigger
                                        onClick={() => setWithdrawMethod("Inter-User")}
                                        className="w-fit h-fit text-[.79rem] font-normal font-Manrope py-[.25rem] px-4 bg-lnd-surface-2 rounded-sm transition-all duration-300 data-[state=active]:py-[.22rem] data-[state=active]:font-bold data-[state=active]:text-lnd-accent data-[state=active]:bg-lnd-accent/10 data-[state=active]:border data-[state=active]:border-lnd-accent/55"
                                        value="Inter-UserTransfer(0 Fee)">
                                        Inter-User Transfer (0 Fee)
                                    </TabsTrigger>
                                </TabsList>
                                <Label className="text-[.87rem] font-bold font-Manrope dark:text-lnd-fg">
                                    Fill in Withdrawal Info
                                </Label>
                                <TabsContent value="NormalTransfer">
                                    <div className="flex items-center space-x-2 mb-2.5">
                                        <span className="text-[.89rem] font-Manrope dark:text-lnd-fg">
                                            Select Network
                                        </span>
                                        <PiWarningCircleThin className="w-5 h-5 mt-[2px] dark:text-lnd-fg-muted" />
                                    </div>
                                    <RadioGroup defaultValue={network} className="grid grid-cols-1 lg:grid-cols-2 lg:gap-3">
                                        {selectedNetwork?.map((network: ExtendedCryptoNetwork) => (
                                            <Label key={network?.name as string} className="w-full lg:w-72 flex items-center justify-between rounded-sm border border-muted bg-lnd-surface-2 py-1.5 px-3.5 text-base font-semibold hover:border-lnd-accent/55 hover:bg-lnd-accent/10 [&:has([data-state=checked])]:bg-lnd-accent/10 [&:has([data-state=checked])]:border-lnd-accent/55 dark:border-lnd-border dark:bg-lnd-surface dark:hover:border-lnd-accent/55 dark:hover:bg-lnd-accent/15 dark:[&:has([data-state=checked])]:bg-lnd-accent/20 dark:[&:has([data-state=checked])]:border-lnd-accent/55 dark:text-lnd-fg">
                                                <RadioGroupItem onClick={() => setSender(network?.contract_address as string)} value={network?.name} className="peer sr-only" />
                                                {network?.name}
                                                <span className="flex flex-col items-end text-lnd-fg-muted/90 text-[.73rem] font-Manrope -space-y-1 dark:text-lnd-fg-muted">
                                                    <span>Fees</span>
                                                    <span>≈ {network?.fees} USD</span>
                                                </span>
                                            </Label>
                                        ))}
                                    </RadioGroup>
                                    <>
                                        <div className="w-full h-auto flex flex-col gap-4 mt-6">
                                            <Label className="font-Manrope font-medium dark:text-lnd-fg">
                                                Withdraw to a Addresss
                                            </Label>
                                            <div className="w-full h-fit flex items-center bg-lnd-surface-2 pr-3 rounded-sm dark:bg-lnd-surface">
                                                <Input
                                                    type="text"
                                                    aria-autocomplete="none"
                                                    autoComplete="off"
                                                    value={address}
                                                    onChange={(e) => setAddress(e.target.value)}
                                                    className="w-full h-10 bg-transparent ring-offset-0 outline-none dark:text-lnd-fg" />
                                                <PiAddressBookFill className="w-5 h-5 text-lnd-accent dark:text-lnd-accent" />
                                            </div>
                                        </div>
                                        <div className="w-full h-auto flex flex-col space-y-1 mt-4">
                                            <div className="mb-2 flex w-full flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
                                                <span className="font-Manrope font-semibold text-sm dark:text-lnd-fg">
                                                    Receive amount
                                                </span>
                                                <span className="text-lnd-fg-muted text-sm space-x-1 dark:text-lnd-fg-muted">
                                                    <span className="border-b-[1.9px] border-lnd-border border-dashed dark:border-lnd-border">
                                                        Withdrawable Amount
                                                    </span>
                                                    <span>
                                                        <span className="text-lnd-accent dark:text-lnd-accent">{roundToTwoDecimalPlaces(Coin?.available as number)}</span> {crypto?.symbol}
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="w-full h-auto flex flex-col bg-lnd-surface-2 border-2 border-lnd-accent/25 rounded-md dark:bg-lnd-surface dark:border-lnd-accent/55">
                                                <div className="w-full h-fit flex items-center bg-lnd-surface-2 pr-3 space-x-4 rounded-t-md border-b border-dashed border-lnd-accent/25 dark:bg-lnd-surface dark:border-lnd-accent/55">
                                                    <Input
                                                        aria-autocomplete="none"
                                                        autoComplete="off"
                                                        inputMode="decimal"
                                                        value={amount}
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
                                                        className="w-full h-10 bg-transparent ring-offset-0 outline-none" />
                                                    <span className="text-sm">
                                                        {crypto?.symbol}
                                                    </span>
                                                    <span className="w-px h-4 bg-lnd-surface-2" />
                                                    <button
                                                        type="button"
                                                        onClick={() => setAmount(roundToTwoDecimalPlaces(Coin?.available as number))}
                                                        className="text-lnd-accent text-xs dark:text-lnd-accent">
                                                        All
                                                    </button>
                                                </div>
                                                <div className="w-auto h-auto flex text-sm text-lnd-fg-muted space-x-8 mt-3 pl-3 dark:text-lnd-fg-muted">
                                                    <span>
                                                        Withdraw fee:
                                                    </span>
                                                    <span className="text-lnd-fg-muted/80 font-medium dark:text-lnd-fg-muted">
                                                        <span className="text-lnd-fg font-normal dark:text-lnd-fg">{minimalWithdrawAmount}</span> {crypto?.symbol}
                                                    </span>
                                                </div>
                                                <div className="w-auto h-auto flex text-sm text-lnd-fg-muted space-x-8 my-3 pl-3 dark:text-lnd-fg-muted">
                                                    <span>
                                                        Decuction:
                                                    </span>
                                                    <span className="text-lnd-fg-muted/80 font-medium dark:text-lnd-fg-muted">
                                                        <span className="text-lnd-fg font-normal dark:text-lnd-fg">{minimalWithdrawAmount}</span> {crypto?.symbol}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button onClick={() => handlePreSubmit()} className="w-full h-fit py-2.5 text-base bg-lnd-accent hover:bg-lnd-accent/90 text-lnd-accent-fg font-Manrope font-semibold rounded-[1.25rem] mt-10 dark:bg-lnd-accent dark:hover:bg-lnd-accent/90 dark:text-lnd-accent-fg">
                                            Submit
                                        </Button>
                                    </>
                                </TabsContent>
                                <TabsContent
                                    className="w-full mt-5"
                                    value="Inter-UserTransfer(0 Fee)">
                                    <div className="w-full h-auto flex flex-col gap-4">
                                        <Label className="font-Manrope font-medium dark:text-lnd-fg">
                                            Withdraw to a Verdstamp account (Email)
                                        </Label>
                                        <div className="w-full h-fit flex items-center bg-lnd-surface-2 pr-3 rounded-sm dark:bg-lnd-surface">
                                            <Input
                                                type="email"
                                                aria-autocomplete="none"
                                                autoComplete="off"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full h-10 bg-transparent ring-offset-0 outline-none dark:text-lnd-fg" />
                                            <PiAddressBookFill className="w-5 h-5 text-lnd-accent dark:text-lnd-accent" />
                                        </div>
                                    </div>
                                    <div className="w-full h-auto flex flex-col space-y-1 mt-4">
                                        <div className="mb-2 flex w-full flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
                                            <span className="font-Manrope font-semibold text-sm dark:text-lnd-fg">
                                                Receive amount
                                            </span>
                                            <span className="text-lnd-fg-muted text-sm space-x-1 dark:text-lnd-fg-muted">
                                                <span className="border-b-[1.9px] border-lnd-border border-dashed dark:border-lnd-border">
                                                    Withdrawable Amount
                                                </span>
                                                <span>
                                                    <span className="text-lnd-accent dark:text-lnd-accent">{roundToTwoDecimalPlaces(Coin?.available as number)}</span> {crypto?.symbol}
                                                </span>
                                            </span>
                                        </div>
                                        <div className="w-full h-auto flex flex-col bg-lnd-surface-2 border-2 border-lnd-accent/25 rounded-md dark:bg-lnd-surface dark:border-lnd-accent/55">
                                            <div className="w-full h-fit flex items-center bg-lnd-surface-2 pr-3 space-x-4 rounded-t-md border-b border-dashed border-lnd-accent/25 dark:bg-lnd-surface dark:border-lnd-accent/55">
                                                <Input
                                                    aria-autocomplete="none"
                                                    autoComplete="off"
                                                    inputMode="decimal"
                                                    value={amount}
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
                                                    className="w-full h-10 bg-transparent ring-offset-0 outline-none" />
                                                <span className="text-sm">
                                                    {crypto?.symbol}
                                                </span>
                                                <span className="w-px h-4 bg-lnd-surface-2" />
                                                <button
                                                    type="button"
                                                    onClick={() => setAmount(roundToTwoDecimalPlaces(Coin?.available as number))}
                                                    className="text-lnd-accent text-xs dark:text-lnd-accent">
                                                    All
                                                </button>
                                            </div>
                                            <div className="w-auto h-auto flex text-sm text-lnd-fg-muted space-x-8 mt-3 pl-3 dark:text-lnd-fg-muted">
                                                <span>
                                                    Withdraw fee:
                                                </span>
                                                <span className="text-lnd-fg-muted/80 font-medium dark:text-lnd-fg-muted">
                                                    <span className="text-lnd-fg font-normal dark:text-lnd-fg">{minimalWithdrawAmount}</span> {crypto?.symbol}
                                                </span>
                                            </div>
                                            <div className="w-auto h-auto flex text-sm text-lnd-fg-muted space-x-8 my-3 pl-3 dark:text-lnd-fg-muted">
                                                <span>
                                                    Decuction:
                                                </span>
                                                <span className="text-lnd-fg-muted/80 font-medium dark:text-lnd-fg-muted">
                                                    <span className="text-lnd-fg font-normal dark:text-lnd-fg">0</span> {crypto?.symbol}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button onClick={() => handlePreSubmit()} className="w-full h-fit py-2.5 text-base bg-lnd-accent hover:bg-lnd-accent/90 text-lnd-accent-fg font-Manrope font-semibold rounded-[1.25rem] mt-10 dark:bg-lnd-accent dark:hover:bg-lnd-accent/90 dark:text-lnd-accent-fg">
                                        Submit
                                    </Button>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-[40%] flex flex-col mt-12 lg:mt-0 gap-4">
                    <TotalAsset value={value} />
                    <div className="flex flex-col w-full h-auto">
                        <div className="w-full h-auto flex justify-between text-[.903rem] font-bold pb-3 dark:text-lnd-fg">
                            <span className="font-Manrope">
                                Withdrawal Limit
                            </span>
                        </div>
                        <div className="w-full h-auto flex justify-between text-[.775rem] text-lnd-fg-muted font-Manrope pb-3 dark:text-lnd-fg-muted">
                            <span className="text-[.765rem]">
                                Last <span className="text-lnd-fg px-1 dark:text-lnd-fg"> 24H </span> remaining withdrawal quota
                            </span>
                            <span>
                                <strong className="text-lnd-fg px-1 dark:text-lnd-fg">10,000.00</strong>/ 10,000.00 USD
                            </span>
                        </div>
                        <div className="w-full h-auto flex justify-between text-[.775rem] text-lnd-fg-muted font-Manrope pb-3 dark:text-lnd-fg-muted">
                            <span className="text-[.765rem]">
                                Last <span className="text-lnd-fg px-1 dark:text-lnd-fg"> 30D </span>  remaining withdrawal quota
                            </span>
                            <span>
                                <strong className="text-lnd-fg px-1 dark:text-lnd-fg">50,000.00</strong>/ 50,000.00 USD
                            </span>
                        </div>
                        <div className="w-full flex justify-end">
                            <Link href={"#"} className="text-lnd-accent text-[.76rem] font-Manrope font-semibold dark:text-lnd-accent">
                                Get higher withdrawal limit
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-col w-full h-auto">
                        {
                            withdrawMethod === "Normal" ?
                                <>
                                    <div className="w-full h-auto flex justify-between text-[.903rem] font-bold pb-3 dark:text-lnd-fg">
                                        <span className="font-Manrope">
                                            Attention
                                        </span>
                                    </div><div className="w-full h-auto flex justify-between text-[.775rem] text-lnd-fg-muted font-Manrope pb-3 dark:text-lnd-fg-muted">
                                        <span className="text-[.765rem]">
                                            Minimum Withdrawal
                                        </span>
                                        <span>
                                            <span className="text-amber-600 font-bold dark:text-amber-400">{minimalWithdrawAmount}</span> {crypto?.symbol}
                                        </span>
                                    </div><div className="w-full h-auto flex justify-between text-[.775rem] text-lnd-fg-muted font-Manrope pb-3 dark:text-lnd-fg-muted">
                                        <span className="text-[.755rem]">
                                            Arrival time: Normal transfers are sent via crypto network, and the arrival time depends on the number of confirmations required by the recipient.
                                        </span>
                                    </div>
                                </>
                                :
                                <>
                                    <div className="w-full h-auto flex justify-between text-[.903rem] font-bold pb-3 dark:text-lnd-fg">
                                        <span className="font-Manrope">
                                            Attention
                                        </span>
                                    </div><div className="w-full h-auto flex justify-between text-[.775rem] text-lnd-fg-muted font-Manrope pb-3 dark:text-lnd-fg-muted">
                                        <span className="text-[.755rem]">
                                            Arrival time: Inter-user transfers are sent within Verdstamp, requiring Email confirmation instead of on-chain confirmation. instant with 0 fees.
                                        </span>
                                    </div>
                                </>
                        }
                    </div>
                    <div className="flex flex-col w-full h-auto">
                        <div className="w-full h-auto flex justify-between items-center text-[.903rem] font-bold pb-1 dark:text-lnd-fg">
                            <span>
                                FAQ
                            </span>
                            <Button className="bg-transparent p-0 py-0 px-0 hover:bg-transparent text-lnd-accent font-normal text-sm dark:text-lnd-accent">
                                View More<BiChevronRight className="w-4 h-4 mt-1" />
                            </Button>
                        </div>
                        <div className="w-full h-auto flex text-[.903rem] font-bold pb-2">
                            <Link href={"#"} className="flex items-center text-[.82rem] font-normal hover:text-lnd-accent transition-all duration-300 dark:text-lnd-fg-muted dark:hover:text-lnd-accent">
                                <BsQuestionCircleFill className="w-4 h-4 text-amber-500 mr-1 dark:text-amber-400" />
                                Withdrawal Unreceived?
                            </Link>
                        </div>
                        <div className="w-full h-auto flex text-[.903rem] font-bold">
                            <Link href={"#"} className="flex items-center text-[.82rem] font-normal hover:text-lnd-accent transition-all duration-300 dark:text-lnd-fg-muted dark:hover:text-lnd-accent">
                                <BsQuestionCircleFill className="w-4 h-4 text-amber-500 mr-1 dark:text-amber-400" />
                                How to choose the public chain for your withdrawal?
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
                <DialogContent className="w-[calc(100vw-2rem)] max-w-md dark:bg-lnd-surface dark:border-lnd-border">
                    <DialogHeader>
                        <DialogTitle className="text-center dark:text-lnd-fg">Withdrawal Verification</DialogTitle>
                        <DialogDescription className="text-center dark:text-lnd-fg-muted">
                            Enter the 6-digit verification code sent to your email to confirm this withdrawal.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-6 py-4">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-sm text-lnd-fg-muted dark:text-lnd-fg-muted">Withdrawing</span>
                            <span className="text-2xl font-bold text-lnd-accent dark:text-lnd-accent">
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
                                <InputOTPSlot index={0} className={`w-9 sm:w-12 h-12 text-lg dark:bg-lnd-surface dark:border-lnd-border dark:text-lnd-fg ${otpError ? 'border-red-500' : ''}`} />
                                <InputOTPSlot index={1} className={`w-9 sm:w-12 h-12 text-lg dark:bg-lnd-surface dark:border-lnd-border dark:text-lnd-fg ${otpError ? 'border-red-500' : ''}`} />
                                <InputOTPSlot index={2} className={`w-9 sm:w-12 h-12 text-lg dark:bg-lnd-surface dark:border-lnd-border dark:text-lnd-fg ${otpError ? 'border-red-500' : ''}`} />
                                <InputOTPSlot index={3} className={`w-9 sm:w-12 h-12 text-lg dark:bg-lnd-surface dark:border-lnd-border dark:text-lnd-fg ${otpError ? 'border-red-500' : ''}`} />
                                <InputOTPSlot index={4} className={`w-9 sm:w-12 h-12 text-lg dark:bg-lnd-surface dark:border-lnd-border dark:text-lnd-fg ${otpError ? 'border-red-500' : ''}`} />
                                <InputOTPSlot index={5} className={`w-9 sm:w-12 h-12 text-lg dark:bg-lnd-surface dark:border-lnd-border dark:text-lnd-fg ${otpError ? 'border-red-500' : ''}`} />
                            </InputOTPGroup>
                        </InputOTP>
                        {otpError && (
                            <span className="text-sm text-red-500">Invalid verification code. Please try again.</span>
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
