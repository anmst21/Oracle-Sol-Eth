"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useCategory } from "@/hooks/useCategory";

const FRAMES = [
  "/favicon/f1.png",
  "/favicon/f2.png",
  "/favicon/f3.png",
  "/favicon/f4.png",
  "/favicon/f5.png",
  "/favicon/f6.png",
  "/favicon/f7.png",
  "/favicon/f8.png",
  "/favicon/f9.png",
  "/favicon/f10.png",
  "/favicon/f11.png",
  "/favicon/f12.png",
  "/favicon/f13.png",
  "/favicon/f14.png",
  "/favicon/f15.png",
  "/favicon/f16.png",
  "/favicon/f17.png",
  "/favicon/f18.png",
  "/favicon/f19.png",
  "/favicon/f20.png",
];
const INTERVAL_MS = 50; // 0.15s

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
  // Bust cache so swaps are visible
  const v = performance.now().toString().replace(".", "");
  link.href = `${src}?v=${v}`;
}

function preloadImages(srcs: string[]) {
  for (const src of srcs) {
    const img = new Image();
    img.src = src;
  }
}

export default function FaviconAnimator() {
  const pathname = usePathname();
  const playingRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

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
    preloadImages(FRAMES);
    setFavicon(FRAMES[0]); // initial

    const handler = () => play(); // allow manual trigger via event
    window.addEventListener("play-favicon", handler);

    return () => {
      window.removeEventListener("play-favicon", handler);
      clearTimer();
    };
  }, [play, clearTimer]);

  const { activeCategory } = useCategory();

  useEffect(() => {
    play(); // auto-play on route change
  }, [pathname, play, activeCategory]);

  return null;
}
