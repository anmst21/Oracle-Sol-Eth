import ChainList from "./chain-list";
import { Dispatch, SetStateAction, useRef, useMemo, useEffect } from "react";
import chartData from "./relay-daily-volume.json";
import { CHART_DATES, CHART_TICKS } from "./colors";
import ChartLine from "./chart-line";
import { ChartData } from "./types";
import { useRelayChains } from "@reservoir0x/relay-kit-hooks";
import { RelayChainFetch } from "@/types/relay-chain";

const rows = CHART_TICKS.length;
const cols = CHART_DATES.length + 1;

const cellsLength = rows * cols;

const DashboardBottomCharts = ({
  chainId,
  setChainId,
}: {
  chainId: number;
  setChainId: Dispatch<SetStateAction<number>>;
}) => {
  const filteredData = useMemo(
    () => chartData.filter((_, i) => i % 2 === 0),
    []
  );

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const margin = 70;

    el.scrollLeft = el.scrollWidth - el.clientWidth - margin;
  }, []);

  const { chains } = useRelayChains();

  const activeChain = useMemo(
    () => chains?.find((chain) => chain.id === chainId) || null,
    [chains, chainId]
  );

  return (
    <div className="dashboard-bottom-chart">
      <div className="dashboard-bottom-chart__header">
        <div className="dashboard-bottom-chart__header__badge">
          Network Activity
        </div>
        <div className="dashboard-bottom-chart__header__subheader">
          Track how much value moves through each network.
        </div>
      </div>
      <div className="dashboard-bottom-chart__placeholder">
        <div className="dashboard-bottom-chart__ticks">
          {CHART_TICKS.map((name, index) => {
            return <div key={index}>{name}</div>;
          })}
        </div>
        <div ref={containerRef} className="dashboard-bottom-chart__chart">
          <div
            style={
              {
                "--chart-cols": cols,
                "--chart-rows": rows,
              } as React.CSSProperties
            }
            className="dashboard-bottom-chart__container"
          >
            {(filteredData as ChartData).map((data, index) => {
              return (
                <ChartLine
                  date={data.date}
                  activeChain={activeChain as RelayChainFetch}
                  setChainId={setChainId}
                  chains={data.chains}
                  key={index}
                />
              );
            })}
            <div className="dashboard-bottom-chart__grid">
              {Array.from({ length: cellsLength }).map((_, i) => {
                const row = Math.floor(i / cols);
                const col = i % cols;

                const isLastRow = row === rows - 1;

                const dateLabel = isLastRow ? CHART_DATES[col] : null;

                return (
                  <div className="chart-cell" key={i}>
                    {dateLabel !== null && (
                      <div className="chart-cell__x-label">{dateLabel}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="dashboard-bottom-chart__chains__wrapper">
        <div className="dashboard-bottom-chart__chains">
          <ChainList isChart setChainId={setChainId} chainId={chainId} />
        </div>
      </div>
    </div>
  );
};

export default DashboardBottomCharts;
