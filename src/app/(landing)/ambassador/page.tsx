import Image from "next/image";
import Link from "next/link";
import {
    ArrowUpRight,
    Crown,
    FileText,
    Medal,
    Shield,
    Star,
    Wallet,
} from "lucide-react";
import { TbHexagonFilled } from "react-icons/tb";
import { TiStar } from "react-icons/ti";
import PageHero from "../components/PageHero";
import PageCta from "../components/PageCta";
import SectionHead from "../components/SectionHead";
import StatGrid from "../components/StatGrid";
import Steps from "../components/Steps";

const TIERS = [
    { name: "Silver", image: "/assets/silver.png", rate: "40%" },
    { name: "Gold", image: "/assets/golden.png", rate: "45%" },
    { name: "Diamond", image: "/assets/diamond.png", rate: "50%" },
];

const BENEFITS = [
    {
        icon: Wallet,
        title: "Permanent referral",
        description:
            "The rebate ratio will resume as normal after the ambassador status becomes invalid.",
    },
    {
        icon: Shield,
        title: "Protection period",
        description:
            "First-time ambassadors will have a 3-month protection period, where they can remain Silver despite the assessment result.",
    },
    {
        icon: Crown,
        title: "Ambassador referral",
        description:
            "By inviting friends to become ambassadors, you can enjoy an extra 5% fee reward generated from the referred users of your referred ambassadors.",
    },
    {
        icon: Star,
        title: "Exclusive benefits",
        description: "Official exposure exclusively for ace ambassadors.",
    },
    {
        icon: FileText,
        title: "Official resources",
        description:
            "Quality content created by Verdstamp ambassadors will be supported by Verdstamp's official and external channels.",
    },
    {
        icon: Medal,
        title: "Priority participation",
        description:
            "Community activities, newbie bonus and regular business training.",
    },
];

const REQUIREMENTS = [
    "With independently built and operated blockchain social groups, which can provide promotional support for Verdstamp.",
    "Owned personally operated blockchain SNS accounts, including but not limited to YouTube, Twitter, etc.",
    "With experience and resources related to various blockchain events, such as AMA, meet-ups and fan clubs.",
    "With experience and resources related to blockchain content writing or creation, such as media advertorial, SNS advertorial, creative writing, etc.",
];

const APPLY_STEPS = [
    {
        title: "Apply for Verdstamp Ambassador",
        description: "Reach out to our team through the contact page.",
    },
    {
        title: "Fill in the information required",
        description:
            "Tell us about your community, channels and experience.",
    },
    {
        title: "Wait for Verdstamp's approval",
        description:
            "We review every application and get back to you with next steps.",
    },
];

export default function Ambassador() {
    return (
        <div className="w-full">
            <PageHero
                eyebrow="Ambassador program"
                title={
                    <>
                        Become a Verdstamp{" "}
                        <span className="text-lnd-accent">Ambassador</span>
                    </>
                }
                subtitle="Get an average of 1,200 USD monthly referral rewards."
                actions={
                    <>
                        <Link
                            href="/contact-us"
                            className="lnd-btn-accent inline-flex items-center gap-2 px-6 py-3 text-sm"
                        >
                            Apply now
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="#privileges"
                            className="lnd-btn-ghost inline-flex items-center gap-2 px-6 py-3 text-sm"
                        >
                            Referral privileges
                        </Link>
                    </>
                }
                footer={
                    <StatGrid
                        items={[
                            {
                                value: "50%",
                                label: "Max trading fee rebate",
                            },
                            { value: "3", label: "Ambassador tiers" },
                            { value: "3 mo", label: "Protection period" },
                        ]}
                    />
                }
                aside={
                    <div className="relative mx-auto flex aspect-square w-full max-w-[320px] items-center justify-center">
                        <TbHexagonFilled
                            aria-hidden
                            className="absolute h-full w-full text-lnd-accent/10"
                        />
                        <TbHexagonFilled
                            aria-hidden
                            className="absolute h-3/4 w-3/4 text-lnd-accent/15"
                        />
                        <div className="relative text-center">
                            <TiStar className="mx-auto h-12 w-12 text-lnd-accent" />
                            <p className="mt-4 font-Manrope text-5xl font-extrabold tracking-tight text-lnd-fg">
                                50%
                            </p>
                            <p className="mt-1 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-lnd-fg-muted">
                                Max fee rebate
                            </p>
                        </div>
                    </div>
                }
            />

            {/* Referral privileges */}
            <section
                id="privileges"
                className="mx-auto w-full max-w-[1280px] scroll-mt-24 px-4 py-16 lg:px-6 lg:py-20"
            >
                <SectionHead
                    eyebrow="Referral privileges"
                    title="Earn more at every tier"
                    description="Verdstamp Ambassadors can enjoy up to 50% of trading fees as referral rewards, settled in USDT."
                />
                <div className="mt-8 grid gap-4 md:grid-cols-3">
                    {TIERS.map((tier) => (
                        <div
                            key={tier.name}
                            className="group rounded-2xl border border-lnd-border bg-lnd-surface p-5 transition-colors hover:border-lnd-accent/40"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={tier.image}
                                        alt={`${tier.name} tier`}
                                        width={1000}
                                        height={1000}
                                        className="h-14 w-14 object-contain"
                                    />
                                    <div>
                                        <p className="font-Manrope text-base font-semibold text-lnd-fg">
                                            {tier.name}
                                        </p>
                                        <p className="text-xs text-lnd-fg-muted">
                                            Ambassador tier
                                        </p>
                                    </div>
                                </div>
                                <p className="font-Manrope text-3xl font-extrabold text-lnd-accent">
                                    {tier.rate}
                                </p>
                            </div>
                            <p className="mt-4 border-t border-lnd-border pt-4 text-xs leading-relaxed text-lnd-fg-muted">
                                Of trading fees as referral rewards, settled in
                                USDT.
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Benefits */}
            <section className="border-y border-lnd-border bg-lnd-surface/30">
                <div className="mx-auto w-full max-w-[1280px] px-4 py-16 lg:px-6 lg:py-20">
                    <SectionHead
                        eyebrow="Ambassador benefits"
                        title="More than a referral rate"
                        description="Resources, recognition and protection built for long-term partners."
                    />
                    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {BENEFITS.map((benefit) => (
                            <div
                                key={benefit.title}
                                className="rounded-2xl border border-lnd-border bg-lnd-surface p-6"
                            >
                                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-lnd-border bg-lnd-surface-2 text-lnd-accent">
                                    <benefit.icon className="h-5 w-5" />
                                </span>
                                <h3 className="mt-5 font-Manrope text-base font-semibold text-lnd-fg">
                                    {benefit.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-lnd-fg-muted">
                                    {benefit.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Requirements */}
            <section className="mx-auto w-full max-w-[1280px] px-4 py-16 lg:px-6 lg:py-20">
                <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
                    <div className="lg:sticky lg:top-24 lg:self-start">
                        <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-lnd-accent">
                            Eligibility
                        </p>
                        <h2 className="mt-2 font-Manrope text-3xl font-bold tracking-tight text-lnd-fg lg:text-4xl">
                            Requirements
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-lnd-fg-muted">
                            You can apply for the Verdstamp Ambassador program
                            with any one of the conditions below met.
                        </p>

                        <div className="mt-8 rounded-2xl border border-lnd-border bg-lnd-surface p-5">
                            <h3 className="font-Manrope text-sm font-bold text-lnd-fg">
                                Remark
                            </h3>
                            <p className="mt-2 text-xs leading-relaxed text-lnd-fg-muted">
                                Verdstamp Ambassadors are partners within the
                                Verdstamp ecosystem, who independently engage
                                in promo events under their own names in the
                                regions specified in the agreement. Neither are
                                they authorized to undertake or assume any
                                express or implied obligation on behalf of
                                Verdstamp in written or any other form.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {REQUIREMENTS.map((requirement, i) => (
                            <div
                                key={i}
                                className="rounded-2xl border border-lnd-border bg-lnd-surface p-5 lg:p-6"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="font-Manrope text-xs font-bold tracking-[0.14em] text-lnd-accent">
                                        Requirement {i + 1}
                                    </span>
                                    <span
                                        aria-hidden
                                        className="h-px flex-1 bg-lnd-border"
                                    />
                                </div>
                                <p className="mt-3 text-sm leading-relaxed text-lnd-fg-muted">
                                    {requirement}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How to apply */}
            <section className="border-t border-lnd-border bg-lnd-surface/30">
                <div className="mx-auto w-full max-w-[1280px] px-4 py-16 lg:px-6 lg:py-20">
                    <SectionHead
                        eyebrow="How to join"
                        title="Become an ambassador in three steps"
                        description="Applications are reviewed by our partnership team."
                    />
                    <div className="mt-8">
                        <Steps steps={APPLY_STEPS} />
                    </div>
                </div>
            </section>

            <PageCta
                eyebrow="Apply"
                title="Welcome to join the Verdstamp Ambassador program"
                description="Tell us about your community and we'll get back to you with the next steps."
                label="Apply now"
                href="/contact-us"
            />
        </div>
    );
}
