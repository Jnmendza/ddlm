// src/components/PanDeMuertoSection.tsx
"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useTranslations } from "next-intl";
import ClipCarousel from "./clip-carousel/ClipCarousel";

gsap.registerPlugin(ScrollTrigger);

export default function LocalsSections() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgAWrapRef = useRef<HTMLDivElement>(null);
  const imgBWrapRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Sections");

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 90%", // start revealing as the section enters
          end: "top 35%", // finish before it's fully in
          scrub: true,
        },
        defaults: { ease: "power2.out" },
      });

      tl.fromTo(
        imgAWrapRef.current,
        { y: "-70vh", opacity: 0 },
        { y: 0, opacity: 1 },
        0
      ).fromTo(
        imgBWrapRef.current,
        { y: "-90vh", opacity: 0 },
        { y: 0, opacity: 1 },
        0.06
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className='bg-dia-pattern relative min-h-[90vh] bg-[--color-ink] overflow-hidden mb-40 md:pb-56'
    >
      {/* Papel picado — final resting positions; we animate the wrappers */}
      <div
        ref={imgAWrapRef}
        className='relative -top-10 left-0 z-30 w-[70vw] max-w-[900px] aspect-[16/5] [will-change:transform]'
      >
        <Image
          src='/picudo-1.png'
          alt='papel picado decoration'
          fill
          priority
          draggable={false}
          sizes='(min-width: 1440px) 70vw, 90vw'
          className='object-contain'
        />
      </div>

      <div
        ref={imgBWrapRef}
        className='absolute -top-10 right-0 z-30 w-[72vw] max-w-[980px] aspect-[16/5] [will-change:transform]'
      >
        <Image
          src='/picudo-2.png'
          alt='papel picado decoration'
          fill
          priority
          draggable={false}
          sizes='(min-width: 1440px) 72vw, 92vw'
          className='object-contain'
        />
      </div>

      {/* Heading block */}
      <div className='relative z-10 w-full flex items-center justify-center py-12'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8 w-full'>
          <div className='flex flex-col sm:flex-row items-center sm:items-start justify-center gap-8'>
            {/* Left: carousel */}
            <div className='w-full max-w-[min(92vw,640px)] flex-shrink-0'>
              <ClipCarousel className='mx-auto' />
            </div>

            {/* Right: text */}
            <div className='w-full text-center sm:text-left max-w-[min(92vw,48rem)]'>
              <h1 className='title-style'>
                <span className='clamp block'>{t("localsPrimary")}</span>
                <span className='yt block'>{t("localsSecondary")}</span>
              </h1>

              <p
                className='mt-4 text-[--color-sand] leading-relaxed
               text-[clamp(1rem,0.6vw+0.9rem,1.35rem)]
               max-w-[70ch] mx-auto sm:mx-0'
              >
                {t("localsDescription")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div aria-hidden className='h-96 md:h-40' />
    </section>
  );
}
