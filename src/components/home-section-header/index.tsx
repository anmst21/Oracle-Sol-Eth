import React from "react";
import { HomeSectionCross, LinkBlog } from "../icons";
import {
  HomePageAbout,
  HomePageStats,
  HomePageBlog,
  HomePagePlaceholder,
} from "@/components/icons/home-page";
import Link from "next/link";
import { HomeHeaderType } from "@/types/home-page";

type Props = {
  type: HomeHeaderType;
};

const HomePageHeader = ({ type }: Props) => {
  let header = "All in one window";
  let subheader =
    "A multichain synthesiser for cross-chain asset routing, execution, and settlement.";
  let btnContent = "Visit Swap";
  let uri = "/swap";
  let icon = <HomePagePlaceholder />;

  switch (type) {
    case HomeHeaderType.About:
      header = "All in one window";
      subheader =
        "A multichain synthesiser for cross-chain asset routing, execution, and settlement.";
      btnContent = "Visit Swap";
      uri = "/swap";
      icon = <HomePageAbout />;
      break;

    case HomeHeaderType.Stats:
      header = "Trusted at multichain scale";
      subheader =
        "Oracle runs on Relay — a production payments protocol that moves value across chains in seconds.";
      btnContent = "Visit Relay";
      uri = "https://relay.link";
      icon = <HomePageStats />;
      break;

    case HomeHeaderType.Blog:
      header = "Everything you need";
      subheader =
        "Oracle brings swaps, bridging, buying, and context into one fast, composable surface.";
      btnContent = "Visit Blog";
      uri = "/blog";
      icon = <HomePageBlog />;

      break;

    case HomeHeaderType.Stakeholders:
      header = "Built with the best";
      subheader =
        "Protocols, networks, and tools that power Oracle's speed, performance, and data.";
      btnContent = "Visit Nexus";
      uri = "https://n3xus.nyc/";
      icon = <HomePagePlaceholder />;

      break;

    case HomeHeaderType.Chart:
      header = "Portable charts";
      subheader =
        "Portable charting with live OHLCV—built for fast, informed swaps.";
      btnContent = "Visit Chart";
      uri = "/chart";
      icon = <HomePagePlaceholder />;

      break;

    case HomeHeaderType.Feed:
      header = "Personalized Feed";
      subheader =
        "A personalized feed from your Farcaster graph + top DEX activity.";
      btnContent = "Visit Feed";
      uri = "/chart";
      icon = <HomePagePlaceholder />;

      break;

    default:
      break;
  }
  return (
    <div className="home-page-header">
      <div className="home-page-header__title">
        <div className="home-page-header__title__icon">{icon}</div>
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
