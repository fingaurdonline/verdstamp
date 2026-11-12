import { HiMiniArrowUpRight } from "react-icons/hi2";
import BotCard from "./BotCard";

export default function TradingBotCard() {
    return (
        <div className="group flex h-full w-full flex-col justify-between gap-6 rounded-3xl border border-lnd-border bg-lnd-surface p-5 transition-colors hover:border-lnd-accent/40">
            <div className="flex w-full items-start justify-between gap-3">
                <div>
                    <h3 className="font-Manrope text-lg font-semibold text-lnd-fg">
                        Trade Bots
                    </h3>
                    <p className="mt-1 text-sm text-lnd-fg-muted">
                        Effortless trading with automated strategies
                    </p>
                </div>
                <HiMiniArrowUpRight className="h-6 w-6 shrink-0 text-lnd-fg-muted transition-colors group-hover:text-lnd-accent" />
            </div>
            <BotCard />
        </div>
    )
}
