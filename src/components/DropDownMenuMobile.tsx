"use client"

import { useRouter } from "nextjs-toploader/app"
import { useQuery } from "convex/react"
import { api } from "@convex/_generated/api"
import { authClient } from "@/lib/auth-client"
import useCurrencies from "@/hooks/useCurrency"
import LandingMobileMenu from "@/app/(landing)/components/LandingMobileMenu"
import { useState } from "react"

/**
 * Dashboard mobile navigation now shares the Verdstamp mobile drawer with the
 * landing header. The wrapper only supplies the authenticated user and the
 * currency picker rates.
 */
export default function DropDownMobileMenu() {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const user = useQuery(api.user.user)
    const { data: currencies } = useCurrencies()

    const rates = (currencies?.data?.conversion_rates ?? {}) as Record<string, number>

    const logout = async () => {
        await authClient.signOut()
        router.push("/")
        router.refresh()
    }

    return (
        <LandingMobileMenu
            open={open}
            onOpenChange={setOpen}
            loggedIn={!!user}
            user={user}
            currenciesRates={rates}
            onLogout={logout}
        />
    )
}
