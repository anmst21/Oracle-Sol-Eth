import {
  TotalRequests,
  TotalUsers,
  TotalVolume,
  ChartIconFilled,
} from "@/components/icons/dashboard";

import React from "react";

type Props = {
  type: "users" | "volume" | "requests";
  value?: number;
};

const TopCell = ({ type }: Props) => {
  let header = "Users";
  let subheader = "Users to date";
  let icon = <TotalUsers />;

  switch (type) {
    case "users":
      header = "Users";
      subheader = "Users to date";
      icon = <TotalUsers />;
      break;

    case "volume":
      header = "Volume";
      subheader = "Volume setteled";
      icon = <TotalVolume />;
      break;

    case "requests":
      header = "Requests";
      subheader = "Cross-chain requests";
      icon = <TotalRequests />;
      break;

    default:
      break;
  }

  return (
    <div className="dashboard-top-cell">
      <div className="dashboard-top-cell__top">
        <div className="dashboard-top-cell__top__header">{header}</div>
        <div className="dashboard-top-cell__top__icon">{icon}</div>
      </div>
      <div className="dashboard-top-cell__center">
        <div className="dashboard-top-cell__center__mil">
          <span>XX</span>6
        </div>
        <div className="dashboard-top-cell__center__gran">369</div>
        <div className="dashboard-top-cell__center__num">705</div>
      </div>
      <div className="dashboard-top-cell__bottom">
        <div className="dashboard-top-cell__bottom__icon">
          <ChartIconFilled />
        </div>
        <div className="dashboard-top-cell__bottom__subheader">
          {subheader + " "} <span>total</span>
        </div>
      </div>
    </div>
  );
};

export default TopCell;
