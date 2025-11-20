"use client";

import { NavigationEthereum, NavigationSolana } from "@/components/icons";
import { greyEq } from "@/components/icons/dashboard";
import Lottie from "lottie-react";
type Props = {
  type: "base" | "solana";
};

const MidCell = ({ type }: Props) => {
  const isBase = type === "base";

  return (
    <div className="dashboard-mid-cell">
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
        {"300 412"}
      </div>
      <div className="dashboard-mid-cell__bot">
        <span>
          Volume Over Last <span>7 Days</span>
        </span>
        <Lottie
          animationData={greyEq}
          loop={true}
          autoplay={true}
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
