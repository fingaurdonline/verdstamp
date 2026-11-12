import { JSX, SVGProps } from "react";
export default function PasswordIcon(
    props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
    return (
        <svg
        {...props}
         width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect x="9" y="3.59998" width="18" height="17.1" rx="8.55" stroke="#3E9B2F" stroke-width="5" />
            <rect x="2.69995" y="13.5" width="30.6" height="21.6" rx="4" fill="#EAFBE3" />
            <circle cx="18" cy="22.5" r="4.5" fill="white" />
            <rect x="15.75" y="22.5" width="4.5" height="8.1" rx="2.25" fill="white" />
            <ellipse cx="18.0002" cy="22.5002" rx="2.91989" ry="2.91989" fill="#3E9B2F" />
        </svg>
    )
}
