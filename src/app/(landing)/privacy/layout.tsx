import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "Learn how Verdstamp collects, uses, stores and protects your personal information.",
  path: "/privacy",
  keywords: ["privacy policy", "data protection", "Verdstamp privacy"],
});

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
