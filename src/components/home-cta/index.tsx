"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useInView, animate } from "motion/react";
import { HomeLaunch } from "../icons";
import { CtaAsciiEngine } from "./cta-ascii-engine";

const bgImage = "/thick-smoke-inverted.jpg";

const HomeCta = () => {
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
        duration: 5,
        ease: [0.25, 0.1, 0.25, 1],
        onUpdate: (v) => engineRef.current?.setReveal(v),
      });
    }
  }, [isInView]);

  return (
    <div id="values" className="home-cta">
      <div className="home-cta__text">
        <h2>Move Value the Way It Should Be</h2>
        <span>
          Fast execution, real transparency, and multichain freedom — all in one
          seamless flow.
        </span>
      </div>
      <div className="home-cta__container" ref={containerRef}>
        <div className="home-cta__card">
          <div className="home-cta__card__badge">Oracle Team</div>
          <h3>Oracle</h3>
          <span className="home-cta__card__paragraph">
            Oracle brings swapping, bridging, and sending into a single, fluid
            experience powered by Relay. Fast fills, clear fees, verified data,
            and frictionless wallet control — everything you need to move value
            across chains with confidence.
          </span>
          <Link className="home-cta__card__cta" href={"/swap"}>
            <HomeLaunch />
            <div className="home-cta__card__cta__mid">
              <HomeLaunch />
              <span>Visit App</span>
              <HomeLaunch />
            </div>
            <HomeLaunch />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeCta;
