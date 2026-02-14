"use client";

import React, { useCallback, useRef, useState } from "react";
import { SwapIcon, SwapBuy, SwapCog, HistoryIcon, ChartIcon } from "../icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import SlippageModal from "../slippage-modal";
import { AnimatePresence } from "motion/react";
import { useChart } from "@/context/ChartProvider";
import { useHistory } from "@/context/HistoryProvider";
import { useActiveWallet } from "@/context/ActiveWalletContext";
import { useOnRamp } from "@/context/OnRampProvider";

const buttons = [
  { name: "Swap", icon: <SwapIcon />, href: "/swap" },
  { name: "Buy", icon: <SwapBuy />, href: "/buy" },
  { name: "Chart", icon: <ChartIcon />, href: "/chart" },
  { name: "History", icon: <HistoryIcon />, href: "/history" },
];

const SwapHeader = () => {
  const [isOpenSlippage, setIsOpenSlippage] = useState(false);

  const { isOpenPools, setIsOpenPools, activePool } = useChart();
  const { isOpenHistory, setIsOpenHistory } = useHistory();

  const { isOpenRegions, setIsOpenRegions } = useOnRamp();

  const pathname = usePathname();

  const poolsCallback = useCallback(
    (value: boolean) => setIsOpenPools(value),
    [setIsOpenPools]
  );
  const historyCallback = useCallback(
    (value: boolean) => setIsOpenHistory(value),
    [setIsOpenHistory]
  );
  const onRampCallback = useCallback(
    (value: boolean) => setIsOpenRegions(value),
    [setIsOpenRegions]
  );

  const { activeWallet } = useActiveWallet();

  const buttonsLogin = activeWallet
    ? buttons
    : buttons.filter((b) => b.href !== "/history");

  const navRef = useRef<HTMLDivElement>(null);
  const [scrolledToEnd, setScrolledToEnd] = useState(false);

  const handleNavScroll = useCallback(() => {
    const el = navRef.current;
    if (!el) return;
    setScrolledToEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  }, []);

  return (
    <div className="swap-header">
      <div
        className={classNames("swap-header__nav", {
          "swap-header__nav--end": scrolledToEnd,
        })}
        ref={navRef}
        onScroll={handleNavScroll}
      >
        {buttonsLogin.map((button, i) => (
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
      </div>
      <div
        onMouseLeave={() => {
          if (isOpenSlippage) setIsOpenSlippage(false);
        }}
        onClick={() => {
          if (!isOpenSlippage && pathname === "/swap") setIsOpenSlippage(true);
          if (!isOpenPools && pathname === "/chart" && activePool)
            poolsCallback(!isOpenPools);
          if (!isOpenHistory && pathname === "/history")
            historyCallback(!isOpenHistory);
          if (!isOpenRegions && pathname === "/buy")
            onRampCallback(!isOpenRegions);
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
