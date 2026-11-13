import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Buy Crypto",
  description:
    "Buy Bitcoin, Ethereum, USDT and other digital assets with secure payments and transparent pricing on Verdstamp.",
  path: "/buy-crypto",
  keywords: ["buy crypto", "buy bitcoin", "buy ethereum", "buy USDT", "Verdstamp"],
});

export default function BuyCryptoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
