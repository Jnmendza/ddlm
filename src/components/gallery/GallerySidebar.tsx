"use client";

import Link from "next/link";
import { killScrollAnimations } from "@/lib/scroll/cleanup";
import type { ApiTag } from "@/types/api";
import type { CategorySlug, Translate } from "./types";

type GallerySidebarProps = {
  tags: ApiTag[];
  activeCategory: CategorySlug;
  onSelectCategory: (category: CategorySlug) => void;
  t: Translate;
};

export function GallerySidebar({
  tags,
  activeCategory,
  onSelectCategory,
  t,
}: GallerySidebarProps) {
  return (
    <aside className='w-44 shrink-0 border-r border-crimson'>
      <div
        className='px-6 py-8'
        style={{
          position: "sticky",
          top: 0,
          height: "100dvh",
          paddingInlineStart: "1.5rem",
          marginTop: 20,
        }}
      >
        <nav className='flex flex-col gap-4 font-bebas'>
          <button
            onClick={() => onSelectCategory("all")}
            className={[
              "text-left text-xl capitalize tracking-wide transition font-semibold cursor-pointer",
              activeCategory === "all"
                ? "text-crimson"
                : "text-neutral-300 hover:text-neutral-50",
            ].join(" ")}
            aria-pressed={activeCategory === "all"}
            aria-label={t("filterAllAria")}
          >
            {t("filterAll")}
          </button>

          {tags.map((tag) => {
            const isActive = activeCategory === tag.slug;
            return (
              <button
                key={tag.id ?? tag.slug}
                onClick={() => onSelectCategory(tag.slug as CategorySlug)}
                className={[
                  "text-left text-xl capitalize tracking-wide transition font-semibold cursor-pointer",
                  isActive
                    ? "text-crimson"
                    : "text-neutral-300 hover:text-neutral-50",
                ].join(" ")}
                aria-pressed={isActive}
                aria-label={t("filterTagAria", { tag: tag.label })}
              >
                {tag.label.toLowerCase()}
              </button>
            );
          })}
        </nav>

        <Link
          href='/'
          aria-label={t("backAria")}
          className='block text-sm font-semibold tracking-wide text-crimson hover:text-white'
          style={{
            position: "absolute",
            left: "1.5rem",
            right: "1.5rem",
            bottom: "calc(4rem + env(safe-area-inset-bottom))",
          }}
          prefetch={false}
          onClick={killScrollAnimations}
        >
          {t("backText")}
        </Link>
      </div>
    </aside>
  );
}
