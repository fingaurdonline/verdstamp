import { Icon } from "@iconify/react/dist/iconify.js";
import HistoryTable from "../components/History";
import HistoryMobile from "../components/HistoryMobile";

export default function History() {
    return (
        <div className="w-full lg:w-auto h-auto flex flex-col gap-4">
            <div className="w-auto h-auto flex items-center space-x-2.5 mb-1">
                <span className="w-fit h-6 bg-blend-darken">
                    <Icon icon="icon-park-solid:hexagon-one" className="w-4 h-4 text-lnd-fg-muted/50 relative left-3.5 top-3 z-10 dark:text-lnd-fg-muted" />
                    <Icon icon="mdi:stop-circle" className="w-6 h-6 text-lnd-accent/30 rotate-45 relative  -top-4 z-50 dark:text-lnd-accent" />
                </span>
                <span className="db-title">
                  Spot Records
                </span>
            </div>
            <div className="w-full h-auto bg-lnd-surface dark:bg-lnd-surface rounded-[1.25rem] p-4">
                <HistoryTable />
                <HistoryMobile />
            </div>
        </div>
    )
}