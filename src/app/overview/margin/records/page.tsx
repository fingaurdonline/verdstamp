import { Icon } from "@iconify/react/dist/iconify.js";
import HistoryTable from "../components/History";
import HistoryMobile from "../components/HistoryMobile";

export default function History() {
    return (
        <div className="flex w-full flex-col gap-5">
            <div className="w-auto h-auto flex items-center gap-2.5">
                <span className="w-fit h-6 bg-blend-darken">
                    <Icon icon="icon-park-solid:hexagon-one" className="w-4 h-4 text-lnd-fg-muted/50 relative left-3.5 top-3 z-10 dark:text-lnd-fg-muted" />
                    <Icon icon="mdi:stop-circle" className="w-6 h-6 text-lnd-accent/30 rotate-45 relative  -top-4 z-50 dark:text-lnd-accent" />
                </span>
                <h1 className="db-title">
                  Margin Records
                </h1>
            </div>
            <div className="w-full h-auto bg-lnd-surface dark:bg-lnd-surface rounded-[1.25rem] p-4">
                <HistoryTable />
                <HistoryMobile />
            </div>
        </div>
    )
}