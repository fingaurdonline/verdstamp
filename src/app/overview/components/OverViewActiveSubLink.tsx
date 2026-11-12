"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type NavProps = {
  href: string;
  children: ReactNode;
};

export default function OverViewActiveSublink({ href, children }: NavProps) {
  const pathname = usePathname();

  const active = pathname === href;

  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={`flex w-full items-center gap-2.5 rounded-lg py-2 pl-10 pr-3 font-Manrope text-[0.8rem] transition-colors ${
        active
          ? "bg-lnd-accent/10 font-medium text-lnd-accent"
          : "text-lnd-fg-muted hover:bg-lnd-surface-2 hover:text-lnd-fg"
      }`}
      href={href}
    >
      <span
        className={`h-1 w-1 rounded-full ${
          active ? "bg-lnd-accent" : "bg-lnd-fg-muted/40"
        }`}
      />
      {children}
    </Link>
  );
}
