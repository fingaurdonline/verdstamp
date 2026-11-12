"use client"

import { useSession } from "@/lib/auth-client";
import { useRouter } from "nextjs-toploader/app";

export default function GetStartedButton() {
    const router = useRouter()
    const { data: session } = useSession()

    return (
        <button
            onClick={() => {
                if (!session?.user?.id) {
                    router.push("/auth/login")
                } else {
                    router.push("/overview/spot/assets")
                }
            }}
            className="lnd-btn-accent w-fit px-8 py-3 text-sm"
        >
            Get Started
        </button>
    );
}
