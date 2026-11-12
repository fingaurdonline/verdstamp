"use client"
import { useQuery } from "convex/react"
import { api } from "@convex/_generated/api"
import { signOut } from "@/lib/auth-client"

export default function LoginHistoryMagagementMobile() {
    const data = useQuery(api.misc.view_login_status)

    const currentSession = data?.[0]
    function dateFormat(date?: number | string) {
        if (!date) return "—";
        return new Date(date).toLocaleString();
    }
    return (
        <div className="w-full h-auto flex lg:hidden flex-col dark:bg-lnd-surface">
            <div className="w-full h-auto flex flex-col space-y-3 bg-lnd-surface dark:bg-lnd-surface rounded-xl">
                <div className="w-full flex items-center justify-between gap-3">
                    <span className="shrink-0 text-sm font-light text-lnd-fg-muted dark:text-lnd-fg-muted">Time</span>
                    <span className="min-w-0 truncate text-right text-xs text-lnd-fg dark:text-lnd-fg">{dateFormat(currentSession?._creationTime)}</span>
                </div>
                <div className="w-full flex items-center justify-between gap-3">
                    <span className="shrink-0 text-sm font-light text-lnd-fg-muted dark:text-lnd-fg-muted">Device</span>
                    <span className="min-w-0 truncate text-right text-xs text-lnd-fg dark:text-lnd-fg">{currentSession?.device}</span>
                </div>
                <div className="w-full flex items-center justify-between gap-3">
                    <span className="shrink-0 text-sm font-light text-lnd-fg-muted dark:text-lnd-fg-muted">ip</span>
                    <span className="min-w-0 truncate text-right text-xs text-lnd-fg dark:text-lnd-fg">{currentSession?.ip}</span>
                </div>
                <div className="w-full flex items-center justify-between gap-3">
                    <span className="shrink-0 text-sm font-light text-lnd-fg-muted dark:text-lnd-fg-muted">Location</span>
                    <span className="min-w-0 truncate text-right text-xs text-lnd-fg dark:text-lnd-fg">{currentSession?.location}</span>
                </div>
                <div className="w-full flex items-center justify-between gap-3">
                    <span className="shrink-0 text-sm font-light text-lnd-fg-muted dark:text-lnd-fg-muted">Operation</span>
                    <span onClick={() => signOut()} className="cursor-pointer text-right text-xs text-lnd-accent dark:text-lnd-accent">logout</span>
                </div>
            </div>
        </div>
    )
}
