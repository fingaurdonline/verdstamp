import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import LandingBrand from "@/app/(landing)/components/LandingBrand"
import SwapTheme from "@/components/ThemeSwap"

export default function AuthHeader() {
    return (
        <header className="sticky top-0 z-40 border-b border-lnd-border bg-lnd-bg/85 backdrop-blur-md">
            <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-4 lg:px-6">
                <LandingBrand />

                <div className="flex items-center gap-2">
                    <Link
                        href="/"
                        className="lnd-btn-ghost inline-flex items-center gap-2 px-3.5 py-2 text-[0.8rem] sm:px-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Back to home</span>
                        <span className="sm:hidden">Home</span>
                    </Link>

                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-lnd-border text-lnd-fg transition-colors hover:bg-lnd-surface-2">
                        <SwapTheme />
                    </span>
                </div>
            </div>
        </header>
    )
}
