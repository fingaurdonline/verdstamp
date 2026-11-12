
import { JSX, SVGProps } from "react";
export default function WithdrawPassword(
    props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
    return (
        <svg
            {...props}
            width="40" height="40" viewBox="0 0 40 40" fill="none"
            className="dark:[&_path]:fill-white [&_path]:fill-[#161719]">
            <path d="M2 9C2 6.79086 3.79086 5 6 5H34C36.2091 5 38 6.79086 38 9V15H2V9Z" fill="#161719" />
            <path d="M2 31C2 33.2091 3.79086 35 6 35H34C36.2091 35 38 33.2091 38 31V17H2V31Z" fill="#B4B7BD" />
            <path d="M23.5 28H32.689C32.9675 28 33.0957 27.6535 32.8843 27.4722L30 25" stroke="white" stroke-width="2.5" stroke-linecap="round" />
        </svg>
    )
}