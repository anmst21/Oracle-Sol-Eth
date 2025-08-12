import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { ChartLine, ChartCandle, ArrowChart } from "../icons";
import { useChart } from "@/context/ChartProvider";
import { ChartSortOptions } from "@/helpers/chart-options";
import classNames from "classnames";
import { ChartType } from "./types";
import { motion } from "motion/react";
import { getRandomInt } from "@/helpers/get-random-int";
import SkeletonLoaderWrapper from "../skeleton";
type OhlcvTuple = [number, number, number, number, number, number]; // [ts, o, h, l, c, v]
import {
  createChart,
  LineStyle,
  Time,
  AreaSeries,
  CandlestickSeries,
  IChartApi,
  ISeriesApi,
} from "lightweight-charts";

const height = 210;

const ChartComponent = () => {
  const {
    isLoadingPools,
    isErrorPools,
    chartData,
    isLoadingChart,
    isErrorChart,
    sortType,
    setSortType,
    chartType,
    setChartType,
    activePool,
  } = useChart();

  const randomIntOne = useMemo(() => getRandomInt(45, 70), []);
  const randomIntTwo = useMemo(() => getRandomInt(45, 70), []);
  const randomIntThree = useMemo(() => getRandomInt(45, 70), []);
  const randomIntFour = useMemo(() => getRandomInt(45, 70), []);

  const chartSortOptions = [
    {
      key: ChartSortOptions.FIVE_MUNUTES,
      priceChange: activePool?.attributes.price_change_percentage.m5,
      random: randomIntOne,
    },
    {
      key: ChartSortOptions.HOUR,
      priceChange: activePool?.attributes.price_change_percentage.h1,
      random: randomIntTwo,
    },
    {
      key: ChartSortOptions.SIX_HOURS,
      priceChange: activePool?.attributes.price_change_percentage.h6,
      random: randomIntThree,
    },
    {
      key: ChartSortOptions.DAY,
      priceChange: activePool?.attributes.price_change_percentage.h24,
      random: randomIntFour,
    },
    {
      key: ChartSortOptions.MONTH,
      priceChange: null,
      random: null,
    },
    {
      key: ChartSortOptions.MAX,
      priceChange: null,
      random: null,
    },
  ];

  const onTypeChange = useCallback(
    (value: ChartType) => setChartType(value),
    [setChartType]
  );
  const onSortChange = useCallback(
    (value: ChartSortOptions) => setSortType(value),
    [setSortType]
  );

  const asc = useMemo<OhlcvTuple[] | null>(() => {
    if (!chartData || chartData.length === 0) return null;
    // Data appears newest->oldest; ensure oldest->newest
    const cloned = [...chartData];
    if (cloned.length >= 2 && cloned[0][0] > cloned[1][0]) cloned.reverse();
    return cloned as OhlcvTuple[];
  }, [chartData]);

  const lineData = useMemo(
    () =>
      asc?.map(([t, , , , c]) => ({
        time: t as Time, // seconds since epoch (UTC)
        value: c,
      })) ?? [],
    [asc]
  );

  const candleData = useMemo(
    () =>
      asc?.map(([t, o, h, l, c]) => ({
        time: t as Time,
        open: o,
        high: h,
        low: l,
        close: c,
      })) ?? [],
    [asc]
  );

  console.log({ lineData, candleData });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<
    ISeriesApi<"Area"> | ISeriesApi<"Candlestick"> | null
  >(null);

  useEffect(() => {
    if (!containerRef.current || chartRef.current) return;

    const chart = createChart(containerRef.current, {
      height,
      autoSize: true,
      layout: {
        background: { type: "solid", color: "transparent" },
        textColor: "rgba(136,150,151,0.9)",
      },
      grid: {
        vertLines: { color: "rgba(136,150,151,0.08)", style: LineStyle.Solid },
        horzLines: { color: "rgba(136,150,151,0.08)", style: LineStyle.Solid },
      },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false, rightOffset: 2, fixLeftEdge: true },
      crosshair: { mode: 1 },
    });

    chartRef.current = chart;

    const resize = () => {
      chart.applyOptions({ width: containerRef.current!.clientWidth });
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  // (Re)create the series when type changes
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    // remove previous
    if (seriesRef.current) {
      chart.removeSeries(seriesRef.current);
      seriesRef.current = null;
    }

    if (chartType === ChartType.candel) {
      const s = chart.addSeries(CandlestickSeries, {
        upColor: "#27AE60",
        downColor: "#E74C3C",
        wickUpColor: "#27AE60",
        wickDownColor: "#E74C3C",
        borderUpColor: "#27AE60",
        borderDownColor: "#E74C3C",
      });
      seriesRef.current = s;
      if (candleData.length) s.setData(candleData);
    } else {
      const s = chart.addSeries(AreaSeries, {
        lineWidth: 2,
        lineColor: "#58C7FF",
        topColor: "rgba(88,199,255,0.25)",
        bottomColor: "rgba(88,199,255,0.02)",
        priceLineVisible: false,
      });
      seriesRef.current = s;
      if (lineData.length) s.setData(lineData);
    }

    chart.timeScale().fitContent();
  }, [chartType, candleData, lineData]);

  // If data updates (same type), update efficiently
  useEffect(() => {
    const series = seriesRef.current;
    if (!series) return;

    if (series.seriesType() === "Candlestick") {
      if (candleData.length) {
        // If many points changed, setData; if streaming, you can .update(lastPoint)
        series.setData(candleData);
      }
    } else {
      if (lineData.length) {
        series.setData(lineData);
      }
    }
  }, [candleData, lineData]);

  return (
    <div className="chart-component">
      <div
        ref={containerRef}
        className={classNames("chart-component__chart", {
          "chart-component__chart--loading": isLoadingPools || isLoadingChart,
        })}
      >
        {(isLoadingPools || isLoadingChart) && (
          <SkeletonLoaderWrapper height={210} width={"100%"} isLoading={true} />
        )}

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
                disabled={isLoadingPools || isLoadingChart}
                onClick={() => onSortChange(option.key)}
                key={i}
                className={classNames(
                  "chart-header__center__status chart-component__button",
                  {
                    "chart-header__center__status--up": change > 0,
                    "chart-header__center__status--down": change < 0,
                    "chart-component__button--active": option.key === sortType,
                    "chart-component__button--null": change === 0,
                    "chart-component__button--width": i >= 4,
                  }
                )}
              >
                <span className="chart-component__button__header">
                  {parts[0]}
                  <span>{parts[1]}</span>
                </span>

                {isLoadingPools && option.random && (
                  <div className="chart-component__button__stats">
                    <SkeletonLoaderWrapper
                      radius={1}
                      height={18.5}
                      width={option.random}
                      isLoading={true}
                    />
                  </div>
                )}
                {!isLoadingPools && option.random && (
                  <div className="chart-component__button__stats">
                    <span>{change}%</span>

                    {change !== 0 && (
                      <div className="arrow-chart">
                        <ArrowChart />
                      </div>
                    )}
                  </div>
                )}
                {/* {isLoadingPools ? (
                  <SkeletonLoaderWrapper
                    radius={1}
                    height={18.5}
                    width={randomIntOne}
                    isLoading={true}
                  />
                ) : (
                  <div className="chart-component__button__stats">
                    <span>{change}%</span>

                    {change !== 0 && (
                      <div className="arrow-chart">
                        <ArrowChart />
                      </div>
                    )}
                  </div>
                )} */}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
