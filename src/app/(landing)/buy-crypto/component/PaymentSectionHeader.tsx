"use client"

export function PaymentSectionHeader() {
    return (
        <div className="w-full flex flex-col space-y-2 pb-8 border-b border-gray-100 dark:border-gray-700">
            <span className="font-bold text-[1.6rem] dark:text-gray-100">Payment Partner</span>
            <span className="text-base text-gray-500 dark:text-gray-400">The real-time quotation is for reference only. Please refer to the specific service provider for the actual price.</span>
        </div>
    )
}