import { Metadata } from "next";
import Chart from "@/components/chart";

export const metadata: Metadata = {
  title: "Charts",
  description:
    "Advanced token charts with real-time price data, pool analytics, and trade history across multiple chains. Track and analyze any token pair.",
  openGraph: {
    title: "Charts | Oracle",
    description:
      "Advanced token charts with real-time price data, pool analytics, and trade history across multiple chains.",
    url: "https://oracleswap.app/chart",
  },
};

export default async function Page() {
  return (
    <div className="chart-page">
      <Chart />
    </div>
  );
}
