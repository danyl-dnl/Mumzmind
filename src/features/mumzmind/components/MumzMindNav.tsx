"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { StaggeredMenu } from "@/components/ui/staggered-menu";

import { mumzMindNavLinks } from "../routes";

import { useCart } from "../CartContext";

export default function MumzMindNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  
  return (
    <div className="sticky top-0 z-[60] px-4 pt-4 sm:px-6">
      <nav className="mx-auto max-w-7xl rounded-[2rem] border border-white/60 bg-white/60 px-5 py-3.5 shadow-[0_8px_32px_rgba(42,18,18,0.03)] backdrop-blur-2xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-lg font-medium tracking-tight text-[var(--deep-plum)]">MumzMind</span>
              <span className="hidden h-4 w-[1px] bg-[rgba(42,18,18,0.1)] lg:block"></span>
              <span className="hidden text-xs text-[var(--muted-mauve)] lg:block">A calm guide for each next chapter</span>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <StaggeredMenu
                items={[
                  { href: "/", label: "Store", eyebrow: "Browse" },
                  { href: "/deals", label: "Deals", eyebrow: "Save" },
                  { href: "/brands", label: "Brands", eyebrow: "Trust" },
                  { href: "/cart", label: `Cart (${totalItems})`, eyebrow: "Checkout" },
                ]}
                logo="MumzMind"
                subtitle="Menu"
                badge="Navigation"
                colors={["#250000", "#A50D25", "#FFF8F5"]}
                accentColor="#DE3A57"
                menuButtonColor="#250000"
                openMenuButtonColor="#250000"
              />
            </div>
          </div>

          <div className="hidden min-w-0 items-center gap-1.5 lg:flex lg:flex-1 lg:justify-end">
            {mumzMindNavLinks.map((link) => {
              const isActive = pathname === link.href;
              const label = link.label === "Cart" ? `Cart (${totalItems})` : link.label;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                    isActive
                      ? "bg-white text-[var(--deep-plum)] shadow-[0_2px_12px_rgba(42,18,18,0.04)] ring-1 ring-[rgba(42,18,18,0.02)]"
                      : "text-[var(--muted-mauve)] hover:text-[var(--deep-plum)] hover:bg-white/40"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
