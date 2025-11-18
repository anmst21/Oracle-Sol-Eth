import React from "react";
import HomeSectionHeader from "../home-section-header";
import { HomeHeaderType } from "@/types/home-page";
import HeaderIcon from "../home-section-header/header-icon";
import {
  BridgeIcon,
  BuyIcon,
  SendIcon,
  SwapIcon,
} from "@/components/icons/landing-pack";
import {
  bridgeAnimation,
  buyAnimation,
  sendAnimation,
  swapAnimation,
} from "@/components/icons/landing-pack";

import { HomeSectionCross } from "../icons";

const aboutList = [
  {
    key: "swap",
    icon: <SwapIcon />,
    animation: swapAnimation,
    header: "Swap",
    paragraph:
      "Oracle quotes a route and executes it via Relay's relayer model. That means near-instant fills and minimized gas—no juggling bridges or tabs.",
  },
  {
    key: "buy",
    icon: <BuyIcon />,
    animation: buyAnimation,
    header: "Buy",
    paragraph:
      "Purchase crypto directly inside Oracle using MoonPay's widget. If the token isn't purchasable outright, Oracle offers a follow-up swap immediately after checkout for a seamless finish.",
  },
  {
    key: "bridge",
    icon: <BridgeIcon />,
    animation: bridgeAnimation,
    header: "Bridge",
    paragraph:
      "For bridging, you deposit once into Relay's depository; a relayer completes the transfer on the target chain without waiting for multi-party consensus.",
  },
  {
    key: "send",
    icon: <SendIcon />,
    animation: sendAnimation,
    header: "Send",
    paragraph:
      "Send assets to another wallet or your own on a different chain using the same Relay flow. Ideal for quick payouts, gas top-ups, and small value transfers.",
  },
];

const HomeAbout = () => {
  return (
    <div className="home-about">
      <HomeSectionHeader type={HomeHeaderType.About} />
      <div className="home-about__container">
        {aboutList.map((item, i) => {
          const ItemText = () => {
            return (
              <>
                <HeaderIcon animation={item.animation} />
                <h3>{item.header}</h3>
                <p>{item.paragraph}</p>
              </>
            );
          };

          return (
            <div
              className={`home-about-icon home-about-icon--${item.key}`}
              key={item.key}
            >
              <div className="home-about-icon__cross home-about-icon__cross--1">
                <HomeSectionCross />
              </div>
              <div className="home-about-icon__cross home-about-icon__cross--2">
                <HomeSectionCross />
              </div>
              <div className="home-about-icon__cross home-about-icon__cross--3">
                <HomeSectionCross />
              </div>
              {aboutList.length === i + 1 && (
                <>
                  <div className="home-about-icon__cross home-about-icon__cross--4">
                    <HomeSectionCross />
                  </div>
                  <div className="home-about-icon__cross home-about-icon__cross--5">
                    <HomeSectionCross />
                  </div>
                  <div className="home-about-icon__cross home-about-icon__cross--6">
                    <HomeSectionCross />
                  </div>
                </>
              )}

              <div className="home-about-icon__info">
                {(item.key === "swap" || item.key === "bridge") && <ItemText />}
              </div>
              <div className="home-about-icon__animation">
                {(item.key === "buy" || item.key === "send") && <ItemText />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomeAbout;
