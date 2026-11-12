
import { JSX, SVGProps } from "react";
export default function OrderComfirmation(
    props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
    return (
        <svg
            {...props}
            width="40" height="40" viewBox="0 0 40 40" fill="none"
            className="stroke-current text-gray-700 dark:text-gray-300"
        >
            <rect x="9.3335" y="12" width="21.3333" height="18.6667" className="fill-current text-gray-300 dark:text-gray-600" />
            <rect x="6" y="6" width="28" height="29" rx="2" className="fill-current text-gray-400 dark:text-gray-700" />
            <rect x="11" y="2" width="18" height="8" rx="3" className="fill-current text-gray-900 dark:text-gray-100" stroke="white" strokeWidth="2" />
            <path fillRule="evenodd" clipRule="evenodd" d="M29.0607 15.9393C29.6464 16.5251 29.6464 17.4749 29.0607 18.0607L20.0607 27.0607C19.4749 27.6464 18.5251 27.6464 17.9393 27.0607L12.9393 22.0607C12.3536 21.4749 12.3536 20.5251 12.9393 19.9393C13.5251 19.3536 14.4749 19.3536 15.0607 19.9393L19 23.8787L26.9393 15.9393C27.5251 15.3536 28.4749 15.3536 29.0607 15.9393Z" className="fill-current text-gray-900 dark:text-gray-100" />
        </svg>
    )
}