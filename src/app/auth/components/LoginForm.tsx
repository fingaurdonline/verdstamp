"use client";
import { useRouter } from "nextjs-toploader/app";
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
import { authClient, signIn } from "@/lib/auth-client";
import { useEffect, useId, useState } from "react";
import { ImSpinner3 } from "react-icons/im";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { toast } from "sonner"
import CustomToastSuccess from "@/components/CustomToastSuccessLogin";
import CustomToastError from "@/components/CustomToastErrorLogin";
import { Info } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { UAParser } from "ua-parser-js";
import CustomToastSuccessReset from "@/components/CustomToastSuccessReset";
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
});

interface DeviceInfo {
    browser?: { name?: string; version?: string };
    os?: { name?: string; version?: string };
    device?: { model?: string; type?: string; vendor?: string };
    engine?: { name?: string; version?: string };
    cpu?: { architecture?: string };
    ua?: string;
    platform?: string;
}

interface GeoData {
    ip?: string;
    city?: string;
    region?: string;
    country?: string;
    latitude?: number | string;
    longitude?: number | string;
    org?: string;
}

export default function LoginForm() {
    const [loading, setLoading] = useState(false)
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)
    const id = useId()
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [email, setEmail] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const toggleVisibility = () => setIsVisible((prevState) => !prevState)
    const router = useRouter();
    const ensureUserAccounts = useMutation(api.accounts.ensure_user_accounts)
    // Note: add useEffect to the react imports at top of the file:
    // import { useId, useState, useEffect } from "react";
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const [clientIp, setClientIp] = useState<string | null>(null);
    const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
    const [geo, setGeo] = useState<GeoData | null>(null);

    useEffect(() => {
        // 🧠 Parse user agent using ua-parser-js
        const parser = new UAParser(typeof navigator !== "undefined" ? navigator.userAgent : "");
        const result = parser.getResult();

        setDeviceInfo({
            browser: result.browser,
            os: result.os,
            device: result.device,
            engine: result.engine,
            cpu: result.cpu,
            ua: result.ua,
            platform: typeof navigator !== "undefined" ? navigator.platform : "",
        });

        // 🌍 Fetch IP + geolocation
        (async () => {
            try {
                const res = await fetch("https://ipapi.co/json/");
                if (!res.ok) return;
                const data = await res.json();
                setClientIp(data.ip);
                setGeo({
                    ip: data.ip,
                    city: data.city,
                    region: data.region,
                    country: data.country_name,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    org: data.org,
                });
            } catch (err) {
                console.error("Failed to fetch geo:", err);
            }
        })();
    }, []);

    async function onSubmit(value: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            await signIn.email({
                email: value.email,
                password: value.password,
            });
            await ensureUserAccounts({});
        } catch (error) {
            setLoading(false)
            toast.custom((id) => <CustomToastError />);
            throw error;
        }
        toast.custom((id) => <CustomToastSuccess />)
        router.push("/overview")
        setLoading(false)
    }

    const signInWithGoogle = async () => {
        if (isGoogleLoading) return;
        setIsGoogleLoading(true);
        try {
            await signIn.social(
                {
                    provider: "google",
                    callbackURL: "/overview",
                },
                {
                    onSuccess: async () => {
                        await ensureUserAccounts({});
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

    async function resetPassword(targetEmail: string) {
        try {
            await authClient.requestPasswordReset({
                email: targetEmail,
                redirectTo: 'https://verdstampdigital.app/auth/reset-password'
            });
            toast.custom((id) => <CustomToastSuccessReset />);
        } catch (error) {
            toast.custom((id) => <CustomToastError />);
        }
    }

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
                            Log In
                        </h1>
                        <p className="mt-1 text-sm text-lnd-fg-muted">
                            Login with your account
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
                </div>
                <Button
                    disabled={form.formState.isSubmitting || !form.formState.isValid}
                    type="submit"
                    className={authPrimaryButtonClass}>
                    {
                        loading === true ?
                            <>
                                <ImSpinner3 className="h-4 w-4 animate-spin text-lnd-accent-fg" />
                                <span>Log In</span>
                            </> :
                            <span>Log In</span>

                    }
                </Button>
                <div className="flex w-full items-center justify-center gap-3">
                    <Link href={"/auth/signup"} className={authLinkClass}>Register NOW</Link>
                    <span className="h-3 w-px bg-lnd-border" />
                    <button type="button" onClick={() => setIsDialogOpen(true)} className={authLinkClass}>Forgot Password</button>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-w-[21.2rem] rounded-2xl border-lnd-border bg-lnd-surface! p-6 text-lnd-fg lg:max-w-[440px] lg:p-8">
                        <div className="space-y-6">
                            <div className="flex flex-col items-start gap-3 lg:gap-4">
                                <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lnd-accent/15 text-lnd-accent">
                                    <Info className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="mb-3 font-Manrope text-xl font-extrabold text-lnd-fg lg:text-2xl">Reset Password</h2>
                                    <div className="text-xs leading-relaxed text-amber-600 dark:text-amber-400 lg:text-sm">
                                        Withdrawal service will be prohibited for 24 hours
                                        <br />
                                        after resetting password
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label htmlFor="reset-email" className="block text-sm font-medium text-lnd-fg">Email Account</label>
                                <input
                                    id="reset-email"
                                    type="email"
                                    placeholder="Please enter an Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={authInputClass}
                                />
                            </div>
                            <button
                                className="h-11 w-full rounded-full bg-lnd-accent-fill text-sm font-semibold text-lnd-accent-fg transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lnd-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-lnd-surface disabled:cursor-not-allowed disabled:bg-lnd-surface-2 disabled:text-lnd-fg-muted"
                                disabled={!email.trim()}
                                type="button"
                                onClick={() => resetPassword(email)}
                            >
                                Submit
                            </button>
                        </div>
                    </DialogContent>
                </Dialog>
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
