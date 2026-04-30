"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { StaggeredMenu } from "@/components/ui/staggered-menu";

import { mumzMindNavLinks } from "../routes";

export default function MumzMindNav() {
  const pathname = usePathname();
  const mobileMenuItems = [
    { href: "/", label: "Home", eyebrow: "Start here" },
    { href: "/parent", label: "Parent Feed", eyebrow: "Everyday view" },
    { href: "/timeline", label: "Baby Timeline", eyebrow: "Journey" },
    { href: "/stage", label: "Next Chapter", eyebrow: "Preparation" },
    { href: "/crm", label: "CRM View", eyebrow: "Team view" },
  ] as const;

  return (
    <div className="sticky top-0 z-[60] px-3 pt-3 sm:px-6">
      <nav className="mx-auto max-w-7xl rounded-[28px] border border-[rgba(165,13,37,0.08)] bg-[color:rgba(255,250,248,0.88)] px-4 py-3 shadow-[0_22px_50px_rgba(37,0,0,0.08)] backdrop-blur-xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-medium text-[var(--deep-plum)]">MumzMind</div>
              <div className="text-xs text-[var(--muted-mauve)]">A calm guide for each next chapter</div>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <div className="rounded-full border border-[var(--blush-pink)]/60 bg-white/80 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--deep-berry)]">
            Next Chapter
          </div>
              <StaggeredMenu
                items={mobileMenuItems}
                logo="MumzMind"
                subtitle="Next Chapter"
                badge="Mobile menu"
                colors={["#250000", "#A50D25", "#FFF8F5"]}
                accentColor="#DE3A57"
                menuButtonColor="#250000"
                openMenuButtonColor="#250000"
              />
            </div>
          </div>

          <div className="hidden rounded-full border border-[var(--blush-pink)]/60 bg-white/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--deep-berry)] lg:inline-flex">
            Next Chapter
          </div>

          <div className="hidden min-w-0 flex-wrap items-center gap-2 lg:flex lg:flex-1 lg:justify-end">
            {mumzMindNavLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-full px-3 py-2 text-xs transition-all sm:px-4 sm:text-sm ${
                    isActive
                      ? "bg-[linear-gradient(135deg,rgba(222,58,87,0.92),rgba(165,13,37,0.92))] text-white shadow-[0_12px_24px_rgba(165,13,37,0.18)]"
                      : "bg-white/70 text-[var(--deep-plum)] hover:-translate-y-0.5 hover:bg-white/92 hover:shadow-[0_10px_22px_rgba(37,0,0,0.07)]"
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
