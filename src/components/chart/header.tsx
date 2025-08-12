"use client";

import React, { useCallback, useMemo } from "react";
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
import SkeletonLoaderWrapper from "../skeleton";
import { getRandomInt } from "@/helpers/get-random-int";
import { formatPriceValue } from "@/helpers/format-price-value";
import StatsItem from "./stats-item";

const ChartHeader = () => {
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
    // isOpenTrades,
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

  const poolName = formatPairName(activePool?.attributes.name || "").split("/");

  const randomIntOne = useMemo(() => `${getRandomInt(35, 55)}%`, []);
  const randomIntTwo = useMemo(() => `${getRandomInt(45, 75)}%`, []);
  // const randomIntTwo = useMemo(() => `${getRandomInt(45, 75)}%`, []);

  return (
    <div className="chart-header">
      <div className="chart-header__top">
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
          className={classNames({
            "chart-header__bottom__button--loading": isLoadingPools,
          })}
          href={
            geckoPoolsBase +
            "/" +
            requestChain?.name +
            "/pools/" +
            activeToken?.address
          }
        >
          {!isLoadingPools && activePool?.attributes.name ? (
            <span>
              {poolName[0]}
              <span>/{poolName[1]}</span>
            </span>
          ) : (
            <SkeletonLoaderWrapper
              radius={2}
              height={21}
              width={randomIntOne}
              isLoading={true}
            />
          )}
          <LinkIconChart />
        </Link>
      </div>
      <div className="chart-header__center">
        <div className="chart-header__center__price">
          {isLoadingPools ? (
            <SkeletonLoaderWrapper
              radius={4}
              height={36.5}
              width={randomIntTwo}
              isLoading={true}
            />
          ) : (
            <div className="chart-header__center__price__value">
              <span>
                $
                <span>
                  <GreenDot int={intPrice} dec={decPrice} />
                </span>
              </span>
            </div>
          )}
          {isLoadingPools ? (
            <SkeletonLoaderWrapper
              radius={4}
              height={16}
              width={60}
              isLoading={true}
            />
          ) : priceChangeDay ? (
            <div
              className={classNames("chart-header__center__status", {
                "chart-header__center__status--up": priceChangeDay >= 0,
                "chart-header__center__status--down": priceChangeDay < 0,
              })}
            >
              <span>{priceChangeDay}%</span>
              <div className="arrow-chart">
                <ArrowChart />
              </div>
            </div>
          ) : null}
        </div>
        <div className="chart-header__center__stats">
          <StatsItem
            isLoadingPools={isLoadingPools}
            header="M/CAP"
            value={mCap}
          />
          <StatsItem
            isLoadingPools={isLoadingPools}
            header="24H VOL"
            value={volDay}
          />
          <StatsItem
            isLoadingPools={isLoadingPools}
            header="LIQUID."
            value={liquidity}
          />
        </div>
      </div>
      <div className="chart-header__bottom">
        <button
          onClick={openTrades}
          className={classNames("chart-header__bottom__button", {
            "chart-header__bottom__button--loading": isLoadingPools,
          })}
        >
          <TxChart />
          <span>Trades</span>
        </button>
        <div className="chart-header__bottom__space" />
        {relayChain && (
          <Link
            target="_blank"
            href={relayChain.explorerUrl + "/address/" + activeToken?.address}
            className={classNames("chart-header__bottom__button", {
              "chart-header__bottom__button--loading": isLoadingPools,
            })}
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
