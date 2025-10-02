// app/(landing)/sections/LandingHero.tsx
"use client";
import Image from "next/image";
import BackgroundVideo from "next-video/background-video";
import heroVideo from "../../videos/hero_muertos.mp4";
import { LANDING_IMAGES_URL } from "@/lib/data/constants";

export default function LandingHero() {
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
          <a href='#' className='hover:text-white transition-colors'>
            EN
          </a>
          <span>|</span>
          <a href='#' className='hover:text-white transition-colors'>
            ESP
          </a>
          <span className='mx-2' />
          <a href='/gallery' className='no-underline cursor-pointer'>
            <span className='text-marigold hover:opacity-90'>GALLERY</span>
          </a>
        </div>

        {/* Doily image + centered text */}
        <div className='absolute bottom-[180px] -right-20 h-80 w-80 pointer-events-none'>
          <Image
            src={`${LANDING_IMAGES_URL}ylw-pattern.png`}
            alt=''
            fill
            priority
            className='object-contain drop-shadow-[0_10px_40px_rgba(0,0,0,0.45)]'
          />
          <div className='absolute inset-0 grid place-items-center font-bona'>
            <div className='select-none text-center leading-tight text-black text-4xl'>
              <div className='font-semibold tracking-wide'>Oaxaca</div>
              <div className='font-semibold tracking-wide'>City</div>
              <div className='mt-1'>2023</div>
            </div>
          </div>
        </div>

        <div className='absolute -bottom-5 -right-5'>
          <Image
            src={`${LANDING_IMAGES_URL}crim-flower.png`}
            alt=''
            width={120}
            height={120}
          />
        </div>
        <div className='absolute -bottom-5 -left-5'>
          <Image
            src={`${LANDING_IMAGES_URL}indigo-flower.png`}
            alt=''
            width={120}
            height={120}
          />
        </div>
      </aside>
      {/* LEFT/MID OVERLAY — exact figma coords */}
      <div
        className='
          absolute inset-y-0 left-0 right-[33.333%] z-20   /* CHANGED: was inset-0 */
        '
      >
        {/* top flourish */}
        <div className='absolute -top-3 -left-1 select-none'>
          <Image
            src={`${LANDING_IMAGES_URL}2flowers.png`}
            alt=''
            width={140}
            height={140}
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
              Dia de los Muertos
            </h1>
            {/* FRONT COPY */}
            <h1
              className='
                relative z-10 whitespace-nowrap text-[96px] leading-[0.9]
                font-black text-white
              '
            >
              Dia de los Muertos
            </h1>
          </div>
        </div>

        {/* Tagline at (81,340) */}
        <p className='absolute left-[81px] top-[200px] text-[42px] font-cherish text-amber-400/90'>
          Oaxaca Through My Lens
        </p>

        {/* Subhead at (88,500) */}
        <h3 className='absolute left-[88px] top-[460px] max-w-[360px] text-sm font-bold uppercase tracking-widest text-crimson'>
          A visual journey into the heart of Día de los Muertos 2023 💀 — where
          tradition, <span className='text-marigold'>color,</span> and memory
          collide
        </h3>

        {/* Body at (88,550) */}
        <p className='absolute left-[88px] top-[550px] max-w-[360px] text-sm leading-6 text-neutral-300'>
          Captured on the streets of Oaxaca, these photos celebrate life, honor
          the departed, and showcase one of Mexico’s most vibrant cultural
          traditions.
        </p>

        <div className='absolute left-[81px] top-[656px] flex items-center gap-3 text-xs uppercase tracking-widest text-marigold'>
          <span
            aria-hidden
            className='inline-block text-2xl leading-none motion-safe:animate-bounce translate-y-px'
          >
            ↓
          </span>
          <span>Scroll</span>
        </div>
      </div>
      {/* FULL-WIDTH DOTTED BASELINE — responsive, behind the thirds */}
      <div className='pointer-events-none absolute inset-x-0 bottom-8 z-0 h-0 border-b-4 border-dotted border-crimson' />
    </section>
  );
}
