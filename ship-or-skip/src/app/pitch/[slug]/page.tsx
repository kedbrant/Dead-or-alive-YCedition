import { Metadata } from "next";
import { getSessionId } from "@/lib/session/manager";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Idea } from "@/lib/supabase/types";
import { PitchClient } from "./pitch-client";

interface PitchPageProps {
  params: Promise<{ slug: string }>;
}

type PitchIdea = Pick<Idea, "hero" | "subtitle" | "ship_percentage" | "total_votes" | "submitter_twitter">;

async function getIdeaBySlug(slug: string): Promise<PitchIdea | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("ideas")
    .select("hero, subtitle, ship_percentage, total_votes, submitter_twitter")
    .eq("slug", slug)
    .eq("is_active", true)
    .limit(1)
    .returns<PitchIdea[]>();

  if (error || !data || data.length === 0) {
    return null;
  }
  return data[0];
}

export async function generateMetadata({ params }: PitchPageProps): Promise<Metadata> {
  const { slug } = await params;
  const idea = await getIdeaBySlug(slug);

  if (!idea) {
    return {
      title: "Idea Not Found",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yc-archive.com";
  const pitchUrl = `${siteUrl}/pitch/${slug}`;

  // Dynamic title showing the idea and current results
  const title = `${idea.hero} - ${idea.ship_percentage}% would Ship`;
  const description = idea.subtitle;

  // Attribution text
  const attribution = idea.submitter_twitter
    ? `Pitched by @${idea.submitter_twitter}`
    : "Ship or Skip";

  return {
    title,
    description,
    openGraph: {
      type: "article",
      url: pitchUrl,
      title,
      description,
      siteName: "Ship or Skip",
      images: [
        {
          url: `/api/og?hero=${encodeURIComponent(idea.hero)}&ship=${idea.ship_percentage}&votes=${idea.total_votes}`,
          width: 1200,
          height: 630,
          alt: `${idea.hero} - ${idea.ship_percentage}% Ship Rate`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: idea.submitter_twitter ? `@${idea.submitter_twitter}` : undefined,
      images: [`/api/og?hero=${encodeURIComponent(idea.hero)}&ship=${idea.ship_percentage}&votes=${idea.total_votes}`],
    },
    other: {
      "og:author": attribution,
    },
  };
}

export default async function PitchPage({ params }: PitchPageProps) {
  const { slug } = await params;
  const sessionId = await getSessionId();

  return <PitchClient slug={slug} sessionId={sessionId} />;
}
