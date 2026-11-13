import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Standard Fees",
  description:
    "Review Verdstamp's standard fees for trading, deposits, withdrawals and currency conversion.",
  path: "/fees-standard",
  keywords: ["crypto fees", "trading fees", "withdrawal fees", "Verdstamp fees"],
});

export default function FeesStandardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
