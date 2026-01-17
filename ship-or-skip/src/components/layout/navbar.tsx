"use client";

import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-foreground/10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-center h-16">
          {/* Logo - centered, linking to home */}
          <Link
            href="/"
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <Image
              src="/logo.png"
              alt="YC Archive"
              width={40}
              height={40}
              className="rounded-lg"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
}
