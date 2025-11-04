"use client";

import React from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

export default function ImageSlide({
  url,
  id,
  total,
  width,
  height,
  circle,
  gap,
  isExpanded,
  registerAPI,
}: {
  url: string;
  id: number;
  total: number;
  width: number;
  height: number;
  circle: number;
  gap: number;
  isExpanded: boolean;
  registerAPI: (api: {
    expand: () => Promise<void>;
    collapse: () => Promise<void>;
  }) => void;
}) {
  const clipRef = React.useRef<SVGCircleElement | null>(null);
  const tlRef = React.useRef<gsap.core.Timeline | null>(null);
  const defaults = { transformOrigin: "center center" as const };

  const getPosSmall = () => ({
    x:
      width / 2 -
      (total * (circle * 2 + gap) - gap) / 2 +
      id * (circle * 2 + gap),
    y: height - 72, // initial dot position baseline
    scale: 1,
  });
  const getPosCenter = () => ({ x: width / 2, y: height / 2, scale: 7 });
  const getPosSmallAbove = () => ({
    x:
      width / 2 -
      (total * (circle * 2 + gap) - gap) / 2 +
      id * (circle * 2 + gap),
    y: height / 2,
    scale: 1,
  });

  const killTL = () => {
    if (tlRef.current) {
      tlRef.current.kill();
      tlRef.current = null;
    }
  };

  const expand = () =>
    new Promise<void>((resolve) => {
      const c = clipRef.current;
      if (!c) return resolve();
      killTL();
      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: resolve,
      });
      tlRef.current = tl;

      tl.set(c, { ...defaults, ...getPosSmall() })
        .to(c, { ...defaults, ...getPosCenter(), duration: 0.35 })
        .to(c, { ...defaults, scale: 100, duration: 0.35 });
    });

  const collapse = () =>
    new Promise<void>((resolve) => {
      const c = clipRef.current;
      if (!c) return resolve();
      killTL();
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: resolve,
      });
      tlRef.current = tl;

      tl.set(c, { ...defaults, ...getPosCenter(), scale: 100 })
        .to(c, { ...defaults, scale: 7, duration: 0.3 })
        .to(c, {
          ...defaults,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          motionPath: [getPosSmallAbove(), getPosSmall()] as any,
          duration: 0.6,
          ease: "bounce.out",
        });
    });

  React.useEffect(() => {
    if (clipRef.current) {
      gsap.set(clipRef.current, { ...defaults, ...getPosSmall() });
    }
    registerAPI({ expand, collapse });
    return () => killTL();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio='xMidYMid slice'
      xmlns='http://www.w3.org/2000/svg'
    >
      <defs>
        <clipPath id={`${id}_circleClip`}>
          <circle ref={clipRef} cx='0' cy='0' r={circle} className='clip' />
        </clipPath>
        <clipPath id={`${id}_squareClip`}>
          <rect width={width} height={height} className='clip' />
        </clipPath>
      </defs>

      <g clipPath={`url(#${id}${isExpanded ? "_squareClip" : "_circleClip"})`}>
        <image width={width} height={height} xlinkHref={url} />
      </g>
    </svg>
  );
}
