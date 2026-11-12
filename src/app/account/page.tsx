"use client"
import DoubleVerify from "@/components/icons/DoubleVerify";
import KYC from "@/components/icons/KYC";
import Preference from "@/components/icons/Prefernce";
import VIPLevel from "@/components/icons/VIPLevel";
import VIPLevelIcon from "@/components/icons/VIPLevelIcon";
import Link from "next/link";
import { BsCheckCircleFill } from "react-icons/bs";
import { IoIosMail } from "react-icons/io";
import LoginStatusTable from "./components/LoginStatusTable";
import LoginHistoryTable from "./components/LoginHistoryTable";
import LoginHistoryMobile from "./components/LoginHistoryMobile";
import LoginHistoryMagagementMobile from "./components/LoginHistoryManagementMobile";
import Image from "next/image";
import { api } from "@convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

function StatusPill({
    enabled,
    enabledLabel,
    disabledLabel,
}: {
    enabled: boolean;
    enabledLabel: string;
    disabledLabel: string;
}) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.72rem] font-medium ${
                enabled
                    ? "bg-lnd-accent/10 text-lnd-accent"
                    : "bg-lnd-surface-2 text-lnd-fg-muted"
            }`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${
                    enabled ? "bg-lnd-accent" : "bg-lnd-fg-muted/60"
                }`}
            />
            {enabled ? enabledLabel : disabledLabel}
        </span>
    );
}

export default function AccountOverview() {
    const user = useQuery(api.user.user)
    const updateEnableOtp = useMutation(api.user.update_enable_otp)

    function maskEmail(input: string | undefined) {
        if (!input) return "";
        try {
            if (input.length <= 13) return input;
            const firstPart = input.slice(0, 4);
            const lastPart = input.slice(-14);
            const masked = `${firstPart}******${lastPart}`;
            return masked;
        } catch (error) {
            console.log(error)
        }
    }

    const kycApproved = user?.kyc_status === "approved"
    const otpEnabled = user?.is2FAEnabled !== false
    const vipUser = (user?.vip_status ?? 0) !== 0

    return (
        <div className="flex w-full flex-col gap-5">
            <section className="db-card overflow-hidden">
                <div className="flex flex-wrap items-center gap-4 p-5 sm:p-6">
                    <div className="flex w-full min-w-0 items-center gap-4 sm:w-auto sm:flex-1">
                        <Image
                            src="/assets/userlogo.svg"
                            alt="avatar"
                            width={100}
                            height={100}
                            className="h-16 w-16 shrink-0 lg:h-20 lg:w-20"
                        />
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <h1 className="truncate font-Manrope text-xl font-extrabold tracking-tight text-lnd-fg lg:text-2xl">
                                    {user?.username}
                                </h1>
                                <button
                                    type="button"
                                    className="rounded-full border border-lnd-accent/25 bg-lnd-accent/10 px-3.5 py-1.5 font-Manrope text-[0.78rem] font-medium text-lnd-accent transition-colors hover:bg-lnd-accent/15"
                                >
                                    Change
                                </button>
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                                <span className="inline-flex items-center gap-1.5 text-[0.82rem] text-lnd-fg-muted">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-lnd-surface-2">
                                        <IoIosMail className="h-3 w-3 text-lnd-fg-muted" />
                                    </span>
                                    Email
                                </span>
                                <span className="break-all font-Manrope text-[0.85rem] font-medium text-lnd-fg">
                                    {maskEmail(user?.email)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <StatusPill
                            enabled={kycApproved}
                            enabledLabel="Identity verified"
                            disabledLabel="Identity unverified"
                        />
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 px-2.5 py-1 text-[0.72rem] font-medium text-amber-600 dark:text-amber-400">
                            <VIPLevelIcon className="h-3 w-3" />
                            {vipUser ? "VIP user" : "Regular user"}
                        </span>
                    </div>
                </div>
            </section>

            <section className="db-card overflow-hidden">
                <div className="border-b border-lnd-border px-5 py-4 sm:px-6">
                    <h2 className="db-section-title">Security &amp; preferences</h2>
                    <p className="mt-0.5 text-[0.8rem] text-lnd-fg-muted">
                        Manage verification, two-factor authentication and account preferences.
                    </p>
                </div>
                <div className="divide-y divide-lnd-border">
                    <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div className="flex min-w-0 items-center gap-3.5">
                            <span className="db-icon-tile text-lnd-accent">
                                <KYC className="h-6 w-6" />
                            </span>
                            <div className="min-w-0">
                                <p className="font-Manrope text-[0.9rem] font-semibold text-lnd-fg">
                                    ID Verification
                                </p>
                                <div className="mt-1 flex items-center gap-1.5">
                                    <BsCheckCircleFill
                                        className={
                                            kycApproved
                                                ? "h-2.5 w-2.5 text-lnd-accent"
                                                : "h-2.5 w-2.5 text-lnd-fg-muted/70"
                                        }
                                    />
                                    <span
                                        className={`text-[0.78rem] ${
                                            kycApproved
                                                ? "text-lnd-accent"
                                                : "text-lnd-fg-muted"
                                        }`}
                                    >
                                        {kycApproved ? "Verified" : "Unverified"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Link
                            href="/account/id-verification"
                            className="lnd-btn-ghost w-fit px-4 py-2 text-[0.8rem]"
                        >
                            Personal Verification
                        </Link>
                    </div>

                    <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div className="flex min-w-0 items-center gap-3.5">
                            <span className="db-icon-tile">
                                <VIPLevel className="h-6 w-6 text-lnd-fg-muted" />
                            </span>
                            <div className="min-w-0">
                                <p className="font-Manrope text-[0.9rem] font-semibold text-lnd-fg">
                                    VIP Level
                                </p>
                                <div className="mt-1 flex items-center gap-1.5 text-[0.78rem] text-lnd-fg-muted">
                                    <VIPLevelIcon className="h-3 w-3" />
                                    {vipUser ? "VIP User" : "Regular User"}
                                </div>
                            </div>
                        </div>
                        <Link
                            href="/vip"
                            className="lnd-btn-ghost w-fit px-4 py-2 text-[0.8rem]"
                        >
                            View
                        </Link>
                    </div>

                    <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div className="flex min-w-0 items-center gap-3.5">
                            <span className="db-icon-tile">
                                <DoubleVerify className="h-6 w-6" />
                            </span>
                            <div className="min-w-0">
                                <p className="font-Manrope text-[0.9rem] font-semibold text-lnd-fg">
                                    One-Time Password
                                </p>
                                <div className="mt-1">
                                    <StatusPill
                                        enabled={otpEnabled}
                                        enabledLabel="Enabled"
                                        disabledLabel="Not Enabled"
                                    />
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() =>
                                updateEnableOtp({
                                    enableOtp: !(user?.is2FAEnabled ?? false),
                                })
                            }
                            className="lnd-btn-ghost w-fit px-4 py-2 text-[0.8rem]"
                        >
                            {otpEnabled ? "Disable" : "Set"}
                        </button>
                    </div>

                    <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div className="flex min-w-0 items-center gap-3.5">
                            <span className="db-icon-tile">
                                <Preference className="h-6 w-6" />
                            </span>
                            <div className="min-w-0">
                                <p className="font-Manrope text-[0.9rem] font-semibold text-lnd-fg">
                                    Preferences
                                </p>
                                <p className="mt-0.5 text-[0.78rem] text-lnd-fg-muted">
                                    Currency, language and display settings
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/account/preferences"
                            className="lnd-btn-ghost w-fit px-4 py-2 text-[0.8rem]"
                        >
                            Set
                        </Link>
                    </div>
                </div>
            </section>

            <section className="db-card overflow-hidden">
                <div className="border-b border-lnd-border px-5 py-4 sm:px-6">
                    <h2 className="db-section-title">Login Status Management</h2>
                    <p className="mt-0.5 text-[0.8rem] text-lnd-fg-muted">
                        Review the device currently signed in to your account.
                    </p>
                </div>
                <div className="p-4 sm:p-5">
                    <LoginStatusTable />
                    <LoginHistoryMagagementMobile />
                </div>
            </section>

            <section className="db-card overflow-hidden">
                <div className="border-b border-lnd-border px-5 py-4 sm:px-6">
                    <h2 className="db-section-title">Login History</h2>
                    <p className="mt-0.5 text-[0.8rem] text-lnd-fg-muted">
                        Recent sign-ins and the devices used to access your account.
                    </p>
                </div>
                <div className="p-4 sm:p-5">
                    <LoginHistoryTable />
                    <LoginHistoryMobile />
                </div>
            </section>
        </div>
    )
}
