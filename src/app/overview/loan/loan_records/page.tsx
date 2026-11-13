import { Icon } from "@iconify/react/dist/iconify.js";
import HistoryTable from "../components/History";
import HistoryMobile from "../components/HistoryMobile";

export default function LoanRecords() {
    return (
        <div className="flex w-full flex-col gap-5">
            <div className="w-auto h-auto flex items-center gap-2.5">
                <span className="w-fit h-6 bg-blend-darken">
                    <Icon icon="mdi:stop-circle" className="w-5 h-5 text-lnd-accent/30 rotate-45 relative left-1 z-50" />
                    <Icon icon="fa-solid:hand-holding" className="w-6 h-6 text-lnd-fg-muted/50 z-10 relative -top-5" />
                </span>
                <h1 className="db-title">
                    Loan Records
                </h1>
            </div>
            <div className="w-full h-auto bg-lnd-surface dark:bg-lnd-surface rounded-[1.25rem] p-4">
                <HistoryTable />
                <HistoryMobile />
            </div>
        </div>
    )
}