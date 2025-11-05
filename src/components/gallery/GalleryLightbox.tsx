"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Image from "next/image";
import type { ApiImage } from "@/types/api";
import type { Translate } from "./types";

type DragState = {
  pointerId: number | null;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
  hasMoved: boolean;
};

const ZOOM_SCALE = 1.75;

type GalleryLightboxProps = {
  image: ApiImage;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  t: Translate;
};

export function GalleryLightbox({
  image,
  onClose,
  onPrev,
  onNext,
  t,
}: GalleryLightboxProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOffset, setZoomOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  const imageFrameRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<DragState>({
    pointerId: null,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    hasMoved: false,
  });

  const clearDragState = useCallback(() => {
    dragStateRef.current = {
      pointerId: null,
      startX: 0,
      startY: 0,
      originX: 0,
      originY: 0,
      hasMoved: false,
    };
  }, []);

  const resetZoomState = useCallback(() => {
    setIsZoomed(false);
    setZoomOffset({ x: 0, y: 0 });
    setIsDragging(false);
    clearDragState();
  }, [clearDragState]);

  const activateZoom = useCallback(() => {
    setIsZoomed(true);
    setZoomOffset({ x: 0, y: 0 });
    setIsDragging(false);
    clearDragState();
  }, [clearDragState]);

  useEffect(() => {
    resetZoomState();
  }, [image.id, resetZoomState]);

  useEffect(() => {
    const frame = imageFrameRef.current;
    if (!frame || typeof ResizeObserver === "undefined") return;

    const updateSize = () => {
      const rect = frame.getBoundingClientRect();
      setViewportSize({ width: rect.width, height: rect.height });
    };

    const observer = new ResizeObserver(updateSize);
    observer.observe(frame);
    updateSize();

    return () => observer.disconnect();
  }, [image.id]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (dragStateRef.current.pointerId !== null) return;
    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: zoomOffset.x,
      originY: zoomOffset.y,
      hasMoved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    if (isZoomed) {
      setIsDragging(true);
    }
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;
    if (dragState.pointerId !== event.pointerId) return;
    event.stopPropagation();

    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;

    if (
      !dragState.hasMoved &&
      (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2)
    ) {
      dragState.hasMoved = true;
    }

    if (!isZoomed) return;

    event.preventDefault();
    const limitX = ((ZOOM_SCALE - 1) * viewportSize.width) / 2;
    const limitY = ((ZOOM_SCALE - 1) * viewportSize.height) / 2;

    const clamp = (value: number, max: number) => {
      if (max <= 0) return 0;
      if (value > max) return max;
      if (value < -max) return -max;
      return value;
    };

    setZoomOffset({
      x: clamp(dragState.originX + deltaX, limitX),
      y: clamp(dragState.originY + deltaY, limitY),
    });
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;
    if (dragState.pointerId !== event.pointerId) return;
    event.preventDefault();
    event.stopPropagation();

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;
    const moved =
      dragState.hasMoved || Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3;

    if (isZoomed) {
      setIsDragging(false);
    }

    clearDragState();

    if (!moved) {
      if (isZoomed) {
        resetZoomState();
      } else {
        activateZoom();
      }
    }
  };

  return (
    <div role='dialog' aria-modal='true' className='fixed inset-0 z-50 bg-black/90'>
      <button
        aria-label={t("close")}
        onClick={onClose}
        className='absolute right-4 top-4 h-10 w-10 rounded-full bg-neutral-900/70 px-3 py-2 text-sm ring-1 ring-neutral-700 hover:bg-neutral-800 cursor-pointer'
      >
        X
      </button>
      <button
        aria-label={t("previous")}
        onClick={onPrev}
        className='absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-neutral-900/60 px-3 py-2 text-lg ring-1 ring-neutral-700 hover:bg-neutral-800 w-10 h-10 cursor-pointer'
      >
        ‹
      </button>
      <button
        aria-label={t("next")}
        onClick={onNext}
        className='absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-neutral-900/60 px-3 py-2 text-lg ring-1 ring-neutral-700 hover:bg-neutral-800 w-10 h-10 cursor-pointer'
      >
        ›
      </button>
      <div
        className='flex h-full w-full items-center justify-center p-6'
        onClick={onClose}
      >
        <div
          className={[
            "relative h-[80vh] w-[92vw] max-w-6xl overflow-hidden",
            !isZoomed
              ? "cursor-zoom-in"
              : isDragging
              ? "cursor-grabbing"
              : "cursor-grab",
          ].join(" ")}
          ref={imageFrameRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onClick={(event) => event.stopPropagation()}
        >
          <Image
            src={image.url}
            alt={image.alt}
            fill
            sizes='92vw'
            draggable={false}
            className={`object-contain will-change-transform ${
              isDragging ? "" : "transition-transform duration-300 ease-out"
            }`}
            style={{
              transform: isZoomed
                ? `translate3d(${zoomOffset.x}px, ${zoomOffset.y}px, 0) scale(${ZOOM_SCALE})`
                : "translate3d(0, 0, 0) scale(1)",
              transformOrigin: "center center",
            }}
            priority
          />
        </div>
      </div>
    </div>
  );
}
