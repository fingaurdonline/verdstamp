"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export type FaqItem = {
    question: string;
    answer: string;
};

export default function Faq({
    items,
    numbered = false,
}: {
    items: FaqItem[];
    numbered?: boolean;
}) {
    return (
        <Accordion type="single" collapsible className="w-full">
            {items.map((item, i) => (
                <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="border-b border-lnd-border"
                >
                    <AccordionTrigger className="gap-4 py-5 text-left hover:no-underline [&>svg]:text-lnd-fg-muted">
                        <span className="flex items-start gap-4">
                            {numbered && (
                                <span className="mt-0.5 text-xs font-medium tracking-[0.12em] text-lnd-fg-muted">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                            )}
                            <span className="font-Manrope text-[0.95rem] font-semibold text-lnd-fg">
                                {item.question}
                            </span>
                        </span>
                    </AccordionTrigger>
                    <AccordionContent className="whitespace-pre-line pb-5 pl-8 pr-8 text-sm leading-relaxed text-lnd-fg-muted">
                        {item.answer}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}
