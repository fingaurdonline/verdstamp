
import { JSX, SVGProps } from "react";
export default function SecuritySettingsIcon(
    props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
    return (
        <svg
            width="40" height="40" viewBox="0 0 40 40"
            {...props}>
            <path d="M33.4943 6.04207C33.8268 6.04207 34.1682 6.03758 34.5141 6.02411C35.1897 6.00199 35.7494 6.5437 35.7494 7.21969V22.8024C35.7494 27.2048 34.1592 33.6286 20.4041 38.543C20.1251 38.6419 19.8206 38.6419 19.5416 38.543C5.78652 33.6286 4.19629 27.2048 4.19629 22.8024V7.2152C4.19629 6.54169 4.754 6.00199 5.42715 6.02411C5.77305 6.03758 6.11445 6.04207 6.44688 6.04207C15.274 6.04207 19.0564 2.34051 19.0924 2.30008C19.5747 1.81527 20.3645 1.8128 20.8443 2.30008C20.8758 2.33153 24.7391 6.04207 33.4943 6.04207Z" className="fill-neutral-900 dark:fill-neutral-100" />
            <path d="M20 38.6165V1.93555C20.3074 1.94283 20.6121 2.06394 20.8443 2.29973C20.8758 2.33118 24.7391 6.04173 33.4943 6.04173C33.8268 6.04173 34.1682 6.03723 34.5141 6.02376C35.1897 6.00164 35.7494 6.54335 35.7494 7.21934V22.8021C35.7494 27.2044 34.1592 33.6282 20.4041 38.5427C20.2733 38.589 20.1368 38.6137 20 38.6165Z" className="fill-neutral-500 dark:fill-neutral-400" />
            <ellipse cx="20" cy="18" rx="7" ry="7" className="fill-white dark:fill-neutral-800" />
            <rect x="17.5" y="18" width="5" height="13" rx="2.5" className="fill-white dark:fill-neutral-800" />
            <ellipse cx="20" cy="18" rx="3.5" ry="3.5" className="fill-neutral-900 dark:fill-neutral-100" />
        </svg>
    )
}