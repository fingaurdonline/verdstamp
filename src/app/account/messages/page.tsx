"use client"

import { useMemo, useState } from "react"
import NoData from "@/components/icons/NoData";
import { Button } from "@/components/ui/button";
import { api } from "@convex/_generated/api";
import { Icon } from "@iconify/react";
import { useMutation, useQuery } from "convex/react";
import { CheckCheck, Dot } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";

type Filter = "all" | "unread" | "read";

const FILTERS: { value: Filter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "unread", label: "Unread" },
    { value: "read", label: "Read" },
];

export default function Messages() {
    const data = useQuery(api.messages.view_messages) as any[] | undefined
    const updateMessageRead = useMutation(api.messages.update_message_read)
    const router = useRouter()
    const [filter, setFilter] = useState<Filter>("all")
    const [marking, setMarking] = useState(false)

    const messages = useMemo(() => {
        const all = data ?? [];
        if (filter === "unread") return all.filter((message) => message?.read !== true);
        if (filter === "read") return all.filter((message) => message?.read === true);
        return all;
    }, [data, filter]);

    const unreadCount = useMemo(
        () => (data ?? []).filter((message) => message?.read !== true).length,
        [data],
    );

    async function markAllRead() {
        if (!data || unreadCount === 0 || marking) return;
        setMarking(true);
        try {
            await Promise.all(
                data
                    .filter((message) => message?.read !== true)
                    .map((message) => updateMessageRead({ id: message._id })),
            );
            toast.success("All messages marked as read");
        } catch {
            toast.error("Could not mark every message as read. Try again.");
        } finally {
            setMarking(false);
        }
    }

    return (
        <div className="flex h-auto w-full flex-col gap-5 pt-1">
            <div className="flex w-full items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                    <span className="h-8 w-fit shrink-0 bg-blend-overlay">
                        <Icon icon="mingcute:rectangle-vertical-fill" className="relative left-1 top-[2px] z-10 h-4 w-4 rotate-90 text-lnd-fg-muted/50" />
                        <Icon icon="bxs:message-minus" className="relative -top-2.5 z-50 h-7 w-7 text-lnd-accent/30" />
                    </span>
                    <span className="db-title min-w-0 break-words">
                        Message Center
                    </span>
                </div>
                <Button
                    onClick={markAllRead}
                    disabled={marking || unreadCount === 0}
                    className="flex h-fit shrink-0 items-center justify-center gap-1.5 rounded-md bg-lnd-accent/10 px-2.5 py-2 text-[0.72rem] font-medium text-lnd-accent transition-colors hover:bg-lnd-accent/20 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-lnd-accent/20 dark:text-lnd-accent dark:hover:bg-lnd-accent/40 sm:px-4 sm:text-[0.85rem]"
                >
                    <CheckCheck className="h-4 w-4 shrink-0" />
                    <span className="hidden sm:inline">
                        {marking ? "Marking…" : "Mark all as read"}
                    </span>
                    <span className="sm:hidden">Read all</span>
                </Button>
            </div>

            <div className="flex w-full flex-col gap-4 rounded-lg bg-lnd-surface p-3 dark:bg-lnd-surface sm:p-4">
                <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 lg:w-fit">
                        <span className="text-sm dark:text-lnd-fg-muted">
                            Status
                        </span>
                        <div className="flex w-full items-center sm:w-fit" role="group" aria-label="Filter messages by status">
                            {FILTERS.map((item, index) => {
                                const active = filter === item.value;
                                const count = item.value === "all"
                                    ? (data?.length ?? 0)
                                    : item.value === "unread"
                                        ? unreadCount
                                        : (data?.length ?? 0) - unreadCount;
                                return (
                                    <button
                                        key={item.value}
                                        type="button"
                                        onClick={() => setFilter(item.value)}
                                        aria-pressed={active}
                                        className={`flex min-h-9 flex-1 items-center justify-center gap-1.5 border px-3 py-1.5 text-[0.77rem] transition-colors sm:flex-none sm:px-7 ${index === 0 ? "rounded-l-md" : ""} ${index === FILTERS.length - 1 ? "rounded-r-md" : ""} ${active
                                            ? "border-lnd-accent/55 bg-lnd-accent/10 font-medium text-lnd-accent dark:border-lnd-accent/55 dark:bg-lnd-accent/20 dark:text-lnd-accent"
                                            : "border-lnd-border bg-lnd-surface-2 font-normal text-lnd-fg-muted hover:bg-lnd-surface-2/70 dark:border-lnd-border dark:bg-lnd-surface-2 dark:text-lnd-fg-muted"
                                            }`}
                                    >
                                        {item.label}
                                        <span className={`rounded-full px-1.5 py-0.5 font-mono text-[0.6rem] ${active ? "bg-lnd-accent/15 text-lnd-accent" : "bg-lnd-bg/60 text-lnd-fg-muted"}`}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <span className="hidden text-sm text-lnd-fg-muted dark:text-lnd-fg-muted lg:block">
                        {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                    </span>
                </div>

                <div className="flex min-h-80 w-full flex-col overflow-hidden rounded-2xl bg-lnd-surface dark:bg-lnd-surface">
                    {data === undefined ? (
                        <div className="flex w-full flex-col gap-3 p-3 sm:p-4" role="status" aria-label="Loading messages">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div key={index} className="flex w-full animate-pulse items-start gap-3 rounded-xl px-1 py-2">
                                    <span className="h-5 w-5 shrink-0 rounded-full bg-lnd-fg/10" />
                                    <div className="min-w-0 flex-1 space-y-2">
                                        <span className="block h-3 w-2/3 rounded-full bg-lnd-fg/10" />
                                        <span className="block h-2.5 w-full rounded-full bg-lnd-fg/10" />
                                        <span className="block h-2.5 w-4/5 rounded-full bg-lnd-fg/10" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex w-full flex-1 flex-col items-center justify-center gap-2 px-4 py-16">
                            <NoData className="h-36 w-36" />
                            <span className="text-lnd-fg dark:text-lnd-fg-muted">
                                {filter === "all" ? "No messages yet" : `No ${filter} messages`}
                            </span>
                            {filter !== "all" && (data?.length ?? 0) > 0 ? (
                                <button
                                    type="button"
                                    onClick={() => setFilter("all")}
                                    className="text-[.78rem] font-semibold text-lnd-accent hover:underline"
                                >
                                    Show all messages
                                </button>
                            ) : null}
                        </div>
                    ) : (
                        <div className="flex w-full flex-col divide-y divide-lnd-border dark:divide-lnd-border">
                            {messages.map((message) => {
                                const read = message?.read === true;
                                return (
                                    <button
                                        key={message._id}
                                        type="button"
                                        onClick={() => {
                                            updateMessageRead({ id: message?._id });
                                            router.push(`/account/message_detail/${message._id}`);
                                        }}
                                        className="flex w-full items-start gap-2.5 px-3 py-4 text-left transition-colors hover:bg-lnd-surface-2/70 dark:hover:bg-lnd-surface-2 sm:gap-3 sm:px-4"
                                    >
                                        <Dot className={`mt-1 h-5 w-5 shrink-0 ${read ? "text-lnd-fg-muted/30" : "text-lnd-accent dark:text-lnd-accent"}`} />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex w-full flex-wrap items-center gap-x-2 gap-y-1">
                                                <span className={`min-w-0 max-w-full truncate font-Manrope text-[.94rem] font-extrabold sm:max-w-48 ${read ? "text-lnd-fg-muted" : "text-lnd-fg dark:text-lnd-fg"}`}>
                                                    {message?.title}
                                                </span>
                                                <span className={`max-w-full truncate rounded-[1.25rem] px-2.5 py-0.5 text-[0.72rem] sm:text-[0.8rem] ${read ? "bg-lnd-surface-2/90 text-lnd-fg-muted dark:bg-lnd-surface-2 dark:text-lnd-fg-muted" : "bg-lnd-accent/15 text-lnd-accent dark:bg-lnd-accent/20 dark:text-lnd-accent"}`}>
                                                    {message?.header}
                                                </span>
                                                <span className="ml-auto shrink-0 text-[0.72rem] text-lnd-fg-muted dark:text-lnd-fg-muted">
                                                    {message?.created}
                                                </span>
                                            </div>
                                            <p className="mt-1 line-clamp-2 w-full break-words text-[.81rem] text-lnd-fg-muted dark:text-lnd-fg-muted">
                                                {message?.description}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
