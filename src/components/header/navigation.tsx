"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { SwapIcon, SwapBuy, HeaderFeed } from "../icons";
import classNames from "classnames";
import { motion } from "motion/react";

const navigationItem = [
  { title: "Swap", slug: "/swap", icon: <SwapIcon /> },
  { title: "Feed", slug: "/feed", icon: <HeaderFeed /> },
  { title: "Coins", slug: "/coins", icon: <SwapBuy /> },
];

const Navigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <motion.div className="header-navigation">
      {navigationItem.map((item) => (
        <button
          onClick={() => router.push(item.slug)}
          key={item.slug}
          className={classNames("header-navigation__item", {
            "header-navigation__item--active": pathname === item.slug,
          })}
        >
          {item.icon}
          <span>{item.title}</span>

          {pathname === item.slug ? (
            <motion.div
              layoutId="underline-header"
              className="underline-header"
            />
          ) : null}
        </button>
      ))}
    </motion.div>
  );
};

export default Navigation;
