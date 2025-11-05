// app/(landing)/sections/LandingHero.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import BackgroundVideo from "next-video/background-video";

import LocaleSwitcher from "@/components/LocaleSwitcher";
import { LANDING_IMAGES_URL } from "@/lib/data/constants";
import { killScrollAnimations } from "@/lib/scroll/cleanup";
import heroVideo from "../../videos/hero_muertos.mp4";

export default function LandingHero() {
  const t = useTranslations("Hero");
  const subhead = t.rich("subhead", {
    highlight: (chunks) => <span className='text-marigold'>{chunks}</span>,
  });

  return (
    <section
      className='
        relative isolate mx-auto h-[100vh] w-full max-w-full
        grid grid-cols-3 bg-dia-pattern text-white overflow-hidden
      '
    >
      {/* MIDDLE THIRD — full-height image */}
      <div className='relative z-10 col-start-2 col-end-3 h-full overflow-hidden video-cover-middle'>
        <BackgroundVideo src={heroVideo} />
      </div>
      {/* RIGHT THIRD — nav + badge */}
      <aside className='relative z-10 col-start-3 col-end-4 h-full px-8 py-8'>
        {/* NAV — pin top-right, above overlay */}
        <div
          className='
            absolute top-10 right-8 z-[100]
            pointer-events-auto
            flex items-center gap-3 text-xs tracking-widest text-crimson
          '
        >
          <LocaleSwitcher className='flex items-center gap-2' />
          <span className='mx-2' />
          <Link
            href='/gallery'
            className='no-underline cursor-pointer'
            prefetch={false}
            onClick={killScrollAnimations}
          >
            <span className='text-marigold transition-opacity hover:opacity-90'>
              {t("galleryLink")}
            </span>
          </Link>
        </div>

        {/* Doily image + text centered within right column */}
        <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
          <div className='flex w-80 flex-col items-center font-bona'>
            <div className='relative h-80 w-80'>
              <Image
                src={`${LANDING_IMAGES_URL}sugaSkull.png`}
                alt=''
                fill
                priority
                sizes='80px'
                className='object-contain drop-shadow-[0_10px_40px_rgba(0,0,0,0.45)]'
              />
            </div>
            <div className='mt-6 select-none text-center text-4xl leading-tight text-white'>
              <div className='font-semibold tracking-wide text-shadow-lg/30'>
                {t("badge.line1")}
              </div>
              <div className='font-semibold tracking-wide'>
                {t("badge.line2")}
              </div>
              <div className='mt-1'>{t("badge.line3")}</div>
            </div>
          </div>
        </div>

        <div className='absolute -bottom-5 -right-5'>
          <Image
            src={`${LANDING_IMAGES_URL}crim-flower.png`}
            alt=''
            width={120}
            height={120}
            sizes='120px'
            style={{ width: "auto", height: "auto" }}
          />
        </div>
        <div className='absolute -bottom-5 -left-5'>
          <Image
            src={`${LANDING_IMAGES_URL}indigo-flower.png`}
            alt=''
            width={120}
            height={120}
            sizes='120px'
            style={{ width: "auto", height: "auto" }}
          />
        </div>
      </aside>
      {/* LEFT/MID OVERLAY — exact figma coords */}
      <div
        className='
          absolute inset-y-0 left-0 right-[33.333%] z-20
        '
      >
        {/* top flourish */}
        <div className='absolute -top-3 -left-1 select-none'>
          <Image
            src={`${LANDING_IMAGES_URL}2flowers.png`}
            alt=''
            width={140}
            height={140}
            sizes='140px'
            style={{ width: "auto", height: "auto" }}
          />
        </div>

        {/* H1 at (81,223), stops before col 3 */}
        <div className='absolute left-[81px] top-[123px] right-[33.333%]'>
          <div className='relative inline-block font-sancreek'>
            {/* BACK COPY (solid shadow) */}
            <h1
              aria-hidden='true'
              className='
                absolute inset-0 translate-x-[6px] translate-y-[6px]
                whitespace-nowrap text-[96px] leading-[0.9]
                font-crimson text-crimson z-0 select-none
              '
            >
              {t("title")}
            </h1>
            {/* FRONT COPY */}
            <h1
              className='
                relative z-10 whitespace-nowrap text-[96px] leading-[0.9]
                font-black text-white
              '
            >
              {t("title")}
            </h1>
          </div>
        </div>

        {/* Tagline at (81,340) */}
        <p className='absolute left-[81px] top-[200px] text-[42px] font-cherish text-amber-400/90'>
          {t("tagline")}
        </p>

        {/* Subhead at (88,500) */}
        <h3 className='absolute left-[88px] top-[460px] max-w-[360px] text-sm font-bold uppercase tracking-widest text-crimson'>
          {subhead}
        </h3>

        {/* Body at (88,550) */}
        <p className='absolute left-[88px] top-[550px] max-w-[360px] text-sm leading-6 text-neutral-300'>
          {t("body")}
        </p>

        <div className='absolute left-[81px] top-[656px] flex items-center gap-3 text-xs uppercase tracking-widest text-marigold'>
          <span
            aria-hidden
            className='inline-block text-2xl leading-none motion-safe:animate-bounce translate-y-px'
          >
            ↓
          </span>
          <span>{t("scroll")}</span>
        </div>
      </div>
      {/* FULL-WIDTH DOTTED BASELINE — responsive, behind the thirds */}
      <div className='pointer-events-none absolute inset-x-0 bottom-8 z-0 h-0 border-b-4 border-dotted border-crimson' />
    </section>
  );
}
