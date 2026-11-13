import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Referral Program",
  description:
    "Invite friends to Verdstamp and earn a share of their trading fees with the referral program.",
  path: "/referral",
  keywords: ["crypto referral", "referral rewards", "invite friends", "Verdstamp referral"],
});

export default function ReferralLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
