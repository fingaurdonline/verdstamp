import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Swap Crypto",
  description:
    "Swap crypto instantly at transparent rates with deep liquidity across supported digital assets.",
  path: "/swap",
  keywords: ["swap crypto", "crypto exchange", "instant swap", "Verdstamp swap"],
});

export default function SwapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
