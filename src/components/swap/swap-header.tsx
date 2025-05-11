"use client";

import React from "react";
import { SwapIcon, SwapBuy, SwapCog } from "../icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import classNames from "classnames";

const buttons = [
  { name: "Swap", icon: <SwapIcon />, href: "/swap" },
  { name: "Buy", icon: <SwapBuy />, href: "/buy" },
];

const SwapHeader = () => {
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
      <button className="swap-header__settings">
        <SwapCog />
      </button>
    </div>
  );
};

export default SwapHeader;
