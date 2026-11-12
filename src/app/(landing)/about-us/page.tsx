import Link from "next/link";
import {
    ArrowUpRight,
    Coins,
    Globe,
    Headphones,
    LayoutGrid,
    ShieldCheck,
    Sparkles,
    Target,
    Zap,
} from "lucide-react";
import PageHero from "../components/PageHero";
import PageCta from "../components/PageCta";
import SectionHead from "../components/SectionHead";
import StatGrid from "../components/StatGrid";

const ADVANTAGES = [
    {
        icon: ShieldCheck,
        title: "Robust Security Infrastructure",
        description:
            "Implementation of various advanced mechanisms including multi-signature protocols, system physical isolation, real-time monitoring and automatic alarm systems, aiming to balance the convenience and security of hot and cold wallets.",
    },
    {
        icon: LayoutGrid,
        title: "Comprehensive Product Function Experience",
        description:
            "With user needs at the core, provide all-around coverage of various product functions including spot trading, contracts, margin trading, wealth management, strategy trading, and more.",
    },
    {
        icon: Coins,
        title: "Diverse Offerings of Digital Assets",
        description:
            "Supporting 1,000+ quality crypto assets with a rigorous listing process that prioritizes user interests and comprehensive risk assessments.",
    },
    {
        icon: Zap,
        title: "High-Performance Trading Engine",
        description:
            "A self-developed, high-performance trading matching engine capable of processing 10,000 transactions per second, ensuring stable and reliable operation.",
    },
    {
        icon: Headphones,
        title: "24/7 Professional Customer Service",
        description:
            "A multi-language customer service team providing 24/7 online support, ensuring timely and efficient resolution of user queries.",
    },
    {
        icon: Globe,
        title: "Globalized Strategic Layout",
        description:
            "With a global presence, Verdstamp is committed to providing localized services to users worldwide, fostering a vibrant and inclusive crypto ecosystem.",
    },
];

export default function AboutUs() {
    return (
        <div className="w-full">
            <PageHero
                align="center"
                eyebrow="About us"
                title={
                    <>
                        Via blockchain, making the world{" "}
                        <span className="text-lnd-fg-muted">
                            a better place
                        </span>
                    </>
                }
                subtitle="Putting users first, Verdstamp is committed to being your crypto trading expert."
                actions={
                    <>
                        <Link
                            href="/contact-us"
                            className="lnd-btn-accent inline-flex items-center gap-2 px-6 py-3 text-sm"
                        >
                            Contact us
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="#advantages"
                            className="lnd-btn-ghost inline-flex items-center gap-2 px-6 py-3 text-sm"
                        >
                            Our advantages
                        </Link>
                    </>
                }
                footer={
                    <StatGrid
                        items={[
                            {
                                value: "18",
                                label: "Languages supported",
                            },
                            {
                                value: "200+",
                                label: "Countries and regions",
                            },
                            {
                                value: "2,000+",
                                label: "Communities",
                            },
                        ]}
                    />
                }
            />

            {/* About Us */}
            <section className="mx-auto w-full max-w-[1280px] px-4 py-16 lg:px-6 lg:py-24">
                <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
                    <div>
                        <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-lnd-accent">
                            Who we are
                        </p>
                        <h2 className="mt-2 font-Manrope text-3xl font-bold tracking-tight text-lnd-fg lg:text-4xl">
                            About us
                        </h2>
                        <div className="mt-6 h-1 w-10 rounded-full bg-lnd-accent" />
                    </div>
                    <div>
                        <p className="text-lg font-semibold leading-relaxed text-lnd-fg lg:text-xl">
                            Verdstamp was founded in 2017, and at the heart of
                            our mission lies a steadfast commitment to
                            leveraging the transformative power of blockchain
                            technology, guided by our &ldquo;user first&rdquo;
                            brand ethos.
                        </p>
                        <p className="mt-5 text-sm leading-relaxed text-lnd-fg-muted lg:text-base">
                            Our core team of Verdstamp Ecosystem consists of
                            members from global leading Internet and financial
                            enterprises, including many of the earliest
                            practitioners and investors in the cryptocurrency
                            industry, demonstrating our technological
                            expertise. The Verdstamp Ecosystem is at the
                            forefront of shaping the Web3 landscape,
                            establishing key infrastructures that facilitate
                            the circulation, application, and advancement of
                            blockchain technology.
                        </p>
                        <Link
                            href="/contact-us"
                            className="lnd-btn-ghost mt-8 inline-flex items-center gap-2 px-6 py-3 text-sm"
                        >
                            Get in touch
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="border-y border-lnd-border bg-lnd-surface/30">
                <div className="mx-auto w-full max-w-[1280px] px-4 py-16 lg:px-6 lg:py-24">
                    <div className="grid gap-4 lg:grid-cols-2">
                        <div className="relative overflow-hidden rounded-3xl bg-lnd-accent-fill p-7 text-lnd-accent-fg lg:p-10">
                            <div
                                aria-hidden
                                className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-lnd-accent-fg/15"
                            />
                            <div
                                aria-hidden
                                className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full border border-lnd-accent-fg/15"
                            />
                            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-lnd-accent-fg/60">
                                User-first
                            </p>
                            <h2 className="mt-2 font-Manrope text-3xl font-extrabold tracking-tight lg:text-4xl">
                                Ethos
                            </h2>
                            <p className="mt-5 max-w-xl text-sm leading-relaxed text-lnd-accent-fg/80 lg:text-base">
                                Verdstamp continues refining its
                                comprehensive suite of products, ranging from
                                spot trading, perpetual contracts, margin
                                trading, AMM (Automated Market Making), crypto
                                loans, strategic trading, and financial
                                management services. We are committed to
                                creating a professional and reliable
                                cryptocurrency trading experience for all
                                users.
                            </p>
                            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-lnd-accent-fg/20 px-4 py-2 text-xs font-semibold">
                                <Sparkles className="h-3.5 w-3.5" />
                                One platform, every product
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <div className="lnd-card p-7 lg:p-9">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-lnd-accent/10 text-lnd-accent">
                                        <Target className="h-4.5 w-4.5" />
                                    </span>
                                    <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-lnd-fg-muted">
                                        Mission
                                    </p>
                                </div>
                                <h3 className="mt-4 font-Manrope text-xl font-bold leading-snug text-lnd-fg lg:text-2xl">
                                    Via blockchain, making the world a better
                                    place
                                </h3>
                            </div>

                            <div className="lnd-card p-7 lg:p-9">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-lnd-accent/10 text-lnd-accent">
                                        <Globe className="h-4.5 w-4.5" />
                                    </span>
                                    <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-lnd-fg-muted">
                                        Vision
                                    </p>
                                </div>
                                <h3 className="mt-4 font-Manrope text-xl font-bold leading-snug text-lnd-fg lg:text-2xl">
                                    To become the infrastructure of the
                                    blockchain world
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Advantages */}
            <section
                id="advantages"
                className="mx-auto w-full max-w-[1280px] scroll-mt-24 px-4 py-16 lg:px-6 lg:py-24"
            >
                <SectionHead
                    eyebrow="Our advantages"
                    title="A secure, professional & trusted cryptocurrency exchange"
                    description="Everything we build is designed around security, performance and the people who use it."
                />
                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                    {ADVANTAGES.map((advantage, i) => (
                        <div
                            key={advantage.title}
                            className="group rounded-2xl border border-lnd-border bg-lnd-surface p-6 transition-colors hover:border-lnd-accent/40"
                        >
                            <div className="flex items-center justify-between">
                                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-lnd-border bg-lnd-surface-2 text-lnd-accent">
                                    <advantage.icon className="h-5 w-5" />
                                </span>
                                <span className="font-Manrope text-sm font-bold tracking-[0.14em] text-lnd-accent/30">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                            </div>
                            <h3 className="mt-5 font-Manrope text-lg font-semibold text-lnd-fg">
                                {advantage.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-lnd-fg-muted">
                                {advantage.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <PageCta
                title="Putting users first, always"
                description="Join Verdstamp and trade on a platform built around your security, your assets and your experience."
            />
        </div>
    );
}
