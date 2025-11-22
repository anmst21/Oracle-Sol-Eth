"use client";

import { useIsDesktop } from "@/hooks/useIsDesktop";
import { HomeSectionCross } from "../icons";

type Props = {
  keyString: string;
  length: number;
  index: number;
  children: React.ReactNode;
  isIndex?: boolean;
};

const AboutItemWrapper = ({ keyString, index, children, isIndex }: Props) => {
  const isDesktop = useIsDesktop();
  return (
    <div className={`home-about-icon home-about-icon--${keyString}`}>
      <div className="home-about-icon__cross home-about-icon__cross--1">
        {isDesktop || !isIndex ? (
          <HomeSectionCross />
        ) : (
          <span>{index + 1}</span>
        )}
      </div>
      <div className="home-about-icon__cross home-about-icon__cross--2">
        <HomeSectionCross />
      </div>
      <div className="home-about-icon__cross home-about-icon__cross--3">
        <HomeSectionCross />
      </div>
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
      {children}
    </div>
  );
};

export default AboutItemWrapper;
