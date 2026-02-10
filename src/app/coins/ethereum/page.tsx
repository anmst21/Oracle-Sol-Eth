import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ethereum Coins",
  description:
    "Browse Ethereum tokens with real-time prices, market data, and pool analytics powered by Dune and Gecko Terminal.",
  openGraph: {
    title: "Ethereum Coins | Oracle",
    description:
      "Browse Ethereum tokens with real-time prices, market data, and pool analytics.",
    url: "https://oracleswap.app/coins/ethereum",
  },
};

export default function Page() {
  return <div className="ethereum-coins"></div>;
}
