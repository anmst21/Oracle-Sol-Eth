import React from "react";
import { HomeSectionCross, LinkBlog } from "../icons";
import Link from "next/link";
import { HomeHeaderType } from "@/types/home-page";

import {
  EverythingIcon,
  FeaturesIcon,
  SeeTheMoveIcon,
  SocialTradingIcon,
  StakeholdersIcon,
  DashboardIcon,
} from "@/components/icons/landing-pack/index";
import {
  everythingAnimation,
  featuresAnimation,
  seeTheMoveAnimation,
  socialTradingAnimation,
  stakeholdersAnimation,
  dashboardAnimation,
} from "@/components/icons/landing-pack/index";
import HeaderIcon from "./header-icon";

type Props = {
  type: HomeHeaderType;
};

const HomePageHeader = ({ type }: Props) => {
  let header = "All in one window";
  let subheader =
    "A multichain synthesiser for cross-chain asset routing, execution, and settlement.";
  let btnContent = "Visit Swap";
  let uri = "/swap";
  let icon = <FeaturesIcon />;
  let animation: unknown = featuresAnimation;

  switch (type) {
    case HomeHeaderType.About:
      header = "All in one window";
      subheader =
        "A multichain synthesiser for cross-chain asset routing, execution, and settlement.";
      btnContent = "Visit Swap";
      uri = "/swap";
      icon = <FeaturesIcon />;
      animation = featuresAnimation;
      break;

    case HomeHeaderType.Stats:
      header = "Trusted at multichain scale";
      subheader =
        "Oracle runs on Relay — a production payments protocol that moves value across chains in seconds.";
      btnContent = "Visit Relay";
      uri = "https://relay.link";
      icon = <DashboardIcon />;
      animation = dashboardAnimation;
      break;

    case HomeHeaderType.Blog:
      header = "Everything you need";
      subheader =
        "Oracle brings swaps, bridging, buying, and context into one fast, composable surface.";
      btnContent = "Visit Blog";
      uri = "/blog";
      animation = everythingAnimation;
      icon = <EverythingIcon />;
      break;

    case HomeHeaderType.Stakeholders:
      header = "Built with the best";
      subheader =
        "Protocols, networks, and tools that power Oracle's speed, performance, and data.";
      btnContent = "Visit Nexus";
      uri = "https://n3xus.nyc/";
      icon = <StakeholdersIcon />;
      animation = stakeholdersAnimation;
      break;

    case HomeHeaderType.Chart:
      header = "Portable charts";
      subheader =
        "Portable charting with live OHLCV—built for fast, informed swaps.";
      btnContent = "Visit Chart";
      uri = "/chart";
      icon = <SeeTheMoveIcon />;
      animation = seeTheMoveAnimation;

      break;

    case HomeHeaderType.Feed:
      header = "Personalized Feed";
      subheader =
        "A personalized feed from your Farcaster graph + top DEX activity.";
      btnContent = "Visit Feed";
      uri = "/chart";
      animation = socialTradingAnimation;
      icon = <SocialTradingIcon />;

      break;

    default:
      break;
  }
  return (
    <div className="home-page-header">
      <div className="home-page-header__title">
        <HeaderIcon animation={animation} icon={icon} />
        <h2>{header}</h2>
        <p>{subheader}</p>
      </div>
      <div className="home-page-header__link">
        <Link className="home-page-header__link__button" href={uri}>
          <div className="home-page-header__link__text">{btnContent}</div>
          <div className="home-page-header__link__icon">
            <LinkBlog />
          </div>
        </Link>
        <div className="home-page-header__cross--1 home-page-header__cross">
          <HomeSectionCross />
        </div>
        <div className="home-page-header__cross--2 home-page-header__cross">
          <HomeSectionCross />
        </div>
        <div className="home-page-header__cross--3 home-page-header__cross">
          <HomeSectionCross />
        </div>
        <div className="home-page-header__cross--4 home-page-header__cross">
          <HomeSectionCross />
        </div>
      </div>
    </div>
  );
};

export default HomePageHeader;
