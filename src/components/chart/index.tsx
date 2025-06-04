"use client";

import { GeckoChain } from "@/components/chart/types";
import React, { useEffect, useMemo, useState } from "react";
import { getPoolsForToken } from "@/actions/fetch-pools-for-tokents";
import { PoolItem } from "@/types/token-pools";
import { OHLCVData } from "@/types/chart-data";
import { getTokenHistoricalData } from "@/actions/fetch-token-chart-data";
import { ChartSortType } from "@/helpers/gecko-terminal-dex-data";
import classNames from "classnames";
import { motion } from "motion/react";
import { UnifiedToken } from "@/types/coin-types";
import { buyDefaultToken } from "@/helpers/buy-default-token";

const testContract = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const textChain = 8453;

enum ChartType {
  line = "line",
  candel = "candel",
}

const Chart = ({ geckoChains }: { geckoChains: GeckoChain[] }) => {
  const [tokenPools, setTokenPools] = useState<PoolItem[] | null>(null);
  const [isLoadingPools, setIsLoadingPools] = useState(false);
  const [isErrorPools, setIsErrorPools] = useState(false);

  const [chartData, setChartData] = useState<OHLCVData | null>(null);
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const [isErrorChart, setIsErrorChart] = useState(false);

  const [sortType, setSortType] = useState<ChartSortType>(ChartSortType.Month);
  const [chartType, setChartType] = useState<ChartType>(ChartType.line);

  const [buyToken, setBuyToken] = useState<UnifiedToken | null>(
    buyDefaultToken
  );

  const requestChain = useMemo(
    () => geckoChains.find((chain) => chain.id === textChain),
    [geckoChains]
  );

  useEffect(() => {
    if (requestChain) {
      const fetchPools = async () => {
        setIsErrorPools(false);
        try {
          setIsLoadingPools(true);

          const res = await getPoolsForToken(testContract, requestChain?.name);
          setTokenPools(res);
          setIsLoadingPools(false);
        } catch (err) {
          if (err instanceof Error) {
            setIsLoadingPools(false);
            setIsErrorPools(true);
          }
        }
      };

      fetchPools();
    }
  }, [requestChain]);

  useEffect(() => {
    if (requestChain && tokenPools && tokenPools[0].attributes.address) {
      const fetchPools = async () => {
        setIsErrorChart(false);
        setIsLoadingChart(true);

        try {
          const res = await getTokenHistoricalData(
            tokenPools[0].attributes.address,
            requestChain?.name,
            sortType
          );
          setChartData(res);
          setIsLoadingChart(false);
        } catch (err) {
          if (err instanceof Error) {
            setIsLoadingChart(false);
            setIsErrorChart(true);
          }
        }
      };

      fetchPools();
    }
  }, [tokenPools, requestChain, sortType]);

  const entries = Object.entries(ChartSortType) as Array<
    [keyof typeof ChartSortType, ChartSortType]
  >;

  const sortOptions: Array<{
    key: keyof typeof ChartSortType;
    value: ChartSortType;
  }> = entries.map(([key, value]) => ({ key, value }));

  console.log("tokenPools", tokenPools);
  console.log("chartData", chartData);
  console.log("sortOptions", sortOptions);

  return (
    <div className="chart-component">
      <div className="chart-component__header"></div>
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
      </div>
    </div>
  );
};

export default Chart;
