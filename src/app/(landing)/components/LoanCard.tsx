import LandingLogo from "./LandingLogo";
import { LucideBitcoin } from "lucide-react";
import { BsThreeDots } from "react-icons/bs";
import { FaEthereum } from "react-icons/fa";
import { HiArrowLongLeft, HiArrowLongRight } from "react-icons/hi2";
import { SiTether } from "react-icons/si";

function CoinChip({ children }: { children: React.ReactNode }) {
    return (
        <span className="flex items-center gap-1.5">
            {children}
        </span>
    );
}

export default function LoanCard() {
    return (
        <div className="relative flex w-full items-end justify-end">
            {/* brand medallion */}
            <div className="absolute -left-10 -top-4 hidden sm:block">
                <div className="rounded-full border border-lnd-border/60 p-4">
                    <div className="rounded-full border-2 border-lnd-border/50 p-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-lnd-surface-2">
                            <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-4 border-lnd-surface shadow-sm">
                                <LandingLogo className="h-11 w-11" />
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex w-full flex-col items-end gap-2">
                <div className="flex items-center">
                    <span className="flex h-6 w-8 items-center overflow-hidden">
                        <HiArrowLongLeft className="h-6 w-8 text-lnd-fg-muted" />
                    </span>
                    <div className="w-44 overflow-hidden rounded-xl border border-lnd-border bg-lnd-bg">
                        <div className="border-b border-lnd-border px-3 py-1.5 text-[0.63rem] font-medium uppercase tracking-[0.12em] text-lnd-fg-muted">
                            Stake
                        </div>
                        <div className="flex items-center gap-3 px-3 py-2">
                            <CoinChip>
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-600 p-1">
                                    <FaEthereum className="h-2.5 w-2.5 text-white" />
                                </span>
                                <span className="text-[0.68rem] font-medium text-lnd-fg">
                                    ETH
                                </span>
                            </CoinChip>
                            <CoinChip>
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-400 p-1">
                                    <LucideBitcoin className="h-2.5 w-2.5 text-white" />
                                </span>
                                <span className="text-[0.68rem] font-medium text-lnd-fg">
                                    BTC
                                </span>
                            </CoinChip>
                            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-lnd-border">
                                <BsThreeDots className="h-3 w-3 text-lnd-fg-muted" />
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-start">
                    <span className="flex h-6 w-8 items-center overflow-hidden">
                        <HiArrowLongRight className="h-6 w-8 text-lnd-fg-muted" />
                    </span>
                    <div className="w-44 overflow-hidden rounded-xl border border-lnd-border bg-lnd-bg">
                        <div className="border-b border-lnd-border px-3 py-1.5 text-[0.63rem] font-medium uppercase tracking-[0.12em] text-lnd-fg-muted">
                            Lend
                        </div>
                        <div className="flex items-center gap-3 px-3 py-2">
                            <CoinChip>
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 p-1">
                                    <SiTether className="h-2.5 w-2.5 text-white" />
                                </span>
                                <span className="text-[0.68rem] font-medium text-lnd-fg">
                                    USDT
                                </span>
                            </CoinChip>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
