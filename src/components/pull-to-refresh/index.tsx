"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

const THRESHOLD = 80;
const MAX_PULL = 128;
const DAMPING = 0.45;

export default function PullToRefresh() {
  const pillRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isStandalone =
      "standalone" in navigator && (navigator as Navigator & { standalone: boolean }).standalone ||
      window.matchMedia("(display-mode: standalone)").matches;
    if (!isStandalone) return;

    const pill = pillRef.current;
    const arrow = arrowRef.current;
    const text = textRef.current;
    const wrap = wrapRef.current;
    if (!pill || !arrow || !text || !wrap) return;

    let startY = 0;
    let pulling = false;
    let dist = 0;
    let rafId = 0;

    const apply = () => {
      const progress = Math.min(dist / THRESHOLD, 1);
      const y = dist - 40;
      pill.style.transform = `translateY(${y}px) scale(${0.8 + progress * 0.2})`;
      pill.style.opacity = `${progress}`;
      arrow.style.transform = `rotate(${progress * 180}deg)`;

      if (dist >= THRESHOLD) {
        text.textContent = "Release to refresh";
      } else {
        text.textContent = "Pull to refresh";
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (window.scrollY > 0) return;

      // Only activate on body/main scroll — ignore nested scroll containers
      let el = e.target as HTMLElement | null;
      while (el && el !== document.body) {
        if (el.tagName === "MAIN") break;
        if (el.scrollHeight > el.clientHeight) {
          const style = getComputedStyle(el);
          const overflow = style.overflowY;
          if (overflow === "auto" || overflow === "scroll") return;
        }
        el = el.parentElement;
      }

      startY = e.touches[0].clientY;
      pulling = true;
      dist = 0;
      wrap.style.display = "flex";
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!pulling) return;
      const dy = e.touches[0].clientY - startY;
      if (dy < 0) {
        pulling = false;
        dist = 0;
        wrap.style.display = "none";
        return;
      }
      dist = Math.min(dy * DAMPING, MAX_PULL);
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(apply);
    };

    const onTouchEnd = () => {
      if (!pulling) return;
      pulling = false;
      cancelAnimationFrame(rafId);

      if (dist >= THRESHOLD) {
        text.textContent = "Refreshing\u2026";

        // Spin arrow + hold pill in place, then reload
        animate(arrow, {
          rotate: [180, 720],
          duration: 600,
          ease: "outQuint",
        });
        animate(pill, {
          scale: [1, 0.95, 1],
          duration: 400,
          ease: "outQuint",
          onComplete: () => window.location.reload(),
        });
      } else {
        // Snap back
        const from = dist;
        animate(pill, {
          translateY: [from - 40, -40],
          scale: [0.8 + (Math.min(from / THRESHOLD, 1)) * 0.2, 0.8],
          opacity: [pill.style.opacity, 0],
          duration: 350,
          ease: "outQuint",
          onComplete: () => {
            wrap.style.display = "none";
          },
        });
      }

      dist = 0;
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 99999,
        display: "none",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        ref={pillRef}
        style={{
          transform: "translateY(-40px) scale(0.8)",
          opacity: 0,
          willChange: "transform, opacity",
          fontFamily: "var(--font-handjet)",
          fontSize: 16,
          color: "#fff",
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(8px)",
          borderRadius: 20,
          padding: "6px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <svg
          ref={arrowRef}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={{ willChange: "transform" }}
        >
          <path
            d="M8 2v10M4 8l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span ref={textRef}>Pull to refresh</span>
      </div>
    </div>
  );
}
