"use client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { ChevronDown } from "lucide-react";

export default function DropDown() {
    const user = useQuery(api.user.user)
    const updateUser = useMutation(api.user.updateUser)
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex h-auto w-auto cursor-pointer items-center justify-center rounded-md bg-lnd-surface-2 px-3 py-[0.2rem] transition-colors hover:bg-lnd-accent/10 focus:outline-none data-[state=open]:bg-lnd-accent/10 dark:bg-lnd-surface dark:data-[state=open]:bg-lnd-accent/15 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg]:text-lnd-accent [&>svg]:hover:text-lnd-accent">
                <ChevronDown className="h-4 w-4 text-lnd-fg-muted transition-all duration-300" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="h-fit w-fit border-lnd-border bg-lnd-surface p-1 shadow-lg shadow-black/10 dark:shadow-black/40">
                <DropdownMenuItem onClick={() => { updateUser({ crypto: "tether usdt" }) }} className="cursor-pointer rounded-md px-5 font-semibold text-lnd-fg-muted hover:bg-lnd-accent/10 hover:text-lnd-accent">
                    USDT
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { updateUser({ crypto: "bitcoin" }) }} className="cursor-pointer rounded-md px-5 font-semibold text-lnd-fg-muted hover:bg-lnd-accent/10 hover:text-lnd-accent">
                    BTC
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { updateUser({ crypto: "ethereum" }) }} className="cursor-pointer rounded-md px-5 font-semibold text-lnd-fg-muted hover:bg-lnd-accent/10 hover:text-lnd-accent">
                    ETH
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
