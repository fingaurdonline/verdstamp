import type { Metadata } from "next";
import AuthShell from "../components/AuthShell";
import LoginForm from "../components/LoginForm";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
    title: "Log in",
    description: "Log in to your Verdstamp account to trade, swap and transfer digital assets.",
    path: "/auth/login",
    noIndex: true,
});

export default function Login() {
    return (
        <AuthShell
            highlight="100%"
            highlightLabel="Reserve"
            title="Verdstamp commits 100% to reserve"
            description="Full-dimensional strategies to keep your assets secure."
        >
            <LoginForm />
        </AuthShell>
    )
}
