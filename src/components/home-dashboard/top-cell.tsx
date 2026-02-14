"use client";

import {
  TotalRequests,
  TotalUsers,
  TotalVolume,
  greenEq,
} from "@/components/icons/dashboard";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

type Props = {
  type: "users" | "volume" | "requests";
  value?: number;
  index?: number; // <— add index to apply offsets
  values: string[];
};

const TopCell = ({ type, index = 0, values }: Props) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const centerRef = useRef<HTMLDivElement>(null);

  let header = "Users";
  let subheader = "Users to date";
  let icon = <TotalUsers />;

  switch (type) {
    case "users":
      header = "Users";
      subheader = "Users to date";
      icon = <TotalUsers />;
      break;

    case "volume":
      header = "Volume";
      subheader = "Volume settled";
      icon = <TotalVolume />;
      break;

    case "requests":
      header = "Requests";
      subheader = "Cross-chain";
      icon = <TotalRequests />;
      break;
  }

  // 🔥 RANDOMISE animation offset
  useEffect(() => {
    if (!lottieRef.current) return;

    // Give each card a random delay (0–400ms)
    const delay = index * 200 + Math.random() * 300;

    const timeout = setTimeout(() => {
      lottieRef.current?.play();
      // Give each one a slightly different speed (0.8x–1.2x)
      lottieRef.current?.setSpeed(0.8 + Math.random() * 0.4);
    }, delay);

    return () => clearTimeout(timeout);
  }, [index]);

  useEffect(() => {
    const el = centerRef.current;
    if (!el) return;

    const slots = el.querySelectorAll<HTMLElement>(".slot-inner");
    if (!slots.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            animate(slots, {
              translateY: ["-100%", "0%"],
              opacity: [0, 1],
              delay: stagger(120, { start: index * 200 }),
              duration: 800,
              ease: "outQuint",
            });
            observer.disconnect();
          }
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div className={`dashboard-top-cell  dashboard-top-cell--${type}`}>
      <div className="dashboard-top-cell__top">
        <div className="dashboard-top-cell__top__header">{header}</div>
        <div className="dashboard-top-cell__top__icon">{icon}</div>
      </div>

      <div className="dashboard-top-cell__center" ref={centerRef}>
        <div className="dashboard-top-cell__center__mil" style={{ overflow: "hidden" }}>
          <div className="slot-inner" style={{ opacity: 0 }}>
            <span>{values[0]}</span>
            {values[1]}
          </div>
        </div>
        <div className="dashboard-top-cell__center__gran" style={{ overflow: "hidden" }}>
          <div className="slot-inner" style={{ opacity: 0 }}>{values[2]}</div>
        </div>
        <div className="dashboard-top-cell__center__num" style={{ overflow: "hidden" }}>
          <div className="slot-inner" style={{ opacity: 0 }}>{values[3]}</div>
        </div>
      </div>

      <div className="dashboard-top-cell__bottom">
        <div className="dashboard-top-cell__bottom__icon">
          <Lottie
            lottieRef={lottieRef}
            animationData={greenEq}
            loop
            autoplay={false} // <— disable autoplay, control manually
            style={{ width: 36, height: 12 }}
          />
        </div>
        <div className="dashboard-top-cell__bottom__subheader">
          {subheader + " "} <span>total</span>
        </div>
      </div>
    </div>
  );
};

export default TopCell;
