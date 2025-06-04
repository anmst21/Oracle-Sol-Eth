import Chart from "@/components/chart";
import fs from "fs/promises";
import path from "path";
import { GeckoChain } from "../../../components/chart/types";

export default async function Page() {
  const filePath = path.join(process.cwd(), "public", "gecko-chains.json");

  // 2. Read & parse the JSON
  const raw = await fs.readFile(filePath, "utf-8");
  const geckoChains: GeckoChain[] = JSON.parse(raw);
  return (
    <div className="chart-page">
      <Chart geckoChains={geckoChains} />
    </div>
  );
}
