import type { ReactNode } from "react";

/**
 * Standard inner-page hero with the landing dot grid + glow.
 * `footer` sits below the hero text at full container width (e.g. stats).
 */
export default function PageHero({
    eyebrow,
    title,
    subtitle,
    actions,
    footer,
    aside,
    align = "left",
}: {
    eyebrow?: string;
    title: ReactNode;
    subtitle?: string;
    actions?: ReactNode;
    footer?: ReactNode;
    aside?: ReactNode;
    align?: "left" | "center";
}) {
    const centered = align === "center";

    return (
        <section className="relative w-full overflow-hidden border-b border-lnd-border">
            <div
                aria-hidden
                className="lnd-dot-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_65%_80%_at_50%_0%,black,transparent)]"
            />
            <div
                aria-hidden
                className="lnd-glow pointer-events-none absolute -right-48 -top-24 h-[480px] w-[720px] blur-2xl"
            />

            <div className="relative mx-auto w-full max-w-[1280px] px-4 py-14 lg:px-6 lg:py-20">
                <div
                    className={
                        aside
                            ? "grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14"
                            : ""
                    }
                >
                    <div
                        className={
                            centered
                                ? "mx-auto max-w-3xl text-center"
                                : "max-w-3xl"
                        }
                    >
                        {eyebrow && (
                            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-lnd-accent">
                                {eyebrow}
                            </p>
                        )}
                        <h1 className="mt-3 font-Manrope text-[2.2rem] font-extrabold leading-[1.08] tracking-tight text-lnd-fg sm:text-5xl lg:text-[3.4rem]">
                            {title}
                        </h1>
                        {subtitle && (
                            <p
                                className={`mt-5 max-w-2xl text-base leading-relaxed text-lnd-fg-muted lg:text-lg ${
                                    centered ? "mx-auto" : ""
                                }`}
                            >
                                {subtitle}
                            </p>
                        )}
                        {actions && (
                            <div
                                className={`mt-8 flex flex-wrap items-center gap-3 ${
                                    centered ? "justify-center" : ""
                                }`}
                            >
                                {actions}
                            </div>
                        )}
                    </div>

                    {aside && <div className="relative">{aside}</div>}
                </div>

                {footer && <div className="mt-12">{footer}</div>}
            </div>
        </section>
    );
}
