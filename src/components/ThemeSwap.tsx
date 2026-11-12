"use client"
import { api } from "@convex/_generated/api"
import { useMutation, useQuery } from "convex/react"
import { useTheme } from "next-themes"
import { BiMoon, BiSun } from "react-icons/bi"
import { useEffect, useMemo, useState } from "react"

export default function SwapTheme() {
    const data = useQuery(api.user.user)
    const swapTheme = useMutation(api.user.swap_theme)
    const { theme, resolvedTheme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const currentTheme = useMemo(() => {
        return resolvedTheme ?? theme ?? data?.theme ?? "light"
    }, [data?.theme, resolvedTheme, theme])

    const handleClick = () => {
        const next = currentTheme === "light" ? "dark" : "light"
        swapTheme({ theme: next })
            .then(() => setTheme(next))
            .catch(() => {
                setTheme(next)
            })
    }
    return (
        <span className="w-fit h-fit cursor-pointer" onClick={() => handleClick()}>
            {
                mounted ? (
                    currentTheme === "light" ? (
                        <BiMoon className="w-4 h-4" />
                    ) : (
                        <BiSun className="w-4 h-4" />
                    )
                ) : null
            }
        </span>
    )
}
