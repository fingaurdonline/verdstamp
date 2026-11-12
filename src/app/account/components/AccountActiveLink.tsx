"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type NavProps = {
  href: string;
  children: ReactNode;
};

export default function AccountActivelink({ href, children }: NavProps) {
  const pathname = usePathname();

  const active =
    pathname === href ||
    (href !== "/account" && pathname.startsWith(`${href}/`));

  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={`group flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 font-Manrope text-[0.83rem] font-medium transition-colors ${
        active
          ? "bg-lnd-accent/10 text-lnd-accent"
          : "text-lnd-fg-muted hover:bg-lnd-surface-2 hover:text-lnd-fg"
      }`}
      href={href}
    >
      {children}
    </Link>
  );
}
