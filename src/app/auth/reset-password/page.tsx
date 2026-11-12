import type { Metadata } from "next";
import { Suspense } from "react";
import AuthShell from "../components/AuthShell";
import ResetPasswordForm from "../components/ResetPasswordForm";

export const metadata: Metadata = {
    title: "Reset password | Verdstamp",
    description: "Reset your Verdstamp account password.",
};

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
