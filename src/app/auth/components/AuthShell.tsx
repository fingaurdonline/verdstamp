import type { ReactNode } from "react"
import LandingLogo from "@/app/(landing)/components/LandingLogo"
import { BRAND } from "@/app/(landing)/components/LandingBrand"

type AuthShellProps = {
    highlight: string
    highlightLabel: string
    title: string
    description: string
    children: ReactNode
}

export default function AuthShell({
    highlight,
    highlightLabel,
    title,
    description,
    children,
}: AuthShellProps) {
    return (
        <div className="relative flex min-h-[calc(100dvh-4rem)] items-center justify-center overflow-hidden px-4 py-10 sm:px-6 lg:py-14">
            <div className="lnd-dot-grid pointer-events-none absolute inset-0 opacity-60" />
            <div className="lnd-glow pointer-events-none absolute -left-24 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full" />

            <div className="relative grid w-full max-w-[560px] overflow-hidden rounded-[1.75rem] border border-lnd-border bg-lnd-surface shadow-2xl shadow-black/5 lg:max-w-[1040px] lg:grid-cols-[0.9fr_1.1fr]">
                <aside className="relative hidden overflow-hidden bg-lnd-surface-2 p-10 lg:flex lg:flex-col lg:justify-between">
                    <div className="lnd-dot-grid pointer-events-none absolute inset-0 opacity-70" />
                    <div className="lnd-glow pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full" />

                    <div className="relative z-10 flex items-center gap-3">
                        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lnd-surface shadow-sm">
                            <LandingLogo className="h-11 w-11" />
                        </span>
                        <span className="flex flex-col leading-none">
                            <span className="font-Manrope text-lg font-extrabold tracking-tight text-lnd-fg">
                                {BRAND.name}
                            </span>
                            <span className="mt-1.5 font-Manrope text-[0.52rem] font-semibold uppercase tracking-[0.28em] text-lnd-fg-muted">
                                {BRAND.tagline}
                            </span>
                        </span>
                    </div>

                    <div className="relative z-10 mt-16">
                        <p className="font-Manrope text-[3.4rem] font-extrabold leading-none tracking-tight text-lnd-fg">
                            {highlight}
                        </p>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-lnd-accent">
                            {highlightLabel}
                        </p>
                        <h1 className="mt-8 max-w-xs font-Manrope text-2xl font-extrabold leading-tight text-lnd-fg">
                            {title}
                        </h1>
                        <p className="mt-3 max-w-xs text-sm leading-6 text-lnd-fg-muted">
                            {description}
                        </p>
                    </div>

                    <div className="relative z-10 mt-16 border-t border-lnd-border pt-5">
                        <p className="text-[0.66rem] font-medium uppercase tracking-[0.16em] text-lnd-fg-muted">
                            Secure access · Encrypted sessions
                        </p>
                    </div>
                </aside>

                <div className="relative bg-lnd-surface p-5 sm:p-8 lg:p-12">
                    <div className="mx-auto w-full max-w-[27rem]">{children}</div>
                </div>
            </div>
        </div>
    )
}
