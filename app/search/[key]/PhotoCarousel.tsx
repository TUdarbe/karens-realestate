'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

const ChevronLeft = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
);
const ChevronRight = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
);

const arrow =
  "absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy shadow-lg transition hover:bg-white hover:scale-105 disabled:pointer-events-none disabled:opacity-0";

function isTyping(e: KeyboardEvent) {
  return !!(e.target as HTMLElement).closest("input, textarea, select, [contenteditable]");
}

// Full-screen photo viewer over a dimmed page. Arrows, swipe, Left/Right keys; Esc or backdrop click closes.
function Lightbox({ photos, start, onClose }: { photos: string[]; start: number; onClose: (index: number) => void }) {
  const [index, setIndex] = useState(start);
  const touchX = useRef<number | null>(null);
  const last = photos.length - 1;
  const go = useCallback((i: number) => setIndex(Math.max(0, Math.min(last, i))), [last]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose(index);
      else if (e.key === "ArrowRight") go(index + 1);
      else if (e.key === "ArrowLeft") go(index - 1);
      else return;
      e.preventDefault();
      e.stopImmediatePropagation();
    }
    // Capture phase so the carousel's own key handler doesn't also move.
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [go, index, onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-navy-deep/85 backdrop-blur-sm"
      onClick={() => onClose(index)}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
    >
      <div className="relative h-[80vh] w-[92vw] max-w-6xl" onClick={(e) => e.stopPropagation()}>
        <Image key={photos[index]} src={photos[index]} alt={`Photo ${index + 1} of ${photos.length}`} fill className="object-contain" sizes="92vw" priority />
      </div>

      <button
        type="button"
        onClick={() => onClose(index)}
        aria-label="Close photo viewer"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-navy shadow-lg transition hover:bg-white sm:right-6 sm:top-6"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      {photos.length > 1 && (
        <>
          <button type="button" onClick={(e) => { e.stopPropagation(); go(index - 1); }} disabled={index === 0} aria-label="Previous photo" className={`${arrow} left-3 sm:left-6`}>
            <ChevronLeft />
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); go(index + 1); }} disabled={index === last} aria-label="Next photo" className={`${arrow} right-3 sm:right-6`}>
            <ChevronRight />
          </button>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy" aria-live="polite">
            {index + 1} / {photos.length}
          </div>
        </>
      )}

      {/* Preload neighbours so arrowing feels instant. */}
      <div className="hidden">
        {[index - 1, index + 1].filter((i) => i >= 0 && i <= last).map((i) => (
          <Image key={photos[i]} src={photos[i]} alt="" width={1} height={1} sizes="92vw" />
        ))}
      </div>
    </div>,
    document.body
  );
}

// Swipeable photo strip with prev/next arrows and Left/Right keyboard controls.
// Clicking a photo opens it in the lightbox.
export default function PhotoCarousel({ photos }: { photos: string[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [viewing, setViewing] = useState<number | null>(null);
  const last = photos.length - 1;

  const goTo = useCallback(
    (i: number, behavior: ScrollBehavior = "smooth") => {
      const scroller = scrollerRef.current;
      const slide = scroller?.children[Math.max(0, Math.min(last, i))] as HTMLElement | undefined;
      if (scroller && slide) scroller.scrollTo({ left: slide.offsetLeft, behavior });
    },
    [last]
  );

  // Track the current photo from the scroll position (covers swipes too).
  function onScroll() {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    // Near the end, the last slides can't snap to the left edge, so treat as last.
    if (scroller.scrollLeft >= scroller.scrollWidth - scroller.clientWidth - 4) {
      setIndex(last);
      return;
    }
    const slides = Array.from(scroller.children) as HTMLElement[];
    let closest = 0;
    slides.forEach((s, i) => {
      if (Math.abs(s.offsetLeft - scroller.scrollLeft) < Math.abs(slides[closest].offsetLeft - scroller.scrollLeft)) closest = i;
    });
    setIndex(closest);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || isTyping(e)) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(index + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(index - 1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, index]);

  // On close, leave the strip on the photo the viewer was showing.
  const closeViewer = useCallback(
    (i: number) => {
      setViewing(null);
      setIndex(i);
      goTo(i, "instant");
    },
    [goTo]
  );

  return (
    <div className="relative" role="region" aria-roledescription="carousel" aria-label="Listing photos">
      <div ref={scrollerRef} onScroll={onScroll} className="relative flex snap-x snap-mandatory gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {photos.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setViewing(i)}
            aria-label={`View photo ${i + 1} full screen`}
            className="relative h-72 w-[90vw] shrink-0 cursor-zoom-in snap-start sm:h-96 sm:w-[46rem]"
          >
            <Image src={src} alt={`Photo ${i + 1} of ${photos.length}`} fill priority={i === 0} className="object-cover" sizes="(max-width: 640px) 90vw, 46rem" />
          </button>
        ))}
      </div>

      {photos.length > 1 && (
        <>
          <button type="button" onClick={() => goTo(index - 1)} disabled={index === 0} aria-label="Previous photo" className={`${arrow} left-3 sm:left-5`}>
            <ChevronLeft />
          </button>
          <button type="button" onClick={() => goTo(index + 1)} disabled={index === last} aria-label="Next photo" className={`${arrow} right-3 sm:right-5`}>
            <ChevronRight />
          </button>
          <div className="absolute bottom-3 right-3 z-10 rounded-full bg-navy/80 px-3 py-1 text-xs font-semibold text-white sm:bottom-5 sm:right-5" aria-live="polite">
            {index + 1} / {photos.length}
          </div>
        </>
      )}

      {viewing !== null && <Lightbox photos={photos} start={viewing} onClose={closeViewer} />}
    </div>
  );
}
