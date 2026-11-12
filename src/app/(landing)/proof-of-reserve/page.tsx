import { Info, ShieldCheck } from "lucide-react";
import PageHero from "../components/PageHero";
import PageCta from "../components/PageCta";
import SectionHead from "../components/SectionHead";
import StatGrid from "../components/StatGrid";

const RESERVE_DATA = [
    {
        coin: "CET",
        totalAssetsInSite: "640,515,501.69",
        totalAssetsInWallets: "798,934,385.25",
        totalMarketCapInWallets: "40,815,520.45 USD",
        reserveRate: "124.73%",
    },
    {
        coin: "USDT",
        totalAssetsInSite: "242,891,978.83",
        totalAssetsInWallets: "261,275,602.22",
        totalMarketCapInWallets: "261,151,783.71 USD",
        reserveRate: "107.56%",
    },
    {
        coin: "USDC",
        totalAssetsInSite: "10,870,431.74",
        totalAssetsInWallets: "11,471,052.24",
        totalMarketCapInWallets: "11,464,345.92 USD",
        reserveRate: "105.52%",
    },
    {
        coin: "BTC",
        totalAssetsInSite: "1,643.56",
        totalAssetsInWallets: "1,668.67",
        totalMarketCapInWallets: "199,165,114.66 USD",
        reserveRate: "101.52%",
    },
    {
        coin: "ETH",
        totalAssetsInSite: "16,012.22",
        totalAssetsInWallets: "16,026.06",
        totalMarketCapInWallets: "74,078,002.04 USD",
        reserveRate: "100.09%",
    },
    {
        coin: "DOGE",
        totalAssetsInSite: "155,314,518.51",
        totalAssetsInWallets: "155,894,470.24",
        totalMarketCapInWallets: "36,730,280.54 USD",
        reserveRate: "100.37%",
    },
];

const PROOF_STEPS = [
    "Verdstamp uses \"Merkle Tree\" as a data structure to encrypt user assets and publish the total assets of all users at the same time.",
    "Verdstamp displays the total assets of all on-chain wallet addresses and wallets held by the platform.",
    "By comparing the total assets of all users with the total assets of all on-chain addresses on Verdstamp, users can verify the asset reserve rate of Verdstamp.",
];

export default function ProofOfReserve() {
    return (
        <main className="w-full">
            <PageHero
                align="center"
                eyebrow="Transparency"
                title={
                    <>
                        Proof of{" "}
                        <span className="text-lnd-accent">reserve</span>
                        <br />
                        <span className="text-lnd-fg-muted">
                            Secure and transparent
                        </span>
                    </>
                }
                subtitle="100% reserve has been the bottom line of Verdstamp."
                footer={
                    <StatGrid
                        items={[
                            {
                                value: "$853.08M",
                                label: "Total market cap in wallets",
                            },
                            { value: "6", label: "Assets published" },
                            {
                                value: "100%",
                                label: "Minimum reserve requirement",
                            },
                        ]}
                    />
                }
            />

            <section className="mx-auto w-full max-w-[1280px] px-4 py-16 lg:px-6 lg:py-20">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <SectionHead
                        eyebrow="Latest snapshot"
                        title="Latest reserve rate on Verdstamp"
                        description="Total market cap in wallets: $853,076,824.47"
                    />
                    <span className="inline-flex items-center gap-2 self-start rounded-full border border-lnd-border bg-lnd-surface px-3 py-1.5 text-xs text-lnd-fg-muted sm:self-auto">
                        <ShieldCheck className="h-3.5 w-3.5 text-lnd-accent" />
                        All assets above 100%
                    </span>
                </div>

                {/* Desktop table */}
                <div className="mt-8 hidden overflow-hidden rounded-2xl border border-lnd-border bg-lnd-surface lg:block">
                    <div className="grid grid-cols-[1.1fr_repeat(3,1fr)_0.8fr] gap-4 border-b border-lnd-border bg-lnd-surface-2 px-5 py-3 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-lnd-fg-muted">
                        <span>Coin</span>
                        <span className="text-right">
                            Total assets (in-site)
                        </span>
                        <span className="text-right">
                            Total assets in wallets
                        </span>
                        <span className="text-right">
                            Total market cap in wallets
                        </span>
                        <span className="text-right">Reserve rate</span>
                    </div>

                    {RESERVE_DATA.map((asset) => (
                        <div
                            key={asset.coin}
                            className="grid grid-cols-[1.1fr_repeat(3,1fr)_0.8fr] items-center gap-4 border-b border-lnd-border px-5 py-4 transition-colors last:border-b-0 hover:bg-lnd-surface-2/50"
                        >
                            <div className="flex items-center gap-2.5">
                                <span
                                    aria-hidden
                                    className="flex h-8 w-8 items-center justify-center rounded-full border border-lnd-border bg-lnd-accent/10 font-Manrope text-[0.5rem] font-bold uppercase tracking-tight text-lnd-accent"
                                >
                                    {asset.coin}
                                </span>
                                <span className="font-Manrope text-sm font-semibold text-lnd-fg">
                                    {asset.coin}
                                </span>
                            </div>
                            <span className="text-right font-mono text-sm tabular-nums text-lnd-fg-muted">
                                {asset.totalAssetsInSite}
                            </span>
                            <span className="text-right font-mono text-sm tabular-nums text-lnd-fg-muted">
                                {asset.totalAssetsInWallets}
                            </span>
                            <span className="text-right font-mono text-sm tabular-nums text-lnd-fg-muted">
                                {asset.totalMarketCapInWallets}
                            </span>
                            <span className="text-right font-mono text-sm font-semibold tabular-nums text-lnd-accent">
                                {asset.reserveRate}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Mobile cards */}
                <div className="mt-6 space-y-3 lg:hidden">
                    {RESERVE_DATA.map((asset) => (
                        <div
                            key={asset.coin}
                            className="rounded-2xl border border-lnd-border bg-lnd-surface p-5"
                        >
                            <div className="flex items-center justify-between gap-3 border-b border-lnd-border pb-3">
                                <div className="flex items-center gap-2.5">
                                    <span
                                        aria-hidden
                                        className="flex h-8 w-8 items-center justify-center rounded-full border border-lnd-border bg-lnd-accent/10 font-Manrope text-[0.5rem] font-bold uppercase tracking-tight text-lnd-accent"
                                    >
                                        {asset.coin}
                                    </span>
                                    <span className="font-Manrope text-sm font-semibold text-lnd-fg">
                                        {asset.coin}
                                    </span>
                                </div>
                                <span className="rounded-full bg-lnd-accent/10 px-2.5 py-1 font-mono text-xs font-semibold text-lnd-accent">
                                    {asset.reserveRate}
                                </span>
                            </div>
                            <dl className="mt-3 space-y-2.5 text-xs">
                                <div className="flex items-center justify-between gap-4">
                                    <dt className="text-lnd-fg-muted">
                                        Total assets (in-site)
                                    </dt>
                                    <dd className="font-mono tabular-nums text-lnd-fg">
                                        {asset.totalAssetsInSite}
                                    </dd>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <dt className="text-lnd-fg-muted">
                                        Total assets in wallets
                                    </dt>
                                    <dd className="font-mono tabular-nums text-lnd-fg">
                                        {asset.totalAssetsInWallets}
                                    </dd>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <dt className="text-lnd-fg-muted">
                                        Total market cap in wallets
                                    </dt>
                                    <dd className="text-right font-mono tabular-nums text-lnd-fg">
                                        {asset.totalMarketCapInWallets}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex gap-3 rounded-2xl border border-lnd-border bg-lnd-surface px-5 py-4">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-lnd-accent" />
                    <p className="text-xs leading-relaxed text-lnd-fg-muted">
                        <strong className="font-semibold text-lnd-fg">
                            Note:
                        </strong>{" "}
                        Uncovered assets before the snapshot and asset
                        transactions after the snapshot will not be included in
                        the audit.
                    </p>
                </div>
            </section>

            <section className="border-y border-lnd-border bg-lnd-surface/30">
                <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-4 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-6 lg:py-20">
                    <div>
                        <SectionHead
                            eyebrow="Audit method"
                            title="How to prove reserves"
                            description={
                                'In centralized trading platforms, user assets are often recorded via the ledger in the database, and how to prove the reserve fund has become a difficult issue. In Verdstamp, we use the "Merkle Tree" as an audit method to prove that the platform maintains a 100% reserve rate. This audit methodology requires three key steps for verification:'
                            }
                        />
                    </div>

                    <div className="space-y-3">
                        {PROOF_STEPS.map((step, index) => (
                            <div
                                key={index}
                                className="flex gap-4 rounded-2xl border border-lnd-border bg-lnd-surface p-5"
                            >
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lnd-accent/10 font-Manrope text-sm font-bold text-lnd-accent">
                                    {index + 1}
                                </span>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted">
                                    {step}
                                </p>
                            </div>
                        ))}
                        <p className="rounded-2xl border border-lnd-accent/20 bg-lnd-accent/5 p-5 text-sm leading-relaxed text-lnd-fg-muted">
                            When the total on-chain assets on Verdstamp are
                            greater than or equal to the total assets of the
                            user, it proves that Verdstamp maintains a 100%
                            reserve rate.
                        </p>
                    </div>
                </div>
            </section>

            <PageCta
                title="Transparency you can verify"
                description="Trade on a platform that publishes its reserves and holds user assets to a 100% standard."
            />
        </main>
    );
}
