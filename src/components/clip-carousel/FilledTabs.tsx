"use client";

import React from "react";

export default function FilledTabs({
  images,
  width,
  height,
  circle,
  getPosX,
  getPosY,
  onClick,
  style,
  selected,
}: {
  images: string[];
  width: number;
  height: number;
  circle: number;
  getPosX: (i: number) => number;
  getPosY: () => number;
  onClick: (i: number) => void;
  style?: React.CSSProperties;
  selected: number | null;
}) {
  return (
    <svg
      className='tabs'
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio='xMidYMid slice'
      xmlns='http://www.w3.org/2000/svg'
      style={style}
    >
      <defs>
        {images.map((imgUrl, i) => (
          <clipPath id={`tab_${i}_clip`} key={`tab_def_${imgUrl}-${i}`}>
            <circle cx={getPosX(i)} cy={getPosY()} r={circle} />
          </clipPath>
        ))}
      </defs>

      {images.map((imgUrl, i) => (
        <g key={`tab_${imgUrl}-${i}`}>
          {/* circular thumbnail fill */}
          <g clipPath={`url(#tab_${i}_clip)`}>
            <image width={width} height={height} xlinkHref={imgUrl} />
          </g>
          {/* border click target */}
          <circle
            className={`border${selected === i ? " is-selected" : ""}`}
            cx={getPosX(i)}
            cy={getPosY()}
            r={circle + 2}
            onClick={() => onClick(i)}
          />
        </g>
      ))}
    </svg>
  );
}
