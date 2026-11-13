import Image from "next/image";

export default function LandingLogo({
    className,
}: {
    className?: string;
}) {
    return (
        <Image
            src="/brand/verdstamp-mark.png"
            alt=""
            aria-hidden="true"
            width={172}
            height={172}
            draggable={false}
            className={className}
        />
    );
}
