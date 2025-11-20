import { HomeHeaderType } from "@/types/home-page";
import React from "react";
import HomePageHeader from "../home-section-header";
import AboutItemWrapper from "../home-about/about-item-wrapper";
import ItemText from "../home-about/item-text";
import Image from "next/image";
import { portableAnimation } from "@/components/icons/landing-pack/index";

const HomeCharts = () => {
  return (
    <div className="home-charts">
      <HomePageHeader type={HomeHeaderType.Chart} />
      <div className="home-charts__wrapper">
        <AboutItemWrapper keyString="charts" length={1} index={0}>
          <div className={"home-about-icon__animation section-grid-bottom"}>
            <Image
              src={"/landing/charts.png"}
              alt="Charts mockup"
              width={965}
              height={584}
              style={{
                width: "100%",
                height: "auto",
              }}
            />
          </div>
          <div className="home-about-icon__info">
            <ItemText
              header="See the move. Make the move."
              paragraph="Our dedicated Chart page brings GeckoTerminal market data into a clean, portable view. Scan momentum, switch pools, and route a swap without leaving the chart."
              animation={portableAnimation}
            />
          </div>
        </AboutItemWrapper>
      </div>
    </div>
  );
};

export default HomeCharts;
