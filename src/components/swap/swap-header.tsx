"use client";

import React, { useState } from "react";
import { SwapIcon, SwapBuy, SwapCog } from "../icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import SlippageModal from "../slippage-modal";

const buttons = [
  { name: "Swap", icon: <SwapIcon />, href: "/swap" },
  { name: "Buy", icon: <SwapBuy />, href: "/buy" },
];

const SwapHeader = () => {
  const [isOpenSlippage, setIsOpenSlippage] = useState(false);

  const pathname = usePathname();

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
        onMouseEnter={() => {
          if (!isOpenSlippage) setIsOpenSlippage(true);
        }}
        className="swap-header__settings"
      >
        <SwapCog />
        {isOpenSlippage && (
          <SlippageModal closeModal={() => setIsOpenSlippage(false)} />
        )}
      </div>
    </div>
  );
};

export default SwapHeader;
