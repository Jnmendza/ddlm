"use client";

import React from "react";
import FilledTabs from "./FilledTabs";
import ImageSlide from "./ImageSlide";
import type { ClipCarouselProps } from "@/types/clip-carousel";
import {
  toRenderUrl,
  defaultImages as fallbackImages,
  RING_W,
  RING_H,
} from "@/utils";

export default function ClipCarousel({
  images = fallbackImages,
  width = 400,
  height = 400,
  className = "",
  initialIndex = 0,
  animateInitial = false,
  tabOffset = 72,
}: ClipCarouselProps) {
  const [expanded, setExpanded] = React.useState<number | null>(null);
  const [animating, setAnimating] = React.useState(false);
  const [focus, setFocus] = React.useState<number | null>(null);
  const [queued, setQueued] = React.useState<number | null>(null);

  // dot geometry
  const circle = 7;
  const gap = 10;

  const getPosX = (i: number) =>
    width / 2 -
    (images.length * (circle * 2 + gap) - gap) / 2 +
    i * (circle * 2 + gap);
  const getPosY = () => height - tabOffset;

  // per-slide control APIs
  const slideAPIs = React.useRef<
    Array<{ expand: () => Promise<void>; collapse: () => Promise<void> } | null>
  >(Array(images.length).fill(null));

  // initial image
  React.useEffect(() => {
    if (!images.length) return;
    const init = async () => {
      if (animateInitial) {
        setAnimating(true);
        setFocus(initialIndex);
        await slideAPIs.current[initialIndex]?.expand();
        setExpanded(initialIndex);
        setFocus(null);
        setAnimating(false);
      } else {
        setExpanded(initialIndex);
      }
    };
    void init();
  }, [images.length, initialIndex, animateInitial]);

  const handleDotClick = (i: number) => {
    if (expanded === i) return;
    if (animating) {
      setQueued(i);
      return;
    }
    void runTransition(i);
  };

  const runTransition = async (target: number) => {
    setAnimating(true);
    setFocus(target);

    const prev = expanded;
    const tasks: Promise<void>[] = [];
    tasks.push(slideAPIs.current[target]?.expand() ?? Promise.resolve());
    if (prev !== null)
      tasks.push(slideAPIs.current[prev]?.collapse() ?? Promise.resolve());
    await Promise.allSettled(tasks);

    setExpanded(target);
    setFocus(null);
    setAnimating(false);

    if (queued !== null && queued !== target) {
      const q = queued;
      setQueued(null);
      queueMicrotask(() => runTransition(q));
    } else {
      setQueued(null);
    }
  };

  const next = () => {
    const n = expanded === null ? initialIndex : (expanded + 1) % images.length;
    handleDotClick(n);
  };

  return (
    <div className={`gcc ${className}`}>
      <div className='container shadow'>
        {/* Slides (big reveal) stay behind tabs */}
        {images.map((imgUrl, i) => (
          <div
            key={`${imgUrl}-${i}`}
            className='slide'
            style={{ zIndex: focus === i ? 9000 : expanded === i ? 8000 : i }}
          >
            <ImageSlide
              id={i}
              total={images.length}
              url={imgUrl}
              width={width}
              height={height}
              circle={circle}
              gap={gap}
              isExpanded={expanded === i}
              registerAPI={(api) => (slideAPIs.current[i] = api)}
            />
          </div>
        ))}

        {/* Filled Tabs: circular thumbnails with selectable border */}
        <FilledTabs
          images={images}
          width={width}
          height={height}
          circle={circle}
          getPosX={getPosX}
          getPosY={getPosY}
          onClick={handleDotClick}
          style={{ zIndex: 10000 }}
          selected={expanded}
        />

        {/* ▶ Next button now INSIDE the container, over the image */}
        <button
          className='button shadow'
          onClick={next}
          aria-label='Next'
          style={{
            right: 12, // pull it in from the image's right edge
            top: "50%",
            transform: "translateY(-50%)", // vertical centering (no x-translate)
            zIndex: 12000, // above tabs & image
          }}
        >
          <svg width='24' height='24' viewBox='0 0 24 24' aria-hidden>
            <path d='M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z' />
          </svg>
        </button>
      </div>
    </div>
  );
}

// (Optional) helper if you want to pass raw Supabase URLs from parents:
export const supabaseToThumbs = (urls: string[]) =>
  urls.map((u) =>
    toRenderUrl(u, RING_W, RING_H, { resize: "cover", quality: 85 })
  );
