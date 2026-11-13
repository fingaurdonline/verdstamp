import type { Metadata, Viewport } from "next";
import "./globals.css";
import QueryProvider from "./QueryProvider";
import NextTopLoader from 'nextjs-toploader';
import { ThemeProvider } from "./ThemeProvider";
import SmartsuppChat from "@/components/SmartSupp";
import ConvexClientProvider from "./ConvexClientProvider";

export const metadata: Metadata = {
  title: {
    default: "Verdstamp — Trusted Markets",
    template: "%s | Verdstamp",
  },
  description:
    "Buy, swap and transfer digital assets with transparent fees, deep liquidity and 24/7 support.",
  applicationName: "Verdstamp",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0e0c" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang='en' suppressHydrationWarning>
      <body className='h-dvh w-full overflow-x-clip'>
        <ThemeProvider attribute="class">
          <NextTopLoader color="#7ED957" shadow={false} showSpinner={false} />
          <ConvexClientProvider>
            <QueryProvider>{children}</QueryProvider>
          </ConvexClientProvider>
          <SmartsuppChat />
        </ThemeProvider>
      </body>
    </html>
  );
}
