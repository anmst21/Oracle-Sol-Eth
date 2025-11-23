import React, { Dispatch, SetStateAction } from "react";
import ChainList from "./chain-list";

const DashboardBottomChains = ({
  chainId,
  setChainId,
}: {
  chainId: number;
  setChainId: Dispatch<SetStateAction<number>>;
}) => {
  return (
    <div className="dashboard-bottom-chains">
      <div className="dashboard-bottom-chart__header">
        <div className="dashboard-bottom-chart__header__badge">Sort</div>
        <div className="dashboard-bottom-chart__header__subheader">
          Chain Overview
        </div>
      </div>
      <p>Analyze chain-level liquidity flow and transaction volume.</p>
      <div className="dashboard-bottom-chains__list">
        <ChainList chainId={chainId} setChainId={setChainId} />
      </div>
    </div>
  );
};

export default DashboardBottomChains;
