/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  images: string[]; // full image URLs or /public paths
  frameSrc?: string; // optional PNG/SVG with transparent center
  imageInset?: number;
  imageInsetX: number;
  imageInsetY: number;
  size?: number; // inner square size of the slider (px)
  showMarkers?: boolean;
};

export default function PinnedFlipSlider({
  images,
  frameSrc = "",
  size = 600,
  imageInset = 0,
  imageInsetX,
  imageInsetY,
  showMarkers = false,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Sections");

  useEffect(() => {
    if (!sliderRef.current) return;

    let timeline: gsap.core.Timeline | null = null;
    let trigger: ScrollTrigger | undefined;

    const ctx = gsap.context(() => {
      const slides = gsap.utils.toArray<HTMLElement>(".pf-slide");
      const delay = 0.5;

      gsap.set(slides, {
        rotationX: (i: number) => (i ? -90 : 0),
        transformOrigin: "center center -150px",
        backfaceVisibility: "hidden",
      });

      const tl = gsap.timeline({
        defaults: {
          ease: "power1.inOut",
          transformOrigin: "center center -150px",
        },
        scrollTrigger: {
          trigger: wrapperRef.current!,
          start: "top top",
          end: "+=" + (slides.length - 1) * 50 + "%", // 50% per transition
          pin: true,
          scrub: true,
          markers: showMarkers,
        },
      });

      timeline = tl;
      trigger = tl.scrollTrigger ?? undefined;

      slides.forEach((slide, i) => {
        const next = slides[i + 1];
        if (!next) return;
        tl.to(
          slide,
          {
            rotationX: 90,
            onComplete: () => {
              gsap.set(slide, { rotationX: -90 });
            },
          },
          "+=" + delay
        ).to(
          next,
          {
            rotationX: 0,
          },
          "<"
        );
      });

      // keep last slide visible briefly to smooth the end
      tl.to({}, { duration: delay });
    }, sliderRef);

    return () => {
      try {
        trigger?.kill(true);
      } catch {
        /* ignore */
      }
      timeline?.kill();
      ctx.revert();
    };
  }, [showMarkers]);

  return (
    <>
      <div className='pf-spacer' />
      <section ref={wrapperRef} className='pf-wrapper bg-dia-pattern'>
        <h1>
          <span className='clamp'>{t("artPrimary")}</span>
          <span className='yt'>{t("artSecondary")}</span>
        </h1>

        <div
          className='pf-stage'
          style={{
            width: size,
            height: size,
            ["--img-inset-x" as any]: `${imageInsetX ?? imageInset}px`,
            ["--img-inset-y" as any]: `${imageInsetY ?? imageInset}px`,
          }}
        >
          {/* Slides container (under the frame) */}
          <div ref={sliderRef} className='pf-slider'>
            {images.map((src, i) => (
              <div key={i} className='pf-slide'>
                <Image
                  src={src}
                  alt=''
                  fill
                  sizes={`${size}px`}
                  priority={i === 0}
                  style={{ objectFit: "cover" }}
                />
              </div>
            ))}
          </div>

          {/* Optional decorative frame overlay */}
          {frameSrc ? (
            <div className='pf-frame'>
              <Image
                src={frameSrc}
                alt=''
                fill
                sizes={`${size}px`}
                priority
                style={{ objectFit: "contain" }}
              />
            </div>
          ) : (
            <div className='pf-outline' />
          )}
        </div>
      </section>

      <style jsx>{`
        h1 {
          position: relative;
          font-size: var(--step-5);
          text-transform: uppercase;
          text-align: center;
          line-height: 1.05;
        }

        .pf-spacer {
          height: 50vh;
        }
        .pf-wrapper {
          width: 100%;
          height: 100vh;
          display: grid;
          place-items: center;
          position: relative;
          padding: 1rem;
        }
        .pf-title {
          position: absolute;
          top: clamp(1rem, 6vh, 3rem);
          text-align: center;
          font-size: clamp(2rem, 6vw, 5rem);
          font-weight: 700;
          letter-spacing: 0.02em;
          color: #fff;
          text-transform: uppercase;
          text-shadow: 0 2px 2px rgba(0, 0, 0, 0.35),
            0 0 18px rgba(255, 42, 127, 0.35);
          pointer-events: none;
        }
        .pf-stage {
          position: relative;
          perspective: 500px;
          margin-top: -60px;
        }
        .pf-slider {
          position: absolute;
          inset: var(--img-inset-y, 0) var(--img-inset-x, 0);
        }
        .pf-slide {
          position: absolute;
          inset: var(--img-inset, 0);
          will-change: transform;
          backface-visibility: hidden;
          transform-style: preserve-3d;
          overflow: hidden;
          border-radius: 10px;
        }
        /* fallback outline if no frame asset provided */
        .pf-outline {
          position: absolute;
          inset: -1rem;
          border-radius: 14px;
          outline: 1.5px dashed rgba(255, 255, 255, 0.4);
          pointer-events: none;
        }
        /* frame overlay sits on top, lets the slide show through center */
        .pf-frame {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
      `}</style>
    </>
  );
}
