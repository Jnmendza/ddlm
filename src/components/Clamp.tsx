"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import Image from "next/image";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

const images = [
  {
    url: "https://nargtjqnjvwljfhrzvmk.supabase.co/storage/v1/render/image/public/images/gallery/Altars/Altars1.jpg",
    dataSpeed: "clamp(2.4)",
  },
  {
    url: "https://nargtjqnjvwljfhrzvmk.supabase.co/storage/v1/render/image/public/images/gallery/Altars/Altars2.jpg",
    dataSpeed: "clamp(1.8)",
  },
  {
    url: "https://nargtjqnjvwljfhrzvmk.supabase.co/storage/v1/render/image/public/images/gallery/Altars/Altars3.jpg",
    dataSpeed: "clamp(2.2)",
  },
  {
    url: "https://nargtjqnjvwljfhrzvmk.supabase.co/storage/v1/render/image/public/images/gallery/Altars/Altars4.jpg",
    dataSpeed: "clamp(1.5)",
  },
];

export default function ComparsasParades() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Sections");

  useEffect(() => {
    // ---- Lenis smooth scroll ----
    let rafId: number;
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });

    const raf = (time: number) => {
      lenis.raf(time);
      ScrollTrigger.update();
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // keep ScrollTrigger in sync with Lenis
    lenis.on("scroll", ScrollTrigger.update);

    // ---- SVG path "draw" without DrawSVGPlugin ----
    const ctx = gsap.context(() => {
      const path = svgRef.current?.querySelector<SVGPathElement>(".draw");
      if (path) {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        ScrollTrigger.create({
          trigger: ".heading",
          start: "clamp(top center)",
          end: "bottom center",
          scrub: true,
          pin: ".pin",
          pinSpacing: false,
          // markers: true, // uncomment for debugging
          onUpdate: (self) => {
            const progress = self.progress;
            gsap.to(path, {
              strokeDashoffset: (1 - progress) * length,
              overwrite: "auto",
            });
          },
        });
      }

      // ---- image parallax using data-speed ----
      const imgs = gsap.utils.toArray<HTMLImageElement>(".images img");
      imgs.forEach((img) => {
        const spdAttr = img.getAttribute("data-speed") || "1";
        // "clamp(x)" strings come in from the CodePen; pull the numeric part if present
        const speed = Number(spdAttr.replace(/[^\d.]/g, "")) || 1;
        const yAmount = 40 * (speed - 1); // tune parallax intensity

        gsap.fromTo(
          img,
          { yPercent: -yAmount },
          {
            yPercent: yAmount,
            ease: "none",
            scrollTrigger: {
              trigger: img,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    }, contentRef);

    return () => {
      ctx.revert();
      cancelAnimationFrame(rafId);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
    };
  }, []);

  return (
    <div id='smooth-wrapper' className='bg-dia-pattern-black' ref={wrapperRef}>
      <div id='smooth-content' ref={contentRef}>
        <section className='hero pad-l bg-dia-pattern-black'>
          <div className='heading'>
            <div className='pin'>
              <h1>
                <span className='clamp '>{t("altarsPrimary")}</span>
                <span className='yt'>{t("altarsSecondary")}</span>
              </h1>
            </div>
          </div>

          <div className='images'>
            {images.map((image, idx) => (
              <Image
                key={`${image.url}-${idx}`}
                data-speed={image.dataSpeed}
                src={image.url}
                alt={`image-of-altar${idx + 1}`}
                width={400}
                height={600}
                unoptimized
              />
            ))}
          </div>
        </section>
      </div>

      {/* styles (scoped) */}
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Unbounded:wght@700&display=swap");

        :root {
          --dark: #111;
          --purple: #7c3aed;
          /* crude fluid calc fallback */
          --fluid-bp: clamp(0, (100vw - 320px) / (1280 - 320), 1);
          --f-5-min: 30;
          --f-5-max: 120;
          --step-5: calc(
            ((var(--f-5-min) / 16) * 1rem) + (var(--f-5-max) - var(--f-5-min)) *
              var(--fluid-bp)
          );
        }

        #smooth-wrapper {
          font-family: "Unbounded", sans-serif;
          background: var(--dark);
          color: white;
          min-height: 100vh;
        }

        .pin-spacer {
          pointer-events: none;
        }

        .hero {
          min-height: 100vh;
          padding: 1.5rem;
        }

        h1 {
          position: relative;
          font-size: var(--step-5);
          text-transform: uppercase;
          text-align: center;
          line-height: 1.05;
        }

        .images {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          align-items: stretch;
          justify-items: center;
          margin-top: 2rem;
          gap: 0.75rem;
          z-index: -1;
        }

        img {
          max-width: 100%;
          height: 60vh;
          object-fit: cover;
          will-change: transform;
        }

        .spacer {
          height: 100vh;
        }

        .titleStack {
          position: relative;
          display: inline-block;
          line-height: 0.95;
          text-transform: uppercase;
          /* size: tweak as needed */
          font-size: clamp(2.25rem, 6vw, 6rem);
        }

        .heading {
          position: relative;
          z-index: 2;
          mix-blend-mode: difference;
          perspective: 1000px;
          -webkit-backface-visibility: visible;
          backface-visibility: visible;
          transform: rotate(0.1deg);
        }

        /* small screens: collapse grid */
        @media (max-width: 900px) {
          .images {
            grid-template-columns: repeat(2, 1fr);
          }
          img {
            height: 45vh;
          }
        }

        @media (max-width: 520px) {
          .images {
            grid-template-columns: 1fr;
          }
          img {
            height: 40vh;
          }
        }
      `}</style>
    </div>
  );
}
