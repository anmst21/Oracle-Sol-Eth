"use client";

import React, { useState } from "react";
import classNames from "classnames";
import SlippageModal from "../slippage-modal";
import { AnimatePresence } from "motion/react";
import SwapCog from "../icons/SwapCog";

const SwapHeader = () => {
  const [isOpenSlippage, setIsOpenSlippage] = useState(false);

  return (
    <div className="swap-header">
      <div
        onMouseLeave={() => {
          if (isOpenSlippage) setIsOpenSlippage(false);
        }}
        onClick={() => {
          if (!isOpenSlippage) setIsOpenSlippage(true);
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
