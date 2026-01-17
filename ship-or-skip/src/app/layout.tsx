import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ycarchive.com";
const defaultTitle = "YC Archive - Validate Your Startup Idea";
const defaultDescription = "Validate your startup idea against 5,500+ YC companies and live market data. Get AI-powered insights on historical patterns, market trends, and community sentiment.";

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
        url: "/api/og?hero=Validate%20Your%20Startup%20Idea",
        width: 1200,
        height: 630,
        alt: "YC Archive - Validate Your Startup Idea",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/api/og?hero=Validate%20Your%20Startup%20Idea"],
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
      </body>
    </html>
  );
}
