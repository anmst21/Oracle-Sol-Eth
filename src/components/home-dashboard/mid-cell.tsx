"use client";

import { useEffect, useRef } from "react";
import { NavigationEthereum, NavigationSolana } from "@/components/icons";
import { greyEq } from "@/components/icons/dashboard";
import Lottie, { LottieRefCurrentProps } from "lottie-react";

type Props = {
  type: "base" | "solana";
  index?: number; // for staggered offsets
  value: string;
};

const MidCell = ({ type, index = 0, value }: Props) => {
  const isBase = type === "base";
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    if (!lottieRef.current) return;

    // small deterministic + random offset
    const delay = index * 200 + Math.random() * 300;

    const timeout = setTimeout(() => {
      lottieRef.current?.play();
      lottieRef.current?.setSpeed(0.8 + Math.random() * 0.4);
    }, delay);

    return () => clearTimeout(timeout);
  }, [index]);

  return (
    <div className={`dashboard-mid-cell  dashboard-mid-cell--${type}`}>
      <div className="dashboard-mid-cell__top">
        <span>{isBase ? "Base" : "Solana"}</span>
        {isBase ? <NavigationEthereum /> : <NavigationSolana />}
      </div>

      <p>
        {isBase
          ? "A snapshot of Base's most recent activity."
          : "Solana's high-speed ecosystem routed through Relay."}
      </p>

      <div className="dashboard-mid-cell__value">
        <span>{"$ "}</span>
        {value}
      </div>

      <div className="dashboard-mid-cell__bot">
        <span>
          Volume Over Last <span>30 Days</span>
        </span>
        <Lottie
          lottieRef={lottieRef}
          animationData={greyEq}
          loop
          autoplay={false} // controlled manually
          style={{
            width: 36,
            height: 12,
          }}
        />
      </div>
    </div>
  );
};

export default MidCell;
