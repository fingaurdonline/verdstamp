"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BarChart3, CandlestickChart, FileClock, History, Landmark, LayoutDashboard, Scale } from "lucide-react";
import { usePathname } from "next/navigation";
import OverViewActivelink from "./OverViewActiveLink";
import OverViewActiveSublink from "./OverViewActiveSubLink";

const SECTIONS = [
    {
        value: "spot",
        label: "Spot",
        icon: CandlestickChart,
        base: "/overview/spot",
        links: [
            { label: "Assets", href: "/overview/spot/assets" },
            { label: "Deposit", href: "/overview/spot/deposit" },
            { label: "Withdraw", href: "/overview/spot/withdraw" },
            { label: "Transfer History", href: "/overview/spot/records" },
        ],
    },
    {
        value: "margin",
        label: "Margin",
        icon: Scale,
        base: "/overview/margin",
        links: [
            { label: "Assets", href: "/overview/margin/assets" },
            { label: "Borrow Records", href: "/overview/margin/records" },
        ],
    },
    {
        value: "loan",
        label: "Loan",
        icon: Landmark,
        base: "/overview/loan",
        links: [
            { label: "Assets", href: "/overview/loan/assets" },
            { label: "Borrowing Records", href: "/overview/loan/loan_records" },
        ],
    },
    {
        value: "history",
        label: "History",
        icon: History,
        base: "/overview/history",
        links: [
            { label: "Spot", href: "/overview/history/spot" },
            { label: "Margin", href: "/overview/history/margin" },
            { label: "Futures", href: "/overview/history/futures" },
            { label: "Loan", href: "/overview/history/loan" },
        ],
    },
];

export default function OverViewSidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden w-60 shrink-0 lg:flex xl:w-64">
            <div className="db-card h-fit w-full p-2.5">
                <nav className="flex flex-col gap-0.5" aria-label="Overview navigation">
                    <OverViewActivelink href="/overview">
                        <LayoutDashboard className="h-[1.05rem] w-[1.05rem] shrink-0" strokeWidth={1.7} />
                        <span>Overview</span>
                    </OverViewActivelink>

                    <Accordion type="multiple" defaultValue={["spot", "margin", "loan", "history"]} className="w-full">
                        {SECTIONS.slice(0, 3).map(section => {
                            const SectionIcon = section.icon;
                            const sectionActive = pathname.startsWith(section.base);

                            return (
                                <AccordionItem key={section.value} value={section.value} className="border-b-0">
                                    <AccordionTrigger
                                        className={`group rounded-xl px-3.5 py-2.5 font-Manrope text-[0.85rem] font-medium hover:no-underline ${
                                            sectionActive
                                                ? "text-lnd-accent"
                                                : "text-lnd-fg-muted hover:bg-lnd-surface-2 hover:text-lnd-fg"
                                        } [&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:text-lnd-fg-muted`}
                                    >
                                        <span className="flex items-center gap-3">
                                            <SectionIcon
                                                className="h-[1.05rem] w-[1.05rem] shrink-0"
                                                strokeWidth={1.7}
                                            />
                                            {section.label}
                                        </span>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-1">
                                        {section.links.map(link => (
                                            <OverViewActiveSublink key={link.href} href={link.href}>
                                                {link.label}
                                            </OverViewActiveSublink>
                                        ))}
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}

                        <OverViewActivelink href="/overview/futures">
                            <BarChart3 className="h-[1.05rem] w-[1.05rem] shrink-0" strokeWidth={1.7} />
                            <span>Futures</span>
                        </OverViewActivelink>

                        {SECTIONS.slice(3).map(section => {
                            const SectionIcon = section.icon;
                            const sectionActive = pathname.startsWith(section.base);

                            return (
                                <AccordionItem key={section.value} value={section.value} className="border-b-0">
                                    <AccordionTrigger
                                        className={`group rounded-xl px-3.5 py-2.5 font-Manrope text-[0.85rem] font-medium hover:no-underline ${
                                            sectionActive
                                                ? "text-lnd-accent"
                                                : "text-lnd-fg-muted hover:bg-lnd-surface-2 hover:text-lnd-fg"
                                        } [&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:text-lnd-fg-muted`}
                                    >
                                        <span className="flex items-center gap-3">
                                            <SectionIcon
                                                className="h-[1.05rem] w-[1.05rem] shrink-0"
                                                strokeWidth={1.7}
                                            />
                                            {section.label}
                                        </span>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-1">
                                        {section.links.map(link => (
                                            <OverViewActiveSublink key={link.href} href={link.href}>
                                                {link.label}
                                            </OverViewActiveSublink>
                                        ))}
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>

                    <div className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2">
                        <FileClock className="h-4 w-4 text-lnd-fg-muted" strokeWidth={1.7} />
                        <span className="text-[0.72rem] text-lnd-fg-muted">24H settlement</span>
                    </div>
                </nav>
            </div>
        </aside>
    );
}
