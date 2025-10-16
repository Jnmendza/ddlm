// src/components/PanDeMuertoSection.tsx
"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import ThreeDRing from "./ThreeDRing";

gsap.registerPlugin(ScrollTrigger);

export default function PanDeMuertoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgAWrapRef = useRef<HTMLDivElement>(null);
  const imgBWrapRef = useRef<HTMLDivElement>(null);

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
          alt=''
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
          alt=''
          fill
          priority
          draggable={false}
          sizes='(min-width: 1440px) 72vw, 92vw'
          className='object-contain'
        />
      </div>

      <h1>
        <span className='clamp'>Art &amp; Street Scene</span>
        <span className='yt'>Art Y Street Scene</span>
      </h1>

      {/* Heading block */}
      <div className='relative z-10 w-full'>
        <div className='w-full flex justify-center'>
          <ThreeDRing
            width={620}
            height={540}
            images={[
              "https://picsum.photos/id/32/600/400",
              "https://picsum.photos/id/33/600/400",
              "https://picsum.photos/id/34/600/400",
              "https://picsum.photos/id/35/600/400",
              "https://picsum.photos/id/36/600/400",
              "https://picsum.photos/id/37/600/400",
              "https://picsum.photos/id/38/600/400",
              "https://picsum.photos/id/39/600/400",
              "https://picsum.photos/id/40/600/400",
              "https://picsum.photos/id/41/600/400",
            ]}
          />
        </div>
      </div>
      <div aria-hidden className='h-24 md:h-40' />
      <style jsx>
        {`
          h1 {
            position: relative;
            font-size: var(--step-5);
            text-transform: uppercase;
            text-align: center;
            line-height: 1.05;
          }
        `}
      </style>
    </section>
  );
}
