"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function ComparsasParades() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ---- Lenis smooth scroll ----
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });

    const raf = (time: number) => {
      lenis.raf(time);
      ScrollTrigger.update();
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

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
      lenis.destroy();
    };
  }, []);

  return (
    <div id='smooth-wrapper' ref={wrapperRef}>
      <div id='smooth-content' ref={contentRef}>
        <section className='hero pad-l'>
          <div className='heading'>
            <div className='pin'>
              <h1>
                <span className='clamp '>Comparsas &amp; Parades</span>
                <span className='yt'>Comparsas Y Parades</span>
              </h1>
            </div>
          </div>

          <div className='images'>
            <Image
              data-speed='clamp(2.4)'
              src='https://images.unsplash.com/photo-1530569673472-307dc017a82d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODM2NTUwMDA&ixlib=rb-4.0.3&q=80&w=400'
              alt=''
              width={400}
              height={600}
              unoptimized
            />
            <Image
              data-speed='clamp(1.8)'
              src='https://images.unsplash.com/photo-1439853949127-fa647821eba0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODM2NTQ5Njk&ixlib=rb-4.0.3&q=80&w=400'
              alt=''
              width={400}
              height={600}
              unoptimized
            />
            <Image
              data-speed='clamp(2.2)'
              src='https://images.unsplash.com/photo-1551376347-075b0121a65b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODM2NTQ5MTE&ixlib=rb-4.0.3&q=80&w=400'
              alt=''
              width={400}
              height={600}
              unoptimized
            />
            <Image
              data-speed='clamp(1.5)'
              src='https://images.unsplash.com/photo-1500817487388-039e623edc21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODM2NTQ5MTE&ixlib=rb-4.0.3&q=80&w=400'
              alt=''
              width={400}
              height={600}
              unoptimized
            />
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
