"use client";

import { motion, useAnimation, useInView } from "motion/react";
import React, { useEffect, useRef } from "react";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import Link from "next/link";
import {
  SocialNexus,
  SocialMail,
  SocialLinkedin,
  SocialTwitter,
} from "../icons";

const AnimatedDots = () => {
  const circlesRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(circlesRef, { margin: "0px 0px" });
  const controls = useAnimation();

  const isDesktop = useIsDesktop();

  useEffect(() => {
    const circleWidth = isDesktop ? 32 : 24;
    const gap = isDesktop ? 24 : 16;
    const step = circleWidth + gap;

    const sequence = [0, 1, 2, 1];
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
            duration: 0.5,
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
      <div className="footer-dot">
        <Link
          href="https://nexus-git-main-anmst21s-projects.vercel.app/"
          className="footer__hole"
          target="_blank"
        >
          <SocialNexus />
        </Link>
      </div>
      <div className="footer-dot">
        <Link
          target="_blank"
          href="mailto:r01@ai.com"
          className="footer__hole"
        >
          <SocialMail />
        </Link>
      </div>
      <div className="footer-dot">
        <Link target="_blank" href="/" className="footer__hole">
          <SocialLinkedin />
        </Link>
      </div>
      <div className="footer-dot">
        <Link
          target="_blank"
          href="https://x.com/reveal_r01"
          className="footer__hole"
        >
          <SocialTwitter />
        </Link>
      </div>

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
