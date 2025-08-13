"use client";

import ChartHeader from "./header";
import ChartComponent from "./chart";
import ChartBottom from "./bottom";

const Chart = () => {
  return (
    <div className="chart-container">
      <ChartHeader />
      <ChartComponent />
      <ChartBottom />
    </div>
  );
};

export default Chart;
