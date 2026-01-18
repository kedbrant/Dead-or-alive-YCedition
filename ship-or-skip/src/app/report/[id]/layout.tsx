import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Validation Report",
  description: "AI-powered startup idea validation report with competitor analysis, market trends, and community sentiment from 5,500+ YC companies.",
  openGraph: {
    title: "Startup Idea Validation Report | YC Archive",
    description: "See how this startup idea stacks up against 5,500+ YC companies with AI-powered analysis.",
    images: [
      {
        url: "/api/og?hero=Validation%20Report",
        width: 1200,
        height: 630,
        alt: "YC Archive - Validation Report",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Startup Idea Validation Report | YC Archive",
    description: "See how this startup idea stacks up against 5,500+ YC companies with AI-powered analysis.",
    images: ["/api/og?hero=Validation%20Report"],
  },
};

export default function ReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
