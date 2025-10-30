export type ClipCarouselProps = {
  images?: string[];
  width?: number; // stage width in SVG units
  height?: number; // stage height in SVG units
  className?: string;
  initialIndex?: number; // which image shows on first paint
  animateInitial?: boolean; // animate the initial image on mount
  tabOffset?: number; // distance from bottom where tabs sit
};
