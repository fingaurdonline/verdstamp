import { JSX, SVGProps } from "react";
export default function PassKey(
    props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
    return (
        <svg
            {...props}
            width="40" height="40" viewBox="0 0 40 40" fill="none"
            className="stroke-gray-500 dark:stroke-gray-300"
        >
            <rect x="10" y="5" width="16" height="27" rx="8" className="stroke-current" strokeWidth="5" />
            <rect x="4" y="16" width="28" height="22" rx="3" className="fill-current text-gray-500 dark:text-gray-300" />
            <rect x="24" y="20" width="15" height="15" rx="2" className="fill-current text-gray-900 dark:text-white" />
            <path d="M28 27.5977L30.1213 29.719C30.3166 29.9142 30.6332 29.9142 30.8284 29.719L35.0711 25.4763" className="stroke-current text-white dark:text-black" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
    )
}