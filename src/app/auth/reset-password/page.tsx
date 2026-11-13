import type { Metadata } from "next";
import { Suspense } from "react";
import AuthShell from "../components/AuthShell";
import ResetPasswordForm from "../components/ResetPasswordForm";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
    title: "Reset password",
    description: "Reset your Verdstamp account password securely and regain access to your account.",
    path: "/auth/reset-password",
    noIndex: true,
});

function ResetPasswordContent() {
    return (
        <AuthShell
            highlight="100%"
            highlightLabel="Security"
            title="Verdstamp commits 100% to security"
            description="Reset your password securely to regain access to your account."
        >
            <ResetPasswordForm />
        </AuthShell>
    )
}

export default function ResetPassword() {
    return (
        <Suspense fallback={<div className="min-h-[calc(100dvh-4rem)] w-full bg-lnd-bg" />}>
            <ResetPasswordContent />
        </Suspense>
    )
}
