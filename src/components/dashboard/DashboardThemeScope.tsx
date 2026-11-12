"use client"

import { useEffect } from "react"

/**
 * Adds the Verdstamp dashboard theme scope to <body> while an account/overview
 * route is mounted. Keeping the scope on <body> also themes portalled menus,
 * dialogs and dropdowns without affecting the landing or auth route groups.
 */
export default function DashboardThemeScope() {
    useEffect(() => {
        document.body.classList.add("dashboard-root")
        return () => document.body.classList.remove("dashboard-root")
    }, [])

    return null
}
