"use client";

import { useChart } from "@/context/ChartProvider";
import { ChartSortType } from "@/helpers/gecko-terminal-dex-data";
import classNames from "classnames";
import { motion } from "motion/react";
import { ChartType } from "./types";
import ChartHeader from "./header";
import ChartComponent from "./chart";
import ChartBottom from "./bottom";

const Chart = () => {
  const entries = Object.entries(ChartSortType) as Array<
    [keyof typeof ChartSortType, ChartSortType]
  >;

  const sortOptions: Array<{
    key: keyof typeof ChartSortType;
    value: ChartSortType;
  }> = entries.map(([key, value]) => ({ key, value }));

  const {
    tokenPools,
    isLoadingPools,
    isErrorPools,
    chartData,
    isLoadingChart,
    isErrorChart,
    sortType,
    setSortType,
    chartType,
    setChartType,
    isOpenPools,
    setIsOpenPools,
  } = useChart();

  return (
    <div className="chart-container">
      <ChartHeader />
      <ChartComponent />
      <ChartBottom />
      {/* <div className="chart-component__header"></div>
      <div className="chart-component__buttons">
        <motion.div className="chart-component__buttons__sort">
          {sortOptions.map((option) => (
            <button
              onClick={() => setSortType(option.value)}
              key={option.value}
              className={classNames("chart-button", {
                "chart-button--active": sortType === option.value,
              })}
            >
              <span>{option.key}</span>
              {sortType === option.value ? (
                <motion.div layoutId="underline-sort" className="underline" />
              ) : null}
            </button>
          ))}
        </motion.div>
        <motion.div className="chart-component__buttons__type">
          <button
            onClick={() => setChartType(ChartType.candel)}
            key="candel-type"
            className={classNames("chart-button", {
              "chart-button--active": chartType === ChartType.candel,
            })}
          >
            <span>Candle</span>
            {chartType === ChartType.candel ? (
              <motion.div layoutId="underline-type" className="underline" />
            ) : null}
          </button>
          <button
            onClick={() => setChartType(ChartType.line)}
            key="line-type"
            className={classNames("chart-button", {
              "chart-button--active": chartType === ChartType.line,
            })}
          >
            <span>Line</span>
            {chartType === ChartType.line ? (
              <motion.div layoutId="underline-type" className="underline" />
            ) : null}
          </button>
        </motion.div>
      </div> */}
    </div>
  );
};

export default Chart;
