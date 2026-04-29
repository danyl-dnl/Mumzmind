"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { mumzMindNavLinks } from "../routes";

export default function MumzMindNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-[60] px-3 pt-3 sm:px-6">
      <nav className="mx-auto max-w-7xl rounded-[28px] border border-white/70 bg-[color:rgba(255,248,245,0.78)] px-4 py-3 shadow-[0_18px_45px_rgba(37,0,0,0.1)] backdrop-blur-xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-medium text-[var(--deep-plum)]">MumzMind</div>
              <div className="text-xs text-[var(--muted-mauve)]">Family journey prototype</div>
            </div>

            <div className="rounded-full border border-[var(--blush-pink)]/60 bg-white/80 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--deep-berry)] sm:hidden">
              API-Free
            </div>
          </div>

          <div className="hidden rounded-full border border-[var(--blush-pink)]/60 bg-white/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--deep-berry)] sm:inline-flex">
            API-Free Prototype
          </div>

          <div className="flex min-w-0 flex-wrap items-center gap-2 lg:flex-1 lg:justify-end">
            {mumzMindNavLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-full px-3 py-2 text-xs transition-all sm:px-4 sm:text-sm ${
                    isActive
                      ? "bg-gradient-to-r from-[var(--rose)] to-[var(--coral)] text-white shadow-[0_12px_24px_rgba(165,13,37,0.22)]"
                      : "bg-white/60 text-[var(--deep-plum)] hover:-translate-y-0.5 hover:bg-white/85 hover:shadow-[0_10px_24px_rgba(37,0,0,0.08)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
