"use client";

import { useState, useEffect } from "react";
import DashboardBottomChains from "./bottom-chains";
import DashboardBottomCharts from "./bottom-chart";

const ids = [
  8453, 42161, 2741, 792703809, 137, 59144, 10, 1, 81457, 999, 747474, 56,
  42161, 10,
];

// Create unique array
const uniqueIds = [...new Set(ids)];

const ROTATION_INTERVAL = 5000; // 3 seconds (change as you want)

const DashboardChart = () => {
  const [activeChainId, setActiveChainId] = useState(uniqueIds[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveChainId((current) => {
        const index = uniqueIds.indexOf(current);

        // If not found (shouldn't happen), reset to first
        if (index === -1) return uniqueIds[0];

        // If last → restart
        if (index === uniqueIds.length - 1) return uniqueIds[0];

        // Otherwise → next
        return uniqueIds[index + 1];
      });
    }, ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, []);

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
