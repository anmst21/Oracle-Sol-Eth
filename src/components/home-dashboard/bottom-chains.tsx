import React from "react";

const DashboardBottomChains = () => {
  return (
    <div className="dashboard-bottom-chains">
      <div className="dashboard-bottom-chart__header">
        <div className="dashboard-bottom-chart__header__badge">Sort</div>
        <div className="dashboard-bottom-chart__header__subheader">
          Chain Overview
        </div>
      </div>
      <p>
        Analyze chain-level liquidity flow and transaction volume. Select a
        network to break down how its USD activity evolves over time.
      </p>
      <div className="dashboard-bottom-chains__list"></div>
    </div>
  );
};

export default DashboardBottomChains;
