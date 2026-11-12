import Link from "next/link";
import LandingLogo from "./LandingLogo";

/**
 * Central brand definition for the landing site.
 * Change it here once and it updates the header and footer everywhere.
 */
export const BRAND = {
  name: "Verdstamp",
  tagline: "TRUSTED MARKETS",
  domain: "verdstamp.com",
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
      className={`flex items-center gap-2.5 shrink-0 ${className ?? ""}`}
      aria-label={BRAND.name}
    >
      <span className="w-9 h-9 flex items-center justify-center shrink-0">
        <LandingLogo className="w-9 h-9" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-Manrope font-extrabold text-[1.05rem] tracking-tight text-lnd-fg">
          {BRAND.name}
        </span>
        <span className="font-Manrope text-[0.44rem] tracking-[0.28em] text-lnd-fg-muted uppercase mt-[3px]">
          {BRAND.tagline}
        </span>
      </span>
    </Link>
  );
}
