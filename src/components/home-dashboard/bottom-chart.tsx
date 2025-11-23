import ChainList from "./chain-list";
import { Dispatch, SetStateAction } from "react";
const DashboardBottomCharts = ({
  chainId,
  setChainId,
}: {
  chainId: number;
  setChainId: Dispatch<SetStateAction<number>>;
}) => {
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
      <div className="dashboard-bottom-chart__chains__wrapper">
        <div className="dashboard-bottom-chart__chains">
          <ChainList isChart setChainId={setChainId} chainId={chainId} />
        </div>
      </div>
    </div>
  );
};

export default DashboardBottomCharts;
