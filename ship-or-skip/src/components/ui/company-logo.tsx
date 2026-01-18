"use client";

import { useState } from "react";
import Image from "next/image";

interface CompanyLogoProps {
  src: string | null;
  alt: string;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-10 h-10 text-sm",
  md: "w-16 h-16 text-2xl",
  lg: "w-24 h-24 text-4xl",
};

export function CompanyLogo({ src, alt, name, size = "md", className = "" }: CompanyLogoProps) {
  const [imgError, setImgError] = useState(false);
  const initial = (name || "?")[0].toUpperCase();
  const sizeClass = sizeClasses[size];

  return (
    <div className={`${sizeClass} rounded-lg bg-foreground/10 flex items-center justify-center overflow-hidden flex-shrink-0 ${className}`}>
      {src && !imgError ? (
        <Image
          src={src}
          alt={alt}
          fill={size === "lg"}
          width={size !== "lg" ? (size === "sm" ? 40 : 64) : undefined}
          height={size !== "lg" ? (size === "sm" ? 40 : 64) : undefined}
          className="object-contain"
          unoptimized
          onError={() => setImgError(true)}
        />
      ) : (
        <span className={`font-bold text-foreground/40`}>
          {initial}
        </span>
      )}
    </div>
  );
}
