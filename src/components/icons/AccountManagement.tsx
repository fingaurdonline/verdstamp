
import { JSX, SVGProps } from "react";
export default function AccountManagement(
    props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
    return (
        <svg
            {...props}
            width="40" height="40" viewBox="0 0 40 40" fill="none"
            className="dark:text-[#B4B7BD] text-[#B4B7BD]"
        >
            <path d="M2 4C2 2.89543 2.89543 2 4 2H30C31.1046 2 32 2.89543 32 4V34C32 35.1046 31.1046 36 30 36H4C2.89543 36 2 35.1046 2 34V4Z" fill="currentColor" />
            <rect x="6" y="9" width="17" height="5" rx="2.5" className="fill-white dark:fill-[#161719]" />
            <rect x="6" y="21" width="9" height="5" rx="2.5" className="fill-white dark:fill-[#161719]" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M28.5 27C31.5376 27 34 24.5376 34 21.5C34 18.4624 31.5376 16 28.5 16C25.4624 16 23 18.4624 23 21.5C23 24.5376 25.4624 27 28.5 27ZM28.5 27H32C35.866 27 39 30.134 39 34V36C39 37.1046 38.1046 38 37 38H20C18.8954 38 18 37.1046 18 36V34C18 30.134 21.134 27 25 27H28.5Z" className="fill-[#161719] dark:fill-white" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M29 33.5C29 32.6716 29.6716 32 30.5 32H35C35.8284 32 36.5 32.6716 36.5 33.5C36.5 34.3284 35.8284 35 35 35H30.5C29.6716 35 29 34.3284 29 33.5Z" className="fill-white dark:fill-[#161719]" />
        </svg>
    )
}