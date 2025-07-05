import Chart from "@/components/chart";

import { ChartProvider } from "@/context/ChartProvider";

export default async function Page() {
  return (
    <div className="chart-page">
      <Chart />
    </div>
  );
}
