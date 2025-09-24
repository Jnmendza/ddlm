/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  count: number;
  direction?: "ltr" | "rtl"; // optional single-direction; default ltr
};

// deterministic or random — since this file mounts client-only via dynamic(..., { ssr:false }),
// you can keep random if you want.
const urlFor = (i: number) =>
  `https://source.unsplash.com/random/1240x874?sig=${i + 1}`;

export default function GalleryPanSection({ count, direction = "ltr" }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // avoid double-initting if parent code ever targets [data-pan]
    if ((section as any).dataset.panInit === "1") return;
    (section as any).dataset.panInit = "1";

    const ctx = gsap.context(() => {
      const wrapper = section.querySelector<HTMLElement>(".pan-wrapper");
      if (!wrapper) return;

      // wait for images in THIS section so widths are correct
      const waitForImages = () =>
        new Promise<void>((resolve) => {
          const imgs = Array.from(
            section.querySelectorAll<HTMLImageElement>("img")
          );
          if (imgs.length === 0) return resolve();
          let left = imgs.length;
          const done = () => (--left <= 0 ? resolve() : undefined);
          imgs.forEach((img) => {
            if (img.complete) return done();
            img.addEventListener("load", done, { once: true });
            img.addEventListener("error", done, { once: true });
          });
        });

      waitForImages().then(() => {
        const overflow = Math.max(0, wrapper.scrollWidth - section.clientWidth);
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
              trigger: section,
              start: "top bottom", // begin when section enters viewport
              end: "bottom top", // end when it leaves
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );

        // ensure global measurements catch up after mount/layout
        requestAnimationFrame(() => ScrollTrigger.refresh());
      });
    }, section);

    return () => ctx.revert();
  }, [direction]);

  return (
    <section ref={sectionRef} className='section-pan bg-crimson' data-pan>
      <ul className='pan-wrapper image-row'>
        {Array.from({ length: count }).map((_, i) => (
          <li key={i}>
            <Image
              className='demo-img'
              src={urlFor(i)}
              width={1240}
              height={874}
              alt=''
              unoptimized
              priority={i < 2}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
