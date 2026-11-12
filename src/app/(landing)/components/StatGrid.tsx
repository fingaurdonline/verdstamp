import type { ReactNode } from "react";

const COLUMNS = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-4",
} as const;

export default function StatGrid({
    items,
    cols = 3,
}: {
    items: { value: ReactNode; label: string }[];
    cols?: 2 | 3 | 4;
}) {
    return (
        <div
            className={`grid gap-px overflow-hidden rounded-2xl border border-lnd-border bg-lnd-border ${COLUMNS[cols]}`}
        >
            {items.map((item, i) => (
                <div key={i} className="bg-lnd-surface px-5 py-6 lg:px-7 lg:py-8">
                    <p className="font-Manrope text-2xl font-bold tracking-tight text-lnd-fg lg:text-3xl">
                        {item.value}
                    </p>
                    <p className="mt-2 text-[0.66rem] font-medium uppercase tracking-[0.14em] text-lnd-fg-muted">
                        {item.label}
                    </p>
                </div>
            ))}
        </div>
    );
}
