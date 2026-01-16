"use client";

import { useState, useEffect } from "react";

const HERO_MAX_LENGTH = 60;
const SUBTITLE_MAX_LENGTH = 100;

export interface SubmitFormData {
  hero: string;
  subtitle: string;
  twitter_handle?: string;
  link?: string;
}

interface SubmitFormProps {
  onSubmit: (data: SubmitFormData) => Promise<void>;
  isSubmitting?: boolean;
  initialHero?: string;
}

export function SubmitForm({ onSubmit, isSubmitting = false, initialHero = "" }: SubmitFormProps) {
  const [hero, setHero] = useState(initialHero);

  // Sync with initialHero when it changes (e.g., from URL param)
  useEffect(() => {
    if (initialHero) {
      setHero(initialHero);
    }
  }, [initialHero]);
  const [subtitle, setSubtitle] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [link, setLink] = useState("");
  const [errors, setErrors] = useState<{ hero?: string; subtitle?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { hero?: string; subtitle?: string } = {};

    if (!hero.trim()) {
      newErrors.hero = "Hero text is required";
    } else if (hero.length > HERO_MAX_LENGTH) {
      newErrors.hero = `Hero must be ${HERO_MAX_LENGTH} characters or less`;
    }

    if (!subtitle.trim()) {
      newErrors.subtitle = "Subtitle is required";
    } else if (subtitle.length > SUBTITLE_MAX_LENGTH) {
      newErrors.subtitle = `Subtitle must be ${SUBTITLE_MAX_LENGTH} characters or less`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const data: SubmitFormData = {
      hero: hero.trim(),
      subtitle: subtitle.trim(),
    };

    if (twitterHandle.trim()) {
      data.twitter_handle = twitterHandle.trim().replace(/^@/, "");
    }

    if (link.trim()) {
      data.link = link.trim();
    }

    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[480px] mx-auto space-y-6">
      <div className="space-y-2">
        <label htmlFor="hero" className="block text-sm font-medium text-foreground">
          Hero Text <span className="text-skip">*</span>
        </label>
        <input
          type="text"
          id="hero"
          value={hero}
          onChange={(e) => setHero(e.target.value)}
          maxLength={HERO_MAX_LENGTH}
          placeholder="Your startup in one punchy line"
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-surface text-foreground rounded-xl border border-foreground/20
            placeholder:text-foreground/40
            focus:outline-none focus:border-ship focus:ring-1 focus:ring-ship
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="flex justify-between text-xs">
          {errors.hero ? (
            <span className="text-skip">{errors.hero}</span>
          ) : (
            <span className="text-foreground/40">What does your startup do?</span>
          )}
          <span className={hero.length > HERO_MAX_LENGTH ? "text-skip" : "text-foreground/40"}>
            {hero.length}/{HERO_MAX_LENGTH}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="subtitle" className="block text-sm font-medium text-foreground">
          Subtitle <span className="text-skip">*</span>
        </label>
        <textarea
          id="subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          maxLength={SUBTITLE_MAX_LENGTH}
          placeholder="A bit more detail about your idea"
          rows={3}
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-surface text-foreground rounded-xl border border-foreground/20
            placeholder:text-foreground/40 resize-none
            focus:outline-none focus:border-ship focus:ring-1 focus:ring-ship
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="flex justify-between text-xs">
          {errors.subtitle ? (
            <span className="text-skip">{errors.subtitle}</span>
          ) : (
            <span className="text-foreground/40">Expand on your hero text</span>
          )}
          <span className={subtitle.length > SUBTITLE_MAX_LENGTH ? "text-skip" : "text-foreground/40"}>
            {subtitle.length}/{SUBTITLE_MAX_LENGTH}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="twitter" className="block text-sm font-medium text-foreground">
          Twitter/X Handle <span className="text-foreground/40">(optional)</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40">@</span>
          <input
            type="text"
            id="twitter"
            value={twitterHandle}
            onChange={(e) => setTwitterHandle(e.target.value.replace(/^@/, ""))}
            placeholder="yourhandle"
            disabled={isSubmitting}
            className="w-full pl-8 pr-4 py-3 bg-surface text-foreground rounded-xl border border-foreground/20
              placeholder:text-foreground/40
              focus:outline-none focus:border-ship focus:ring-1 focus:ring-ship
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        <p className="text-xs text-foreground/40">Get credit when people vote on your pitch</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="link" className="block text-sm font-medium text-foreground">
          Website Link <span className="text-foreground/40">(optional)</span>
        </label>
        <input
          type="url"
          id="link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://yourcompany.com"
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-surface text-foreground rounded-xl border border-foreground/20
            placeholder:text-foreground/40
            focus:outline-none focus:border-ship focus:ring-1 focus:ring-ship
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <p className="text-xs text-foreground/40">Link to your product or landing page</p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full min-h-14 px-8 py-4 bg-ship text-white font-bold text-lg rounded-xl
          transition-all duration-150
          hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:scale-[1.02]
          active:scale-[0.98]
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
      >
        {isSubmitting ? "Submitting..." : "Submit Your Pitch"}
      </button>
    </form>
  );
}
