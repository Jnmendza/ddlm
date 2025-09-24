"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import imagesLoaded from "imagesloaded";

import Hero from "@/components/Hero";
import AltarsTextSection from "@/components/AltarsTextSection";
import FoodSection from "@/components/FoodSection";
import Clamp from "@/components/Clamp";
import PinnedFlipSlider from "@/components/PinnedFlipSlider";
import dynamic from "next/dynamic";
const GalleryPanSection = dynamic(
  () => import("@/components/GalleryPanSection"),
  { ssr: false }
);

gsap.registerPlugin(ScrollTrigger);

export default function Page() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const loaderTextRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    // ⬇️ Capture stable references (fixes the ESLint ref warning, too)
    const wrapperEl = wrapperRef.current;
    const loaderEl = loaderRef.current;
    const loaderTextEl = loaderTextRef.current;

    let alive = true; // gate all async work after unmount
    let loadedCount = 0;

    // 1) Collect only images inside this page's wrapper
    const images = Array.from(
      wrapperEl.querySelectorAll<HTMLImageElement>("img")
    );
    const total = images.length || 1;

    // imagesLoaded instance (types vary; treat as any to use .on/.off)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const imgLoad: any = imagesLoaded(images as unknown as Element[]);

    // GSAP context auto-kills tweens/triggers when we revert()
    const ctx = gsap.context(() => {}, wrapperEl);

    const onProgress = () => {
      if (!alive || !loaderTextEl) return;
      loadedCount += 1;
      const prog = Math.round((loadedCount * 100) / total);
      loaderTextEl.textContent = `${prog}%`;
    };

    const onAlways = () => {
      if (!alive) return;

      // enable scroll, fade loader (only if node still in DOM)
      document.body.style.overflow = "auto";
      if (loaderEl && loaderEl.isConnected) {
        gsap.to(loaderEl, { autoAlpha: 0, duration: 0.4, ease: "power2.out" });
      }

      // 2) Setup horizontal pans, strictly scoped under wrapperEl
      const sections = Array.from(
        wrapperEl.querySelectorAll<HTMLElement>("section[data-pan]")
      );

      sections.forEach((section, idx) => {
        if (!alive || !section.isConnected) return;
        const w = section.querySelector<HTMLElement>(".pan-wrapper");
        if (!w || !w.isConnected) return;

        const [xStart, xEnd] =
          idx % 2
            ? ["100%", (w.scrollWidth - section.offsetWidth) * -1]
            : [w.scrollWidth * -1, 0];

        // Create tweens inside GSAP context so cleanup is guaranteed
        ctx.add(() => {
          gsap.fromTo(
            w,
            { x: xStart },
            {
              x: xEnd,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                scrub: 0.5,
              },
            }
          );
        });
      });
    };

    imgLoad.on("progress", onProgress);
    imgLoad.on("always", onAlways);

    // ✅ Cleanup runs BEFORE React removes nodes — prevents removeChild
    return () => {
      alive = false;

      // remove listeners safely (ok if underlying lib no-ops)
      try {
        imgLoad.off("progress", onProgress);
        imgLoad.off("always", onAlways);
      } catch {}

      // kill GSAP tied to this subtree only
      ctx.revert(); // kills ScrollTriggers/tweens created in ctx

      // stop any pending loader tween and clear inline styles
      if (loaderEl) {
        gsap.killTweensOf(loaderEl);
        gsap.set(loaderEl, { clearProps: "all" });
      }

      // final reset
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      {/* LOADER */}
      <div ref={loaderRef} className='loader'>
        <div>
          <h1>Loading</h1>
          <h2 ref={loaderTextRef} className='loader--text'>
            0%
          </h2>
        </div>
      </div>

      {/* SITE */}
      <div ref={wrapperRef} className='site-wrapper'>
        {/* HERO */}
        <Hero />

        {/* ALTARS & OFRENDAS (text marquee style like CodePen) */}
        <section className='altar-section bg-crimson' data-pan>
          <AltarsTextSection />
        </section>

        {/* GALLERIES (you can add as many as you like) */}
        <GalleryPanSection count={3} />
        <GalleryPanSection count={4} />
        <GalleryPanSection count={3} />
      </div>
      {/* Footer spacer (just to feel the end) */}
      <FoodSection />
      <Clamp />
      <PinnedFlipSlider
        images={[
          "/altar-ex.jpg",
          "/skull-ex.png",
          "/slides/art-3.jpg",
          "/slides/art-4.jpg",
          "/slides/art-5.jpg",
          "/slides/art-6.jpg",
        ]}
        frameSrc='/golden-frame.png' // transparent center PNG/SVG
        size={720} // inner square; match your frame opening
        imageInsetX={52}
        imageInsetY={142}
        showMarkers={false}
      />
      <footer className='df aic jcc footer-spacer'>
        <p>
          Images from <a href='https://unsplash.com/'>Unsplash</a>
        </p>
      </footer>
    </>
  );
}
