"use client"
import AccountManagement from "@/components/icons/AccountManagement";
import EmailIcon from "@/components/icons/EmailIcon";
import PassKey from "@/components/icons/PassKey";
import PasswordIcon from "@/components/icons/PasswordIcon";
import SecuritySettingsIcon from "@/components/icons/SecuritySetttings";
import TOTP from "@/components/icons/TOTP";
import TradePassword from "@/components/icons/TradePassword";
import WithdrawPassword from "@/components/icons/WithdrawPassword";
import { api } from "@convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { PiCheckCircleFill } from "react-icons/pi";

export default function SecuritySettings() {
    const user = useQuery(api.user.user);
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
    function dateFormat(date: number | undefined) {
        if (!date) return "Never";
        return new Date(date).toLocaleString();
    }
    return (
        <div className="flex w-full flex-col gap-5">
            <div className="w-full h-auto flex items-center space-x-2.5">
                <SecuritySettingsIcon className="w-8 h-8" />
                <h1 className="db-title">
                    Security Settings
                </h1>
            </div>
            <div className="w-full h-auto flex flex-col space-y-7">
                <div className="w-full h-auto flex flex-col space-y-4">
                    <h2 className="font-Manrope font-extrabold dark:text-lnd-fg-muted">
                        Basic Settings
                    </h2>
                    <div className="w-full h-auto flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-5">
                        <div className="w-full min-w-0 h-auto flex items-center justify-between pl-4 pr-4 py-5 sm:pl-6 sm:pr-7 sm:py-[1.72rem] space-x-1 lg:space-x-3.5 bg-lnd-surface rounded-2xl dark:bg-lnd-surface">
                            <div className="flex min-w-0 items-center space-x-3.5">
                                <EmailIcon className="w-7 h-7" />
                                <div className="min-w-0 flex-1 space-y-1 font-Manrope pl-1">
                                    <h3 className="text-[.9rem] text-lnd-fg font-bold dark:text-lnd-fg">Email</h3>
                                    <p className="truncate text-[.75rem] lg:text-[.87rem] text-lnd-fg font-medium dark:text-lnd-fg-muted">{maskEmail(user?.email)}</p>
                                </div>
                            </div>
                            <Link
                                className="flex min-h-9 shrink-0 items-center justify-center rounded-sm px-2 py-1 text-[0.8rem] font-medium text-lnd-accent transition-all duration-150 dark:text-lnd-accent lg:bg-lnd-surface-2/70 lg:px-6 lg:py-1 lg:text-lnd-fg-muted dark:lg:bg-lnd-surface-2 dark:lg:text-lnd-fg-muted lg:hover:bg-lnd-surface-2 lg:hover:text-lnd-fg dark:lg:hover:bg-lnd-surface-2"
                                href={"#"}>Change
                            </Link>
                        </div>
                        <div className="w-full min-w-0 h-auto flex items-center justify-between pl-4 pr-4 py-5 sm:pl-6 sm:pr-7 sm:py-[1.72rem] space-x-1 lg:space-x-3.5 bg-lnd-surface rounded-2xl dark:bg-lnd-surface">
                            <div className="flex min-w-0 items-center space-x-3.5">
                                <PasswordIcon className="w-7 h-7" />
                                <div className="min-w-0 flex-1 space-y-1 font-Manrope pl-1">
                                    <h3 className="text-[.9rem] text-lnd-fg font-bold dark:text-lnd-fg">Password</h3>
                                    <p className="truncate text-[.87rem] text-lnd-fg-muted dark:text-lnd-fg-muted">Last change: {dateFormat(user?.updatedAt)}</p>
                                </div>
                            </div>
                            <Link
                                className="flex min-h-9 shrink-0 items-center justify-center rounded-sm px-2 py-1 text-[0.8rem] font-medium text-lnd-accent transition-all duration-150 dark:text-lnd-accent lg:bg-lnd-surface-2/70 lg:px-6 lg:py-1 lg:text-lnd-fg-muted dark:lg:bg-lnd-surface-2 dark:lg:text-lnd-fg-muted lg:hover:bg-lnd-surface-2 lg:hover:text-lnd-fg dark:lg:hover:bg-lnd-surface-2"
                                href={"#"}>Change
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="w-full h-auto flex flex-col space-y-4">
                    <h2 className="font-Manrope font-extrabold dark:text-lnd-fg-muted">
                        Two-factor Authentication (2FA)
                    </h2>
                    <div className="w-full h-auto flex flex-col bg-lnd-surface rounded-2xl dark:bg-lnd-surface">
                        <div className="w-full h-auto flex flex-col lg:flex-row lg:items-center lg:justify-between border-b border-lnd-border px-4 sm:px-7 py-4 space-y-2 lg:space-y-0 lg:space-x-3.5 dark:border-lnd-border">
                            <div className="flex items-center space-x-3.5">
                                <PassKey className="h-[1.9rem] w-[1.9rem] shrink-0" />
                                <div className="min-w-0 flex-1 space-y-1 font-Manrope pl-1">
                                    <h3 className="text-[.89rem] text-lnd-fg font-bold dark:text-lnd-fg">Passkey</h3>
                                    <p className="text-[.78rem] text-lnd-fg-muted dark:text-lnd-fg-muted">Use a security device to protect your account.</p>
                                </div>
                            </div>
                            <div className="flex w-full items-center justify-between pl-0 lg:w-auto lg:justify-end lg:space-x-16">
                                <div className="w-auto h-auto flex items-center">
                                    <span className="text-[0.904rem] text-lnd-fg-muted dark:text-lnd-fg-muted">
                                        Set
                                    </span>
                                </div>
                                <div>
                                    <Link
                                        className="flex h-9 w-24 items-center justify-center rounded-sm py-1 text-[0.8rem] font-medium text-lnd-fg-muted transition-all duration-150 hover:bg-lnd-surface-2 hover:text-lnd-fg dark:bg-lnd-surface-2 dark:text-lnd-fg-muted dark:hover:bg-lnd-surface-2"
                                        href={"#"}>Manage</Link>
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-auto flex flex-col lg:flex-row lg:items-center lg:justify-between px-4 sm:px-7 py-4 space-y-2 lg:space-y-0 lg:space-x-3.5">
                            <div className="flex items-center space-x-3.5">
                                <TOTP className="h-[1.9rem] w-[1.9rem] shrink-0" />
                                <div className="min-w-0 flex-1 space-y-1 font-Manrope pl-1">
                                    <h3 className="text-[.89rem] text-lnd-fg font-bold dark:text-lnd-fg">TOTP Verification</h3>
                                    <p className="text-[.78rem] text-lnd-fg-muted dark:text-lnd-fg-muted">Use TOTP authenticator to protect your account.</p>
                                </div>
                            </div>
                            <div className="flex w-full items-center justify-between pl-0 lg:w-auto lg:justify-end lg:space-x-16">
                                <div className="w-auto h-auto flex items-center">
                                    <span className="text-[0.904rem] text-lnd-fg-muted dark:text-lnd-fg-muted">
                                        Not Set
                                    </span>
                                </div>
                                <div>
                                    <Link
                                        className="flex h-9 w-24 items-center justify-center rounded-sm py-1 text-[0.8rem] font-medium text-lnd-fg-muted transition-all duration-150 hover:bg-lnd-surface-2 hover:text-lnd-fg dark:bg-lnd-surface-2 dark:text-lnd-fg-muted dark:hover:bg-lnd-surface-2"
                                        href={"#"}>Set</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full h-auto flex flex-col space-y-4">
                    <h2 className="font-Manrope font-extrabold dark:text-lnd-fg-muted">
                        Advanced Settings
                    </h2>
                    <div className="w-full h-auto flex flex-col bg-lnd-surface rounded-2xl dark:bg-lnd-surface">
                        <div className="w-full h-auto flex flex-col lg:flex-row lg:items-center lg:justify-between border-b border-lnd-border px-4 sm:px-7 py-4 space-y-2 lg:space-y-0 lg:space-x-3.5 dark:border-lnd-border">
                            <div className="flex items-center lg:space-x-3.5">
                                <WithdrawPassword className="h-[1.9rem] w-[1.9rem] shrink-0" />
                                <div className="min-w-0 flex-1 space-y-1 font-Manrope pl-1">
                                    <h3 className="text-[.89rem] text-lnd-fg font-bold dark:text-lnd-fg">Withdrawal Password</h3>
                                    <p className="text-[.78rem] text-lnd-fg-muted dark:text-lnd-fg-muted">Set withdrawal password to protect your assets</p>
                                </div>
                            </div>
                            <div className="flex w-full items-center justify-between pl-0 lg:w-auto lg:justify-end lg:space-x-16">
                                <div className="w-auto h-auto flex items-center">
                                    <span className="text-[0.904rem] text-lnd-fg-muted dark:text-lnd-fg-muted">
                                        {
                                            user?.is2FAEnabled === true ?
                                                <span className="flex items-center space-x-2">
                                                    <PiCheckCircleFill className="text-green-600 dark:text-green-400 w-4 h-4" />
                                                    <span>Set</span>
                                                </span>
                                                :
                                                " Not Set"
                                        }
                                    </span>
                                </div>
                                <div>
                                    <button
                                        onClick={async () => {
                                            await updateEnableOtp({ enableOtp: !(user?.is2FAEnabled ?? false) })
                                        }}
                                        className="flex h-9 w-24 items-center justify-center rounded-sm py-1 text-[0.8rem] font-medium text-lnd-fg-muted transition-all duration-150 hover:bg-lnd-surface-2 hover:text-lnd-fg dark:bg-lnd-surface-2 dark:text-lnd-fg-muted dark:hover:bg-lnd-surface-2">
                                        Set
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-auto flex flex-col lg:flex-row lg:items-center lg:justify-between border-b border-lnd-border px-4 sm:px-7 py-4 space-y-2 lg:space-y-0 lg:space-x-3.5 dark:border-lnd-border">
                            <div className="flex items-center lg:space-x-3.5">
                                <TradePassword className="h-[1.9rem] w-[1.9rem] shrink-0" />
                                <div className="min-w-0 flex-1 space-y-1 font-Manrope pl-1">
                                    <h3 className="text-[.89rem] text-lnd-fg font-bold dark:text-lnd-fg">Trading Password</h3>
                                    <p className="text-[.78rem] text-lnd-fg-muted dark:text-lnd-fg-muted">Set trading password to secure your transactions</p>
                                </div>
                            </div>
                            <div className="flex w-full items-center justify-between pl-0 lg:w-auto lg:justify-end lg:space-x-16">
                                <div className="w-auto h-auto flex items-center">
                                    <span className="text-[0.904rem] text-lnd-fg-muted dark:text-lnd-fg-muted">
                                        Not Set
                                    </span>
                                </div>
                                <div>
                                    <Link
                                        className="flex h-9 w-24 items-center justify-center rounded-sm py-1 text-[0.8rem] font-medium text-lnd-fg-muted transition-all duration-150 hover:bg-lnd-surface-2 hover:text-lnd-fg dark:bg-lnd-surface-2 dark:text-lnd-fg-muted dark:hover:bg-lnd-surface-2"
                                        href={"#"}>Set</Link>
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-auto flex flex-col lg:flex-row lg:items-center lg:justify-between px-4 sm:px-7 py-4 space-y-2 lg:space-y-0 lg:space-x-3.5">
                            <div className="flex items-center lg:space-x-3.5">
                                <SecuritySettingsIcon className="h-[1.9rem] w-[1.9rem] shrink-0" />
                                <div className="min-w-0 flex-1 space-y-1 font-Manrope pl-1">
                                    <h3 className="text-[.89rem] text-lnd-fg font-bold dark:text-lnd-fg">Anti-Phishing Code</h3>
                                    <p className="text-[.78rem] text-lnd-fg-muted dark:text-lnd-fg-muted">For verifying official emails from Verdstamp</p>
                                </div>
                            </div>
                            <div className="flex w-full items-center justify-between pl-0 lg:w-auto lg:justify-end lg:space-x-16">
                                <div className="w-auto h-auto flex items-center">
                                    <span className="text-[0.904rem] text-lnd-fg-muted dark:text-lnd-fg-muted">
                                        Not Set
                                    </span>
                                </div>
                                <div>
                                    <Link
                                        className="flex h-9 w-24 items-center justify-center rounded-sm py-1 text-[0.8rem] font-medium text-lnd-fg-muted transition-all duration-150 hover:bg-lnd-surface-2 hover:text-lnd-fg dark:bg-lnd-surface-2 dark:text-lnd-fg-muted dark:hover:bg-lnd-surface-2"
                                        href={"#"}>Set</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-auto flex flex-col lg:flex-row lg:items-center lg:justify-between px-4 sm:px-7 py-4 space-y-2 lg:space-y-0 lg:space-x-3.5 bg-lnd-surface mt-3 dark:bg-lnd-surface">
                        <div className="flex items-center lg:space-x-3.5">
                            <AccountManagement className="h-[1.9rem] w-[1.9rem] shrink-0" />
                            <div className="min-w-0 flex-1 space-y-1 font-Manrope pl-1">
                                <h3 className="text-[.89rem] text-lnd-fg font-bold dark:text-lnd-fg">Account Management</h3>
                                <p className="text-[.78rem] text-lnd-fg-muted dark:text-lnd-fg-muted">Freeze or delete account</p>
                            </div>
                        </div>
                        <div className="w-auto h-auto flex items-center justify-end space-x-5">
                            <button
                                className="flex h-9 w-24 items-center justify-center rounded-sm py-1 text-[0.8rem] font-medium text-lnd-fg-muted transition-all duration-150 hover:bg-lnd-surface-2 hover:text-lnd-fg dark:bg-lnd-surface-2 dark:text-lnd-fg-muted dark:hover:bg-lnd-surface-2"
                            >
                                Freeze
                            </button>
                            <button
                                className="flex h-9 w-24 items-center justify-center rounded-sm py-1 text-[0.8rem] font-medium text-lnd-fg-muted transition-all duration-150 hover:bg-lnd-surface-2 hover:text-lnd-fg dark:bg-lnd-surface-2 dark:text-lnd-fg-muted dark:hover:bg-lnd-surface-2"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
