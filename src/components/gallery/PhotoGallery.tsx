"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect, useCallback } from "react";
import type { ApiTag } from "@/types/api";
import { useImages } from "@/hooks/useImages";
import { useTags } from "@/hooks/useTags";
import { useTranslations } from "next-intl";
import { killScrollAnimations } from "@/lib/scroll/cleanup";

type CategorySlug = "all" | ApiTag["slug"];

export default function PhotoGallery() {
  const [activeCategory, setActiveCategory] = useState<CategorySlug>("all");
  const { tags, isLoading: tagsLoading } = useTags();
  const { images, isLoading: imagesLoading } = useImages({
    slugs: activeCategory !== "all" ? [activeCategory] : [],
  });
  const t = useTranslations("Gallery");

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Visible images come directly from API (already filtered)
  const visibleImages = useMemo(() => images, [images]);
  const isLoading = tagsLoading || imagesLoading;

  // Cleanup body scroll lock on unmount
  useEffect(
    () => () => {
      document.body.style.overflow = "";
    },
    []
  );

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };
  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxIndex(null);
    document.body.style.overflow = "";
  };

  const goPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex(
      (prev) => ((prev ?? 0) - 1 + visibleImages.length) % visibleImages.length
    );
  }, [lightboxIndex, visibleImages.length]);

  const goNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => ((prev ?? 0) + 1) % visibleImages.length);
  }, [lightboxIndex, visibleImages.length]);

  return (
    <main className='min-h-screen bg-dia-pattern text-neutral-100'>
      <div className='mx-auto px-6'>
        <div
          className='flex min-h-screen'
          style={{ minHeight: "100dvh" }}
        >
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
                {/* "All" */}
                <button
                  onClick={() => {
                    setActiveCategory("all");
                    setLightboxIndex(null);
                  }}
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

                {/* Tags from Supabase */}
                {tags.map((tag) => {
                  const isActive = activeCategory === tag.slug;
                  return (
                    <button
                      key={tag.id}
                      onClick={() => {
                        setActiveCategory(tag.slug);
                        setLightboxIndex(null);
                      }}
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

              {/* use a hard anchor to avoid SPA issues */}
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

          <section className='flex-1 p-6'>
            <div
              className='h-full'
              style={{
                height: "100dvh",
                overflowY: lightboxOpen ? "hidden" : "auto",
                padding: 20,
              }}
            >
              <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4'>
                {isLoading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={`skeleton-${i}`}
                        className='relative h-40 w-full sm:h-48 lg:h-52 rounded bg-neutral-800/60 animate-pulse'
                      />
                    ))
                  : visibleImages.map((img, idx) => (
                      <button
                        key={img.id}
                        onClick={() => openLightbox(idx)}
                        className='group relative overflow-hidden cursor-pointer ring-1 ring-neutral-800 focus:outline-none focus:ring-2 focus:ring-crimson'
                        aria-label={t("openImage", { alt: img.alt })}
                      >
                        <div className='relative h-40 w-full sm:h-48 lg:h-52'>
                          <Image
                            src={img.url}
                            alt={img.alt}
                            fill
                            sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
                            className='object-cover transition-transform duration-300 group-hover:scale-105'
                            priority={idx < 8}
                          />
                        </div>
                      </button>
                    ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {lightboxOpen &&
        lightboxIndex !== null &&
        visibleImages[lightboxIndex] && (
          <div
            role='dialog'
            aria-modal='true'
            className='fixed inset-0 z-50 bg-black/90'
          >
            <button
              aria-label={t("close")}
              onClick={closeLightbox}
              className='absolute right-4 top-4 h-10 w-10 rounded-full bg-neutral-900/70 px-3 py-2 text-sm ring-1 ring-neutral-700 hover:bg-neutral-800 cursor-pointer'
            >
              X
            </button>
            <button
              aria-label={t("previous")}
              onClick={goPrev}
              className='absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-neutral-900/60 px-3 py-2 text-lg ring-1 ring-neutral-700 hover:bg-neutral-800 w-10 h-10 cursor-pointer'
            >
              ‹
            </button>
            <button
              aria-label={t("next")}
              onClick={goNext}
              className='absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-neutral-900/60 px-3 py-2 text-lg ring-1 ring-neutral-700 hover:bg-neutral-800 w-10 h-10 cursor-pointer'
            >
              ›
            </button>
            <div
              className='flex h-full w-full items-center justify-center p-6'
              onClick={closeLightbox}
            >
              <div
                className='relative h-[80vh] w-[92vw] max-w-6xl'
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={visibleImages[lightboxIndex].url}
                  alt={visibleImages[lightboxIndex].alt}
                  fill
                  sizes='92vw'
                  className='object-contain'
                  priority
                />
              </div>
            </div>
          </div>
        )}
    </main>
  );
}
