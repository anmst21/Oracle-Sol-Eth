import React from "react";
import { HomeSectionCross } from "../icons";
import TopCell from "./top-cell";
import MidCell from "./mid-cell";
import { HomeHeaderType } from "@/types/home-page";
import HomePageHeader from "../home-section-header";
import DashboardChart from "./dashboard-chart";
import Animation from "./animation";

const HomeDashboard = () => {
  return (
    <div className="home-dashboard">
      <HomePageHeader type={HomeHeaderType.Stats} />
      <div className="home-dashboard__container">
        <div className="home-dashboard__wrapper">
          <div className="home-dashboard__cross home-dashboard__cross--1">
            <HomeSectionCross />
          </div>
          <div className="home-dashboard__cross home-dashboard__cross--2">
            <HomeSectionCross />
          </div>
          <div className="home-dashboard__cross home-dashboard__cross--3">
            <HomeSectionCross />
          </div>
          <div className="home-dashboard__cross home-dashboard__cross--4">
            <HomeSectionCross />
          </div>
          <TopCell type="users" />
          <TopCell type="volume" />
          <TopCell type="requests" />
          <MidCell type="base" />
          <MidCell type="solana" />
          <Animation />
          <DashboardChart />
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
