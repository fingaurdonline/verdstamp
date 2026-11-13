import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Transfer Crypto",
  description:
    "Transfer crypto securely across supported networks with clear fees and real-time status.",
  path: "/transfer",
  keywords: ["transfer crypto", "send crypto", "crypto deposit", "crypto withdrawal"],
});

export default function TransferLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
