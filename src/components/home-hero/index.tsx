import React from "react";
import HeroCarousel from "./hero-carousel";
import SwapContainer from "../swap/swap-container";
import HeroSwapHeader from "./hero-swap-header";

const HomeHero = () => {
  return (
    <div className="home-hero">
      <div className="home-hero__main">
        <HeroCarousel />
        <div className="home-hero__swap">
          <HeroSwapHeader />
          <SwapContainer isHero />
        </div>
      </div>
      <div className="home-hero__text">
        <h1>
          <span>Swap.</span>
          <span>Bridge.</span>
          <span>Send.</span>
        </h1>
        <p>
          Connect a wallet, pick tokens and chains, and execute in a single
          flow. Oracle finds a fast, low-cost path and fills it via relayers—so
          your assets land where you need them, fast.
        </p>
      </div>
    </div>
  );
};

export default HomeHero;
