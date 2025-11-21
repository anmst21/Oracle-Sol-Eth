"use client";

import {
  TotalRequests,
  TotalUsers,
  TotalVolume,
  greenEq,
} from "@/components/icons/dashboard";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { useEffect, useRef } from "react";

type Props = {
  type: "users" | "volume" | "requests";
  value?: number;
  index?: number; // <— add index to apply offsets
};

const TopCell = ({ type, index = 0 }: Props) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

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

  return (
    <div className="dashboard-top-cell">
      <div className="dashboard-top-cell__top">
        <div className="dashboard-top-cell__top__header">{header}</div>
        <div className="dashboard-top-cell__top__icon">{icon}</div>
      </div>

      <div className="dashboard-top-cell__center">
        <div className="dashboard-top-cell__center__mil">
          <span>XX</span>6
        </div>
        <div className="dashboard-top-cell__center__gran">369</div>
        <div className="dashboard-top-cell__center__num">705</div>
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
