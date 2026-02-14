"use client";

import React, { useEffect, useRef, ElementType, ReactNode } from "react";
import { animate, stagger } from "animejs";

type Props = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  delay?: number;
  variant?: "default" | "hero";
};

function wrapTextNodes(el: HTMLElement) {
  const nodes = Array.from(el.childNodes);
  for (const node of nodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";
      const words = text.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      for (const w of words) {
        if (/^\s+$/.test(w)) {
          frag.appendChild(document.createTextNode(w));
        } else if (w) {
          const span = document.createElement("span");
          span.className = "tr-word";
          span.textContent = w;
          frag.appendChild(span);
        }
      }
      node.replaceWith(frag);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      wrapTextNodes(node as HTMLElement);
    }
  }
}

const TextReveal = ({
  as: Tag = "div",
  className,
  children,
  delay = 0,
  variant = "default",
}: Props) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let targets: HTMLElement[];

    if (variant === "hero") {
      // Animate existing child spans directly — no word wrapping needed
      targets = Array.from(el.children) as HTMLElement[];
      targets.forEach((child) => {
        child.style.opacity = "0";
        child.style.scale = "0.8";
      });
    } else {
      wrapTextNodes(el);
      targets = Array.from(el.querySelectorAll<HTMLElement>(".tr-word"));
    }

    el.style.opacity = "1";
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (variant === "hero") {
              animate(targets, {
                scale: [0.8, 1],
                opacity: [0, 1],
                delay: stagger(120, { start: delay }),
                duration: 600,
                ease: "outQuint",
              });
            } else {
              // Diagonal sweep: delay based on distance from top-left
              const containerRect = el.getBoundingClientRect();
              const distances = targets.map((word) => {
                const rect = word.getBoundingClientRect();
                return (rect.left - containerRect.left) + (rect.top - containerRect.top);
              });
              const maxDist = Math.max(...distances);
              targets.forEach((word, i) => {
                const wordDelay = delay + (maxDist > 0 ? (distances[i] / maxDist) * 250 : 0);
                animate(word, {
                  translateY: [8, 0],
                  opacity: [0, 1],
                  delay: wordDelay,
                  duration: 500,
                  ease: "outQuint",
                });
              });
            }
            observer.disconnect();
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -15% 0px" }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [delay, variant]);

  return (
    <Tag ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </Tag>
  );
};

export default TextReveal;
