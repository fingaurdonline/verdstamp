import type { Metadata } from "next";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import LandingHeader from "./components/LandingHeader";
import LandingFooter from "./components/LandingFooter";
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
    title: {
        default: "Verdstamp — Trusted Markets",
        template: "%s | Verdstamp",
    },
    description:
        "Buy, swap and transfer digital assets with transparent fees, deep liquidity and 24/7 support.",
    applicationName: "Verdstamp",
    openGraph: {
        title: "Verdstamp — Trusted Markets",
        description:
            "Buy, swap and transfer digital assets with transparent fees, deep liquidity and 24/7 support.",
        siteName: "Verdstamp",
        type: "website",
    },
};

export default function LandingLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ScrollArea className="w-full h-full">
            <div className="w-full h-full bg-lnd-bg text-lnd-fg font-Inter selection:bg-lnd-accent/30">
                <LandingHeader />
                <Toaster className="relative top-3.5" position="top-center"/>
                <main className="w-full h-full grid grid-cols-1 lg:grid-cols-none [&>*]:min-w-0">
                    {children}
                </main>
                <LandingFooter />
                <ScrollBar className="z-99" />
            </div>
        </ScrollArea>
    );
}
