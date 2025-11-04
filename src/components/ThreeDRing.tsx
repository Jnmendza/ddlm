/* eslint-disable @typescript-eslint/no-explicit-any */
// app/components/ThreeDCarousel.tsx
"use client";

import { useEffect, useLayoutEffect, useRef, useCallback } from "react";
import gsap from "gsap";

type ThreeDCarouselProps = {
  images: Array<string>;
  width?: number; // px
  height?: number; // px
  perspective?: number; // px
  radius?: number; // px (distance from center to images)
  styles?: string; // additional className styles to apply to the outer container
};

export default function ThreeDCarousel({
  images,
  width = 300,
  height = 600,
  perspective = 3000,
  styles = "",
  radius, // if not provided, we’ll choose a nice default below
}: ThreeDCarouselProps) {
  // fallback demo images like the CodePen

  const angleStep = 360 / images.length;
  const effectiveRadius = radius ?? Math.round(Math.min(width, height) * 1.35); // feels good

  const stageRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const imgRefs = useRef<Array<HTMLDivElement | null>>([]);
  imgRefs.current = [];

  // track pointer X for dragging
  const xPosRef = useRef<number>(0);

  const setImgRef = (el: HTMLDivElement | null) => {
    if (el) imgRefs.current.push(el);
  };

  // helper that returns background-position for parallax
  const getBgPos = useCallback(
    (i: number) => {
      const ring = ringRef.current;
      if (!ring) return "0px 0px";
      const rotY = Number(gsap.getProperty(ring, "rotationY")) || 0;
      // match original math but use dynamic angleStep
      const wrapped = gsap.utils.wrap(0, 360, rotY - 180 - i * angleStep);
      const x = 100 - (wrapped / 360) * 500;
      return `${x}px 0px`;
    },
    [angleStep]
  );

  // hover effects (opacity focus)
  const attachHoverHandlers = () => {
    imgRefs.current.forEach((node) => {
      if (!node) return;
      const onEnter = () => {
        gsap.to(imgRefs.current, {
          opacity: (i, t) => (t === node ? 1 : 0.5),
          ease: "power3",
          duration: 0.2,
        });
      };
      const onLeave = () => {
        gsap.to(imgRefs.current, {
          opacity: 1,
          ease: "power2.inOut",
          duration: 0.25,
        });
      };
      node.addEventListener("mouseenter", onEnter);
      node.addEventListener("mouseleave", onLeave);
      // store listeners on the element so we can remove later
      (node as any).__enter__ = onEnter;
      (node as any).__leave__ = onLeave;
    });
  };

  const detachHoverHandlers = () => {
    imgRefs.current.forEach((node) => {
      if (!node) return;
      const onEnter = (node as any).__enter__;
      const onLeave = (node as any).__leave__;
      if (onEnter) node.removeEventListener("mouseenter", onEnter);
      if (onLeave) node.removeEventListener("mouseleave", onLeave);
      delete (node as any).__enter__;
      delete (node as any).__leave__;
    });
  };

  // drag handlers using Pointer Events
  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;

    const onPointerDown = (e: PointerEvent) => {
      xPosRef.current = Math.round(e.clientX);
      ring.style.cursor = "grabbing";
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerup", onPointerUp, {
        passive: true,
        once: true,
      });
    };

    const onPointerMove = (e: PointerEvent) => {
      const nextX = Math.round(e.clientX);
      const delta = (nextX - xPosRef.current) % 360;

      gsap.to(ring, {
        rotationY: `-=${delta}`,
        onUpdate: () => {
          imgRefs.current.forEach((node, i) => {
            if (!node) return;
            gsap.set(node, { backgroundPosition: getBgPos(i) });
          });
        },
        duration: 0.2,
        ease: "none",
      });

      xPosRef.current = nextX;
    };

    const onPointerUp = () => {
      ring.style.cursor = "grab";
      window.removeEventListener("pointermove", onPointerMove);
    };

    ring.addEventListener("pointerdown", onPointerDown);

    return () => {
      ring.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [getBgPos]);

  // initial GSAP setup + intro animation
  useLayoutEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;

    const ctx = gsap.context(() => {
      gsap.set(ring, {
        rotationY: 180,
        cursor: "grab",
        transformStyle: "preserve-3d",
      });

      imgRefs.current.forEach((node, i) => {
        if (!node) return;
        gsap.set(node, {
          rotateY: i * -angleStep,
          transformOrigin: `50% 50% ${effectiveRadius}px`,
          z: -effectiveRadius,
          backgroundImage: `url(${images[i % images.length]})`,
          backgroundPosition: getBgPos(i),
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backfaceVisibility: "hidden",
          transformStyle: "preserve-3d",
          opacity: 1,
          y: 0,
        });
      });

      gsap.from(imgRefs.current, {
        duration: 1.2,
        y: 200,
        opacity: 0,
        stagger: 0.08,
        ease: "expo",
      });

      attachHoverHandlers();
    }, stageRef);

    return () => {
      detachHoverHandlers();
      ctx.revert();
    };
  }, [images, angleStep, effectiveRadius, getBgPos]);

  return (
    <div ref={stageRef} className={`three-d-stage ${styles}`}>
      <div
        className='three-d-container'
        style={{ width, height, perspective }}
        aria-label='3D photo carousel'
        role='region'
      >
        <div ref={ringRef} className='three-d-ring'>
          {images.map((_, i) => (
            <div key={i} ref={setImgRef} className='three-d-img' aria-hidden />
          ))}
        </div>
      </div>

      {/* Minimal scoped styles to mirror the original; feel free to move to a CSS module */}
      <style jsx>{`
        .three-d-stage,
        .three-d-ring,
        .three-d-img {
          transform-style: preserve-3d;
          user-select: none;
        }

        /* ⬇️ Stage is now an inline box, not a full-screen overlay */
        .three-d-stage {
          position: relative;
          display: block;
          width: auto;
          height: auto;
          overflow: visible;
          background: transparent;
        }

        /* ⬇️ Container is just a sized box; no absolute centering */
        .three-d-container {
          position: relative;
          width: 100%;
          height: 100%;
          perspective: inherit;
        }

        .three-d-ring {
          position: absolute;
          inset: 0;
        }

        .three-d-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
}
