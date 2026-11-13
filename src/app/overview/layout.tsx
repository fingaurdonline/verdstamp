import type { Metadata } from "next";
import OverviewLayoutClient from "./OverviewLayoutClient";

export const metadata: Metadata = {
  title: "Portfolio Overview",
  description: "View your Verdstamp portfolio, balances and trading activity.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function OverviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <OverviewLayoutClient>{children}</OverviewLayoutClient>;
}
