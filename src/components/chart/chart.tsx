import React, { useCallback } from "react";
import {
  ChartLine,
  ChartCandle,
  ArrowChartControls,
  ArrowChart,
} from "../icons";
import { useChart } from "@/context/ChartProvider";
import { ChartSortOptions } from "@/helpers/chart-options";
import classNames from "classnames";
import { ChartType } from "./types";
import { motion } from "motion/react";
type Props = {};

const ChartComponent = (props: Props) => {
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
    requestChain,
    tokenMeta,
    activePool,
    relayChain,
    isOpenTrades,
    setIsOpenTrades,
  } = useChart();

  //,setSortType
  const chartSortOptions = [
    {
      key: ChartSortOptions.FIVE_MUNUTES,
      priceChange: activePool?.attributes.price_change_percentage.m5,
    },
    {
      key: ChartSortOptions.HOUR,
      priceChange: activePool?.attributes.price_change_percentage.h1,
    },
    {
      key: ChartSortOptions.SIX_HOURS,
      priceChange: activePool?.attributes.price_change_percentage.h6,
    },
    {
      key: ChartSortOptions.DAY,
      priceChange: activePool?.attributes.price_change_percentage.h24,
    },
    {
      key: ChartSortOptions.MONTH,
      priceChange: null,
    },
    {
      key: ChartSortOptions.MAX,
      priceChange: null,
    },
  ];

  console.log("chartSortOptions", chartSortOptions);

  const onTypeChange = useCallback(
    (value: ChartType) => setChartType(value),
    [setChartType]
  );
  const onSortChange = useCallback(
    (value: ChartSortOptions) => setSortType(value),
    [setSortType]
  );

  return (
    <div className="chart-component">
      <div className="chart-component__chart">
        <motion.div className="chart-component__chart__type">
          <button
            key="line-button"
            onClick={() => onTypeChange(ChartType.line)}
            className={classNames("chart-component__chart__button", {
              "chart-component__chart__button--active":
                chartType === ChartType.line,
            })}
          >
            <ChartLine />
            {chartType === ChartType.line ? (
              <motion.div layoutId="underline" className="underline" />
            ) : null}
          </button>
          <button
            key="candel-button"
            onClick={() => onTypeChange(ChartType.candel)}
            className={classNames("chart-component__chart__button", {
              "chart-component__chart__button--active":
                chartType === ChartType.candel,
            })}
          >
            <ChartCandle />
            {chartType === ChartType.candel ? (
              <motion.div layoutId="underline" className="underline" />
            ) : null}
          </button>
        </motion.div>
      </div>
      <div className="chart-component__controls">
        <div className="chart-component__controls__scroll">
          {chartSortOptions.map((option, i) => {
            const change = Number(option.priceChange);
            const parts: [string, string] = [
              option.key.slice(0, -1), // everything except the last char → "30"
              option.key.slice(-1), // the last char              → "d"
            ];
            return (
              <button
                onClick={() => onSortChange(option.key)}
                key={i}
                className={classNames(
                  "chart-header__center__status chart-component__button",
                  {
                    "chart-header__center__status--up": change > 0,
                    "chart-header__center__status--down": change < 0,
                    "chart-component__button--active": option.key === sortType,
                    "chart-component__button--null": change === 0,
                    "chart-component__button--width": !option.priceChange,
                  }
                )}
              >
                <span className="chart-component__button__header">
                  {parts[0]}
                  <span>{parts[1]}</span>
                </span>
                {option.priceChange && (
                  <div className="chart-component__button__stats">
                    <span>{change}%</span>

                    {change !== 0 && (
                      <div className="arrow-chart">
                        <ArrowChart />
                      </div>
                    )}
                  </div>
                )}
              </button>
              // <button
              //   className={classNames("chart-component__button", {
              //     "chart-component__button--active": option.key === sortType,
              //   })}
              //   onClick={() => onSortChange(option.key)}
              //   key={i}
              // >
              //   <span className="chart-component__button__header">
              //     {option.key}
              //   </span>

              //   {option.priceChange && (
              //     <div className="chart-component__button__change">
              //       <span>{option.priceChange}%</span>
              //       <ArrowChartControls />
              //     </div>
              //   )}
              // </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
