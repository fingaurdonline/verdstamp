import Image from "next/image";

type PaymentMethod = {
    name: string;
    icon: string;
};

type PaymentPartnerProps = {
    name: string;
    logo: string;
    link: string;
    currency: string;
    referencePrice: string;
    orderLimit: string;
    orderLimitSubtext: string;
    buttonText?: string;
    paymentMethods: PaymentMethod[];
};

export function PaymentPartnerMobile({
    name,
    logo,
    link,
    currency,
    referencePrice,
    orderLimit,
    orderLimitSubtext,
    buttonText = "Buy",
    paymentMethods,
}: PaymentPartnerProps) {
    return (
        <div className="rounded-2xl border border-lnd-border bg-lnd-surface p-4">
            <div className="flex items-start justify-between gap-3 border-b border-lnd-border pb-4">
                <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-lnd-border bg-lnd-surface-2">
                        <Image
                            src={logo || "/placeholder.svg"}
                            alt={`${name} logo`}
                            width={38}
                            height={38}
                            className="h-7 w-7 object-contain"
                        />
                    </span>
                    <span className="font-Manrope text-sm font-semibold text-lnd-fg">
                        {name}
                    </span>
                </div>
                <div className="text-right">
                    <p className="text-[0.6rem] font-medium uppercase tracking-[0.12em] text-lnd-fg-muted">
                        Reference price
                    </p>
                    <p className="mt-0.5 font-Manrope text-sm font-bold text-lnd-fg">
                        {referencePrice}
                    </p>
                </div>
            </div>

            <dl className="mt-3 space-y-3 text-xs">
                <div className="flex items-start justify-between gap-4">
                    <dt className="text-lnd-fg-muted">
                        Single order limit ({currency})
                    </dt>
                    <dd className="text-right">
                        <span className="block font-medium text-lnd-fg">
                            {orderLimit}
                        </span>
                        <span className="mt-0.5 block text-lnd-fg-muted">
                            {orderLimitSubtext}
                        </span>
                    </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <dt className="text-lnd-fg-muted">Payment methods</dt>
                    <dd className="flex items-center gap-1.5">
                        {paymentMethods.map((method, index) => (
                            <span
                                key={index}
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
                    </dd>
                </div>
            </dl>

            <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="lnd-btn-accent mt-4 flex w-full items-center justify-center py-2.5 text-sm"
            >
                {buttonText}
            </a>
        </div>
    );
}
