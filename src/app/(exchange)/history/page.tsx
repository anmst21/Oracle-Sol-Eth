import { Metadata } from "next";
import History from "@/components/history";

export const metadata: Metadata = {
  title: "Transaction History",
  description:
    "View and track your past swaps, bridges, and transfers across all supported chains. Full transaction history in one place.",
  openGraph: {
    title: "Transaction History | Oracle",
    description:
      "View and track your past swaps, bridges, and transfers across all supported chains.",
    url: "https://oracleswap.app/history",
  },
};

export default function Page() {
  return (
    <div className="transaction-history">
      <History />
    </div>
  );
}
