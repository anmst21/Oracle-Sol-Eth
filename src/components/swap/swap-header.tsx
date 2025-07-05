"use client";

import React, { useCallback, useState } from "react";
import { SwapIcon, SwapBuy, SwapCog, HistoryIcon, ChartIcon } from "../icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import SlippageModal from "../slippage-modal";
import { AnimatePresence } from "motion/react";
import { useChart } from "@/context/ChartProvider";
import { useHistory } from "@/context/HistoryProvider";

const buttons = [
  { name: "Swap", icon: <SwapIcon />, href: "/swap" },
  { name: "Buy", icon: <SwapBuy />, href: "/buy" },
  { name: "Chart", icon: <ChartIcon />, href: "/chart" },
  { name: "History", icon: <HistoryIcon />, href: "/history" },
];

const SwapHeader = () => {
  const [isOpenSlippage, setIsOpenSlippage] = useState(false);

  const { isOpenPools, setIsOpenPools } = useChart();
  const { isOpenHistory, setIsOpenHistory } = useHistory();

  const pathname = usePathname();

  const poolsCallback = useCallback(
    (value: boolean) => setIsOpenPools(value),
    [setIsOpenPools]
  );
  const historyCallback = useCallback(
    (value: boolean) => setIsOpenHistory(value),
    [setIsOpenHistory]
  );

  return (
    <div className="swap-header">
      {buttons.map((button, i) => (
        <Link
          className={classNames("swap-header__item", {
            "swap-header__item--active": pathname === button.href,
          })}
          key={i}
          href={button.href}
        >
          {button.icon}
          <span>{button.name}</span>
        </Link>
      ))}
      <div
        onMouseLeave={() => {
          if (isOpenSlippage) setIsOpenSlippage(false);
        }}
        onClick={() => {
          if (!isOpenSlippage && pathname === "/swap") setIsOpenSlippage(true);
          if (!isOpenPools && pathname === "/chart")
            poolsCallback(!isOpenPools);
          if (!isOpenHistory && pathname === "/history")
            historyCallback(!isOpenHistory);
        }}
        className={classNames("swap-header__settings", {
          "swap-header__settings--active": isOpenSlippage,
        })}
      >
        <SwapCog />
        <AnimatePresence mode="wait">
          {isOpenSlippage && (
            <SlippageModal closeModal={() => setIsOpenSlippage(false)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SwapHeader;
