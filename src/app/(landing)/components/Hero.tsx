import { ArrowUpRight, Zap } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Hero — reference-matching composition                                      */
/*  badge pill · two-line headline · store buttons · glowing chart · cards    */
/* -------------------------------------------------------------------------- */

function StoreButton({ icon, top, label }: { icon: React.ReactNode; top: string; label: string }) {
    return (
        <span
            aria-disabled="true"
            title="Mobile apps coming soon"
            className="flex cursor-default items-center gap-2.5 rounded-full border border-lnd-border bg-lnd-surface px-4 py-2.5 text-left transition-colors hover:bg-lnd-surface-2 sm:gap-3 sm:px-5"
        >
            <span className="text-xl text-lnd-fg">{icon}</span>
            <span className="flex flex-col leading-none">
                <span className="text-[0.6rem] uppercase tracking-[0.14em] text-lnd-fg-muted">{top}</span>
                <span className="mt-1 font-Manrope text-sm font-semibold text-lnd-fg">{label}</span>
            </span>
        </span>
    );
}

const CHART_LINE =
    "M0,250 C40,244 60,262 95,248 C130,234 150,196 185,206 C220,216 240,232 275,208 C310,184 330,148 365,164 C400,180 420,224 455,196 C490,168 515,128 550,140 C585,152 605,180 640,158 C675,136 695,100 730,112 C765,124 785,150 820,124 C855,98 875,64 910,80 C945,96 970,62 1000,54";
const CHART_AREA = `${CHART_LINE} L1000,320 L0,320 Z`;

function HeroChart() {
    return (
        <div className="relative mx-auto h-[240px] w-full max-w-[1080px] sm:h-[310px] lg:h-[360px]">
            {/* horizontal guide lines */}
            <div aria-hidden className="absolute inset-0 flex flex-col justify-between py-2">
                {[0, 1, 2, 3].map(i => (
                    <div
                        key={i}
                        className="h-px w-full bg-gradient-to-r from-transparent via-lnd-border to-transparent"
                    />
                ))}
            </div>

            <svg
                viewBox="0 0 1000 320"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
                role="img"
                aria-label="Bitcoin price chart trending upward"
            >
                <defs>
                    <linearGradient id="heroArea" x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset="0%"
                            style={{
                                stopColor: "rgb(var(--lnd-accent))",
                                stopOpacity: 0.26,
                            }}
                        />
                        <stop
                            offset="100%"
                            style={{
                                stopColor: "rgb(var(--lnd-accent))",
                                stopOpacity: 0,
                            }}
                        />
                    </linearGradient>
                </defs>

                {/* area fill */}
                <path d={CHART_AREA} fill="url(#heroArea)" />

                {/* soft glow pass */}
                <path
                    d={CHART_LINE}
                    fill="none"
                    style={{
                        stroke: "rgb(var(--lnd-accent))",
                        strokeWidth: 8,
                        opacity: 0.18,
                        filter: "blur(10px)",
                    }}
                />

                {/* crisp line */}
                <path
                    d={CHART_LINE}
                    fill="none"
                    className="lnd-chart-line"
                    style={{
                        stroke: "rgb(var(--lnd-accent))",
                        strokeWidth: 2.4,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        filter: "drop-shadow(0 0 6px rgb(var(--lnd-accent) / 0.35))",
                    }}
                />

                {/* hover guide */}
                <line
                    x1="640"
                    y1="20"
                    x2="640"
                    y2="320"
                    strokeDasharray="3 6"
                    style={{
                        stroke: "rgb(var(--lnd-accent) / 0.35)",
                        strokeWidth: 1,
                    }}
                />
                <circle
                    cx="640"
                    cy="158"
                    r="5"
                    style={{
                        fill: "rgb(var(--lnd-accent))",
                        stroke: "rgb(var(--lnd-bg))",
                        strokeWidth: 2.5,
                    }}
                />
            </svg>

            {/* tooltip */}
            <div className="absolute left-[64%] top-0 z-10 hidden -translate-x-1/2 rounded-xl border border-lnd-border bg-lnd-surface/95 px-3.5 py-2 text-left shadow-lg shadow-black/20 backdrop-blur sm:block">
                <p className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-lnd-fg-muted">BTC / USDT</p>
                <p className="mt-0.5 font-Manrope text-sm font-bold text-lnd-fg">$81,072.24</p>
                <p className="text-[0.66rem] font-semibold text-lnd-accent">+2.34% today</p>
            </div>

            {/* x-axis hints */}
            <div className="pointer-events-none absolute inset-x-0 -bottom-1 hidden items-center justify-between text-[0.62rem] font-medium text-lnd-fg-muted/70 sm:flex">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
            </div>
        </div>
    );
}

function YieldCard({ className }: { className?: string }) {
    const rows = [
        { abbr: "BTC", name: "Bitcoin", apy: "4.20%" },
        { abbr: "ETH", name: "Ethereum", apy: "3.80%" },
        { abbr: "USDT", name: "Tether", apy: "9.87%" },
    ];

    return (
        <div className={`lnd-card p-4 shadow-xl shadow-black/10 ${className ?? ""}`}>
            <div className="flex items-center justify-between">
                <span className="font-Manrope text-sm font-semibold text-lnd-fg">Yield Bonus</span>
                <span className="rounded-full bg-lnd-accent/15 px-2 py-0.5 text-[0.58rem] font-bold uppercase tracking-wider text-lnd-accent">
                    APY
                </span>
            </div>
            <div className="mt-3 flex flex-col gap-1.5">
                {rows.map(row => (
                    <div
                        key={row.abbr}
                        className="flex items-center justify-between rounded-xl bg-lnd-surface-2 px-3 py-2"
                    >
                        <span className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-lnd-bg text-[0.5rem] font-bold text-lnd-accent">
                                {row.abbr}
                            </span>
                            <span className="text-xs font-medium text-lnd-fg">{row.name}</span>
                        </span>
                        <span className="text-xs font-semibold text-lnd-accent">{row.apy}</span>
                    </div>
                ))}
            </div>
            <p className="mt-3 text-[0.62rem] leading-relaxed text-lnd-fg-muted">
                Flexible staking. Rewards paid daily.
            </p>
        </div>
    );
}

function OrderCard({ className }: { className?: string }) {
    const stats = [
        { label: "24h High", value: "$82,418.90" },
        { label: "24h Low", value: "$78,902.10" },
        { label: "24h Volume", value: "$34.2B" },
    ];

    return (
        <div className={`lnd-card p-4 shadow-xl shadow-black/10 ${className ?? ""}`}>
            <div className="flex items-center justify-between">
                <span className="font-Manrope text-sm font-semibold text-lnd-fg">BTC / USDT</span>
                <span className="rounded-full bg-lnd-accent/15 px-2 py-0.5 text-[0.62rem] font-semibold text-lnd-accent">
                    +2.34%
                </span>
            </div>
            <p className="mt-2 font-Manrope text-2xl font-extrabold tracking-tight text-lnd-fg">$81,072.24</p>
            <div className="mt-3 flex flex-col gap-1.5">
                {stats.map(stat => (
                    <div key={stat.label} className="flex items-center justify-between text-[0.68rem]">
                        <span className="text-lnd-fg-muted">{stat.label}</span>
                        <span className="font-medium text-lnd-fg">{stat.value}</span>
                    </div>
                ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-1.5 rounded-xl bg-lnd-surface-2 p-1">
                <span className="rounded-lg bg-lnd-surface py-1.5 text-center text-xs font-semibold text-lnd-fg shadow-sm">
                    Buy
                </span>
                <span className="rounded-lg py-1.5 text-center text-xs font-medium text-lnd-fg-muted">Sell</span>
            </div>
            <span className="mt-2 block rounded-full bg-lnd-accent-fill py-2.5 text-center text-sm font-semibold text-lnd-accent-fg">
                Buy BTC
            </span>
        </div>
    );
}

export default function Hero() {
    return (
        <section className="relative w-full overflow-hidden">
            {/* dotted matrix */}
            <div
                aria-hidden
                className="lnd-dot-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_65%_55%_at_50%_18%,black,transparent)]"
            />
            {/* soft green glow behind the chart */}
            <div
                aria-hidden
                className="lnd-glow pointer-events-none absolute left-1/2 top-[42%] h-[560px] w-[1000px] max-w-none -translate-x-1/2 blur-2xl"
            />
            {/* top wash */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-lnd-surface-2/50 to-transparent"
            />

            <div className="relative mx-auto w-full max-w-[1280px] px-4 pb-16 pt-14 lg:px-6 lg:pt-20">
                <div className="flex flex-col items-center text-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-lnd-border bg-lnd-surface/70 px-3.5 py-1.5 text-[0.78rem] font-medium text-lnd-fg-muted backdrop-blur">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-lnd-accent/15">
                            <Zap className="h-2.5 w-2.5 text-lnd-accent" />
                        </span>
                        Trade smarter. Grow faster.
                        <ArrowUpRight className="h-3.5 w-3.5 text-lnd-accent" />
                    </span>

                    <h1 className="mt-6 max-w-5xl font-Manrope text-[2.6rem] font-extrabold leading-[1.05] tracking-tight text-lnd-fg sm:text-6xl lg:text-[4.25rem]">
                        <span className="block lg:inline">The global</span>{" "}
                        <span className="block lg:inline">crypto currency</span>
                        <span className="mt-1 block text-lnd-fg-muted">traders broker</span>
                    </h1>

                    <p className="mt-5 max-w-xl text-base leading-relaxed text-lnd-fg-muted sm:text-lg">
                        Making crypto trading easier — buy, swap and transfer digital assets across the networks you
                        already use.
                    </p>
                </div>

                {/* chart + floating cards */}
                <div className="relative mt-12 lg:mt-16">
                    <HeroChart />
                    <YieldCard className="absolute -left-2 top-12 hidden w-[250px] xl:block" />
                    <OrderCard className="absolute -right-2 top-16 hidden w-[260px] xl:block" />
                </div>

                {/* cards on smaller screens */}
                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:hidden">
                    <YieldCard />
                    <OrderCard />
                </div>
            </div>
        </section>
    );
}
