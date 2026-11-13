import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Disclaimer",
  description:
    "Read the Verdstamp risk disclaimer covering digital asset trading, market risk and platform information.",
  path: "/disclaimer",
  keywords: ["crypto risk disclaimer", "digital asset risk", "Verdstamp disclaimer"],
});

export default function DisclaimerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
