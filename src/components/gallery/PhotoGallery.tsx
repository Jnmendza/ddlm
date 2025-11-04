"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  const { images, isLoading: imagesLoading } = useImages({
    slugs: activeCategory !== "all" ? [activeCategory] : [],
  });
  const t = useTranslations("Gallery");

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visibleImages = useMemo(() => images, [images]);
  const isLoading = tagsLoading || imagesLoading;

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
