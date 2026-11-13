"use client"
import { useQuery } from "convex/react"
import { api } from "@convex/_generated/api"
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { IoMdStarOutline } from "react-icons/io";
import IDVerificationPage from "../components/IdVerification";
import { useState } from "react";

export default function Verification() {
    const data = useQuery(api.verification.view_id_verified)
    const user = useQuery(api.user.user)
    const [open, setOpen] = useState(false)
    const user_id_verified = data?.find((acc: any) => user?._id == acc?.userId)
    return (
        <>
            {
                user_id_verified?.verified == false || open == false ?
                    (<div className="flex w-full flex-col gap-5">
                        <div className="flex w-full items-center gap-2">
                            <span className="w-auto h-auto">
                                <ChevronLeft className="w-8 h-8 text-lnd-fg-muted mt-1" />
                            </span>
                            <h1 className="font-Manrope text-2xl font-extrabold dark:text-lnd-fg">
                                Personal Verification
                            </h1>
                        </div>
                        <div className="flex h-auto w-full flex-col gap-4 rounded-lg bg-lnd-surface p-4 dark:bg-lnd-surface lg:space-y-3 lg:bg-transparent lg:p-0">
                            <div className="flex min-h-[6.5rem] w-full flex-col justify-center overflow-hidden rounded-xl bg-lnd-accent/5 px-4 py-5 dark:bg-lnd-surface-2 lg:rounded-[1.25rem] lg:bg-linear-to-r lg:from-lnd-accent lg:to-lnd-accent-fill lg:p-10">
                                <div className="flex h-auto w-auto flex-col justify-center space-y-2">
                                    <span className="flex w-auto items-start gap-2">
                                        <Image src="/assets/icon-rights.webp" alt="icon-rights" width={100} height={100} className="h-6 w-6 shrink-0" />
                                        <span className="text-[.9rem] leading-relaxed text-lnd-fg dark:text-lnd-fg-muted lg:text-[.95rem] lg:text-lnd-accent-fg">After passing the ID verification, you will be entitled to the below privileges:</span>
                                    </span>
                                    <span className="flex w-fit items-start gap-2 lg:items-center lg:text-lnd-accent-fg">
                                        <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-lnd-accent lg:mt-0 lg:bg-lnd-accent-fg dark:bg-lnd-surface" />
                                        <span className="font-Manrope text-lg font-semibold leading-snug text-lnd-fg dark:text-lnd-fg lg:text-[1.1rem] lg:text-lnd-accent-fg">
                                            24H withdrawal quota:<br className="lg:hidden" /> 1,000,000 USD
                                        </span>
                                    </span>
                                </div>
                                <div className="relative -right-20 -top-20 hidden lg:block">
                                    <IoMdStarOutline className="h-80 w-80 -rotate-12 text-lnd-accent-fg/10" />
                                </div>
                            </div>
                            <div className="flex w-full flex-col space-y-4 py-2 lg:px-10">
                                <div className="font-Manrope text-lg font-bold dark:text-lnd-fg">
                                    How to Verify
                                </div>
                                <div className="flex w-full flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
                                    <div className="flex h-auto w-full min-w-0 flex-col justify-center gap-2 rounded-lg border border-dashed border-lnd-accent/55 px-4 py-4 dark:bg-lnd-surface lg:flex-row lg:items-center lg:border-2 lg:px-6 lg:py-1 lg:space-x-3">
                                        <span className="h-10 w-10 shrink-0 rounded-full bg-lnd-accent/10 lg:h-14 lg:w-14" />
                                        <span className="flex h-fit w-fit items-center justify-center rounded-full border border-lnd-accent/55 px-[.37rem] text-xs text-lnd-accent lg:text-sm">
                                            1
                                        </span>
                                        <span className="text-base text-lnd-fg dark:text-lnd-fg lg:text-[1.05rem]">
                                            Basic Info
                                        </span>
                                    </div>
                                    <span className="hidden h-fit w-fit rounded-full bg-lnd-surface-2 p-1 dark:bg-lnd-surface-2 lg:block">
                                        <ChevronRight className="text-lnd-fg-muted dark:text-lnd-fg-muted" />
                                    </span>
                                    <div className="flex h-auto w-full min-w-0 flex-col justify-center gap-2 rounded-lg border border-dashed border-lnd-accent/55 px-4 py-4 dark:bg-lnd-surface lg:flex-row lg:items-center lg:border-2 lg:px-6 lg:py-1 lg:space-x-3">
                                        <span className="h-10 w-10 shrink-0 rounded-full bg-lnd-accent/10 lg:h-14 lg:w-14" />
                                        <span className="flex h-fit w-fit items-center justify-center rounded-full border border-lnd-accent/55 px-[.37rem] text-xs text-lnd-accent lg:text-sm">
                                            2
                                        </span>
                                        <span className="text-base text-lnd-fg dark:text-lnd-fg lg:text-[1.05rem]">
                                            Upload ID
                                        </span>
                                    </div>
                                    <span className="hidden h-fit w-fit rounded-full bg-lnd-surface-2 p-1 dark:bg-lnd-surface-2 lg:block">
                                        <ChevronRight className="text-lnd-fg-muted dark:text-lnd-fg-muted" />
                                    </span>
                                    <div className="flex h-auto w-full min-w-0 flex-col justify-center gap-2 rounded-lg border border-dashed border-lnd-accent/55 px-4 py-4 dark:bg-lnd-surface lg:flex-row lg:items-center lg:border-2 lg:px-6 lg:py-1 lg:space-x-3">
                                        <span className="h-10 w-10 shrink-0 rounded-full bg-lnd-accent/10 lg:h-14 lg:w-14" />
                                        <span className="flex h-fit w-fit items-center justify-center rounded-full border border-lnd-accent/55 px-[.37rem] text-xs text-lnd-accent lg:text-sm">
                                            3
                                        </span>
                                        <span className="text-base text-lnd-fg dark:text-lnd-fg lg:text-[1.05rem]">
                                            Face Recognition
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex w-full flex-col space-y-4 py-2 lg:px-10">
                                <div className="text-lg font-medium dark:text-lnd-fg lg:text-base lg:font-normal">
                                    Reminder
                                </div>
                                <ul className="list-disc space-y-2 pl-5 text-[.91rem] leading-relaxed dark:text-lnd-fg-muted">
                                    <li>Please make sure that the info provided is identical to your ID info, and these informations cannot be altered once the ID verification is approved.</li>
                                    <li>If the camera is not installed on the device, please use Verdstamp App for ID Verification.</li>
                                    <li>Currently, Verdstamp does not support ID Verification for users in China, Minor Outlying Islands, Hong Kong.</li>
                                    <li>The audit results will be sent to your Email in 1~3 working days. Please check your mailbox.</li>
                                </ul>
                            </div>
                            <div className="mt-6 flex w-full flex-col items-center gap-4 lg:mt-16">
                                <span className="flex w-fit max-w-full items-start gap-2 text-left text-sm text-lnd-fg-muted dark:text-lnd-fg-muted">
                                    <Checkbox className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border border-lnd-border bg-lnd-surface-2 hover:border-lnd-accent/55 dark:border-lnd-border dark:bg-lnd-surface-2" />
                                    <span className="min-w-0">I promise that the information is my own, and there is no pirating of someone&apos;s information</span>
                                </span>
                                <Button onClick={() => setOpen(true)} className="h-auto w-full rounded-[1.25rem] bg-lnd-surface-2 px-6 py-3 text-base font-normal text-lnd-fg-muted hover:bg-lnd-surface-2 dark:bg-lnd-surface-2 dark:text-lnd-fg-muted dark:hover:bg-lnd-surface-2 sm:w-auto sm:px-10">
                                    I&apos;m all set for ID Verification
                                </Button>
                            </div>
                        </div>
                    </div>
                    ) :
                    <IDVerificationPage />
            }
        </>
    )
}
