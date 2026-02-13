import React from "react";
import HomeSectionHeader from "../home-section-header";
import { HomeHeaderType } from "@/types/home-page";
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
import AboutItem from "./about-item";

//9500EB
//56EB00

//EB003B
//00EBB0

//00B0EB
//EB3B00

//EB8900
//0062EB

//[-0.73, 0, 0]
//[0.44, 0, 0]
//[0.44 0.31, 0]
// [0,0.31,0]

const aboutList = [
  {
    colorTop: "#9500EB",
    colorBottom: "#56EB00",
    rotation: [3, -0.8, 0],
    position: [-1.45, 0, 0],
    key: "swap",
    icon: <SwapIcon />,
    animation: swapAnimation,
    object: "/objects/swap.glb",
    header: "Swap",
    paragraph:
      "Oracle quotes a route and executes it via Relay's relayer model. That means near-instant fills and minimized gas—no juggling bridges or tabs.",
  },
  {
    colorTop: "#EB003B",
    colorBottom: "#00EBB0",
    rotation: [1, 2.22, -0.4],
    // position: [1.3, -0.3, 0],

    key: "buy",
    icon: <BuyIcon />,
    animation: buyAnimation,
    object: "/objects/buy.glb",
    header: "Buy",
    paragraph:
      "Purchase crypto directly inside Oracle using MoonPay's widget. If the token isn't purchasable outright, Oracle offers a follow-up swap immediately after checkout for a seamless finish.",
  },
  {
    colorTop: "#00B0EB",
    colorBottom: "#EB3B00",
    rotation: [0.5, -0.9, 0.35],
    position: [1.55, 0.65, 0],

    key: "bridge",
    icon: <BridgeIcon />,
    animation: bridgeAnimation,
    object: "/objects/bridge.glb",
    header: "Bridge",
    paragraph:
      "For bridging, you deposit once into Relay's depository; a relayer completes the transfer on the target chain without waiting for multi-party consensus.",
  },
  {
    colorTop: "#EB8900",
    colorBottom: "#0062EB",
    rotation: [1.27, 4, -0.2],
    position: [0, 1, 0],

    key: "send",
    icon: <SendIcon />,
    animation: sendAnimation,
    object: "/objects/send.glb",
    header: "Send",
    paragraph:
      "Send assets to another wallet or your own on a different chain using the same Relay flow. Ideal for quick payouts, gas top-ups, and small value transfers.",
  },
];

const HomeAbout = () => {
  return (
    <div id="about" className="home-about">
      <HomeSectionHeader type={HomeHeaderType.About} />
      <div className="home-about__container">
        {aboutList.map((item, i) => {
          return (
            <AboutItem
              length={aboutList.length}
              key={item.key}
              itemKey={item.key}
              index={i}
              header={item.header}
              paragraph={item.paragraph}
              animation={item.animation}
              object={item.object}
              colorTop={item.colorTop}
              colorBottom={item.colorBottom}
              rotation={item.rotation}
              position={item.position}
            />
          );
        })}
      </div>
    </div>
  );
};

export default HomeAbout;
