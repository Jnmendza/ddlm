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
  { ssr: false } // <- client-only, no SSR HTML to mismatch
);

gsap.registerPlugin(ScrollTrigger);

export default function Page() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const loaderTextRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    // 1) Gather images (plain <img> so imagesLoaded can detect)
    const images = Array.from(wrapperRef.current.querySelectorAll("img"));

    const imgLoad = imagesLoaded(images);
    let loadedCount = 0;
    const updateProgress = () => {
      if (!loaderTextRef.current) return;
      const prog = Math.round((loadedCount * 100) / (images.length || 1));
      loaderTextRef.current.textContent = `${prog}%`;
    };

    imgLoad.on("progress", () => {
      loadedCount += 1;
      updateProgress();
    });
    imgLoad.on("always", () => {
      // 2) Enable scroll, fade out loader
      document.body.style.overflow = "auto";
      document.scrollingElement?.scrollTo(0, 0);

      if (loaderRef.current) {
        gsap.to(loaderRef.current, {
          autoAlpha: 0,
          duration: 0.4,
          ease: "power2.out",
        });
      }

      // 3) Apply horizontal pan to each pan section
      const sections = gsap.utils.toArray<HTMLElement>("section[data-pan]");
      sections.forEach((section, idx) => {
        const w = section.querySelector<HTMLElement>(".pan-wrapper");
        if (!w) return;

        const [xStart, xEnd] =
          idx % 2
            ? ["100%", (w.scrollWidth - section.offsetWidth) * -1]
            : [w.scrollWidth * -1, 0];

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

    // Cleanup on route change
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
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
