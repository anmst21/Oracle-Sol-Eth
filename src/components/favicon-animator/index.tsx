"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const FRAMES = Array.from({ length: 20 }, (_, i) => `/favicon/f${i + 1}.png`);
const INTERVAL_MS = 50; // 50ms per frame

function getOrCreateFaviconLink() {
  let link = document.querySelector<HTMLLinkElement>("link#dynamic-favicon");
  if (!link) {
    link = document.createElement("link");
    link.id = "dynamic-favicon";
    link.rel = "icon";
    link.type = "image/png";
    // Put ours LAST so Chrome prefers it over any existing icons
    document.head.appendChild(link);
  }
  return link;
}

function setFavicon(src: string) {
  const link = getOrCreateFaviconLink();
  link.href = src;
}

export default function FaviconAnimator() {
  const pathname = usePathname();
  const playingRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);
  const preloadedRef = useRef<HTMLImageElement[]>([]);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    playingRef.current = false;
  }, []);

  const play = useCallback(() => {
    if (playingRef.current || FRAMES.length === 0) return;
    playingRef.current = true;

    let i = 0;
    setFavicon(FRAMES[i]); // show first frame immediately

    const step = () => {
      i++;
      if (i < FRAMES.length) {
        setFavicon(FRAMES[i]);
        timeoutRef.current = window.setTimeout(step, INTERVAL_MS);
      } else {
        // finished; reset to first frame and stop
        setFavicon(FRAMES[0]);
        clearTimer();
      }
    };

    timeoutRef.current = window.setTimeout(step, INTERVAL_MS);
  }, [clearTimer]);

  useEffect(() => {
    // Hold references so preloaded images aren't garbage-collected
    preloadedRef.current = FRAMES.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    const handler = () => play(); // allow manual trigger via event
    window.addEventListener("play-favicon", handler);

    return () => {
      window.removeEventListener("play-favicon", handler);
      clearTimer();
    };
  }, [play, clearTimer]);

  useEffect(() => {
    play(); // auto-play on route change
  }, [pathname, play]);

  return null;
}
