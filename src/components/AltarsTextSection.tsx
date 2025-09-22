// AltarsTextSection.jsx (or .tsx if using TypeScript)
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function AltarsTextSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const textRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    // Register the ScrollTrigger plugin (once on client-side)
    gsap.registerPlugin(ScrollTrigger);

    // Ensure this runs on client (Next.js SSR guard)
    if (!sectionRef.current || !textRef.current) return;

    // Compute width values for animation boundaries
    const fullTextWidth = textRef.current.scrollWidth;
    // const containerWidth = sectionRef.current.offsetWidth;

    // Set start and end X positions for left-to-right scroll
    const startX = fullTextWidth + 100; // text starts off-screen to the left
    const endX = 0; // text ends aligned at container left
    console.log("startX", startX);

    // GSAP horizontal pan animation tied to scroll
    gsap.fromTo(
      textRef.current,
      { x: -startX }, // starting position (off-screen left)
      {
        x: endX, // end position (bring text fully into view)
        scrollTrigger: {
          trigger: sectionRef.current, // animate when this section is in viewport
          start: "top 100%",
          end: "bottom top",
          scrub: 0.5, // smooth scrub to tie animation to scroll (0.5s lag):contentReference[oaicite:0]{index=0}
          // (start and end defaults to section entering/leaving viewport)
        },
      }
    );

    // Cleanup on unmount (to avoid duplication in React strict mode)
    return () => ScrollTrigger.getAll().forEach((trig) => trig.kill());
  }, []);

  return (
    <section ref={sectionRef} className='relative overflow-x-hidden'>
      {/* The section is a normal block in page flow; overflow-x-hidden hides horizontal scroll */}
      <h1
        ref={textRef}
        className='whitespace-nowrap text-[clamp(8rem,15vw,16rem)] font-black leading-28 font-bebas text-ink'
      >
        ALTARS Y OFRENDAS
        <span
          style={{ marginLeft: "3rem", marginRight: "3rem", fontSize: "4rem" }}
        >
          •
        </span>
        <span className='inline-block mx-[0.4em] font-cherish text-[clamp(6rem, 13vw, 12rem)] text-marigold font-light '>
          Alatars y Ofrendas
        </span>
        <span
          style={{ marginLeft: "3rem", marginRight: "3rem", fontSize: "4rem" }}
        >
          •
        </span>
        ALTARS Y OFRENDAS
      </h1>
    </section>
  );
}
