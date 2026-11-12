export default function Steps({
    steps,
    cols = 3,
}: {
    steps: { title: string; description: string }[];
    cols?: 2 | 3;
}) {
    return (
        <div
            className={`grid gap-4 ${
                cols === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
            }`}
        >
            {steps.map((step, i) => (
                <div
                    key={i}
                    className="rounded-2xl border border-lnd-border bg-lnd-surface p-5"
                >
                    <span className="font-Manrope text-xs font-bold tracking-[0.14em] text-lnd-accent">
                        {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 font-Manrope text-base font-semibold text-lnd-fg">
                        {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-lnd-fg-muted">
                        {step.description}
                    </p>
                </div>
            ))}
        </div>
    );
}
