import type { ReactNode } from "react";

export default function SectionHead({
    eyebrow,
    title,
    description,
    action,
    center = false,
}: {
    eyebrow?: string;
    title: string;
    description?: string;
    action?: ReactNode;
    center?: boolean;
}) {
    return (
        <div
            className={`flex gap-4 ${
                center
                    ? "flex-col items-center text-center"
                    : "flex-col sm:flex-row sm:items-end sm:justify-between"
            }`}
        >
            <div>
                {eyebrow && (
                    <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-lnd-accent">
                        {eyebrow}
                    </p>
                )}
                <h2 className="mt-1.5 font-Manrope text-2xl font-bold tracking-tight text-lnd-fg lg:text-3xl">
                    {title}
                </h2>
                {description && (
                    <p
                        className={`mt-2 max-w-2xl text-sm leading-relaxed text-lnd-fg-muted ${
                            center ? "mx-auto" : ""
                        }`}
                    >
                        {description}
                    </p>
                )}
            </div>
            {action}
        </div>
    );
}
