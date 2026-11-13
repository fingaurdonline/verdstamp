import type { Metadata } from "next";
import AccountLayoutClient from "./AccountLayoutClient";

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your Verdstamp account, security and verification settings.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AccountLayoutClient>{children}</AccountLayoutClient>;
}
