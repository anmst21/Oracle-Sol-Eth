"use client";

import { motion, useAnimation, useInView } from "motion/react";
import React, { useEffect, useRef } from "react";

const AnimatedDots = () => {
  const circlesRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(circlesRef, { margin: "0px 0px" });
  const controls = useAnimation();

  useEffect(() => {
    const circleWidth = 32;
    const gap = 24;
    const step = circleWidth + gap;

    const sequence = [0, 1, 2, 1, 2, 3, 2];
    const keyframes = sequence.map((idx) => idx * step);
    const times = keyframes.map((_, i) =>
      keyframes.length === 1 ? 0 : i / (keyframes.length - 1)
    );

    if (inView) {
      // Play animation
      controls
        .start({
          x: keyframes,
          opacity: 1,
          transition: {
            duration: 1.5,
            ease: "easeInOut",
            times,
          },
        })
        .then(() =>
          controls.start({
            x: 250,
            //  opacity: 0,
            transition: { duration: 0.5, ease: "easeInOut" },
          })
        );
    } else {
      // Reset immediately when out of view
      controls.set({ x: -60, opacity: 1 });
    }
  }, [inView, controls]);

  return (
    <div ref={circlesRef} className="animated-dots">
      <div className="footer-dot"></div>
      <div className="footer-dot"></div>
      <div className="footer-dot"></div>
      <div className="footer-dot"></div>

      <motion.div
        className="blog-circle blog-circle--overlay"
        initial={{ x: -60, opacity: 1 }}
        animate={controls}
        style={{ scale: 1.1 }}
      />
    </div>
  );
};

export default AnimatedDots;
