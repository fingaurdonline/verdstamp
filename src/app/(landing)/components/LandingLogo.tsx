import Image from "next/image";

/**
 * Leaf-only Verdstamp mark for compact surfaces. The brighter mint variant
 * keeps the mark legible on the dashboard's dark theme.
 */
export default function LandingLogo({
    className,
}: {
    className?: string;
}) {
    return (
        <>
            <Image
                src="/brand/verdstamp-mark.png"
                alt=""
                aria-hidden="true"
                width={172}
                height={172}
                loading="eager"
                draggable={false}
                className={`${className ?? ""} dark:hidden`}
            />
            <Image
                src="/brand/verdstamp-mark-light.png"
                alt=""
                aria-hidden="true"
                width={172}
                height={172}
                loading="eager"
                draggable={false}
                className={`${className ?? ""} hidden dark:block`}
            />
        </>
    );
}
