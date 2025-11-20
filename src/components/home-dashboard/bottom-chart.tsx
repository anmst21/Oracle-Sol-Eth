import React from "react";

const DashboardBottomCharts = () => {
  return (
    <div className="dashboard-bottom-chart">
      <div className="dashboard-bottom-chart__header">
        <div className="dashboard-bottom-chart__header__badge">
          Network Activity
        </div>
        <div className="dashboard-bottom-chart__header__subheader">
          Track how much value moves through each network.
        </div>
      </div>
      <div className="dashboard-bottom-chart__placeholder"></div>
    </div>
  );
};

export default DashboardBottomCharts;
