/**
 * Branded placeholder used while the auth session is resolving.
 * Keeps protected routes from flashing an empty viewport on slow connections.
 */
import LandingLogo from "@/app/(landing)/components/LandingLogo";

export default function AppLoadingSkeleton() {
    return (
        <div
            className="flex h-dvh w-full flex-col bg-lnd-bg text-lnd-fg"
            role="status"
            aria-live="polite"
            aria-label="Loading your account"
        >
            <div className="flex h-16 w-full shrink-0 items-center gap-2.5 border-b border-lnd-border bg-lnd-bg/85 px-3 sm:px-5 lg:px-7">
                <LandingLogo className="h-8 w-8 shrink-0" />
                <span className="h-2.5 w-24 animate-pulse rounded-full bg-lnd-fg/10" />
            </div>

            <div className="mx-auto flex w-full max-w-[1560px] flex-1 gap-5 px-3 py-5 sm:px-5 lg:px-7 lg:py-7">
                <aside className="hidden w-60 shrink-0 lg:block xl:w-64">
                    <div className="db-card space-y-3 p-4">
                        <span className="block h-2.5 w-16 animate-pulse rounded-full bg-lnd-fg/10" />
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="flex items-center gap-3 px-1 py-1.5">
                                <span className="h-4 w-4 animate-pulse rounded-md bg-lnd-fg/10" />
                                <span
                                    className="h-2.5 animate-pulse rounded-full bg-lnd-fg/10"
                                    style={{ width: `${52 + (index % 3) * 12}%` }}
                                />
                            </div>
                        ))}
                    </div>
                </aside>

                <main className="min-w-0 flex-1 space-y-5">
                    <div className="db-card h-28 animate-pulse bg-lnd-surface-2/40" />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="db-card h-36 animate-pulse bg-lnd-surface-2/40" />
                        ))}
                    </div>
                    <div className="db-card h-64 animate-pulse bg-lnd-surface-2/40" />
                </main>
            </div>

            <span className="sr-only">Loading…</span>
        </div>
    );
}
