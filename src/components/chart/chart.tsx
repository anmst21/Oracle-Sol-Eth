import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { ChartLine, ChartCandle, ArrowChart } from "../icons";
import { useChart } from "@/context/ChartProvider";
import { ChartSortOptions } from "@/helpers/chart-options";
import classNames from "classnames";
import { ChartType } from "./types";
import { AnimatePresence, motion } from "motion/react";
import { getRandomInt } from "@/helpers/get-random-int";
import SkeletonLoaderWrapper from "../skeleton";
import {
  createChart,
  LineStyle,
  Time,
  AreaSeries,
  CandlestickSeries,
  IChartApi,
  ISeriesApi,
  ColorType,
} from "lightweight-charts";
import ChartError from "./chart-error";
import { useTokenModal } from "@/context/TokenModalProvider";

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
    setActiveToken,
    fetchPools,
    setIsOpenPools,
    fetchChart,
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

  const normalized = useMemo(() => {
    if (!chartData || chartData.length === 0) return [];

    // 1) convert ms→s if needed, 2) sort asc, 3) dedupe equal timestamps (keep last)
    const rows = chartData
      .map(([t, o, h, l, c, v]) => {
        const ts = t > 1e12 ? Math.floor(t / 1000) : t; // LWC expects seconds
        return { t: ts, o, h, l, c, v };
      })
      .sort((a, b) => a.t - b.t);

    const uniq: typeof rows = [];
    let last = -Infinity;
    for (const r of rows) {
      if (r.t === last) {
        // overwrite previous duplicate with the latest one
        uniq[uniq.length - 1] = r;
      } else if (r.t > last) {
        uniq.push(r);
        last = r.t;
      }
      // if r.t < last, we just skip (can't go backwards)
    }

    return uniq;
  }, [chartData]);

  const lineData = useMemo(
    () =>
      normalized.map(({ t, c }) => ({
        time: t as Time,
        value: c,
      })),
    [normalized]
  );

  const candleData = useMemo(
    () =>
      normalized.map(({ t, o, h, l, c }) => ({
        time: t as Time,
        open: o,
        high: h,
        low: l,
        close: c,
      })),
    [normalized]
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
        background: { type: ColorType.Solid, color: "transparent" },
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
        upColor: "#AEE900",
        downColor: "#F13D20",
        wickUpColor: "#AEE900",
        wickDownColor: "#F13D20",
        borderUpColor: "#AEE900",
        borderDownColor: "#F13D20",
      });
      seriesRef.current = s;
      if (candleData.length) s.setData(candleData);
    } else {
      const s = chart.addSeries(AreaSeries, {
        lineWidth: 2,
        lineColor: "#00B0EB",
        topColor: "rgba(0, 176, 235, 0.25)",
        bottomColor: "rgba(0, 176, 235, 0.02)",
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

  const { openTokenModal } = useTokenModal();

  const openPools = useCallback(() => {
    setIsOpenPools(true);
  }, [setIsOpenPools]);

  return (
    <div className="chart-component">
      <div
        ref={containerRef}
        className={classNames("chart-component__chart", {
          "chart-component__chart--loading":
            isLoadingPools || isLoadingChart || isErrorPools,
          "chart-component__chart--error": isErrorPools || isErrorChart,
        })}
      >
        {isErrorChart && (
          <ChartError
            btnLeftCallback={() => fetchPools()}
            btnLeftHeader={"Reload Data"}
            btnRightCallback={() => openPools()}
            btnRightHeader={"Select Pool"}
            mainHeader={"Unable to Load Chart Data"}
            paragraph={
              "We encountered an issue retrieving the latest chart data. This may be due to a temporary network problem or unavailable data from the source."
            }
          />
        )}
        {isErrorPools && (
          <ChartError
            btnLeftCallback={() => fetchChart()}
            btnLeftHeader={"Reload Data"}
            btnRightCallback={() =>
              openTokenModal({ mode: "chart", onSelect: setActiveToken })
            }
            btnRightHeader={"Select Token"}
            mainHeader={"Unable to Load Pool Data"}
            paragraph={
              "We encountered an issue retrieving the latest pool information. This may be due to a temporary network problem or unavailable data from the source."
            }
          />
        )}
        {(isLoadingPools || isLoadingChart) && (
          <SkeletonLoaderWrapper height={210} width={"100%"} isLoading={true} />
        )}
        <AnimatePresence mode="wait">
          {!isErrorPools && !isErrorChart && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="chart-component__chart__type"
            >
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
          )}
        </AnimatePresence>
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
                disabled={isLoadingPools || isLoadingChart || isErrorPools}
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

                {(isLoadingPools || isErrorPools) && option.random && (
                  <div className="chart-component__button__stats">
                    <SkeletonLoaderWrapper
                      radius={1}
                      height={18.5}
                      width={option.random}
                      isLoading={true}
                    />
                  </div>
                )}
                {!isLoadingPools && !isErrorPools && option.random && (
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
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
