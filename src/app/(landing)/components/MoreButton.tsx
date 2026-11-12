"use client"

import { ArrowUpRight } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useSession } from "@/lib/auth-client";

export default function MoreButton() {
    const router = useRouter()
    const { data: session } = useSession()

    return (
        <button
            onClick={() => {
                if (session?.user?.id === undefined) {
                    router.push("/auth/signup")
                } else {
                    router.push("/overview")
                }
            }}
            className="lnd-btn-ghost flex items-center gap-1.5 px-4 py-2 text-sm"
        >
            More
            <ArrowUpRight className="h-4 w-4" />
        </button>
    )
}
