"use client"

import Image from "next/image"

type PaymentPartnerProps = {
    id: number
    name: string
    logo: string
    link: string
    currency: string
    referencePrice: string
    orderLimit: string
    orderLimitSubtext: string
    paymentMethods: [
        {
            name: string
            icon: string
        }
    ]
}

export function PaymentPartnerDesktop({
    id,
    name,
    logo,
    link,
    currency,
    referencePrice,
    orderLimit,
    orderLimitSubtext,
    paymentMethods
}: PaymentPartnerProps) {
    return (
        <div
            key={id}
            className="grid grid-cols-9 items-center bg-lnd-surface-2 rounded-3xl mb-6 px-6"
        >
            <div className="col-span-2 w-full py-4 text-left flex items-center space-x-2">
                <Image
                    src={logo || "/placeholder.svg"}
                    alt={`${name} logo`}
                    width={38}
                    height={38}
                    className="rounded dark:opacity-90"
                />
                <span className="text-base font-medium text-lnd-fg">{name}</span>
            </div>
            <div className="col-span-2 py-6">
                <span className="text-2xl font-bold font-Manrope text-lnd-fg">{referencePrice}</span>
            </div>
            <div className="col-span-2 py-6">
                <div className="flex flex-col">
                    <span className="text-2xl font-bold font-Manrope text-lnd-fg">{orderLimit}</span>
                    <span className="text-base font-Manrope text-lnd-fg-muted mt-1">{orderLimitSubtext}</span>
                </div>
            </div>
            <div className="col-span-2 px-6 py-6">
                <div className="flex items-center justify-center gap-3">
                    {paymentMethods.map((method, methodIndex) => (
                        <Image
                            key={methodIndex}
                            src={method.icon || "/placeholder.svg"}
                            alt={method.name}
                            width={32}
                            height={32}
                            className="rounded dark:opacity-90"
                        />
                    ))}
                </div>
            </div>
            <div className="col-span-1 px-2 py-5">
                <a target="_blank" href={link} className="w-full flex item-center justify-center bg-lnd-accent hover:bg-lnd-accent/90 text-lnd-accent-fg font-medium text-sm py-2 rounded-sm transition-colors">
                    Buy
                </a>
            </div>
        </div>
    )
}