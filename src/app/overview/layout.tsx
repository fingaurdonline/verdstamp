'use client';

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Header from "../../components/Header";
import OverViewSidebar from "./components/OverviewSideBar";
import AccountInitializer from "./components/AccountInitializer";
import DashboardThemeScope from "@/components/dashboard/DashboardThemeScope";
import { Toaster } from "@/components/ui/sonner"
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OverviewLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { data: session, isPending } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/auth/login");
        }
    }, [isPending, session, router]);

    // Prevent rendering protected UI if evaluation is ongoing or session is strictly invalid
    if (isPending || !session) {
        return <div className="w-full h-screen bg-lnd-bg" />;
    }

    return (
        <>
            <DashboardThemeScope />
            <ScrollArea className="w-full h-full bg-lnd-bg">
                <div className="min-h-full w-full bg-lnd-bg text-lnd-fg">
                    <Header />
                    <AccountInitializer />
                    <Toaster className="relative top-3.5" position="top-center" />
                    <div className="mx-auto flex w-full max-w-[1560px] gap-5 px-3 pb-16 pt-5 sm:px-5 lg:px-7 lg:pt-7">
                        <OverViewSidebar />
                        <main className="min-w-0 flex-1 pb-10">
                            {children}
                        </main>
                    </div>
                    <ScrollBar className="z-99" />
                </div>
            </ScrollArea>
        </>
    );
}
