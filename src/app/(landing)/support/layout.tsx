import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Support Center",
  description:
    "Get help with your Verdstamp account, deposits, withdrawals, trading, verification and security.",
  path: "/support",
  keywords: ["Verdstamp support", "crypto help center", "account help", "withdrawal help"],
});

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
