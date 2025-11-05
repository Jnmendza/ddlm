// components/GalleryPanSection.tsx
"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { GALLERY_STREETART } from "@/lib/data/constants";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  start?: number;
  end?: number;
  count?: number;
  direction?: "ltr" | "rtl";
  /** Portrait card height in px (visual size on page). */
  cardHeight?: number; // e.g., 420
  /** Portrait ratio as width/height. 0.75 = 3:4, 0.8 = 4:5, 0.5625 = 9:16 */
  aspect?: number; // default 3/4
  /**
   * Resize mode for Supabase image transformer.
   * - cover: crop to fill frame
   * - contain/inside: keep whole image visible
   */
  resizeMode?: "cover" | "contain" | "fill" | "inside" | "outside";
  /** Allow the frame width to grow with the intrinsic image ratio */
  variableWidth?: boolean;
};

const toRenderBase = (base: string) =>
  base.replace("/object/public/", "/render/image/public/");

export default function GalleryPanSection({
  start,
  end,
  count,
  direction = "ltr",
  cardHeight = 420, // tall but not extreme
  aspect = 3 / 4, // 3:4 portrait (less aggressive than 9:16)
  resizeMode = "inside",
  variableWidth = false,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  const indices = useMemo(() => {
    if (typeof start === "number" && typeof end === "number" && end >= start) {
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }
    const c = typeof count === "number" ? count : 0;
    return Array.from({ length: c }, (_, i) => i + 1);
  }, [start, end, count]);

  // Frame dimensions (CSS box on the page)
  const BOX_H = Math.max(220, Math.round(cardHeight));
  const BOX_W = Math.round(BOX_H * aspect);

  // Request size from Supabase CDN (2x for HiDPI)
  const REQ_W = BOX_W * 2;
  const REQ_H = BOX_H * 2;
  const QUALITY = 72;

  const srcFor = (n: number) => {
    if (variableWidth) {
      // Raw asset keeps original proportions when we only constrain height in CSS
      return `${GALLERY_STREETART}StreetArt${n}.jpg`;
    }
    const params = new URLSearchParams();
    params.set("width", String(REQ_W));
    params.set("height", String(REQ_H));
    params.set("resize", resizeMode);
    params.set("quality", String(QUALITY));
    return `${toRenderBase(
      GALLERY_STREETART
    )}StreetArt${n}.jpg?${params.toString()}`;
  };

  const fitClass =
    resizeMode === "cover" || resizeMode === "fill"
      ? "object-cover object-top"
      : "object-contain object-center";

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (section.dataset.panInit === "1") return;
    section.dataset.panInit = "1";

    const ctx = gsap.context(() => {
      const wrapper = section.querySelector<HTMLElement>(".pan-wrapper");
      if (!wrapper) return;

      const waitForImages = () =>
        new Promise<void>((resolve) => {
          const imgs = Array.from(
            section.querySelectorAll<HTMLImageElement>("img")
          );
          if (!imgs.length) return resolve();
          let left = imgs.length;
          const done = () => {
            if (--left <= 0) resolve();
          };
          imgs.forEach((img) => {
            if (img.complete) return done();
            if (typeof img.decode === "function") {
              img.decode().then(done).catch(done);
            } else {
              img.addEventListener("load", done, { once: true });
              img.addEventListener("error", done, { once: true });
            }
          });
          setTimeout(resolve, 1500); // safety
        });

      waitForImages().then(() => {
        const sectionEl = section;
        const overflow = Math.max(
          0,
          wrapper.scrollWidth - sectionEl.clientWidth
        );
        if (overflow <= 0) {
          ScrollTrigger.refresh();
          return;
        }
        const fromX = direction === "rtl" ? -overflow : 0;
        const toX = direction === "rtl" ? 0 : -overflow;

        gsap.fromTo(
          wrapper,
          { x: fromX },
          {
            x: toX,
            ease: "none",
            scrollTrigger: {
              trigger: sectionEl,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );

        requestAnimationFrame(() => ScrollTrigger.refresh());
      });
    }, section);

    return () => ctx.revert();
  }, [direction]);

  return (
    <section ref={sectionRef} className='section-pan bg-dia-pattern-2' data-pan>
      <ul className='pan-wrapper image-row flex gap-3'>
        {indices.map((n, idx) => (
          <li
            key={`street-${n}`}
            className='relative overflow-hidden rounded-md bg-neutral-900/30'
            style={
              variableWidth
                ? { height: BOX_H, width: "auto", flex: "0 0 auto" }
                : { height: BOX_H, aspectRatio: String(aspect) }
            }
          >
            {variableWidth ? (
              <Image
                src={srcFor(n)}
                alt={`Street Art ${n}`}
                width={REQ_W}
                height={REQ_H}
                className='object-contain object-center'
                unoptimized // using Supabase transformer
                priority={idx < 2}
                loading={idx < 2 ? "eager" : "lazy"}
                style={{
                  height: "100%",
                  width: "auto",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            ) : (
              <Image
                src={srcFor(n)}
                alt={`Street Art ${n}`}
                fill
                className={fitClass}
                unoptimized // using Supabase transformer
                priority={idx < 2}
                sizes={`${BOX_W}px`}
              />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
