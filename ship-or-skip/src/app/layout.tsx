import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap", // Prevent FOIT - show fallback font immediately
  preload: true,
});

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://shiporskip.app";
const defaultTitle = "YC Archive - Validate Your Startup Idea";
const defaultDescription = "Validate your startup idea against 5,500+ YC companies and live market data. Get AI-powered analysis with competitor insights, market trends, and community sentiment.";

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
        {/* Skip link for keyboard navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-button-bg focus:text-button-text focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-focus-ring"
        >
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
