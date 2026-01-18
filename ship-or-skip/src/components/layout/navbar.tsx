"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center h-16">
          <Link
            href="/"
            className="hover:opacity-80 transition-opacity"
          >
            <span className="text-xl font-bold text-yc-orange">YC-ARCHIVE</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
