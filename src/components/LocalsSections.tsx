// src/components/PanDeMuertoSection.tsx
"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useTranslations } from "next-intl";
import ThreeDRing from "./ThreeDRing";

gsap.registerPlugin(ScrollTrigger);

const toRenderUrl = (
  url: string,
  width: number,
  height: number,
  opts: {
    resize?: "cover" | "contain" | "fill";
    quality?: number;
    format?: "origin";
  } = {}
) => {
  const u = new URL(url);
  const key = u.pathname.replace("/storage/v1/object/public/", "");
  const base = `${u.origin}/storage/v1/render/image/public/${key}`;
  const params = new URLSearchParams({
    width: String(width),
    height: String(height),
    resize: opts.resize ?? "cover",
    quality: String(opts.quality ?? 85),
  });
  if (opts.format) params.set("format", opts.format);
  return `${base}?${params.toString()}`;
};

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

  // INSIDE the component, right before the return:
  const ringW = 620;
  const ringH = 540;

  const ringImages = [
    "https://nargtjqnjvwljfhrzvmk.supabase.co/storage/v1/object/public/images/gallery/People/People1.jpg",
    "https://nargtjqnjvwljfhrzvmk.supabase.co/storage/v1/object/public/images/gallery/People/People2.jpg",
    "https://nargtjqnjvwljfhrzvmk.supabase.co/storage/v1/object/public/images/gallery/People/People3.jpg",
    "https://nargtjqnjvwljfhrzvmk.supabase.co/storage/v1/object/public/images/gallery/People/People4.jpg",
    "https://nargtjqnjvwljfhrzvmk.supabase.co/storage/v1/object/public/images/gallery/People/People5.jpg",
    "https://nargtjqnjvwljfhrzvmk.supabase.co/storage/v1/object/public/images/gallery/People/People6.jpg",
    "https://nargtjqnjvwljfhrzvmk.supabase.co/storage/v1/object/public/images/gallery/People/People7.jpg",
    "https://nargtjqnjvwljfhrzvmk.supabase.co/storage/v1/object/public/images/gallery/People/People8.jpg",
    "https://nargtjqnjvwljfhrzvmk.supabase.co/storage/v1/object/public/images/gallery/People/People9.jpg",
    "https://nargtjqnjvwljfhrzvmk.supabase.co/storage/v1/object/public/images/gallery/People/People10.jpg",
  ].map((u) => toRenderUrl(u, ringW, ringH, { resize: "cover", quality: 85 }));

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

      <h1 className='title-style'>
        <span className='clamp'>{t("localsPrimary")}</span>
        <span className='yt'>{t("localsSecondary")}</span>
      </h1>

      {/* Heading block */}
      <div className='relative z-10 w-full'>
        <div className='w-full flex justify-center'>
          <ThreeDRing width={620} height={600} images={ringImages} />
        </div>
      </div>

      <div aria-hidden className='h-48 md:h-40' />
    </section>
  );
}
