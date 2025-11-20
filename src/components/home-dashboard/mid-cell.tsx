import { NavigationEthereum, NavigationSolana } from "@/components/icons";
import { ChartIcon } from "@/components/icons/dashboard";

import React from "react";

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
          ? "A snapshot of Base's most recent activity: efficient, low-cost execution powered by Relay."
          : "Solana's high-speed ecosystem routed through Relay, showing the latest week of swaps and settlement flow."}
      </p>
      <div className="dashboard-mid-cell__value">
        <span>{"$ "}</span>
        {"300 412"}
      </div>
      <div className="dashboard-mid-cell__bot">
        <span>
          Volume Over Last <span>7 Days</span>
        </span>
        <ChartIcon />
      </div>
    </div>
  );
};

export default MidCell;
