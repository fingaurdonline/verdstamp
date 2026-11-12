import { BiSolidStar, BiSolidUser } from "react-icons/bi";
import { ChartLine } from "./ChartLine";

export default function BotCard() {
    return (
        <div className="w-full rounded-2xl border border-lnd-border bg-lnd-bg/70 p-4">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-lnd-border bg-lnd-surface-2">
                        <BiSolidUser className="h-4 w-4 text-lnd-accent" />
                    </span>
                    <span className="flex flex-col">
                        <span className="font-Manrope text-xs font-semibold text-lnd-fg">
                            Bruce Robot
                        </span>
                        <span className="text-[0.65rem] text-lnd-fg-muted">
                            50 / 50 risk
                        </span>
                    </span>
                </div>
                <BiSolidStar className="h-4 w-4 text-lnd-fg-muted" />
            </div>
            <div className="mt-4 flex items-end justify-between gap-2">
                <span className="flex flex-col">
                    <span className="text-[0.6rem] uppercase tracking-[0.12em] text-lnd-fg-muted">
                        30D PNL
                    </span>
                    <span className="mt-0.5 font-Manrope text-lg font-bold text-lnd-accent">
                        +12.4%
                    </span>
                </span>
                <ChartLine />
            </div>
        </div>
    )
}
