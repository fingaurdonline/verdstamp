import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

import Link from "next/link";
import {
    ArrowUpRight,
    Briefcase,
    Gem,
    Globe,
    HeartHandshake,
    Layers,
    LifeBuoy,
    Megaphone,
    Scale,
    ShieldAlert,
    Sparkles,
} from "lucide-react";
import { IoIosMail } from "react-icons/io";
import { BiLogoTelegram } from "react-icons/bi";
import { BsTwitterX } from "react-icons/bs";
import { FaDiscord, FaFacebookF, FaYoutube } from "react-icons/fa";
import {
    PiInstagramLogoLight,
    PiMediumLogoFill,
    PiRedditLogoFill,
} from "react-icons/pi";
import PageHero from "../components/PageHero";
import SectionHead from "../components/SectionHead";
import ContactEmail from "./ContactEmail";

const CONTACTS = [
    {
        icon: Briefcase,
        title: "Business Cooperation",
        description:
            "Fiat currency deposit & withdrawal, platform business cooperation.",
        email: "bd@verdstampdigital.app",
    },
    {
        icon: Gem,
        title: "Key Account Services",
        description:
            "Services for institutional clients, market makers, brokers and VIPs.",
        email: "vip@verdstampdigital.app",
    },
    {
        icon: HeartHandshake,
        title: "Charity & Public Welfare",
        description:
            "Charity program collaboration, donations and funding support, public welfare campaigns.",
        email: "charity@verdstampdigital.app",
    },
    {
        icon: LifeBuoy,
        title: "Product Help",
        description:
            "Feedback on accounts, products, services, and other issues.",
        email: "support@verdstampdigital.app",
    },
    {
        icon: Megaphone,
        title: "External Cooperation",
        description:
            "Brand cooperation and sponsorship, media and content creation, social promotion, influencer and advertising cooperation, P2P trading.",
        email: "pr@verdstampdigital.app",
    },
    {
        icon: Layers,
        title: "Listing Cooperation",
        description: "Project cooperation.",
        email: "listing@verdstampdigital.app",
    },
    {
        icon: ShieldAlert,
        title: "Vulnerability Report",
        description: "Know more about the Verdstamp Security Bounty Program.",
        email: "support@verdstampdigital.app",
    },
    {
        icon: Scale,
        title: "Legal Advice",
        description:
            "Advice on legal, regulatory or enforcement issues.",
        email: "compliance@verdstampdigital.app",
    },
];

const SOCIALS = [
    { label: "Email", icon: IoIosMail },
    { label: "Telegram", icon: BiLogoTelegram },
    { label: "Twitter", icon: BsTwitterX },
    { label: "Facebook", icon: FaFacebookF },
    { label: "Medium", icon: PiMediumLogoFill },
    { label: "Reddit", icon: PiRedditLogoFill },
    { label: "Instagram", icon: PiInstagramLogoLight },
    { label: "YouTube", icon: FaYoutube },
    { label: "Discord", icon: FaDiscord },
];

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Contact the Verdstamp team for customer support, partnerships, listings, compliance and media enquiries.",
  path: "/contact-us",
  keywords: ["contact Verdstamp", "crypto support", "Verdstamp partnerships"],
});

export default function ContactUs() {
    return (
        <div className="w-full">
            <PageHero
                align="center"
                eyebrow="Contact us"
                title={
                    <>
                        Let&apos;s build something{" "}
                        <span className="text-lnd-fg-muted">together</span>
                    </>
                }
                subtitle="Join Verdstamp for more cooperation opportunities. Reach the right team directly — we'll take it from there."
                footer={
                    <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-lnd-fg-muted">
                        <span className="flex items-center gap-2">
                            <Sparkles className="h-3.5 w-3.5 text-lnd-accent" />
                            Dedicated teams for every partnership
                        </span>
                        <span className="flex items-center gap-2">
                            <Globe className="h-3.5 w-3.5 text-lnd-accent" />
                            Support in 18 languages
                        </span>
                    </div>
                }
            />

            <section className="mx-auto w-full max-w-[1280px] px-4 py-16 lg:px-6 lg:py-20">
                <SectionHead
                    eyebrow="Get in touch"
                    title="Choose the right team"
                    description="Email is the fastest way to reach us. Copy an address or open it directly from the card."
                />
                <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {CONTACTS.map((contact) => (
                        <div
                            key={contact.title}
                            className="group flex flex-col rounded-2xl border border-lnd-border bg-lnd-surface p-5 transition-colors hover:border-lnd-accent/40"
                        >
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-lnd-border bg-lnd-surface-2 text-lnd-accent">
                                <contact.icon className="h-4.5 w-4.5" />
                            </span>
                            <h3 className="mt-4 font-Manrope text-base font-semibold text-lnd-fg">
                                {contact.title}
                            </h3>
                            <p className="mt-1.5 pb-5 text-xs leading-relaxed text-lnd-fg-muted">
                                {contact.description}
                            </p>
                            <ContactEmail email={contact.email} />
                        </div>
                    ))}
                </div>
            </section>

            <section className="border-y border-lnd-border bg-lnd-surface/30">
                <div className="mx-auto w-full max-w-[1280px] px-4 py-16 lg:px-6 lg:py-20">
                    <SectionHead
                        eyebrow="Stay connected"
                        title="Follow us"
                        description="Official channels for product updates, market insights and community news."
                    />
                    <div className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
                        {SOCIALS.map((social) => (
                            <div
                                key={social.label}
                                title={`${social.label} — link coming soon`}
                                className="group flex flex-col items-center gap-2.5 rounded-2xl border border-lnd-border bg-lnd-surface px-3 py-5 transition-colors hover:border-lnd-accent/40"
                            >
                                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-lnd-surface-2 text-lnd-fg-muted transition-colors group-hover:bg-lnd-accent/10 group-hover:text-lnd-accent">
                                    <social.icon className="h-5 w-5" />
                                </span>
                                <span className="text-[0.68rem] font-medium text-lnd-fg-muted">
                                    {social.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto w-full max-w-[1280px] px-4 py-12 lg:px-6 lg:py-16">
                <div className="flex flex-col items-start justify-between gap-5 rounded-3xl border border-lnd-border bg-lnd-surface p-7 sm:flex-row sm:items-center lg:p-10">
                    <div>
                        <h2 className="font-Manrope text-xl font-bold text-lnd-fg lg:text-2xl">
                            Looking for product help?
                        </h2>
                        <p className="mt-2 max-w-xl text-sm leading-relaxed text-lnd-fg-muted">
                            Browse answers to common questions or reach our
                            support team any time of day.
                        </p>
                    </div>
                    <Link
                        href="/support"
                        className="lnd-btn-accent inline-flex shrink-0 items-center gap-2 px-6 py-3 text-sm"
                    >
                        Visit support
                        <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
