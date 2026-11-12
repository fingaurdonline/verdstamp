"use client"

import { ArrowUpRight } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useSession } from "@/lib/auth-client";
import { BRAND } from "./LandingBrand";

export default function SignUpButton() {
    const { data: session } = useSession()
    const router = useRouter()
    const loggedIn = session?.user?.id !== undefined

    return (
        <section className="relative w-full overflow-hidden border-t border-lnd-border">
            <div
                aria-hidden
                className="lnd-dot-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_50%_60%_at_50%_50%,black,transparent)]"
            />
            <div
                aria-hidden
                className="lnd-glow pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[720px] max-w-none -translate-x-1/2 -translate-y-1/2 blur-2xl"
            />
            <span
                aria-hidden
                className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-Manrope text-[22vw] font-extrabold leading-none tracking-tight text-lnd-fg/5 lg:text-[11rem]"
            >
                {BRAND.name}
            </span>

            <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center lg:py-32">
                <span className="inline-flex items-center gap-2 rounded-full border border-lnd-border bg-lnd-surface/70 px-3.5 py-1.5 text-[0.72rem] font-medium text-lnd-fg-muted backdrop-blur">
                    <span className="h-1.5 w-1.5 rounded-full bg-lnd-accent" />
                    Buy, swap and transfer in one place
                </span>

                <h2 className="mt-6 font-Manrope text-3xl font-extrabold tracking-tight text-lnd-fg sm:text-4xl lg:text-5xl">
                    Explore the crypto world with {BRAND.name}
                </h2>

                <p className="mt-4 max-w-lg text-base leading-relaxed text-lnd-fg-muted">
                    Open an account in minutes and trade digital assets with
                    transparent fees, deep liquidity and 24/7 support.
                </p>

                <button
                    onClick={() =>
                        router.push(
                            loggedIn ? "/overview/spot/assets" : "/auth/signup",
                        )
                    }
                    className="lnd-btn-accent mt-8 flex items-center gap-2 px-8 py-3.5 text-sm"
                >
                    {loggedIn ? "Trade Now" : "Sign Up Now"}
                    <ArrowUpRight className="h-4 w-4" />
                </button>

                <p className="mt-3 text-xs text-lnd-fg-muted">
                    No hidden fees · 24/7 support
                </p>
            </div>
        </section>
    )
}
