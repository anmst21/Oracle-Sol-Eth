import { GeckoChain } from "@/components/chart/types";
import SwapHeader from "@/components/swap/swap-header";
import ChartProvider from "@/context/ChartProvider";
import { HistoryProvider } from "@/context/HistoryProvider";

import fs from "fs/promises";
import path from "path";

export default async function ExchangeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const filePath = path.join(process.cwd(), "public", "gecko-chains.json");
  const raw = await fs.readFile(filePath, "utf-8");
  const geckoChains: GeckoChain[] = JSON.parse(raw);
  return (
    <div className="exchange-layout">
      <ChartProvider geckoChains={geckoChains}>
        <HistoryProvider>
          <SwapHeader />
          {children}
        </HistoryProvider>
      </ChartProvider>
    </div>
  );
}
