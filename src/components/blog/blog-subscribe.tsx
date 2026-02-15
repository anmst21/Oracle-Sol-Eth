"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { BlogSubscribe as MailIcon } from "../icons";
import HeaderLogo from "../header/header-logo";
import { motion, useAnimation, useInView } from "motion/react";

const BlogSubscribe = ({ isSubscribe }: { isSubscribe?: boolean }) => {
  const circlesRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(circlesRef, { margin: "-5% 0px" });
  const controls = useAnimation();

  useEffect(() => {
    const circleWidth = 30;
    const gap = 16;
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
            duration: 0.6,
            ease: "easeInOut",
            times,
          },
        })
        .then(() =>
          controls.start({
            x: 200,
            //  opacity: 0,
            transition: { duration: 0.4, ease: "easeInOut" },
          })
        );
    } else {
      // Reset immediately when out of view
      controls.set({ x: -60, opacity: 1 });
    }
  }, [inView, controls]);

  return (
    <div className="blog-subscribe">
      <HeaderLogo />
      <div className="blog-subscribe__top">
        <h3>Oracle</h3>

        <div className="blog-subscribe__top__circles" ref={circlesRef}>
          <div className="blog-circle" />
          <div className="blog-circle" />
          <div className="blog-circle" />

          <motion.div
            className="blog-circle blog-circle--overlay"
            initial={{ x: -60, opacity: 1 }}
            animate={controls}
            style={{ scale: 1.1 }}
          />
        </div>
      </div>

      <div className="blog-subscribe__text">
        Oracle&apos;s Blog is designed to enable users around the world to get
        new relevant project information, share and save useful information.
      </div>

      {!isSubscribe && (
        <Link className="blog-subscribe__bottom" href={"/subscribe"}>
          <div className="blog-subscribe__bottom__text">Subscribe</div>
          <div className="blog-subscribe__bottom__icon">
            <MailIcon />
          </div>
        </Link>
      )}
    </div>
  );
};

export default BlogSubscribe;
