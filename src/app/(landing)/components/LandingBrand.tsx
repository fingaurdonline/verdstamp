import Image from "next/image";
import Link from "next/link";

/**
 * Central brand definition and wordmark lockup.
 * Change it here once and it updates the header and footer everywhere.
 */
export const BRAND = {
  name: "Verdstamp",
  tagline: "TRUSTED MARKETS",
  domain: "verdstampdigital.app",
  url: "https://verdstampdigital.app",
};

export default function LandingBrand({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={`flex shrink-0 items-center ${className ?? ""}`}
      aria-label={`${BRAND.name} home`}
    >
      <Image
        src="/brand/verdstamp-wordmark-light.png"
        alt={BRAND.name}
        width={584}
        height={114}
        priority
        draggable={false}
        className="h-7 w-auto dark:hidden sm:h-8"
      />
      <Image
        src="/brand/verdstamp-wordmark-dark.png"
        alt=""
        aria-hidden="true"
        width={584}
        height={114}
        priority
        draggable={false}
        className="hidden h-7 w-auto dark:block sm:h-8"
      />
    </Link>
  );
}
