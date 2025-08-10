import React from "react";
import { useChart } from "@/context/ChartProvider";
type Props = {};

const Bottom = (props: Props) => {
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

  const txData = activePool?.attributes.transactions.h24;
  const tokenReserves = activePool?.attributes.reserve_in_usd;

  const txBuys = txData?.buys || 0;
  const txSells = txData?.sells || 0;

  const txBuyers = txData?.buyers || 0;
  const txSellers = txData?.sellers || 0;

  const txTotal = txBuys + txSells;
  const userTotal = txBuyers + txSellers;

  const bottomObjects = [
    {
      key: "txns",
      valueDefalut: txTotal,
      valueLeft: txBuys,
      valueRight: txSells,
    },
    {
      key: "users",
      valueDefalut: userTotal,
      valueLeft: txBuyers,
      valueRight: txSellers,
    },
    {
      key: "reserves",
      valueDefalut: tokenReserves,
      valueLeft: null,
      valueRight: null,
    },
  ];

  return <div className="chart-bottom">Bottom</div>;
};

export default Bottom;
