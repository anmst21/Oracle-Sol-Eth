import { Metadata } from "next";
import SwapContainer from "@/components/swap/swap-container";

export const metadata: Metadata = {
  title: "Swap",
  description:
    "Swap tokens across Solana, Ethereum, Base, Arbitrum, Polygon, and more with instant cross-chain fills powered by Relay. Minimal gas, maximum speed.",
  openGraph: {
    title: "Swap | Oracle",
    description:
      "Swap tokens across Solana, Ethereum, Base, Arbitrum, Polygon, and more with instant cross-chain fills powered by Relay.",
    url: "https://oracleswap.app/swap",
  },
};

export default function Page() {
  return (
    <div className="swap-page">
      <SwapContainer />

      {/* <Connect /> */}
    </div>
  );
}
