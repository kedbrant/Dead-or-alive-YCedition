import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yc-archive.com";
const defaultTitle = "YC Archive - Explore 5,400+ Y Combinator Startups";
const defaultDescription = "Browse the complete Y Combinator startup archive. See which companies shipped or skipped, vote on pitches, and test your investor instincts.";

export const metadata: Metadata = {
  title: {
    default: defaultTitle,
    template: "%s | YC Archive",
  },
  description: defaultDescription,
  metadataBase: new URL(siteUrl),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "YC Archive",
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: "/logo.png",
        width: 1024,
        height: 1024,
        alt: "YC Archive",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased bg-background text-foreground min-h-screen`}>
        <Navbar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
