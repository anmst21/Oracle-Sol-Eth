"use client";

import React from "react";
import { SwapCog } from "../icons";
import classNames from "classnames";
import { motion } from "motion/react";

import { useRouter, usePathname } from "next/navigation";

const CoinsHeader = () => {
  const pathname = usePathname();
  const { push } = useRouter();

  const btnsArray = [
    { href: "/community", key: "Community" },
    { href: "/ethereum", key: "Ethereum" },
    { href: "/solana", key: "Solana" },
  ];

  return (
    <div className="coins-header">
      <div className="coins-header__navigation">
        {btnsArray.map((btn) => {
          const toPath = "/coins" + btn.href;
          return (
            <button
              className={classNames("coins-header__navigation__button", {
                "coins-header__navigation__button--active": toPath === pathname,
              })}
              onClick={() => push(toPath)}
              key={btn.key}
            >
              {btn.key}
              {toPath === pathname ? (
                <motion.div
                  initial={false}
                  layoutId="underline"
                  className="underline"
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <button className="coins-header__settings">
        <SwapCog />
      </button>
    </div>
  );
};

export default CoinsHeader;
