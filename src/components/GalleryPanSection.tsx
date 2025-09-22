"use client";

import Image from "next/image";

type Props = { count?: number; w?: number; h?: number };

export default function GalleryPanSection({
  count = 3,
  w = 1240,
  h = 874,
}: Props) {
  return (
    <section className='section-pan bg-crimson' data-pan>
      <ul className='pan-wrapper image-row'>
        {Array.from({ length: count }).map((_, i) => {
          const sig = Math.floor(Math.random() * 206);
          const src = `https://source.unsplash.com/random/${w}x${h}?sig=${sig}`;
          return (
            <li key={i}>
              <Image
                className='demo-img'
                src={src}
                width={w}
                height={h}
                alt=''
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
