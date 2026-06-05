"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/standings", label: "Standings" },
  { href: "/builder", label: "Builder" },
  { href: "/calendar", label: "Calendar" }
];

export function Nav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-canvas/85 backdrop-blur-[8px]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-3 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="focus-ring shrink-0 font-display text-lg tracking-[0.12em] text-electric-blue sm:text-xl">
          F1 PULSE
        </Link>
        <nav aria-label="Primary" className="-mx-1 flex max-w-full flex-wrap items-center gap-1 overflow-x-auto px-1 sm:gap-2">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "focus-ring flex min-h-11 items-center rounded-md px-2 py-2 text-xs font-semibold uppercase tracking-wide transition sm:px-3 sm:text-sm",
                  active
                    ? "bg-electric-blue/20 text-electric-blue shadow-neonBlue"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
