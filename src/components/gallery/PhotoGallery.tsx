"use client";

import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { useImages } from "@/hooks/useImages";
import { useTags } from "@/hooks/useTags";
import { GallerySidebar } from "./GallerySidebar";
import { GalleryGrid } from "./GalleryGrid";
import { GalleryLightbox } from "./GalleryLightbox";
import type { CategorySlug } from "./types";

export default function PhotoGallery() {
  const [activeCategory, setActiveCategory] = useState<CategorySlug>("all");
  const { tags, isLoading: tagsLoading } = useTags();
  const {
    images,
    isLoading: imagesLoading,
    isLoadingMore,
    isReachingEnd,
    setSize,
    size,
  } = useImages({
    slugs: activeCategory !== "all" ? [activeCategory] : [],
  });
  const t = useTranslations("Gallery");

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // We need a ref for the load-more trigger
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isReachingEnd && !isLoadingMore) {
          setSize((prev) => prev + 1);
        }
      },
      { rootMargin: "200px" }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [isReachingEnd, isLoadingMore, setSize]);

  const visibleImages = useMemo(() => images, [images]);
  // Initial loading state
  const isLoading = tagsLoading || (imagesLoading && size === 1);

  useEffect(
    () => () => {
      document.body.style.overflow = "";
    },
    []
  );

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setLightboxIndex(null);
    document.body.style.overflow = "";
  }, []);

  const goPrev = useCallback(() => {
    if (lightboxIndex === null || visibleImages.length === 0) return;
    setLightboxIndex(
      (prev) =>
        ((prev ?? 0) - 1 + visibleImages.length) % visibleImages.length
    );
  }, [lightboxIndex, visibleImages.length]);

  const goNext = useCallback(() => {
    if (lightboxIndex === null || visibleImages.length === 0) return;
    setLightboxIndex((prev) => ((prev ?? 0) + 1) % visibleImages.length);
  }, [lightboxIndex, visibleImages.length]);

  const handleSelectCategory = useCallback((category: CategorySlug) => {
    setActiveCategory(category);
    setLightboxIndex(null);
  }, []);

  const currentImage =
    lightboxIndex !== null ? visibleImages[lightboxIndex] : null;

  return (
    <main className='min-h-screen bg-dia-pattern text-neutral-100'>
      <div className='mx-auto px-6'>
        <div className='flex min-h-screen' style={{ minHeight: "100dvh" }}>
          <GallerySidebar
            tags={tags}
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
            t={t}
          />

          <section className='flex-1 p-6'>
            <div
              className='h-full'
              style={{
                height: "100dvh",
                overflowY: lightboxOpen ? "hidden" : "auto",
                padding: 20,
              }}
            >
              <GalleryGrid
                images={visibleImages}
                isLoading={isLoading}
                onOpenImage={openLightbox}
                t={t}
              />
              
              {/* Load more trigger */}
              <div ref={loadMoreRef} className="h-10 w-full flex items-center justify-center mt-4">
                 {isLoadingMore && <div className="animate-pulse text-neutral-500">Loading more...</div>}
              </div>
            </div>
          </section>
        </div>
      </div>

      {lightboxOpen && currentImage && (
        <GalleryLightbox
          image={currentImage}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
          t={t}
        />
      )}
    </main>
  );
}
