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
 * landing header. The wrapper only supplies authenticated account data.
 */
export default function DropDownMobileMenu() {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const user = useQuery(api.user.user)
    const auth = useQuery(api.auth.getCurrentUser)
    const spotAccounts = useQuery(api.accounts.view_all_spot_accounts)
    const futuresAccount = useQuery(api.accounts.view_all_futures_accounts)
    const marginAccount = useQuery(api.accounts.view_all_margin_accounts)
    const { data: currencies } = useCurrencies()

    const userId = user?.userId
    const spot = (spotAccounts?.find((acc: any) => acc?.user === userId)?.total_asset ?? 0) as number
    const futures = (futuresAccount?.find((acc: any) => acc?.user === userId)?.total_asset ?? 0) as number
    const margin = (marginAccount?.find((acc: any) => acc?.user === userId)?.total_asset ?? 0) as number
    const total = spot + futures + margin

    const rates = (currencies?.data?.conversion_rates ?? {}) as Record<string, number>
    const convertedTotal = user?.currency && user.currency !== "USD"
        ? total * (rates[user.currency] ?? 1)
        : total

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
            emailVerified={!!auth?.emailVerified}
            convertedTotal={convertedTotal}
            currenciesRates={rates}
            onLogout={logout}
        />
    )
}
