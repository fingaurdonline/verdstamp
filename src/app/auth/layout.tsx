'use client';

import { Toaster } from "@/components/ui/sonner"
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AuthHeader from "./components/AuthHeader";
import AuthLoadingSkeleton from "@/components/AuthLoadingSkeleton";

export default function AuthLayout(
    {
        children,
    }: Readonly<{
        children: React.ReactNode;
    }>
) {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !isPending && session) {
            router.push("/overview");
        }
    }, [isPending, mounted, session, router]);

    const canRenderAuth = mounted && !isPending && !session;

    return (
        <div className="min-h-dvh w-full bg-lnd-bg font-Inter text-lnd-fg selection:bg-lnd-accent/30">
            <AuthHeader />
            <Toaster className="relative top-3.5" position="top-center" />
            <main className="w-full">
                {canRenderAuth ? (
                    children
                ) : (
                    <AuthLoadingSkeleton />
                )}
            </main>
        </div>
    )
}
