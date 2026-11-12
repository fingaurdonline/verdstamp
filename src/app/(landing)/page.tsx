import { Globe2, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import CryptoCarousel from "./components/CryptoCarousel";
import CryptoTabs from "./components/CryptoTab";
import Hero from "./components/Hero";
import MoreButton from "./components/MoreButton";
import SignUpButton from "./components/SignUpButton";
import ValueInfo from "./components/ValueInfo";

function SectionHead({
    eyebrow,
    title,
    live,
    children,
}: {
    eyebrow?: string;
    title: string;
    live?: boolean;
    children?: ReactNode;
}) {
    return (
        <div className="flex items-end justify-between gap-4">
            <div>
                {eyebrow && (
                    <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-lnd-accent">
                        {eyebrow}
                    </p>
                )}
                <h2 className="mt-1.5 flex items-center gap-2.5 font-Manrope text-2xl font-bold tracking-tight text-lnd-fg">
                    {title}
                    {live && <span className="lnd-live-dot h-2 w-2 rounded-full bg-lnd-accent" />}
                </h2>
            </div>
            {children}
        </div>
    );
}

function Feature({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
    return (
        <div className="flex items-start gap-3 rounded-2xl border border-lnd-border bg-lnd-surface/60 p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lnd-accent/15 text-lnd-accent">
                {icon}
            </span>
            <span>
                <span className="block font-Manrope text-sm font-semibold text-lnd-fg">{title}</span>
                <span className="mt-1 block text-xs leading-relaxed text-lnd-fg-muted">{text}</span>
            </span>
        </div>
    );
}

export default function Home() {
    return (
        <div className="w-full">
            <Hero />

            <CryptoCarousel />

            {/* Rankings */}
            <section className="mx-auto w-full max-w-[1280px] px-4 pt-14 lg:px-6 lg:pt-20">
                <SectionHead eyebrow="Live market" title="Rankings">
                    <MoreButton />
                </SectionHead>
                <CryptoTabs />
            </section>

            {/* platform stats */}
            <section className="mt-16 border-y border-lnd-border bg-lnd-surface/40 lg:mt-20">
                <div className="mx-auto w-full max-w-[1280px] px-4 lg:px-6">
                    <ValueInfo />
                </div>
            </section>

            {/* services */}
            <section className="mx-auto w-full max-w-[1280px] px-4 py-16 lg:px-6 lg:py-24">
                <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
                    <div>
                        <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-lnd-accent">
                            Built for everyone
                        </p>
                        <h2 className="mt-3 max-w-md font-Manrope text-3xl font-extrabold tracking-tight text-lnd-fg sm:text-4xl lg:text-5xl">
                            Crypto trading with users in mind
                        </h2>
                        <p className="mt-4 max-w-sm text-base leading-relaxed text-lnd-fg-muted">
                            Everything you need to move between fiat and digital assets — without the usual complexity.
                        </p>

                        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                            <Feature
                                icon={<Globe2 className="h-5 w-5" />}
                                title="200+ countries"
                                text="Supporting languages across 200+ countries and regions."
                            />
                            <Feature
                                icon={<Sparkles className="h-5 w-5" />}
                                title="Beginner-friendly"
                                text="Simple flows and clear pricing for first-time traders."
                            />
                        </div>
                    </div>
                </div>
            </section>

            <SignUpButton />
        </div>
    );
}
