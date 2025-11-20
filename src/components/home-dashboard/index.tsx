import React from "react";
import { HomeSectionCross } from "../icons";
import TopCell from "./top-cell";
import DashboardBottomChains from "./bottom-chains";
import DashboardBottomCharts from "./bottom-chart";
import Image from "next/image";
import MidCell from "./mid-cell";
import { HomeHeaderType } from "@/types/home-page";
import HomePageHeader from "../home-section-header";

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
          <div className="home-dashboard__animation">
            <Image
              src={"/landing/dashboard.png"}
              alt="Dashboard placeholder"
              width={100}
              height={100}
            />
          </div>
          <DashboardBottomCharts />
          <DashboardBottomChains />
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
