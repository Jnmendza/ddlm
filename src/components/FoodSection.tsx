// src/components/PanDeMuertoSection.tsx
"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

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
      className='bg-dia-pattern relative min-h-[90vh] bg-[--color-ink] overflow-hidden'
    >
      {/* Papel picado — final resting positions; we animate the wrappers */}
      <div
        ref={imgAWrapRef}
        className='absolute -top-8 left-0 w-[70vw] max-w-[900px] aspect-[16/5] [will-change:transform]'
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
        className='absolute -top-10 right-0 w-[72vw] max-w-[980px] aspect-[16/5] [will-change:transform]'
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

      {/* Heading block */}
      <div className='relative z-10 max-w-5xl px-6 pt-40'>
        <h2 className='font-bebas text-5xl md:text-7xl text-white'>PAN DE</h2>
        <h2 className='font-bebas text-5xl md:text-7xl text-white'>
          MUERTO &amp;
        </h2>
        <h2 className='font-bebas text-5xl md:text-7xl text-white'>FOOD</h2>
      </div>
    </section>
  );
}
