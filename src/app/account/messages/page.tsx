"use client"
import NoData from "@/components/icons/NoData";
import { Button } from "@/components/ui/button";
import { api } from "@convex/_generated/api";
import { Icon } from "@iconify/react";
import { useMutation, useQuery } from "convex/react";
import { ChevronLeft, ChevronRight, Dot } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";

export default function Messages() {
    const data = useQuery(api.messages.view_messages) as any[] | undefined
    const updateMessageRead = useMutation(api.messages.update_message_read)
    const router = useRouter()
    return (
        <div className="w-full h-auto flex pt-1 flex-col space-y-6">
            <div className="w-full h-auto flex items-center justify-between">
                <div className="w-fit h-fit flex items-center space-x-2.5">
                    <span className="w-fit h-8 bg-blend-overlay">
                        <Icon icon="mingcute:rectangle-vertical-fill" className="w-4 h-4 text-lnd-fg-muted/50 rotate-90 left-1 top-[2px] relative z-10" />
                        <Icon icon="bxs:message-minus" className="w-7 h-7 text-lnd-accent/30 relative -top-2.5 z-50" />
                    </span>
                    <span className="db-title">
                        Message Center
                    </span>
                </div>
                <div className="hidden lg:block w-fit h-fit">
                    <Button className="w-full h-fit flex justify-center items-center rounded-md bg-lnd-accent/10 hover:bg-lnd-accent/10 transition-colors text-lnd-accent text-[0.85rem] font-medium py-2 dark:bg-lnd-accent/20 dark:hover:bg-lnd-accent/40 dark:text-lnd-accent">
                        Mark all as read
                    </Button>
                </div>
            </div>
            <div className="w-full h-auto flex flex-col bg-lnd-surface rounded-lg p-2 space-y-5 dark:bg-lnd-surface">
                <div className="w-full h-auto flex flex-col lg:flex-row lg:items-center justify-start lg:space-x-8 space-y-4 lg:space-y-0">
                    <div className="w-fit h-fit flex flex-col lg:flex-row lg:space-x-3 lg:items-center space-y-3 lg:space-y-0">
                        <div className="text-sm dark:text-lnd-fg-muted">
                            Status
                        </div>
                        <div className="w-fit h-fit flex items-center">
                            <Button className="w-full h-fit flex justify-center items-center rounded-l-sm bg-lnd-accent/10 hover:bg-lnd-accent/10 border border-lnd-accent/55 transition-colors text-lnd-accent text-[0.77rem] font-medium px-4 sm:px-9 py-1 dark:bg-lnd-accent/20 dark:hover:bg-lnd-accent/40 dark:border-lnd-accent/55 dark:text-lnd-accent">All</Button>
                            <Button className="w-full h-fit flex justify-center items-center bg-lnd-surface-2 hover:bg-lnd-surface-2 border-y border-lnd-border transition-colors text-lnd-fg-muted text-[0.77rem] px-4 sm:px-9 py-1 font-normal dark:bg-lnd-surface-2 dark:hover:bg-lnd-surface-2 dark:border-lnd-border dark:text-lnd-fg-muted">Unread</Button>
                            <Button className="w-full h-fit flex justify-center items-center rounded-r-sm bg-lnd-surface-2 hover:bg-lnd-surface-2 border border-lnd-border transition-colors text-lnd-fg-muted text-[0.77rem] px-4 sm:px-9 py-1 font-normal dark:bg-lnd-surface-2 dark:hover:bg-lnd-surface-2 dark:border-lnd-border dark:text-lnd-fg-muted">Read</Button>
                        </div>
                    </div>
                    <div className="w-fit h-fit flex space-x-3 items-center">
                        <div className="text-sm dark:text-lnd-fg-muted">
                            Time
                        </div>
                        <div></div>
                    </div>
                </div>
                <div className="w-full h-fit lg:hidden flex space-x-3 items-center">
                    <div className="w-full min-h-96 flex flex-col items-center bg-lnd-surface pb-24 rounded-2xl overflow-hidden dark:bg-lnd-surface">
                        {
                            data?.length === 0 ?
                                <div className="w-full h-full flex flex-col items-center space-y-2">
                                    <NoData className="w-36 h-36" />
                                    <span className="text-lnd-fg dark:text-lnd-fg-muted">No Data</span>
                                </div>
                                :
                                <>{
                                    data?.map((messages) => (
                                        <button onClick={() => { router.push(`/account/message_detail/${messages.id}`), updateMessageRead({ id: messages?.id }) }} key={messages.id} className="w-full h-auto flex items-start gap-3 dark:hover:bg-lnd-surface-2">
                                            <div className="w-12 h-12 flex items-start justify-center overflow-hidden">
                                                <Dot className={messages?.read === true ? "w-14 h-14 text-lnd-fg-muted/30 relative -top-1" : "w-14 h-14 text-lnd-accent relative -top-1 dark:text-lnd-accent"} />
                                            </div>
                                            <div className="min-w-0 flex-1 space-y-1">
                                                <span className={messages?.read === true ? "w-fit max-w-full h-fit flex justify-center items-center truncate rounded-[1.25rem] bg-lnd-surface-2/90 text-lnd-fg-muted text-[0.8rem] py-1 px-3 dark:bg-lnd-surface-2 dark:text-lnd-fg-muted" : "w-fit max-w-full h-fit flex justify-center items-center truncate rounded-[1.25rem] bg-lnd-accent/15 text-lnd-accent text-[0.8rem] py-1 px-3 dark:bg-lnd-accent/20 dark:text-lnd-accent"}>
                                                    {messages?.header}
                                                </span>
                                                <div className="flex flex-col">
                                                    <span className={messages?.read === true ? "max-w-48 truncate text-[.94rem] text-lnd-fg-muted font-Manrope font-extrabold" : "max-w-48 truncate text-[.94rem] text-lnd-fg-muted font-Manrope font-extrabold dark:text-lnd-fg"}>
                                                        {messages?.title}
                                                    </span>
                                                    <div className="w-full h-auto flex flex-wrap">
                                                        <p className={messages?.read === true ? "w-full lg:w-156 h-auto text-[.81rem] text-lnd-fg-muted line-clamp-2" : "w-full lg:w-156 h-auto text-[.81rem] text-lnd-fg-muted line-clamp-2 dark:text-lnd-fg-muted"}>
                                                            {messages?.description} Time: {messages?.created}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    )
                                    )}
                                </>
                        }
                    </div>
                </div>
                <div className="w-full h-fit hidden lg:flex space-x-3 items-center">
                    <div className="w-full min-h-96 flex flex-col items-center bg-lnd-surface pb-24 rounded-2xl overflow-hidden dark:bg-lnd-surface">
                        {
                            data?.length === 0 ?
                                <div className="w-full h-full flex flex-col items-center justify-center space-y-2 mt-20">
                                    <NoData className="w-36 h-36" />
                                    <span className="text-lnd-fg dark:text-lnd-fg-muted">No Data</span>
                                </div>
                                :
                                <>{
                                    data?.map((messages) => (
                                        <button onClick={() => { router.push(`/account/message_detail/${messages.id}`), updateMessageRead({ id: messages?.id }) }} key={messages.id} className="w-full h-fit flex items-start hover:bg-lnd-surface-2/90 dark:hover:bg-lnd-surface-2">
                                            <div className="w-12 h-12 flex items-start justify-center overflow-hidden">
                                                <Dot className={messages?.read === true ? "w-14 h-14 text-lnd-fg-muted/30 relative top-[.2rem]" : "w-14 h-14 text-lnd-accent relative top-[.2rem] dark:text-lnd-accent"} />
                                            </div>
                                            <div className="w-full h-auto flex items-center justify-between pr-6 py-4">
                                                <div className="w-auto h-auto flex flex-col space-y-1">
                                                    <div className="w-auto h-auto flex items-center space-x-3">
                                                        <span className={messages?.read === true ? "max-w-48 truncate text-[.94rem] text-lnd-fg-muted font-Manrope font-extrabold" : "max-w-48 truncate text-[.94rem] text-lnd-fg-muted font-Manrope font-extrabold dark:text-lnd-fg"}>
                                                            {messages?.title}
                                                        </span>
                                                        <span className={messages?.read === true ? "w-fit h-fit flex justify-center items-center rounded-[1.25rem] bg-lnd-surface-2/90 text-lnd-fg-muted text-[0.8rem] py-1 px-3 dark:bg-lnd-surface-2 dark:text-lnd-fg-muted" : "w-fit max-w-full h-fit flex justify-center items-center truncate rounded-[1.25rem] bg-lnd-accent/15 text-lnd-accent text-[0.8rem] py-1 px-3 dark:bg-lnd-accent/20 dark:text-lnd-accent"}>
                                                            {messages?.header}
                                                        </span>
                                                    </div>
                                                    <div className={messages?.read === true ? "w-156 h-auto text-[.81rem] text-lnd-fg-muted truncate flex items-center justify-start" : "w-156 h-auto text-[.81rem] text-lnd-fg-muted truncate flex items-center justify-start dark:text-lnd-fg-muted"}>
                                                        {messages?.description}
                                                    </div>
                                                </div>
                                                <div className={messages?.read === true ? "text-[.84rem] text-lnd-fg-muted" : "text-[.84rem] dark:text-lnd-fg-muted"}>
                                                    {messages?.created}
                                                </div>
                                            </div>
                                        </button>
                                    )
                                    )}
                                </>
                        }
                    </div>
                </div>
                <div className="w-full h-auto flex justify-end items-center space-x-2">
                    <button>
                        <ChevronLeft className="w-4 h-4 dark:text-lnd-fg-muted" />
                    </button>
                    <span className="w-fit h-fit bg-lnd-accent flex items-center justify-center text-lnd-accent-fg text-sm px-2">
                        1
                    </span>
                    <button>
                        <ChevronRight className="w-4 h-4 dark:text-lnd-fg-muted" />
                    </button>
                </div>
            </div>
        </div >
    )
}
