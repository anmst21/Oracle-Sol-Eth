"use client";

import React, { useEffect, useRef, ElementType, ReactNode } from "react";
import { animate, stagger } from "animejs";

type Props = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  delay?: number;
  staggerMs?: number;
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
  staggerMs = 50,
}: Props) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    wrapTextNodes(el);

    el.style.opacity = "1";

    const words = el.querySelectorAll<HTMLElement>(".tr-word");
    if (!words.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            animate(words, {
              translateY: [20, 0],
              opacity: [0, 1],
              filter: ["blur(4px)", "blur(0px)"],
              delay: stagger(staggerMs, { start: delay }),
              duration: 800,
              ease: "outQuint",
            });
            observer.disconnect();
          }
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [delay, staggerMs]);

  return (
    <Tag ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </Tag>
  );
};

export default TextReveal;
