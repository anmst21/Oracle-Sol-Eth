import { Metadata } from "next";
import HomeAbout from "@/components/home-about";
import HomeBlog from "@/components/home-blog";
import HomeCharts from "@/components/home-charts";
import HomeCta from "@/components/home-cta";
import HomeDashboard from "@/components/home-dashboard";
import HomeFeed from "@/components/home-feed";
import HomeHero from "@/components/home-hero";
import HomeStakeholders from "@/components/home-stakeholders";

export const metadata: Metadata = {
  title: "Oracle — Cross-Chain Trading Platform",
  description:
    "Swap, bridge, buy, and send crypto across Solana, Ethereum, Base, Arbitrum, and more. Instant Relay-powered fills with minimal gas fees.",
};

export default function Home() {
  return (
    <div className="landing">
      <HomeHero />
      <HomeAbout />
      <HomeDashboard />
      <HomeBlog />
      <HomeStakeholders />
      <HomeCharts />
      <HomeFeed />
      <HomeCta />
    </div>
  );
}
