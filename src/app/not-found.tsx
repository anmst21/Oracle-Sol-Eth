"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useInView, animate } from "motion/react";
import { CtaAsciiEngine } from "@/components/home-cta/cta-ascii-engine";
import { InputCross } from "@/components/icons";

const bgImage = "/not-found.jpg";

export default function NotFound() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<CtaAsciiEngine | null>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  useEffect(() => {
    if (!containerRef.current) return;

    const engine = new CtaAsciiEngine({
      container: containerRef.current,
      imageUrl: bgImage,
    });
    engineRef.current = engine;

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (isInView && engineRef.current) {
      animate(0, 1, {
        duration: 2,
        ease: [0.25, 0.1, 0.25, 1],
        onUpdate: (v) => engineRef.current?.setReveal(v),
      });
    }
  }, [isInView]);

  return (
    <div className="not-found-page">
      <title>Not Found</title>
      <div className="not-found-page__artwork" ref={containerRef} />

      <div className="not-found-page__window">
        <div className="not-found-page__card">
          <div className="not-found-page__card__badge">Oracle Team</div>
          <h3>404</h3>
          <span className="not-found-page__card__paragraph">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Head back and we&apos;ll get you on the right path.
          </span>
          <button
            className="not-found-page__card__cta"
            onClick={() => router.back()}
          >
            <InputCross />
            <div className="not-found-page__card__cta__mid">
              <InputCross />
              <span>Go Back</span>
              <InputCross />
            </div>
            <InputCross />
          </button>
        </div>
      </div>
    </div>
  );
}
