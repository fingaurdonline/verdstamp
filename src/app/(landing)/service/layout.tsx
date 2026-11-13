import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description:
    "Read the Verdstamp Terms of Service governing use of our crypto trading and transfer platform.",
  path: "/service",
  keywords: ["terms of service", "crypto terms", "Verdstamp terms"],
});

export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
