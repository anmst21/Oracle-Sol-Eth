"use client";

import { useState } from "react";
import DashboardBottomChains from "./bottom-chains";
import DashboardBottomCharts from "./bottom-chart";

const DashboardChart = () => {
  const [activeChainId, setActiveChainId] = useState(0);

  return (
    <>
      <DashboardBottomCharts
        chainId={activeChainId}
        setChainId={setActiveChainId}
      />
      <DashboardBottomChains
        chainId={activeChainId}
        setChainId={setActiveChainId}
      />
    </>
  );
};

export default DashboardChart;
