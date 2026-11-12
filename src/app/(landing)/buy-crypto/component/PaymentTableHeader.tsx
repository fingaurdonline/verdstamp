"use client"

export function PaymentTableHeader({ currency }: { currency: string }) {
    return (
        <div className="w-full grid grid-cols-9 px-5">
            <div className="w-full col-span-2 py-4 text-l">
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-start">Payment Partner</span>
            </div>
            <div className="w-full col-span-2 py-4 text-left">
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-start">Reference Price (USD)</span>
            </div>
            <div className="w-full col-span-2 py-4 text-left">
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-start">Single Order Limit ({currency})</span>
            </div>
            <div className="w-full col-span-2 py-4 text-center">
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center">Payment Methods</span>
            </div>
            <div className="w-full col-span-1 py-4 text-center">
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center">Operation</span>
            </div>
        </div>
    )
}