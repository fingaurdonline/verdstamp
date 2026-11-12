"use client";

import { ChevronDown } from "lucide-react";

export default function LegalMobileToc({
    items,
    active,
    onSelect,
}: {
    items: string[];
    active: number;
    onSelect: (index: number) => void;
}) {
    return (
        <details className="group mb-8 rounded-2xl border border-lnd-border bg-lnd-surface lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 font-Manrope text-sm font-semibold text-lnd-fg [&::-webkit-details-marker]:hidden">
                On this page
                <ChevronDown className="h-4 w-4 text-lnd-fg-muted transition-transform group-open:rotate-180" />
            </summary>
            <nav className="max-h-[60vh] overflow-y-auto border-t border-lnd-border p-2">
                {items.map((item, index) => (
                    <button
                        key={item}
                        type="button"
                        onClick={() => onSelect(index)}
                        className={`block w-full rounded-lg px-3 py-2 text-left text-sm leading-snug transition-colors ${
                            active === index
                                ? "bg-lnd-surface-2 font-medium text-lnd-fg"
                                : "text-lnd-fg-muted hover:bg-lnd-surface-2/60 hover:text-lnd-fg"
                        }`}
                    >
                        {item}
                    </button>
                ))}
            </nav>
        </details>
    );
}
