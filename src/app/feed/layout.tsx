import { Metadata } from "next";
import FeedHeader from "@/components/feed/feed-header";

export const metadata: Metadata = {
  title: "Feed",
  description:
    "Stay up to date with the latest token swaps, bridges, and trades happening across chains. Featured transactions and social activity in one feed.",
  openGraph: {
    title: "Feed | Oracle",
    description:
      "Stay up to date with the latest token swaps, bridges, and trades happening across chains.",
    url: "https://oracleswap.app/feed",
  },
};

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="feed-layout">
      <FeedHeader />
      {children}
    </div>
  );
}
