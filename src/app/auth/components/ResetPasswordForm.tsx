"use client";
import { useRouter, useSearchParams } from "next/navigation";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useId, useMemo, useState } from "react";
import { ImSpinner3 } from "react-icons/im";
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import CustomToastError from "@/components/CustomToastErrorLogin";
import {
    authInputClass,
    authLabelClass,
    authLinkClass,
    authPrimaryButtonClass,
} from "./authStyles";

const formSchema = z
    .object({
        newPassword: z.string().min(8, {
            message: "Password must be at least 8 characters",
        }),
        confirmPassword: z.string().min(8, {
            message: "Please confirm your password",
        }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export default function ResetPasswordForm() {
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const newPasswordId = useId();
    const confirmPasswordId = useId();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Better Auth sends the token via query param when the user clicks the email link
    const token = searchParams.get("token");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    const checkStrength = (pass: string) => {
        const requirements = [
            { regex: /.{8,}/, text: "At least 8 characters" },
            { regex: /[0-9]/, text: "At least 1 number" },
            { regex: /[a-z]/, text: "At least 1 lowercase letter" },
            { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
        ];

        return requirements.map((req) => ({
            met: req.regex.test(pass),
            text: req.text,
        }));
    };

    const strength = checkStrength(form.watch("newPassword") || "");

    const strengthScore = useMemo(() => {
        return strength.filter((req) => req.met).length;
    }, [strength]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!token) {
            toast.custom(() => <CustomToastError />);
            return;
        }

        if (strengthScore < 3) {
            toast.custom(() => <CustomToastError />);
            return;
        }

        setLoading(true);
        try {
            await authClient.resetPassword({
                newPassword: values.newPassword,
                token: token,
            });
            setIsSuccess(true);
        } catch (error) {
            toast.custom(() => <CustomToastError />);
            console.error("Password reset failed:", error);
        } finally {
            setLoading(false);
        }
    }

    // No token present — show an error state
    if (!token) {
        return (
            <div className="flex flex-col items-center justify-center gap-6 py-10">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500 dark:text-red-400">
                    <XIcon className="h-8 w-8" />
                </div>
                <div className="space-y-2 text-center">
                    <h1 className="font-Manrope text-xl font-extrabold text-lnd-fg">
                        Invalid Reset Link
                    </h1>
                    <p className="max-w-xs text-sm text-lnd-fg-muted">
                        This password reset link is invalid or has expired. Please request a new one.
                    </p>
                </div>
                <Link
                    href="/auth/login"
                    className={authLinkClass}
                >
                    Back to Login
                </Link>
            </div>
        );
    }

    // Success state after password has been reset
    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center gap-6 py-10">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-lnd-accent/10 text-lnd-accent">
                    <CheckIcon className="h-8 w-8" />
                </div>
                <div className="space-y-2 text-center">
                    <h1 className="font-Manrope text-xl font-extrabold text-lnd-fg">
                        Password Reset Successfully
                    </h1>
                    <p className="max-w-xs text-sm text-lnd-fg-muted">
                        Your password has been updated. You can now log in with your new password.
                    </p>
                    <div className="pt-2 text-xs leading-relaxed text-amber-600 dark:text-amber-400">
                        Withdrawal service will be prohibited for 24 hours
                        <br />
                        after resetting password
                    </div>
                </div>
                <Button
                    onClick={() => router.push("/auth/login")}
                    className={`${authPrimaryButtonClass} w-auto px-8`}
                >
                    Go to Login
                </Button>
            </div>
        );
    }

    // Main reset password form
    return (
        <Form {...form}>
            <form
                className="flex flex-col gap-6"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <div className="flex flex-col gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lnd-accent/10 text-lnd-accent">
                        <ShieldCheck className="h-6 w-6" />
                    </span>
                    <div>
                        <h1 className="font-Manrope text-2xl font-extrabold tracking-tight text-lnd-fg">
                            Reset Password
                        </h1>
                        <p className="mt-1 text-sm text-lnd-fg-muted">
                            Enter your new password below
                        </p>
                    </div>
                </div>

                <div className="text-xs leading-relaxed text-amber-600 dark:text-amber-400">
                    Withdrawal service will be prohibited for 24 hours
                    <br />
                    after resetting password
                </div>

                <div className="flex flex-col gap-5">
                    {/* New Password Field */}
                    <div className="flex items-start gap-2">
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className={authLabelClass}>
                                        New Password
                                    </FormLabel>
                                    <FormControl>
                                        <input
                                            id={newPasswordId}
                                            className={authInputClass}
                                            placeholder="Enter new password"
                                            type={isNewPasswordVisible ? "text" : "password"}
                                            {...field}
                                            aria-describedby={`${newPasswordId}-description`}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs font-medium text-red-500 dark:text-red-400" />
                                </FormItem>
                            )}
                        />
                        <button
                            className="mt-7 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-lnd-border bg-lnd-bg text-lnd-fg-muted transition-colors hover:text-lnd-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lnd-accent/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                            type="button"
                            onClick={() => setIsNewPasswordVisible((prev) => !prev)}
                            aria-label={isNewPasswordVisible ? "Hide password" : "Show password"}
                            aria-pressed={isNewPasswordVisible}
                        >
                            {isNewPasswordVisible ? (
                                <EyeOffIcon size={16} aria-hidden="true" />
                            ) : (
                                <EyeIcon size={16} aria-hidden="true" />
                            )}
                        </button>
                    </div>

                    {/* Password Strength Indicator */}
                    <div className="flex w-full flex-col gap-2">
                        <ul className="flex w-full flex-col gap-1.5">
                            {strength.map((req, index) => (
                                <li key={index} className="flex w-full items-center gap-2 text-xs text-lnd-fg-muted">
                                    {req.met ? (
                                        <CheckIcon size={14} className="text-lnd-accent" />
                                    ) : (
                                        <XIcon size={14} className="text-red-500 dark:text-red-400" />
                                    )}
                                    <span>{req.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="flex items-start gap-2">
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className={authLabelClass}>
                                        Confirm Password
                                    </FormLabel>
                                    <FormControl>
                                        <input
                                            id={confirmPasswordId}
                                            className={authInputClass}
                                            placeholder="Confirm new password"
                                            type={isConfirmPasswordVisible ? "text" : "password"}
                                            {...field}
                                            aria-describedby={`${confirmPasswordId}-description`}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs font-medium text-red-500 dark:text-red-400" />
                                </FormItem>
                            )}
                        />
                        <button
                            className="mt-7 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-lnd-border bg-lnd-bg text-lnd-fg-muted transition-colors hover:text-lnd-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lnd-accent/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                            type="button"
                            onClick={() => setIsConfirmPasswordVisible((prev) => !prev)}
                            aria-label={isConfirmPasswordVisible ? "Hide password" : "Show password"}
                            aria-pressed={isConfirmPasswordVisible}
                        >
                            {isConfirmPasswordVisible ? (
                                <EyeOffIcon size={16} aria-hidden="true" />
                            ) : (
                                <EyeIcon size={16} aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>

                <Button
                    disabled={form.formState.isSubmitting || !form.formState.isValid}
                    type="submit"
                    className={authPrimaryButtonClass}
                >
                    {loading ? (
                        <>
                            <ImSpinner3 className="h-4 w-4 animate-spin text-lnd-accent-fg" />
                            <span>Resetting...</span>
                        </>
                    ) : (
                        <span>Reset Password</span>
                    )}
                </Button>

                <div className="flex w-full items-center justify-center gap-3">
                    <Link href="/auth/login" className={authLinkClass}>
                        Back to Login
                    </Link>
                    <span className="h-3 w-px bg-lnd-border" />
                    <Link href="/auth/signup" className={authLinkClass}>
                        Register NOW
                    </Link>
                </div>
            </form>
        </Form>
    );
}
