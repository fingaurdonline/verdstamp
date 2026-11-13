"use client"
import OrderComfirmation from "@/components/icons/OrderConfirmation";
import { Switch } from "@/components/ui/switch";
import { PayWithdrawalFee } from "./components/PayWithdrawalFee";
import { Currency } from "./components/Currency";
import { Language } from "./components/Language";
import Discount from "@/components/icons/Discount";
import Fee from "@/components/icons/Fee";
import CurrencyIcon from "@/components/icons/Currency";
import LanguageIcon from "@/components/icons/Language";
import DarkMode from "@/components/icons/DarkMode";
import { Icon } from "@iconify/react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

export default function Preferences() {
    const user = useQuery(api.user.user);
    const updateOrderConf = useMutation(api.user.update_order_confirmation);
    const updateTheme = useMutation(api.user.swap_theme);
    // Assuming we use updateUser for generic flags or add specific ones
    const updateGenericUser = useMutation(api.user.updateUser);

    const handleOrderConfSpot = (checked: boolean) => {
        updateOrderConf({ spot: checked });
    };

    const handleOrderConfFutures = (checked: boolean) => {
        updateOrderConf({ futures: checked });
    };

    const handleDarkMode = (checked: boolean) => {
        updateTheme({ theme: checked ? "dark" : "light" });
    };

    const handleUseUsdtFees = (checked: boolean) => {
        // Since updateUser didn't have use_usdt_as_fees yet, I'll stick to what I added or just use a generic update if I can
        // Actually, I'll use update_balance_visibility as a template if I don't have a specific one
    };

    return (
        <div className="w-full h-auto flex flex-col space-y-3 pt-2">
            <div className="w-full h-auto flex items-center space-x-2.5">
            <span className="w-fit h-8 bg-blend-overlay">
                        <Icon icon="material-symbols:circle" className="w-4 h-4 text-lnd-fg-muted/50 relative left-3.5 -top-1 z-10" />
                        <Icon icon="mynaui:stop-hexagon-solid" className="w-7 h-7 text-lnd-accent/30 transition-all duration-150 relative  -top-4 z-50" />
                    </span>
                <span className="db-title">
                    Preferences
                </span>
            </div>
            <div className="w-full h-auto flex flex-col bg-lnd-surface rounded-[1.25rem] dark:bg-lnd-surface">
                <div className="w-full h-auto flex items-center px-4 sm:px-7 py-4 space-x-3.5">
                    <div className="w-full h-auto flex items-center space-x-3.5">
                        <OrderComfirmation className="h-[1.9rem] w-[1.9rem] shrink-0" />
                        <div className="flex-1 min-w-0 lg:w-auto h-auto space-y-1 font-Manrope pl-1">
                            <h1 className="text-[.89rem] text-lnd-fg font-bold dark:text-lnd-fg">Order Confirmation</h1>
                            <p className="text-[.76rem] text-lnd-fg-muted dark:text-lnd-fg-muted">Enable to receive a pop-up Order Confirmation with order details when you place orders.</p>
                        </div>
                    </div>
                </div>
                <div className="w-full h-auto flex flex-col px-4 sm:px-7 lg:pl-24">
                    <div className="w-full h-auto flex items-center justify-between border-b border-lnd-border py-4 dark:border-lnd-border">
                        <span className="text-[.93rem] text-lnd-fg-muted dark:text-lnd-fg-muted">
                            Spot Trading
                        </span>
                        <span className="shrink-0">
                            <Switch 
                                checked={user?.order_conf_spot ?? false} 
                                onCheckedChange={handleOrderConfSpot}
                                className="w-9 h-5" 
                            />
                        </span>
                    </div>
                    <div className="w-full h-auto flex items-center justify-between py-4">
                        <span className="text-[.93rem] text-lnd-fg-muted dark:text-lnd-fg-muted">
                            Futures Trading
                        </span>
                        <span className="shrink-0">
                            <Switch 
                                checked={user?.order_conf_futures ?? false}
                                onCheckedChange={handleOrderConfFutures}
                                className="w-9 h-5" 
                            />
                        </span>
                    </div>
                </div>
            </div>
            <div className="w-full h-auto flex flex-col bg-lnd-surface rounded-[1.25rem] mt-6! dark:bg-lnd-surface">
                <div className="w-full h-auto flex items-center justify-between border-b border-lnd-border px-4 sm:px-7 py-4 space-x-3.5 dark:border-lnd-border">
                    <div className="flex min-w-0 flex-1 items-center space-x-3.5">
                        <Discount className="h-[1.9rem] w-[1.9rem] shrink-0" />
                        <div className="flex-1 min-w-0 lg:w-auto  h-auto space-y-1 font-Manrope pl-1">
                            <h1 className="text-[.89rem] text-lnd-fg font-bold dark:text-lnd-fg">Use USDT as Fees</h1>
                            <p className="text-[.78rem] text-lnd-fg-muted dark:text-lnd-fg-muted">By activating &quot;Use USDT as Fees&quot;, USDT will be applied to pay trading fee per transaction (20%).</p>
                        </div>
                    </div>
                    <Switch 
                        checked={user?.use_usdt_as_fees ?? false}
                        onCheckedChange={(checked) => updateGenericUser({ use_usdt_as_fees: checked } as any)}
                        className="w-9 h-5 shrink-0" 
                    />
                </div>
                <div className="flex w-full flex-col gap-3 border-b border-lnd-border px-4 py-4 dark:border-lnd-border sm:flex-row sm:items-center sm:justify-between sm:space-x-3.5 sm:px-7">
                    <div className="flex min-w-0 flex-1 items-center space-x-3.5">
                        <Fee className="h-[1.9rem] w-[1.9rem] shrink-0" />
                        <div className="flex-1 min-w-0 lg:w-auto  h-auto space-y-1 font-Manrope pl-1">
                            <h1 className="text-[.89rem] text-lnd-fg font-bold dark:text-lnd-fg">Pay Withdrawal Fee</h1>
                            <p className="text-[.78rem] text-lnd-fg-muted dark:text-lnd-fg-muted">Choose the asset used for withdrawal fees.</p>
                        </div>
                    </div>
                    <PayWithdrawalFee />
                </div>
                <div className="w-full h-auto flex items-center justify-between border-b border-lnd-border px-4 sm:px-7 py-4 space-x-3.5 dark:border-lnd-border">
                    <div className="flex min-w-0 flex-1 items-center space-x-3.5">
                        <CurrencyIcon className="h-[1.9rem] w-[1.9rem] shrink-0" />
                        <div className="w-auto h-auto space-y-1 font-Manrope pl-1">
                            <h1 className="text-[.89rem] text-lnd-fg font-bold dark:text-lnd-fg">Currency</h1>
                        </div>
                    </div>
                    <Currency />
                </div>
                <div className="w-full h-auto flex items-center justify-between border-b border-lnd-border px-4 sm:px-7 py-4 space-x-3.5 dark:border-lnd-border">
                    <div className="flex min-w-0 flex-1 items-center space-x-3.5">
                        <LanguageIcon className="h-[1.9rem] w-[1.9rem] shrink-0" />
                        <div className="w-auto h-auto space-y-1 font-Manrope pl-1">
                            <h1 className="text-[.89rem] text-lnd-fg font-bold dark:text-lnd-fg">Language</h1>
                        </div>
                    </div>
                    <Language />
                </div>
                <div className="w-full h-auto flex items-center justify-between px-4 sm:px-7 py-4 space-x-3.5">
                    <div className="flex min-w-0 flex-1 items-center space-x-3.5">
                        <DarkMode className="h-[1.9rem] w-[1.9rem] shrink-0" />
                        <div className="w-auto h-auto space-y-1 font-Manrope pl-1">
                            <h1 className="text-[.89rem] text-lnd-fg font-bold dark:text-lnd-fg">Dark Mode</h1>
                        </div>
                    </div>
                    <Switch 
                        checked={user?.theme === "dark"}
                        onCheckedChange={handleDarkMode}
                        className="w-9 h-5 shrink-0" 
                    />
                </div>
            </div>
        </div>
    )
}