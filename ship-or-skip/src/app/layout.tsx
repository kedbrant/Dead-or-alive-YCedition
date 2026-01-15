import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://shiporskip.app";
const defaultTitle = "Ship or Skip - Would You Fund This Startup?";
const defaultDescription = "Tinder for startup ideas. Swipe through real pitches, see what the crowd thinks, submit your own.";

export const metadata: Metadata = {
  title: {
    default: defaultTitle,
    template: "%s | Ship or Skip",
  },
  description: defaultDescription,
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Ship or Skip",
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: "/api/og?hero=Would%20You%20Fund%20This%20Startup%3F",
        width: 1200,
        height: 630,
        alt: "Ship or Skip - Would You Fund This Startup?",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/api/og?hero=Would%20You%20Fund%20This%20Startup%3F"],
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
