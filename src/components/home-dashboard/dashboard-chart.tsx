"use client";

import { useState } from "react";
import DashboardBottomChains from "./bottom-chains";
import DashboardBottomCharts from "./bottom-chart";

const DashboardChart = () => {
  const [activeChainId, setActiveChainId] = useState(8453);

  return (
    <>
      <DashboardBottomCharts />
      <DashboardBottomChains
        chainId={activeChainId}
        setChainId={setActiveChainId}
      />
    </>
  );
};

export default DashboardChart;
