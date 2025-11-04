"use client";

// AltarsTextSection.jsx (or .tsx if using TypeScript)
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

export default function PanTextSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const textRef = useRef<HTMLHeadingElement | null>(null);
  const t = useTranslations("StreetArtText");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!sectionRef.current || !textRef.current) return;

    const ctx = gsap.context(() => {
      const fullTextWidth = textRef.current?.scrollWidth ?? 0;
      const startX = fullTextWidth + 100;
      const endX = 0;

      gsap.fromTo(
        textRef.current,
        { x: -startX },
        {
          x: endX,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 100%",
            end: "bottom top",
            scrub: 0.5,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className='relative overflow-x-hidden bg-dia-pattern-2'
    >
      {/* The section is a normal block in page flow; overflow-x-hidden hides horizontal scroll */}
      <h1
        ref={textRef}
        className='whitespace-nowrap text-[clamp(8rem,15vw,16rem)] font-black leading-28 font-bebas text-ink'
      >
        <span className='font-cherish font-light text-marigold'>
          {t("marquee")}{" "}
        </span>
        <span> • {t("marquee")} • </span>
        <span className='font-cherish font-light text-marigold'>
          {t("marquee")}{" "}
        </span>
        <span> • {t("marquee")}</span>
      </h1>
    </section>
  );
}
