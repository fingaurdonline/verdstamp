import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import LandingHeader from "./components/LandingHeader";
import LandingFooter from "./components/LandingFooter";
import { Toaster } from "@/components/ui/sonner"
import {
    SITE_DESCRIPTION,
    SITE_NAME,
    SITE_URL,
    SUPPORT_EMAIL,
} from "@/lib/site";

const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Organization",
            "@id": `${SITE_URL}/#organization`,
            name: SITE_NAME,
            url: SITE_URL,
            logo: `${SITE_URL}/icons/icon-512.png`,
            description: SITE_DESCRIPTION,
            contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                email: SUPPORT_EMAIL,
                url: `${SITE_URL}/support`,
                availableLanguage: ["English"],
            },
        },
        {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            url: SITE_URL,
            name: SITE_NAME,
            description: SITE_DESCRIPTION,
            publisher: { "@id": `${SITE_URL}/#organization` },
            inLanguage: "en",
        },
    ],
};

export default function LandingLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ScrollArea className="h-dvh w-full">
            <div className="min-h-full w-full bg-lnd-bg font-Inter text-lnd-fg selection:bg-lnd-accent/30">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
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
