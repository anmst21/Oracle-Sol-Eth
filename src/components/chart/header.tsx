"use client";

import React, { useCallback, useState } from "react";
import {
  ArrowChart,
  HexChain,
  LinkIconChart,
  UserQuestion,
  ExplorerChart,
  TxChart,
  SwapArrow,
} from "../icons";
import Image from "next/image";
import { useChart } from "@/context/ChartProvider";
import { getIconUri } from "@/helpers/get-icon-uri";
import Link from "next/link";
import { geckoPoolsBase } from "@/helpers/gecko-pools-base";
import classNames from "classnames";
import { splitCompact } from "@/helpers/compact-formatter";
import { formatPairName } from "@/helpers/format-pair-name";

import GreenDot from "../green-dot";
import { AnimatePresence, motion } from "motion/react";
import { slidingTextAnimation } from "../swap/animation";
import { useTokenModal } from "@/context/TokenModalProvider";
import { truncateAddress } from "@/helpers/truncate-address";

export function formatPriceValue(raw: number | string): string {
  // 1) Parse raw input
  const n =
    typeof raw === "string" ? parseFloat(raw.replace(/[^0-9.-]+/g, "")) : raw;
  if (isNaN(n)) return "$–";

  const abs = Math.abs(n);
  // 2) Decide fraction range
  const [minFrac, maxFrac] = abs < 1 ? [2, 6] : [2, 2];

  // 3) Use toLocaleString for rounding/formatting
  let s = n.toLocaleString("en-US", {
    minimumFractionDigits: minFrac,
    maximumFractionDigits: maxFrac,
  });

  // 4) If <1, strip any trailing zeros beyond the last significant digit
  if (abs < 1) {
    s = s.replace(/(\.\d*?[1-9])0+$/, "$1");
  }

  return `${s}`;
}

type Props = {};

const ChartHeader = (props: Props) => {
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
    //  tokenMeta,
    activePool,
    relayChain,
    isOpenTrades,
    setIsOpenTrades,
    activeToken,
    setActiveToken,
  } = useChart();

  console.log("context", {
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
  });

  const priceChangeDay =
    Number(activePool?.attributes.price_change_percentage.h24) || 0;

  const mCap = splitCompact(Number(activePool?.attributes.market_cap_usd) || 0);
  const volDay = splitCompact(
    Number(activePool?.attributes.volume_usd.h24) || 0
  );
  const liquidity = splitCompact(
    Number(activePool?.attributes.reserve_in_usd) || 0.0
  );

  const StatsItem = ({
    header,
    value,
  }: {
    header: string;
    value: string[];
  }) => {
    const [int, dec] = (Number(value[0]).toFixed(1) || "0.0").split(".");
    return (
      <div className="stats-item">
        <div className="stats-item__key">{header}</div>
        <div className="stats-item__value">
          <span>
            $
            <span className="stats-item__value__white">
              <GreenDot int={int} dec={dec} />
            </span>
            {value[1].toUpperCase()}
          </span>
        </div>
      </div>
    );
  };

  const [intPrice, decPrice] = (
    activePool?.attributes.token_price_usd
      ? formatPriceValue(activePool?.attributes.token_price_usd)
      : "0.000000"
  ).split(".");

  const openTrades = useCallback(
    () => setIsOpenTrades(true),
    [setIsOpenTrades]
  );

  const { openTokenModal } = useTokenModal();

  console.log("relayChain", relayChain);
  return (
    <div className="chart-header">
      <div className="chart-header__top">
        {/* <div className="chart-header__top__token">
          <div className="token-to-buy__token__icon">
            {tokenMeta?.chainId ? (
              <HexChain width={25} uri={getIconUri(tokenMeta.chainId)} />
            ) : (
              <HexChain width={25} question />
            )}
            <div className="user-placeholder user-placeholder--md">
              {tokenMeta?.metadata?.logoURI ? (
                <Image
                  src={tokenMeta?.metadata?.logoURI}
                  width={24}
                  height={24}
                  alt={`${tokenMeta?.symbol} coin`}
                />
              ) : (
                <UserQuestion />
              )}
            </div>
          </div>
          <span>{tokenMeta?.symbol}</span>
        </div>
        <div className="chart-header__top__name">{tokenMeta?.name}</div> */}

        <button
          //  onClick={openModalCallback}
          className="token-to-buy__token"
          onClick={() =>
            openTokenModal({ mode: "chart", onSelect: setActiveToken })
          }
        >
          <div className="token-to-buy__token__icon">
            {!activeToken?.chainId ? (
              <HexChain width={32} question />
            ) : (
              <HexChain
                key={activeToken?.chainId}
                width={32}
                uri={getIconUri(activeToken.chainId)}
              />
            )}
            <div
              className={classNames("user-placeholder", {
                "user-placeholder--empty": !activeToken,
              })}
            >
              {activeToken?.logo ? (
                <Image
                  src={activeToken?.logo}
                  width={30}
                  height={30}
                  alt={`${activeToken?.name} token`}
                />
              ) : (
                <UserQuestion />
              )}
            </div>
          </div>
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={activeToken?.symbol ?? "balances"}
              {...slidingTextAnimation}
              className="token-to-buy__token__text"
            >
              <h4>{activeToken ? activeToken?.symbol : "Select"}</h4>
              <span>
                {activeToken ? truncateAddress(activeToken?.address) : "Token"}
              </span>
            </motion.div>
          </AnimatePresence>
          <div className="token-to-buy__token__arrow">
            <SwapArrow />
          </div>
        </button>
        <Link
          target="_blank"
          href={
            geckoPoolsBase +
            "/" +
            requestChain?.name +
            "/pools/" +
            activeToken?.address
          }
        >
          {activePool?.attributes.name && (
            <span>{formatPairName(activePool?.attributes.name)}</span>
          )}
          <LinkIconChart />
        </Link>
      </div>
      <div className="chart-header__center">
        <div className="chart-header__center__price">
          <div className="chart-header__center__price__value">
            <span>
              $
              <span>
                <GreenDot int={intPrice} dec={decPrice} />
              </span>
            </span>
          </div>
          {priceChangeDay && (
            <div
              className={classNames("chart-header__center__status", {
                "chart-header__center__status--up": priceChangeDay > 0,
                "chart-header__center__status--down": priceChangeDay < 0,
              })}
            >
              <span>{priceChangeDay}%</span>
              <div className="arrow-chart">
                <ArrowChart />
              </div>
            </div>
          )}
        </div>
        <div className="chart-header__center__stats">
          <StatsItem header="M/CAP" value={mCap} />
          <StatsItem header="24H VOL" value={volDay} />
          <StatsItem header="LIQUID." value={liquidity} />
        </div>
      </div>
      <div className="chart-header__bottom">
        <button onClick={openTrades} className="chart-header__bottom__button">
          <TxChart />
          <span>Trades</span>
        </button>
        <div className="chart-header__bottom__space" />
        {relayChain && (
          <Link
            target="_blank"
            href={relayChain.explorerUrl + "/address/" + activeToken?.address}
            className="chart-header__bottom__button"
          >
            <span>{relayChain.explorerName || "Explorer"}</span>
            <ExplorerChart />
          </Link>
        )}
      </div>
    </div>
  );
};

export default ChartHeader;
