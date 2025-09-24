"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect, useCallback } from "react";

type GalleryCategory = "all" | "food" | "art" | "parades";
type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  category: Exclude<GalleryCategory, "all">;
};

const CATEGORIES: Array<GalleryCategory> = ["all", "food", "art", "parades"];

// Replace these with your own images (local /public or remote)
const IMAGES: Array<GalleryImage> = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1514511542413-f0f2d52f0c54?q=80&w=1600",
    alt: "Street tacos",
    category: "food",
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1600",
    alt: "Ceviche plate",
    category: "food",
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600",
    alt: "Gallery piece",
    category: "art",
  },
  {
    id: "4",
    src: "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1600",
    alt: "Abstract mural",
    category: "art",
  },
  {
    id: "5",
    src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600",
    alt: "Parade dancers",
    category: "parades",
  },
  {
    id: "6",
    src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600",
    alt: "Parade drums",
    category: "parades",
  },
  {
    id: "7",
    src: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1600",
    alt: "Churros",
    category: "food",
  },
  {
    id: "8",
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600",
    alt: "Sculpture",
    category: "art",
  },
];

export default function GalleryPage() {
  const [active, setActive] = useState<GalleryCategory>("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visibleImages = useMemo(() => {
    if (active === "all") return IMAGES;
    return IMAGES.filter((img) => img.category === active);
  }, [active]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

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
    setLightboxIndex((prev) => {
      const i = prev ?? 0;
      return (i - 1 + visibleImages.length) % visibleImages.length;
    });
  }, [lightboxIndex, visibleImages.length]);

  const goNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => {
      const i = prev ?? 0;
      return (i + 1) % visibleImages.length;
    });
  }, [lightboxIndex, visibleImages.length]);

  // Keyboard controls: ESC closes, arrows navigate
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, goPrev, goNext]);

  return (
    <main className='min-h-screen bg-neutral-950 text-neutral-100'>
      <div className='mx-auto max-w-7xl px-6'>
        <div className='flex min-h-screen'>
          {/* LEFT SIDEBAR */}
          <aside className='w-44 shrink-0 border-r border-crimson'>
            <div
              className='px-6 py-8'
              style={{
                marginTop: 10,
                position: "sticky",
                top: 0,
                height: "100dvh", // full column height
                paddingInlineStart: "1.5rem",
              }}
            >
              <nav className='flex flex-col gap-4 font-bebas'>
                {CATEGORIES.map((cat) => {
                  const isActive = active === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setActive(cat);
                        setLightboxIndex(null);
                      }}
                      className={[
                        "text-left text-xl capitalize tracking-wide transition font-semibold cursor-pointer",
                        isActive
                          ? "text-crimson"
                          : "text-neutral-300 hover:text-neutral-50",
                      ].join(" ")}
                      aria-pressed={isActive}
                      aria-label={`Filter by ${cat}`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </nav>
              <Link
                href='/'
                aria-label='Back to home'
                className='block text-sm font-semibold tracking-wide text-crimson hover:text-neutral-50'
                style={{
                  position: "absolute",
                  left: "1.5rem",
                  right: "1.5rem",
                  bottom: "calc(3rem + env(safe-area-inset-bottom))",
                }}
              >
                ← Back to Home
              </Link>
            </div>
          </aside>

          {/* RIGHT GRID */}
          <section className='flex-1 p-6'>
            <div
              className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4'
              style={{ paddingInlineStart: "1.5rem", marginTop: "1rem" }}
            >
              {visibleImages.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => openLightbox(idx)}
                  className='group relative overflow-hidden ring-1 ring-neutral-800 focus:outline-none focus:ring-2 focus:ring-crimson'
                  aria-label={`Open ${img.alt}`}
                >
                  <div className='relative h-40 w-full sm:h-48 lg:h-52'>
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
                      className='object-cover transition-transform duration-300 group-hover:scale-105'
                      priority={idx < 8}
                      unoptimized
                    />
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* LIGHTBOX */}
      {lightboxOpen && lightboxIndex !== null && (
        <div
          role='dialog'
          aria-modal='true'
          className='fixed inset-0 z-50 bg-black/90'
        >
          <button
            aria-label='Close'
            onClick={closeLightbox}
            className='absolute right-4 top-4 rounded-full bg-neutral-900/70 px-3 py-2 text-sm ring-1 ring-neutral-700 hover:bg-neutral-800 cursor-pointer h-10 w-10'
          >
            X
          </button>

          <button
            aria-label='Previous image'
            onClick={goPrev}
            className='absolute left-8 top-1/2 -translate-y-1/2 rounded-full bg-neutral-900/60 px-3 py-2 text-lg ring-1 ring-neutral-700 hover:bg-neutral-800 cursor-pointer h-10 w-5'
          >
            ‹
          </button>

          <button
            aria-label='Next image'
            onClick={goNext}
            className='absolute right-8 top-1/2 -translate-y-1/2 rounded-full bg-neutral-900/60 px-3 py-2 text-lg ring-1 ring-neutral-700 hover:bg-neutral-800 cursor-pointer h-10 w-5'
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
                src={visibleImages[lightboxIndex].src}
                alt={visibleImages[lightboxIndex].alt}
                fill
                sizes='92vw'
                className='object-contain'
                unoptimized
                priority
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
