"use client";
import { useRouter } from "next/navigation";
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
import { FaUserCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { signIn, signUp, authClient } from "@/lib/auth-client";
import { ImSpinner3 } from "react-icons/im";
import { useEffect } from "react";
import { useId, useMemo, useState } from "react"
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react"
import { toast } from "sonner"
import CustomToastSuccess from "@/components/CustomToastSuccessSignup";
import CustomToastError from "@/components/CustomToastErrorSignup";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import {
    authDividerClass,
    authGhostButtonClass,
    authInputClass,
    authLabelClass,
    authLinkClass,
    authPrimaryButtonClass,
} from "./authStyles";


const formSchema = z.object({
    email: z
        .string()
        .min(1, {
            message: "email required",
        })
        .email(),
    password: z.string().min(8, {
        message: "password required",
    }),
    referral_code: z.string().optional()
});

export default function SignUpForm() {
    const [loading, setLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const router = useRouter();
    const ensureUserAccounts = useMutation(api.accounts.ensure_user_accounts)
    type Inputs = z.infer<typeof formSchema>;
    const form = useForm<Inputs>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            referral_code: ""
        },
    });
    const id = useId()
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const toggleVisibility = () => setIsVisible((prevState) => !prevState)

    const checkStrength = (pass: string) => {
        const requirements = [
            { regex: /.{8,}/, text: "At least 8 characters" },
            { regex: /[0-9]/, text: "At least 1 number" },
            { regex: /[a-z]/, text: "At least 1 lowercase letter" },
            { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
        ]

        return requirements.map((req) => ({
            met: req.regex.test(pass),
            text: req.text,
        }))
    }
    // Check password strength realtime
    const strength = checkStrength(form.watch("password") || "");

    const strengthScore = useMemo(() => {
        return strength.filter((req) => req.met).length
    }, [strength])

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("c");
        if (code) {
            form.setValue("referral_code", code);
        }
    }, [form]);

    async function onSubmit(value: Inputs) {
        const username = value.email.includes('@') ? value.email.split('@')[0] : value.email;
        if (strengthScore < 3) {
            throw new Error("Password is not strong enough. Please ensure it meets the requirements.");
        }
        try {
            setLoading(true)
            if (value.referral_code) {
                localStorage.setItem("pendingReferralCode", value.referral_code);
            }
            await signUp.email({
                name: username,
                email: value.email,
                password: value.password,
            }, {
                onSuccess: () => {
                    toast.custom((id) => <CustomToastSuccess />)
                    router.push("/overview")
                    setLoading(false)
                    void authClient.sendVerificationEmail({
                        email: value.email,
                    })
                }
            });
        } catch (error) {
            toast.custom((id) => <CustomToastError />)
            console.error("Signup failed:", error);
            setLoading(false)
            throw error;
        }
    }
    const signInWithGoogle = async () => {
        if (isGoogleLoading) return;
        setIsGoogleLoading(true);
        try {
            const refCode = form.getValues("referral_code");
            if (refCode) {
                localStorage.setItem("pendingReferralCode", refCode);
            }
            await signIn.social({
                provider: "google",
                callbackURL: "/overview",
            },
                {
                    onSuccess: async () => {
                        router.push("/overview");
                        setIsGoogleLoading(false);
                    },
                    onError: () => {
                        setIsGoogleLoading(false);
                    },
                }
            );
        } catch {
            setIsGoogleLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form
                className="flex flex-col gap-6"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <div className="flex flex-col gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lnd-accent/10 text-lnd-accent">
                        <FaUserCircle className="h-6 w-6" />
                    </span>
                    <div>
                        <h1 className="font-Manrope text-2xl font-extrabold tracking-tight text-lnd-fg">
                            Sign Up
                        </h1>
                        <p className="mt-1 text-sm text-lnd-fg-muted">
                            Create your account
                        </p>
                    </div>
                </div>
                <div className="flex flex-col gap-5">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className={authLabelClass}>
                                    Account
                                </FormLabel>
                                <FormControl>
                                    <input
                                        type="email"
                                        placeholder="Please enter your Account address"
                                        {...field}
                                        aria-autocomplete="none"
                                        autoComplete="off"
                                        className={authInputClass}
                                    />
                                </FormControl>
                                <FormMessage className="text-xs font-medium text-red-500 dark:text-red-400" />
                            </FormItem>
                        )}
                    />
                    <div className="flex items-start gap-2">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className={authLabelClass}>
                                        Password
                                    </FormLabel>
                                    <FormControl>
                                        <input
                                            id={id}
                                            className={authInputClass}
                                            placeholder="Password"
                                            type={isVisible ? "text" : "password"}
                                            {...field}
                                            aria-describedby={`${id}-description`}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs font-medium text-red-500 dark:text-red-400" />
                                </FormItem>
                            )}
                        />
                        <button
                            className="mt-7 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-lnd-border bg-lnd-bg text-lnd-fg-muted transition-colors hover:text-lnd-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lnd-accent/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                            type="button"
                            onClick={toggleVisibility}
                            aria-label={isVisible ? "Hide password" : "Show password"}
                            aria-pressed={isVisible}
                            aria-controls="password"
                        >
                            {isVisible ? (
                                <EyeOffIcon size={16} aria-hidden="true" />
                            ) : (
                                <EyeIcon size={16} aria-hidden="true" />
                            )}
                        </button>
                    </div>
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
                    <FormField
                        control={form.control}
                        name="referral_code"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className={authLabelClass}>
                                    Referral Code (Optional)
                                </FormLabel>
                                <FormControl>
                                    <input
                                        type="text"
                                        placeholder="Enter referral code"
                                        {...field}
                                        aria-autocomplete="none"
                                        autoComplete="off"
                                        className={authInputClass}
                                    />
                                </FormControl>
                                <FormMessage className="text-xs font-medium text-red-500 dark:text-red-400" />
                            </FormItem>
                        )}
                    />
                </div>
                <Button
                    disabled={form.formState.isSubmitting || !form.formState.isValid}
                    type="submit"
                    className={authPrimaryButtonClass}>
                    {
                        loading === true ?
                            <>
                                <ImSpinner3 className="h-4 w-4 animate-spin text-lnd-accent-fg" />
                                <span>Sign Up</span>
                            </> :
                            <span>Sign Up</span>

                    }
                </Button>
                <div className="flex w-full items-center justify-center gap-3">
                    <Link href={"/auth/login"} className={authLinkClass}>Login</Link>
                    <span className="h-3 w-px bg-lnd-border" />
                    <button type="button" onClick={() => router.push("/")} className={authLinkClass}>Back to Home</button>
                </div>
                <div className="flex items-center justify-center gap-2 overflow-hidden">
                    <Separator className={authDividerClass} />
                    <span className="whitespace-nowrap text-sm text-lnd-fg-muted">
                        Continue with other login
                    </span>
                    <Separator className={authDividerClass} />
                </div>
            </form>
            <div className="flex w-full justify-center pt-4">
                <Button
                    onClick={() => signInWithGoogle()}
                    className={authGhostButtonClass}>
                    <FcGoogle className="h-5 w-5" />
                    <span>Login with Google</span>
                </Button>
            </div>
        </Form>
    )
}
