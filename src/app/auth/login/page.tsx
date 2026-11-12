import type { Metadata } from "next";
import AuthShell from "../components/AuthShell";
import LoginForm from "../components/LoginForm";

export const metadata: Metadata = {
    title: "Log in | Verdstamp",
    description: "Log in to your Verdstamp account.",
};

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
