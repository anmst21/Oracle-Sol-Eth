"use client";

import React, { useEffect, useRef } from "react";
import { useInView, animate } from "motion/react";
import { CtaAsciiEngine } from "../home-cta/cta-ascii-engine";

const bgImage = "/leaf-background.jpg";

const ContactsArtwork = () => {
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

  return <div className="contacts-page__artwork" ref={containerRef} />;
};

export default ContactsArtwork;
