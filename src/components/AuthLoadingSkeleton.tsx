/**
 * Auth-page placeholder shown while the session check is in flight.
 */
export default function AuthLoadingSkeleton() {
    return (
        <div
            className="flex min-h-[calc(100dvh-4rem)] w-full items-center justify-center px-4 py-10 sm:px-6 lg:py-14"
            role="status"
            aria-live="polite"
            aria-label="Loading sign-in"
        >
            <div className="grid w-full max-w-[560px] animate-pulse overflow-hidden rounded-[1.75rem] border border-lnd-border bg-lnd-surface p-5 shadow-2xl shadow-black/5 sm:p-7 lg:max-w-[1040px] lg:grid-cols-[0.9fr_1.1fr] lg:p-0">
                <div className="hidden min-h-[520px] flex-col justify-between bg-lnd-surface-2 p-10 lg:flex">
                    <span className="h-10 w-32 rounded-xl bg-lnd-fg/10" />
                    <div className="space-y-3">
                        <span className="block h-7 w-3/4 rounded-full bg-lnd-fg/10" />
                        <span className="block h-3 w-full rounded-full bg-lnd-fg/10" />
                        <span className="block h-3 w-5/6 rounded-full bg-lnd-fg/10" />
                    </div>
                    <span className="h-3 w-24 rounded-full bg-lnd-fg/10" />
                </div>

                <div className="space-y-4 p-2 sm:p-4 lg:p-10">
                    <span className="block h-2.5 w-20 rounded-full bg-lnd-fg/10" />
                    <span className="block h-7 w-52 max-w-full rounded-full bg-lnd-fg/10" />
                    <span className="block h-3 w-full rounded-full bg-lnd-fg/10" />
                    <span className="mt-6 block h-12 w-full rounded-xl bg-lnd-fg/10" />
                    <span className="block h-12 w-full rounded-xl bg-lnd-fg/10" />
                    <span className="block h-11 w-full rounded-xl bg-lnd-accent/20" />
                </div>
            </div>
            <span className="sr-only">Loading…</span>
        </div>
    );
}
