import React from "react";
import HeroCarousel from "./hero-carousel";
import SwapContainer from "../swap/swap-container";
import HeroSwapHeader from "./hero-swap-header";
import TextReveal from "../text-reveal";

const HomeHero = () => {
  return (
    <div id="hero" className="home-hero">
      <div className="home-hero__main">
        <div className="home-hero__swap-area">
          <HeroCarousel />
          <div className="home-hero__swap">
            <HeroSwapHeader />
            <SwapContainer isHero />
          </div>
        </div>
        <div className="home-hero__text">
          <TextReveal as="h1">
            <span className="home-hero__text__swap">Swap. </span>
            <span className="home-hero__text__bridge">Bridge. </span>
            <span className="home-hero__text__send">Send.</span>
          </TextReveal>
          <TextReveal as="p" delay={150}>
            Connect a wallet, pick tokens and chains, and execute in a single
            flow. Oracle finds a fast, low-cost path and fills it via
            relayers—so your assets land where you need them, fast.
          </TextReveal>
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
