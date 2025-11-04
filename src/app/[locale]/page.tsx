"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import imagesLoaded from "imagesloaded";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTranslations } from "next-intl";

import AltarsTextSection from "@/components/PanTextSection";
import Clamp from "@/components/Clamp";
import Hero from "@/components/Hero";
import PinnedFlipSlider from "@/components/PinnedFlipSlider";
import { killScrollAnimations } from "@/lib/scroll/cleanup";
import { GALLERY_CEMETERIES } from "@/lib/data/constants";
import LocalsSections from "@/components/LocalsSections";

const GalleryPanSection = dynamic(
  () => import("@/components/GalleryPanSection"),
  { ssr: false } // <- client-only, no SSR HTML to mismatch
);

gsap.registerPlugin(ScrollTrigger);

export default function Page() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const loaderTextRef = useRef<HTMLHeadingElement>(null);
  const t = useTranslations("Home");

  useEffect(() => {
    if (!wrapperRef.current) return;

    const loaderEl = loaderRef.current;
    const wrapperEl = wrapperRef.current;
    const previousOverflow = document.body.style.overflow;
    const createdTriggers: ScrollTrigger[] = [];
    const createdTweens: gsap.core.Tween[] = [];
    let loaderTween: gsap.core.Tween | null = null;
    let cancelled = false;

    const images = Array.from(wrapperRef.current.querySelectorAll("img"));
    const imgLoad = imagesLoaded(images);

    let loadedCount = 0;
    const updateProgress = () => {
      if (!loaderTextRef.current) return;
      const prog = Math.round((loadedCount * 100) / (images.length || 1));
      loaderTextRef.current.textContent = `${prog}%`;
    };

    const handleProgress = () => {
      if (cancelled) return;
      loadedCount += 1;
      updateProgress();
    };

    const handleAlways = () => {
      if (cancelled) return;

      document.body.style.overflow = "auto";
      document.scrollingElement?.scrollTo(0, 0);

      if (loaderEl) {
        loaderTween = gsap.to(loaderEl, {
          autoAlpha: 0,
          duration: 0.4,
          ease: "power2.out",
        });
      }

      const sections = gsap.utils.toArray<HTMLElement>("section[data-pan]");
      sections.forEach((section, idx) => {
        const w = section.querySelector<HTMLElement>(".pan-wrapper");
        if (!w) return;

        const [xStart, xEnd] =
          idx % 2
            ? ["100%", (w.scrollWidth - section.offsetWidth) * -1]
            : [w.scrollWidth * -1, 0];

        const tween = gsap.fromTo(
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

        if (tween.scrollTrigger) {
          createdTriggers.push(tween.scrollTrigger);
        }
        createdTweens.push(tween);
      });
    };

    imgLoad.on("progress", handleProgress);
    imgLoad.on("always", handleAlways);

    return () => {
      cancelled = true;
      imgLoad.off?.("progress", handleProgress);
      imgLoad.off?.("always", handleAlways);
      (imgLoad as unknown as { destroy?: () => void }).destroy?.();
      createdTriggers.forEach((trigger) => {
        try {
          trigger.kill(true);
        } catch {
          /* ignore */
        }
      });
      loaderTween?.kill();
      createdTweens.forEach((tween) => tween.kill());
      if (loaderEl) {
        gsap.killTweensOf(loaderEl);
      }
      if (wrapperEl) {
        gsap.killTweensOf(wrapperEl);
      }
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <>
      {/* LOADER */}
      <div ref={loaderRef} className='loader'>
        <div>
          <h1>{t("loaderTitle")}</h1>
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
        <GalleryPanSection
          start={1}
          end={5}
          cardHeight={480}
          variableWidth
          resizeMode='inside'
        />
        <GalleryPanSection
          start={6}
          end={8}
          cardHeight={480}
          variableWidth
          resizeMode='inside'
        />
        <GalleryPanSection
          start={9}
          end={13}
          cardHeight={480}
          variableWidth
          resizeMode='inside'
        />
      </div>
      <LocalsSections />
      <Clamp />
      <PinnedFlipSlider
        images={[
          `${GALLERY_CEMETERIES}Cemetery3.jpg`,
          `${GALLERY_CEMETERIES}Cemetery2.jpg`,
          `${GALLERY_CEMETERIES}Cemetery8.jpg`,
          `${GALLERY_CEMETERIES}Cemetery9.jpg`,
        ]}
        frameSrc='/golden-frame.png' // transparent center PNG/SVG
        size={720} // inner square; match your frame opening
        imageInsetX={52}
        imageInsetY={142}
        showMarkers={false}
      />
      <footer className='df aic jcc footer-spacer'>
        <p>
          {t("footerIntro")}{" "}
          <Link href='/gallery' prefetch={false} onClick={killScrollAnimations}>
            {t("footerLink")}
          </Link>
        </p>
      </footer>
    </>
  );
}
