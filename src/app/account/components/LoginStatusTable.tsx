"use client"
import { useQuery } from "convex/react"
import { api } from "@convex/_generated/api"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { signOut } from "@/lib/auth-client"

export default function LoginStatusTable() {
    const data = useQuery(api.misc.view_login_status)

    const currentSession = data?.[0]
    function dateFormat(date?: number | string) {
        if (!date) return "—";
        return new Date(date).toLocaleString()
    }
    return (
        <Table className="space-y-3 hidden lg:block dark:bg-lnd-surface rounded-xl">
            <TableHeader>
                <TableRow className="w-full">
                    <TableHead className="w-full text-sm font-light text-lnd-fg-muted dark:text-lnd-fg-muted">Time</TableHead>
                    <TableHead className="w-full text-sm font-light text-lnd-fg-muted dark:text-lnd-fg-muted">Device</TableHead>
                    <TableHead className="w-full text-sm font-light text-lnd-fg-muted dark:text-lnd-fg-muted">IP</TableHead>
                    <TableHead className="w-full text-sm font-light text-lnd-fg-muted dark:text-lnd-fg-muted">Location</TableHead>
                    <TableHead className="w-full text-sm font-light text-lnd-fg-muted dark:text-lnd-fg-muted text-right">Operation</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow className="w-full">
                    <TableCell className="w-full text-xs text-nowrap text-lnd-fg dark:text-lnd-fg">
                        {dateFormat(currentSession?._creationTime)}
                    </TableCell>
                    <TableCell className="w-full text-xs text-nowrap text-lnd-fg dark:text-lnd-fg">
                        {currentSession?.device}
                    </TableCell>
                    <TableCell className="w-full text-xs text-nowrap text-lnd-fg dark:text-lnd-fg">
                        {currentSession?.ip}
                    </TableCell>
                    <TableCell className="w-full text-xs text-nowrap text-lnd-fg dark:text-lnd-fg">
                        {currentSession?.location}
                    </TableCell>
                    <TableCell onClick={() => signOut()} className="w-full text-xs cursor-pointer text-lnd-accent dark:text-lnd-accent text-right">
                        Log Out
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}
