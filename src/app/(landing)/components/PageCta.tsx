"use client";

import { ArrowUpRight } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useSession } from "@/lib/auth-client";
import { BRAND } from "./LandingBrand";

export default function PageCta({
    eyebrow = "Get started",
    title = `Start trading with ${BRAND.name}`,
    description = "Open an account in minutes and trade digital assets with transparent fees, deep liquidity and 24/7 support.",
    label = "Create account",
    href,
}: {
    eyebrow?: string;
    title?: string;
    description?: string;
    label?: string;
    /** Overrides the default signup/dashboard destination. */
    href?: string;
}) {
    const { data: session } = useSession();
    const router = useRouter();
    const loggedIn = session?.user?.id !== undefined;

    return (
        <section className="relative w-full overflow-hidden border-t border-lnd-border">
            <div
                aria-hidden
                className="lnd-dot-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_55%_70%_at_50%_50%,black,transparent)]"
            />
            <div
                aria-hidden
                className="lnd-glow pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[620px] max-w-none -translate-x-1/2 -translate-y-1/2 blur-2xl"
            />
            <div className="relative mx-auto flex max-w-[1280px] flex-col items-center px-4 py-16 text-center lg:py-20">
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-lnd-accent">
                    {eyebrow}
                </p>
                <h2 className="mt-3 max-w-2xl font-Manrope text-2xl font-extrabold tracking-tight text-lnd-fg sm:text-3xl lg:text-4xl">
                    {title}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-lnd-fg-muted lg:text-base">
                    {description}
                </p>
                <button
                    onClick={() =>
                        router.push(
                            href ??
                                (loggedIn
                                    ? "/overview/spot/assets"
                                    : "/auth/signup"),
                        )
                    }
                    className="lnd-btn-accent mt-7 inline-flex items-center gap-2 px-7 py-3 text-sm"
                >
                    {loggedIn ? "Go to dashboard" : label}
                    <ArrowUpRight className="h-4 w-4" />
                </button>
            </div>
        </section>
    );
}
