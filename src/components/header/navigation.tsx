"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { SwapIcon, SwapBuy, HeaderFeed } from "../icons";
import classNames from "classnames";
import { motion } from "motion/react";

const Navigation = () => {
  const pathname = usePathname();
  const router = useRouter();

  const navigationItem = [
    {
      title: "Swap",
      slug: "/swap",
      icon: <SwapIcon />,
      active:
        pathname.includes("/swap") ||
        pathname.includes("/buy") ||
        pathname.includes("/chart") ||
        pathname.includes("/history"),
    },
    {
      title: "Feed",
      slug: "/feed",
      icon: <HeaderFeed />,
      active: pathname.includes("/feed") || pathname.includes("/user"),
    },
    {
      title: "Coins",
      slug: "/coins/community",
      icon: <SwapBuy />,
      active: pathname.includes("/coins"),
    },
  ];
  return (
    <motion.div className="header-navigation">
      {navigationItem.map((item) => (
        <button
          onClick={() => router.push(item.slug)}
          key={item.slug}
          className={classNames("header-navigation__item", {
            "header-navigation__item--active": item.active,
          })}
        >
          {item.icon}
          <span>{item.title}</span>

          {item.active ? (
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
