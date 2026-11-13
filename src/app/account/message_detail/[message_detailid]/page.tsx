"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { api } from "@convex/_generated/api"
import { useQuery } from "convex/react"
import { useParams } from "next/navigation"



export default function MessageDetail() {
    const params = useParams()
    const message = useQuery(api.messages.view_message, { id: params.message_detailid as any }) as any
    const transaction = useQuery(api.transactions.view_transaction, message?.transaction_id ? { id: message.transaction_id } : "skip") as any

    if (message === undefined) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="animate-pulse text-lnd-fg-muted">Loading message...</div>
            </div>
        )
    }

    if (message === null) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-lnd-fg-muted">Message not found</div>
            </div>
        )
    }

    return (
        <div className="h-full w-full px-3 pb-6 sm:px-0">
            {
                message.header === "deposit Notice" ?
                    <div className="flex justify-center min-h-fit bg-lnd-surface-2 dark:bg-lnd-surface">
                        <Card className="w-full max-w-md bg-lnd-surface dark:bg-lnd-surface">
                            <CardHeader className="flex justify-center pb-2">
                                <h2 className="text-xl font-semibold text-center mt-4 dark:text-lnd-fg">{message.title}</h2>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex flex-wrap items-start justify-between gap-2 border-b border-lnd-border py-2 dark:border-lnd-border sm:flex-nowrap">
                                        <span className="text-lnd-fg-muted dark:text-lnd-fg-muted">Account</span>
                                        <span className="min-w-0 break-words text-right font-medium dark:text-lnd-fg">spot</span>
                                    </div>
                                    <div className="flex flex-wrap items-start justify-between gap-2 border-b border-lnd-border py-2 dark:border-lnd-border sm:flex-nowrap">
                                        <span className="text-lnd-fg-muted dark:text-lnd-fg-muted">Submitted At</span>
                                        <span className="min-w-0 break-words text-right font-medium dark:text-lnd-fg">
                                            {transaction?.createdAt ? new Date(transaction.createdAt).toLocaleString() : '-'}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-start justify-between gap-2 border-b border-lnd-border py-2 dark:border-lnd-border sm:flex-nowrap">
                                        <span className="text-lnd-fg-muted dark:text-lnd-fg-muted">Actual Received</span>
                                        <span className="min-w-0 break-words text-right font-medium dark:text-lnd-fg">{transaction?.amount} {transaction?.asset}</span>
                                    </div>

                                    <div className="flex flex-wrap items-start justify-between gap-2 border-b border-lnd-border py-2 dark:border-lnd-border sm:flex-nowrap">
                                        <span className="text-lnd-fg-muted dark:text-lnd-fg-muted">Fee</span>
                                        <span className="min-w-0 break-words text-right font-medium dark:text-lnd-fg">0.00 {transaction?.asset}</span>
                                    </div>

                                    <div className="flex flex-wrap items-start justify-between gap-2 border-b border-lnd-border py-2 dark:border-lnd-border sm:flex-nowrap">
                                        <span className="text-lnd-fg-muted dark:text-lnd-fg-muted">Public Chain</span>
                                        <span className="min-w-0 break-words text-right font-medium dark:text-lnd-fg">{transaction?.asset}</span>
                                    </div>

                                    <div className="flex w-full flex-wrap items-start justify-between gap-3 border-b border-lnd-border py-2 dark:border-lnd-border">
                                        <span className="shrink-0 text-lnd-fg-muted dark:text-lnd-fg-muted">sender Address</span>
                                        <div className="min-w-0 flex-1 text-right">
                                            <p className="break-all font-medium dark:text-lnd-fg">{transaction?.sender}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div> :
                    message.header === "withdraw Notice" ?
                        <div className="flex justify-center min-h-fit bg-lnd-surface-2 dark:bg-lnd-surface">
                            <Card className="w-full max-w-md bg-lnd-surface dark:bg-lnd-surface">
                                <CardHeader className="flex justify-center pb-2">
                                    <h2 className="text-xl font-semibold text-center mt-4 dark:text-lnd-fg">{message.title}</h2>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex flex-wrap items-start justify-between gap-2 border-b border-lnd-border py-2 dark:border-lnd-border sm:flex-nowrap">
                                            <span className="text-lnd-fg-muted dark:text-lnd-fg-muted">Account</span>
                                            <span className="min-w-0 break-words text-right font-medium dark:text-lnd-fg">spot</span>
                                        </div>

                                        <div className="flex flex-wrap items-start justify-between gap-2 border-b border-lnd-border py-2 dark:border-lnd-border sm:flex-nowrap">
                                            <span className="text-lnd-fg-muted dark:text-lnd-fg-muted">Submitted At</span>
                                            <span className="min-w-0 break-words text-right font-medium dark:text-lnd-fg">
                                                {transaction?.createdAt ? new Date(transaction.createdAt).toLocaleString() : '-'}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-start justify-between gap-2 border-b border-lnd-border py-2 dark:border-lnd-border sm:flex-nowrap">
                                            <span className="text-lnd-fg-muted dark:text-lnd-fg-muted">Actual Received</span>
                                            <span className="min-w-0 break-words text-right font-medium dark:text-lnd-fg">{transaction?.amount} {transaction?.asset}</span>
                                        </div>

                                        <div className="flex flex-wrap items-start justify-between gap-2 border-b border-lnd-border py-2 dark:border-lnd-border sm:flex-nowrap">
                                            <span className="text-lnd-fg-muted dark:text-lnd-fg-muted">Fee</span>
                                            <span className="min-w-0 break-words text-right font-medium dark:text-lnd-fg">0.00 {transaction?.asset}</span>
                                        </div>

                                        <div className="flex flex-wrap items-start justify-between gap-2 border-b border-lnd-border py-2 dark:border-lnd-border sm:flex-nowrap">
                                            <span className="text-lnd-fg-muted dark:text-lnd-fg-muted">Public Chain</span>
                                            <span className="min-w-0 break-words text-right font-medium dark:text-lnd-fg">{transaction?.asset}</span>
                                        </div>

                                        <div className="flex w-full flex-wrap items-start justify-between gap-3 border-b border-lnd-border py-2 dark:border-lnd-border">
                                            <span className="shrink-0 text-lnd-fg-muted dark:text-lnd-fg-muted">Withdrawal Address</span>
                                            <div className="min-w-0 flex-1 text-right">
                                                <span className="break-all font-medium dark:text-lnd-fg">{transaction?.receiver}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div> :
                        message.header === "Trade Info Notice" ?
                            <div className="flex justify-center min-h-fit bg-lnd-surface-2 dark:bg-lnd-surface">
                                <Card className="w-full max-w-2xl bg-lnd-surface dark:bg-lnd-surface">
                                    <CardHeader className="flex justify-center pb-2">
                                        <h2 className="text-xl font-semibold text-center mt-4 dark:text-lnd-fg">{message.title}</h2>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex flex-wrap items-start justify-between gap-2 border-b border-lnd-border py-2 dark:border-lnd-border sm:flex-nowrap">
                                                <span className="text-lnd-fg-muted dark:text-lnd-fg-muted">Assigned Algo Trader</span>
                                                <span className="min-w-0 break-words text-right font-medium dark:text-lnd-fg">{message.description?.match(/Trader:\s*(.+)/)?.[1]?.trim() || "-"}</span>
                                            </div>

                                            <div className="flex flex-wrap items-start justify-between gap-2 border-b border-lnd-border py-2 dark:border-lnd-border sm:flex-nowrap">
                                                <span className="text-lnd-fg-muted dark:text-lnd-fg-muted">Strategy Style</span>
                                                <span className="min-w-0 break-words text-right font-medium dark:text-lnd-fg">{message.description?.match(/Strategy Style:\s*(.+)/)?.[1]?.trim() || "-"}</span>
                                            </div>

                                            <div className="flex flex-wrap items-start justify-between gap-2 border-b border-lnd-border py-2 dark:border-lnd-border sm:flex-nowrap">
                                                <span className="text-lnd-fg-muted dark:text-lnd-fg-muted">Risk Profile</span>
                                                <span className="min-w-0 break-words text-right font-medium dark:text-lnd-fg">{message.description?.match(/Risk Profile:\s*(.+)/)?.[1]?.trim() || "-"}</span>
                                            </div>

                                            <div className="flex flex-wrap items-start justify-between gap-2 border-b border-lnd-border py-2 dark:border-lnd-border sm:flex-nowrap">
                                                <span className="text-lnd-fg-muted dark:text-lnd-fg-muted">Ideal Client</span>
                                                <span className="min-w-0 break-words text-right font-medium dark:text-lnd-fg">{message.description?.match(/Ideal Client:\s*(.+)/)?.[1]?.trim() || "-"}</span>
                                            </div>

                                            <div className="flex flex-wrap items-start justify-between gap-2 border-b border-lnd-border py-2 dark:border-lnd-border sm:flex-nowrap">
                                                <span className="text-lnd-fg-muted dark:text-lnd-fg-muted">Telegram</span>
                                                <a
                                                    href={message.description?.match(/Telegram:\s*(.+)/)?.[1]?.trim() || "#"}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="min-w-0 break-all text-right font-medium text-lnd-accent hover:text-lnd-accent dark:text-lnd-accent"
                                                >
                                                    {message.description?.match(/Telegram:\s*(.+)/)?.[1]?.trim() || "-"}
                                                </a>
                                            </div>

                                            <div className="pt-4 text-sm text-lnd-fg-muted dark:text-lnd-fg-muted">
                                                <p>
                                                    You’ve been assigned an Algo Trader who will be assisting you throughout your trading journey.
                                                    If you ever need direct help, guidance, or clarification, feel free to reach out to them.
                                                    They are here to ensure your trading experience is smooth, informed, and profitable.
                                                </p>
                                            </div>

                                            <div className="flex gap-4 pt-4">
                                                <Button
                                                    variant="outline"
                                                    className="w-1/2 rounded-md dark:bg-lnd-surface-2 dark:text-lnd-fg dark:border-lnd-border dark:hover:bg-lnd-surface-2"
                                                >
                                                    Dismiss
                                                </Button>
                                                <Button className="w-1/2 bg-lnd-accent hover:bg-lnd-accent/90 text-lnd-accent-fg rounded-md">
                                                    Contact Trader
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div> :
                            (
                                <div className="flex justify-center min-h-fit bg-lnd-surface-2 dark:bg-lnd-surface">
                                    <Card className="w-full max-w-md bg-lnd-surface dark:bg-lnd-surface mt-6 lg:mt-10">
                                        <CardHeader className="flex flex-col items-center pb-2">
                                            <div className="text-xs text-lnd-fg-muted mb-1 uppercase tracking-wider dark:text-lnd-fg-muted">{message.header}</div>
                                            <h2 className="text-xl font-semibold text-center dark:text-lnd-fg">{message.title}</h2>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="p-4 bg-lnd-surface-2 rounded-lg dark:bg-lnd-surface-2">
                                                    <p className="text-sm text-lnd-fg-muted dark:text-lnd-fg-muted leading-relaxed whitespace-pre-wrap">
                                                        {message.description}
                                                    </p>
                                                </div>

                                                <div className="mt-4 flex flex-wrap items-start justify-between gap-2 border-t border-lnd-border py-2 dark:border-lnd-border">
                                                    <span className="text-xs text-lnd-fg-muted dark:text-lnd-fg-muted">Date</span>
                                                    <span className="min-w-0 break-words text-right text-xs font-medium dark:text-lnd-fg-muted">
                                                        {message._creationTime ? new Date(message._creationTime).toLocaleString() : ''}
                                                    </span>
                                                </div>

                                                <div className="flex justify-center pt-2">
                                                    <Button
                                                        variant="outline"
                                                        className="w-full rounded-md dark:bg-lnd-surface-2 dark:text-lnd-fg dark:border-lnd-border dark:hover:bg-lnd-surface-2"
                                                        onClick={() => window.history.back()}
                                                    >
                                                        Go Back
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )
            }
        </div>
    )
}
