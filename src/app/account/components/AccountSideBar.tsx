"use client";

import {
  BadgeCheck,
  LayoutDashboard,
  MessageSquare,
  ShieldCheck,
  SlidersHorizontal,
  Ticket,
} from "lucide-react";
import AccountActivelink from "./AccountActiveLink";

const LINKS = [
  { href: "/account", label: "Account Overview", icon: LayoutDashboard },
  { href: "/account/security-settings", label: "Security Settings", icon: ShieldCheck },
  { href: "/account/id-verification", label: "ID Verification", icon: BadgeCheck },
  { href: "/account/preferences", label: "Preferences", icon: SlidersHorizontal },
  { href: "/account/messages", label: "Messages", icon: MessageSquare },
  { href: "/account/voucher-center", label: "Voucher Center", icon: Ticket },
];

export default function AccountSidebar() {
  return (
    <aside className="hidden w-60 shrink-0 lg:flex xl:w-64">
      <div className="db-card h-fit w-full p-2.5">
        <p className="db-eyebrow px-3 pb-2 pt-2">Account</p>
        <nav className="flex flex-col gap-0.5" aria-label="Account navigation">
          {LINKS.map(({ href, label, icon: Icon }) => (
            <AccountActivelink key={href} href={href}>
              <Icon className="h-[1.05rem] w-[1.05rem] shrink-0" strokeWidth={1.7} />
              <span>{label}</span>
            </AccountActivelink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
