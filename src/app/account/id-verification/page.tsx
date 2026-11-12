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
                    (<div className="w-full h-auto flex flex-col pt-1 space-y-7">
                        <div className="w-full h-auto flex items-center space-x-2">
                            <span className="w-auto h-auto">
                                <ChevronLeft className="w-8 h-8 text-lnd-fg-muted mt-1" />
                            </span>
                            <span className="text-2xl font-extrabold font-Manrope dark:text-lnd-fg">
                                Personal Verification
                            </span>
                        </div>
                        <div className="w-full h-auto bg-lnd-surface rounded-lg lg:bg-transparent space-y-4 lg:space-y-7 p-4 lg:p-0 dark:bg-lnd-surface">
                            <div className="w-full h-[6.5rem] flex lg:rounded-[1.25rem] overflow-hidden lg:bg-linear-to-r lg:from-lnd-accent lg:to-lnd-accent-fill">
                                <div className="w-auto h-auto flex flex-col justify-center lg:p-10 space-y-2">
                                    <span className="w-auto h-auto flex space-x-2">
                                        <Image src="/assets/icon-rights.webp" alt="icon-rights" width={100} height={100} className="w-6 h-6" />
                                        <span className="lg:text-lnd-accent-fg text-[.95rem]">After passing the ID verification, you will be entitled to the below privileges:</span>
                                    </span>
                                    <span className="w-fit h-fit flex lg:items-center items-start space-x-2 lg:text-lnd-accent-fg">
                                        <span className="w-2 h-2 rounded-full bg-black lg:bg-lnd-accent-fg translate-y-2.5 lg:translate-y-0 dark:bg-lnd-surface" />
                                        <span className="text-[1.1rem] font-semibold font-Manrope">
                                            24H withdrawal quota:<br className="lg:hidden" /> 1,000,000 USD
                                        </span>
                                    </span>
                                </div>
                                <div className="hidden lg:block relative -top-20 -right-20">
                                    <IoMdStarOutline className="w-80 h-80 -rotate-12 text-lnd-accent-fg/10" />
                                </div>
                            </div>
                            <div className="w-full h-auto flex flex-col lg:px-10 py-2 space-y-4">
                                <div className="text-lg font-bold font-Manrope dark:text-lnd-fg">
                                    How to Verify
                                </div>
                                <div className="w-full h-auto flex items-center lg:space-x-4">
                                    <div className="w-full min-w-0 h-auto px-6 py-1 flex flex-col lg:flex-row lg:items-center justify-center lg:border-2 border-dashed border-lnd-accent/55 rounded-lg lg:space-x-3 space-y-2 lg:space-y-0 dark:bg-lnd-surface">
                                        <span className="w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-lnd-accent/10" />
                                        <span className="w-fit h-fit flex justify-center items-center text-lnd-accent text-xs lg:text-sm px-[.37rem] border border-lnd-accent/55 rounded-full">
                                            1
                                        </span>
                                        <span className="text-base lg:text-[1.05rem] text-lnd-fg dark:text-lnd-fg">
                                            Basic Info
                                        </span>
                                    </div>
                                    <span className="w-fit h-fit hidden lg:block p-1 rounded-full bg-lnd-surface-2 dark:bg-lnd-surface-2">
                                        <ChevronRight className="text-lnd-fg-muted dark:text-lnd-fg-muted" />
                                    </span>
                                    <div className="w-full min-w-0 h-auto px-6 py-1 flex flex-col lg:flex-row lg:items-center justify-center lg:border-2 border-dashed border-lnd-accent/55 rounded-lg lg:space-x-3 space-y-2 lg:space-y-0 dark:bg-lnd-surface">
                                        <span className="w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-lnd-accent/10" />
                                        <span className="w-fit h-fit flex justify-center items-center text-lnd-accent text-xs lg:text-sm px-[.37rem] border border-lnd-accent/55 rounded-full">
                                            2
                                        </span>
                                        <span className="text-base lg:text-[1.05rem] text-lnd-fg dark:text-lnd-fg">
                                            Upload ID
                                        </span>
                                    </div>
                                    <span className="w-fit h-fit hidden lg:block p-1 rounded-full bg-lnd-surface-2 dark:bg-lnd-surface-2">
                                        <ChevronRight className="text-lnd-fg-muted dark:text-lnd-fg-muted" />
                                    </span>
                                    <div className="w-full min-w-0 h-auto px-6 py-1 flex flex-col lg:flex-row lg:items-center justify-center lg:border-2 border-dashed border-lnd-accent/55 rounded-lg lg:space-x-3 space-y-2 lg:space-y-0 dark:bg-lnd-surface">
                                        <span className="w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-lnd-accent/10" />
                                        <span className="w-fit h-fit flex justify-center items-center text-lnd-accent text-xs lg:text-sm px-[.37rem] border border-lnd-accent/55 rounded-full">
                                            3
                                        </span>
                                        <span className="text-base lg:text-[1.05rem] text-lnd-fg dark:text-lnd-fg">
                                            Face Recognition
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full h-auto flex flex-col lg:px-10 py-2 space-y-4">
                                <div className="text-lg font-medium lg:text-base lg:font-normal dark:text-lnd-fg">
                                    Reminder
                                </div>
                                <div className="text-[.91rem] dark:text-lnd-fg-muted">
                                    <li>Please make sure that the info provided is identical to your ID info, and these informations cannot be altered once the ID verification is approved.</li>
                                    <li>If the camera is not installed on the device, please use Verdstamp App for ID Verification.</li>
                                    <li>Currently, Verdstamp does not support ID Verification for users in China, Minor Outlying Islands, Hong Kong.</li>
                                    <li>The audit results will be sent to your Email in 1~3 working days. Please check your mailbox.</li>
                                </div>
                            </div>
                            <div className="w-full h-auto flex flex-col items-center space-y-4 mt-40!">
                                <span className="w-fit h-fit text-center text-sm text-lnd-fg-muted flex items-center space-x-1 dark:text-lnd-fg-muted">
                                    <Checkbox className="flex items-center justify-center w-3.5 h-3.5 bg-lnd-surface-2 border border-lnd-border hover:border-lnd-accent/55 -translate-y-2.5 lg:translate-y-0 dark:bg-lnd-surface-2 dark:border-lnd-border" />
                                    <span>I promise that the information is my own, and there is no pirating of someone&apos;s information</span>
                                </span>
                                <Button onClick={() => setOpen(true)} className="h-auto py-3 px-10 text-base font-normal bg-lnd-surface-2 hover:bg-lnd-surface-2 text-lnd-fg-muted rounded-[1.25rem] -mt-3 dark:bg-lnd-surface-2 dark:hover:bg-lnd-surface-2 dark:text-lnd-fg-muted">
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
