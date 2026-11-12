"use client";

import { useEffect, useRef } from "react";
import { useMutation, useAction, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

export default function AccountInitializer() {
    const ensureUserAccounts = useMutation(api.accounts.ensure_user_accounts);
    const provisionCryptoVault = useAction(api.actions.wallet.generate.provisionUserCryptoVault);
    const user = useQuery(api.user.user); 
    const hasRun = useRef(false);

    const createReferral = useMutation(api.referrals.create_referral);

    useEffect(() => {
        if (user && !hasRun.current) {
            hasRun.current = true;
            const initialize = async () => {
                try {
                    await ensureUserAccounts({});
                    await provisionCryptoVault({});
                    
                    const pendingReferral = localStorage.getItem("pendingReferralCode");
                    if (pendingReferral) {
                        try {
                            await createReferral({ code: pendingReferral });
                        } catch (e) {
                            console.error("Failed to commit referral code:", e);
                        } finally {
                            localStorage.removeItem("pendingReferralCode");
                        }
                    }
                } catch (e) {
                    console.error("Failed to initialize accounts via AccountInitializer", e);
                }
            };
            initialize();
        }
    }, [user, ensureUserAccounts, provisionCryptoVault, createReferral]);

    return null;
}
