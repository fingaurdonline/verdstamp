import type { Metadata } from "next";
import AuthShell from "../components/AuthShell";
import SignUpForm from "../components/SignUpForm";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
    title: "Create account",
    description: "Create a Verdstamp account to buy, swap, transfer and trade digital assets.",
    path: "/auth/signup",
    noIndex: true,
});

export default function SignUp() {
    return (
        <AuthShell
            highlight="100%"
            highlightLabel="Reserve"
            title="Verdstamp commits 100% to reserve"
            description="Full-dimensional strategies to keep your assets secure."
        >
            <SignUpForm />
        </AuthShell>
    )
}
