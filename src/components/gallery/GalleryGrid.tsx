"use client";

import Image from "next/image";
import type { ApiImage } from "@/types/api";
import type { Translate } from "./types";

type GalleryGridProps = {
  images: ApiImage[];
  isLoading: boolean;
  onOpenImage: (index: number) => void;
  t: Translate;
};

export function GalleryGrid({
  images,
  isLoading,
  onOpenImage,
  t,
}: GalleryGridProps) {
  return (
    <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4'>
      {isLoading
        ? Array.from({ length: 18 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className='relative h-40 w-full sm:h-48 lg:h-52 rounded bg-neutral-800/60 animate-pulse'
            />
          ))
        : images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => onOpenImage(idx)}
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
  );
}
