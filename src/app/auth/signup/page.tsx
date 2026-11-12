import type { Metadata } from "next";
import AuthShell from "../components/AuthShell";
import SignUpForm from "../components/SignUpForm";

export const metadata: Metadata = {
    title: "Create account | Verdstamp",
    description: "Create your Verdstamp account.",
};

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
