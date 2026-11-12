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
import { Copy, QrCode } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

export default function Deposit() {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("Bitcoin")
    const [checked, setChecked] = React.useState(false)
    const [showAddress, setShowAddress] = React.useState(false)
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
    const handleCopy = (address: string | undefined) => {
        navigator.clipboard.writeText(address as string);
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
        <div className="w-full lg:w-auto h-auto flex flex-col gap-4">
            <div className="w-auto h-auto flex items-center space-x-2.5 mb-1">
                <span className="w-fit h-6 bg-blend-darken">
                    <Icon icon="icon-park-solid:hexagon-one" className="w-4 h-4 text-lnd-fg-muted/50 relative left-3.5 top-3 z-10" />
                    <Icon icon="mdi:stop-circle" className="w-6 h-6 text-lnd-accent/30 rotate-45 relative  -top-4 z-50" />
                </span>
                <span className="db-title">
                    Deposit
                </span>
            </div>
            <div className="w-full h-auto py-6 px-6 pb-8 flex flex-col lg:flex-row lg:justify-between bg-lnd-surface dark:bg-lnd-surface rounded-[1.25rem]">
                <div className="w-full lg:w-[57%] h-auto flex space-x-3">
                    <div className="hidden lg:flex flex-col items-center space-y-1">
                        <span className="flex w-5 h-5 justify-center items-center bg-lnd-accent text-lnd-accent-fg text-[.85rem] rounded-full">
                            1
                        </span>
                        <div className="flex flex-col items-center justify-center space-y-[1.5px]">
                            <span className="w-px h-[3px] bg-lnd-surface-2/90 dark:bg-lnd-surface-2" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90 dark:bg-lnd-surface-2" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90 dark:bg-lnd-surface-2" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90 dark:bg-lnd-surface-2" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90 dark:bg-lnd-surface-2" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90 dark:bg-lnd-surface-2" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90 dark:bg-lnd-surface-2" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90 dark:bg-lnd-surface-2" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90 dark:bg-lnd-surface-2" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90 dark:bg-lnd-surface-2" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90 dark:bg-lnd-surface-2" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90 dark:bg-lnd-surface-2" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90 dark:bg-lnd-surface-2" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90 dark:bg-lnd-surface-2" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90 dark:bg-lnd-surface-2" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90 dark:bg-lnd-surface-2" />
                            <span className="w-px h-[3px] bg-lnd-surface-2/90 dark:bg-lnd-surface-2" />
                        </div>
                        <span className="flex w-5 h-5 justify-center items-center bg-lnd-accent text-lnd-accent-fg text-[.85rem] rounded-full">
                            2
                        </span>
                    </div>
                    <div className="flex flex-col w-full h-auto justify-start gap-[2.27rem]">
                        <CryptoSelector
                            value={value}
                            setValue={setValue}
                            open={open}
                            setOpen={setOpen}
                        />
                        <div className="w-auto h-auto flex flex-col gap-3">
                            <Label className="text-[.87rem] flex lg:block space-x-2 lg:space-x-0 items-center font-bold font-Manrope dark:text-lnd-fg">
                                <span className="flex lg:hidden w-5 h-5 justify-center items-center bg-lnd-accent text-lnd-accent-fg text-[.85rem] rounded-full">
                                    2
                                </span>
                                Generate Deposit Address
                            </Label>
                            <div className="flex items-center space-x-2">
                                <span className="text-[.89rem] font-Manrope dark:text-lnd-fg-muted">
                                    Select Network
                                </span>
                                <PiWarningCircleThin className="w-5 h-5 mt-[2px]" />
                            </div>
                            <RadioGroup defaultValue={network} className="grid grid-cols-1 lg:grid-cols-2 lg:gap-3">
                                {selectedNetwork?.map((network: CryptoNetwork) => (
                                    <Label key={network.name} className="flex items-center justify-start space-x-2.5 rounded-sm border border-muted dark:border-lnd-border bg-lnd-surface-2 dark:bg-lnd-surface py-2.5 px-3.5 text-sm font-semibold hover:border-lnd-accent/55 dark:hover:border-lnd-accent/55 hover:bg-lnd-accent/10 dark:hover:bg-lnd-accent/15 [&:has([data-state=checked])]:bg-lnd-accent/10 dark:[&:has([data-state=checked])]:bg-lnd-accent/20 [&:has([data-state=checked])]:border-lnd-accent/55 dark:[&:has([data-state=checked])]:border-lnd-accent/55 transition-all duration-300 dark:text-lnd-fg">
                                        <RadioGroupItem onClick={() => { setNetwork(network.name), setAddress(network?.contract_address) }} value={network.name} className="sr-only" />
                                        <span>
                                            {network.name}
                                        </span>
                                        {network?.token_standard !== "" &&
                                            <span>
                                                ({network?.token_standard})
                                            </span>}
                                    </Label>
                                ))}
                            </RadioGroup>
                        </div>
                        <div className="w-full h-auto -mt-6 space-y-4">
                            {
                                showAddress === false ? (
                                    <>
                                        <div className="flex flex-col w-full h-auto px-5 py-5 border border-dashed dark:border-lnd-border items-center space-y-3 rounded-sm dark:bg-lnd-surface">
                                            <h3 className="text-[.96rem] font-bold dark:text-lnd-fg">
                                                <span className="text-amber-600 dark:text-amber-400">{crypto?.symbol}-{crypto?.name}</span> Risk Reminder
                                            </h3>
                                            <p className="text-center text-[.78rem] text-lnd-fg-muted dark:text-lnd-fg-muted pb-3">
                                                * The address is ONLY available for <span className="text-amber-500 dark:text-amber-400">{crypto?.symbol}-{crypto?.name}</span> deposit. Deposit of other assets will lead to permanent asset loss.
                                            </p>
                                            <span className="text-center text-[.782rem] flex items-center space-x-1 dark:text-lnd-fg-muted">
                                                <Checkbox
                                                    checked={checked}
                                                    onCheckedChange={checked => setChecked(checked === true)}
                                                    className="flex items-center justify-center w-3.5 h-3.5 border border-lnd-border dark:border-lnd-border hover:border-lnd-accent/55 dark:hover:border-lnd-accent/55"
                                                />
                                                <span>I&apos;m aware of the risk and would like to proceed</span>
                                            </span>
                                        </div>
                                        <Button onClick={() => setShowAddress(true)} className={checked === true ? "h-auto w-full py-2.5 text-base font-normal bg-lnd-accent hover:bg-lnd-accent/90 text-lnd-accent-fg rounded-[1.25rem] -mt-3" : "h-auto w-full py-2.5 text-base font-normal bg-lnd-surface-2 hover:bg-lnd-surface-2 text-lnd-fg-muted rounded-[1.25rem] -mt-3 dark:bg-lnd-surface-2 dark:text-lnd-fg-muted dark:hover:bg-lnd-surface-2"} disabled={checked === false}>
                                            Confirm
                                        </Button>
                                    </>
                                ) : (

                                    <>
                                        <div className="mb-2">
                                            <span className="text-sm font-medium dark:text-lnd-fg">Deposit To</span>
                                        </div><div className="flex justify-between mb-2">
                                            <div className="flex items-center w-full bg-lnd-surface-2 dark:bg-lnd-surface rounded-md p-3">
                                                <div className="w-20 lg:w-auto flex-1 text-sm lg:text-base font-medium text-lnd-fg-muted mr-2 overflow-hidden text-ellipsis dark:text-lnd-fg">{address}</div>
                                                  <div className="flex space-x-2">
                                                      <Button onClick={() => handleCopy(address)} className="w-auto h-auto p-2 rounded-md bg-lnd-surface-2 dark:bg-lnd-surface-2 hover:bg-lnd-surface-2 dark:hover:bg-lnd-surface-2 text-lnd-fg-muted dark:text-lnd-fg-muted">
                                                          <Copy className="w-4 h-4" />
                                                      </Button>
                                                      <Button onClick={() => setShowAddress(false)} className="w-auto h-auto p-2 rounded-md bg-lnd-surface-2 dark:bg-lnd-surface-2 hover:bg-lnd-surface-2 dark:hover:bg-lnd-surface-2 text-lnd-fg-muted dark:text-lnd-fg-muted">
                                                          <QrCode className="w-4 h-4" />
                                                      </Button>
                                                  </div>
                                              </div>
                                          </div>
                                          <div className="w-full h-auto flex flex-col lg:flex-row items-center justify-between gap-3">
                                              <div className="w-full lg:w-1/2 h-auto flex items-center space-x-2">
                                                  <PiWarningCircleThin className="w-5 h-5 text-amber-500" />
                                                  <span className="text-[.78rem] text-lnd-fg-muted dark:text-lnd-fg-muted">
                                                      Only send {crypto?.symbol} to this address.
                                                  </span>
                                              </div>
                                              <a href="#deposit-records" className="w-full lg:w-1/2 h-auto flex items-center justify-end space-x-1 text-lnd-accent dark:text-lnd-accent hover:text-lnd-accent dark:hover:text-lnd-accent text-[.78rem]">
                                                  <span>Deposit History</span>
                                                  <BiChevronRight className="w-4 h-4" />
                                              </a>
                                          </div>
                                      </>
                                  )
                              }
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-[40%] h-auto flex flex-col gap-3">
                    <TotalAsset value={value} />
                    <div className="w-full h-auto flex flex-col gap-3">
                        <span className="text-[.92rem] font-bold font-Manrope text-lnd-fg dark:text-lnd-fg">
                            Deposit Instructions
                        </span>
                        <div className="w-full h-auto flex flex-col gap-2">
                            <div className="w-full h-auto flex items-center space-x-2">
                                <BsQuestionCircleFill className="w-4 h-4 text-lnd-accent dark:text-lnd-accent" />
                                <span className="text-[.82rem] text-lnd-fg-muted dark:text-lnd-fg-muted">
                                    Minimum deposit: {minimal_deposit} {crypto?.symbol}
                                </span>
                            </div>
                            <div className="w-full h-auto flex items-center space-x-2">
                                <BsQuestionCircleFill className="w-4 h-4 text-lnd-accent dark:text-lnd-accent" />
                                <span className="text-[.82rem] text-lnd-fg-muted dark:text-lnd-fg-muted">
                                    Deposits below the minimum will not be credited.
                                </span>
                            </div>
                            <div className="w-full h-auto flex items-center space-x-2">
                                <BsQuestionCircleFill className="w-4 h-4 text-lnd-accent dark:text-lnd-accent" />
                                <span className="text-[.82rem] text-lnd-fg-muted dark:text-lnd-fg-muted">
                                    Only deposit {crypto?.name} to this address.
                                </span>
                            </div>
                            <div className="w-full h-auto flex items-center space-x-2">
                                <BsQuestionCircleFill className="w-4 h-4 text-lnd-accent dark:text-lnd-accent" />
                                <span className="text-[.82rem] text-lnd-fg-muted dark:text-lnd-fg-muted">
                                    Deposits require 1 network confirmation.
                                </span>
                            </div>
                            <div className="w-full h-auto flex items-center space-x-2">
                                <BsQuestionCircleFill className="w-4 h-4 text-lnd-accent dark:text-lnd-accent" />
                                <span className="text-[.82rem] text-lnd-fg-muted dark:text-lnd-fg-muted">
                                    Please ensure your deposit address is correct.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DepositTable />
        </div>
    )
}