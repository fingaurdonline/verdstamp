import { JSX, SVGProps } from "react";
export default function KYC(
    props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
    return (
        <svg
            {...props}
            viewBox="0 0 40 40" fill="none">
            <path d="M16.77 35.1174C17.977 36.407 20.023 36.407 21.2301 35.1174L35.719 19.6382C36.5733 18.7254 36.7852 17.3841 36.2538 16.2525L31.3247 5.75617C30.8214 4.68436 29.7439 4 28.5598 4H9.2797C8.08369 4 6.99771 4.69801 6.50102 5.786L1.7171 16.2649C1.20287 17.3913 1.41953 18.7167 2.26567 19.6208L16.77 35.1174Z" fill="currentColor" className="text-[#B4B7BD] dark:text-[#4B4D53]" />
            <path d="M27.8336 30.8146C28.4747 31.4662 29.5253 31.4662 30.1664 30.8146L39.1237 21.7118C39.6411 21.186 39.7427 20.3789 39.3717 19.7412L36.5051 14.8135C36.2121 14.3099 35.6733 14 35.0906 14H22.9094C22.3267 14 21.7879 14.3099 21.4949 14.8135L18.6283 19.7412C18.2573 20.3789 18.3589 21.186 18.8763 21.7118L27.8336 30.8146Z" fill="currentColor" className="text-[#161719] dark:text-[#E0E0E0]" />
            <path d="M25 20L28.6464 23.6464C28.8417 23.8417 29.1583 23.8417 29.3536 23.6464L33 20" stroke="currentColor" className="text-white dark:text-black" strokeWidth="2" strokeLinecap="round" />
        </svg>

    )
}