import { Metadata } from "next";
import SolanaCoinsLoader from "@/components/coins/solana-coins-loader";

export const metadata: Metadata = {
  title: "Solana Coins",
  description:
    "Browse trending Solana tokens with real-time prices, market cap, volume, and liquidity data powered by DexScreener.",
  openGraph: {
    title: "Solana Coins | Oracle",
    description:
      "Browse trending Solana tokens with real-time prices, market cap, volume, and liquidity data.",
    url: "https://oracleswap.app/coins/solana",
  },
};

export default function Page() {
  return (
    <div className="solana-coins">
      <SolanaCoinsLoader />
    </div>
  );
}
