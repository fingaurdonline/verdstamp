"use client";

import Image from "next/image";
import { useState } from "react";
import PageHero from "../components/PageHero";
import { PaymentPartnerMobile } from "./component/PaymentPartnersMobile";
import {
    paymentPartnersBTC,
    paymentPartnersBTCSELL,
    paymentPartnersETH,
    paymentPartnersETHSELL,
    paymentPartnersUSDC,
    paymentPartnersUSDCSELL,
    paymentPartnersUSDT,
    paymentPartnersUSDTSELL,
    paymentPartnersXRP,
    paymentPartnersXRPSELL,
} from "./payment-partners";

type PaymentMethod = { name: string; icon: string };

type PaymentPartner = {
    id: number;
    name: string;
    logo: string;
    link: string;
    referencePrice: string;
    orderLimit: string;
    orderLimitSubtext: string;
    paymentMethods: PaymentMethod[];
};

const COINS = ["USDT", "USDC", "BTC", "ETH", "XRP"] as const;
type Coin = (typeof COINS)[number];
type Side = "buy" | "sell";

const BUY_PARTNERS: Record<Coin, PaymentPartner[]> = {
    USDT: paymentPartnersUSDT,
    USDC: paymentPartnersUSDC,
    BTC: paymentPartnersBTC,
    ETH: paymentPartnersETH,
    XRP: paymentPartnersXRP,
};

const SELL_PARTNERS: Record<Coin, PaymentPartner[]> = {
    USDT: paymentPartnersUSDTSELL,
    USDC: paymentPartnersUSDCSELL,
    BTC: paymentPartnersBTCSELL,
    ETH: paymentPartnersETHSELL,
    XRP: paymentPartnersXRPSELL,
};

function PaymentTable({
    partners,
    actionLabel,
}: {
    partners: PaymentPartner[];
    actionLabel: string;
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-lnd-border bg-lnd-surface">
            <div className="grid grid-cols-[1.4fr_0.9fr_1.2fr_1.2fr_0.6fr] gap-4 border-b border-lnd-border bg-lnd-surface-2 px-5 py-3 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-lnd-fg-muted">
                <span>Payment partner</span>
                <span>Reference price (USD)</span>
                <span>Single order limit (USDT)</span>
                <span>Payment methods</span>
                <span className="text-right">Operation</span>
            </div>

            {partners.map((partner) => (
                <div
                    key={partner.id}
                    className="grid grid-cols-[1.4fr_0.9fr_1.2fr_1.2fr_0.6fr] items-center gap-4 border-b border-lnd-border px-5 py-4 last:border-b-0"
                >
                    <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-lnd-border bg-lnd-surface-2">
                            <Image
                                src={partner.logo || "/placeholder.svg"}
                                alt={`${partner.name} logo`}
                                width={38}
                                height={38}
                                className="h-7 w-7 object-contain"
                            />
                        </span>
                        <span className="font-Manrope text-sm font-semibold text-lnd-fg">
                            {partner.name}
                        </span>
                    </div>

                    <span className="font-Manrope text-lg font-bold text-lnd-fg">
                        {partner.referencePrice}
                    </span>

                    <div>
                        <p className="text-sm font-medium text-lnd-fg">
                            {partner.orderLimit}
                        </p>
                        <p className="mt-0.5 text-xs text-lnd-fg-muted">
                            {partner.orderLimitSubtext}
                        </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                        {partner.paymentMethods.map((method, i) => (
                            <span
                                key={i}
                                title={method.name}
                                className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-lnd-border bg-lnd-surface-2"
                            >
                                <Image
                                    src={method.icon || "/placeholder.svg"}
                                    alt={method.name}
                                    width={28}
                                    height={28}
                                    className="h-5 w-5 object-contain"
                                />
                            </span>
                        ))}
                    </div>

                    <a
                        href={partner.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="lnd-btn-accent justify-self-end px-4 py-2 text-xs"
                    >
                        {actionLabel}
                    </a>
                </div>
            ))}
        </div>
    );
}

export default function BuyCryptoPage() {
    const [side, setSide] = useState<Side>("buy");
    const [coin, setCoin] = useState<Coin>("USDT");

    const partners =
        side === "buy" ? BUY_PARTNERS[coin] : SELL_PARTNERS[coin];
    const actionLabel = side === "buy" ? "Buy" : "Sell";

    return (
        <main className="w-full">
            <PageHero
                align="center"
                eyebrow="Third-party trading"
                title={
                    <>
                        Buy and sell crypto{" "}
                        <span className="text-lnd-fg-muted">
                            through institutions
                        </span>
                    </>
                }
                subtitle="Purchase digital assets with your preferred payment method through trusted payment partners."
            />

            <section className="mx-auto w-full max-w-[1280px] px-4 py-12 lg:px-6 lg:py-16">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="inline-flex rounded-full border border-lnd-border bg-lnd-surface p-1">
                            {(["buy", "sell"] as const).map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => setSide(option)}
                                    aria-pressed={side === option}
                                    className={`rounded-full px-6 py-2 text-sm font-semibold capitalize transition-colors ${
                                        side === option
                                            ? "bg-lnd-accent-fill text-lnd-accent-fg"
                                            : "text-lnd-fg-muted hover:text-lnd-fg"
                                    }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                        <h2 className="mt-4 font-Manrope text-xl font-bold text-lnd-fg lg:text-2xl">
                            {actionLabel} {coin} with a payment partner
                        </h2>
                        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-lnd-fg-muted">
                            The real-time quotation is for reference only.
                            Please refer to the specific service provider for
                            the actual price.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {COINS.map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => setCoin(option)}
                                aria-pressed={coin === option}
                                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                                    coin === option
                                        ? "border-lnd-accent/40 bg-lnd-accent/10 text-lnd-accent"
                                        : "border-lnd-border text-lnd-fg-muted hover:border-lnd-accent/30 hover:text-lnd-fg"
                                }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-8 hidden lg:block">
                    <PaymentTable
                        partners={partners}
                        actionLabel={actionLabel}
                    />
                </div>

                <div className="mt-6 space-y-3 lg:hidden">
                    {partners.map((partner) => (
                        <PaymentPartnerMobile
                            key={partner.id}
                            name={partner.name}
                            link={partner.link}
                            logo={partner.logo}
                            currency="USDT"
                            referencePrice={partner.referencePrice}
                            orderLimit={partner.orderLimit}
                            orderLimitSubtext={partner.orderLimitSubtext}
                            paymentMethods={partner.paymentMethods}
                            buttonText={actionLabel}
                        />
                    ))}
                </div>

                <p className="mt-6 text-xs leading-relaxed text-lnd-fg-muted">
                    Payment services are provided by independent third
                    parties. Verdstamp does not control and is not responsible
                    for the rates, limits or availability offered by these
                    providers. Always review the provider&apos;s terms before
                    completing a transaction.
                </p>
            </section>
        </main>
    );
}
