import { HomeHeaderType } from "@/types/home-page";
import React from "react";
import HomePageHeader from "../home-section-header";
import AboutItemWrapper from "../home-about/about-item-wrapper";
import ItemText from "../home-about/item-text";
import { feedAnimation } from "@/components/icons/landing-pack/index";
import Image from "next/image";

const HomeFeed = () => {
  return (
    <div className="home-feed">
      <HomePageHeader type={HomeHeaderType.Feed} />
      <div className="home-feed__wrapper">
        <AboutItemWrapper keyString="feed" length={1} index={0}>
          <div className="home-about-icon__animation">
            <ItemText
              header="Social trading, verified on-chain"
              paragraph="Oracle associates Farcaster accounts with their verified wallet addresses and ingests DEX swap transactions via Sim.io."
              animation={feedAnimation}
            />
          </div>
          <div className="home-about-icon__info section-grid-bottom">
            <Image
              src={"/landing/feed.png"}
              alt="Feed mockup"
              width={1094}
              height={637}
              style={{
                width: "100%",
                height: "auto",
              }}
            />
          </div>
        </AboutItemWrapper>
      </div>
    </div>
  );
};

export default HomeFeed;
