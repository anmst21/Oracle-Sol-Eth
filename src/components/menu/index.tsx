"use client";

import { usePathname, useRouter } from "next/navigation";
import Wallet from "../header/wallet";
import { BtnPolygons, MenuHome } from "../icons";

import React, { useEffect, useState } from "react";
import { useRouteOptions } from "@/hooks/useRouteOptions";
import { Blogpost, Category } from "@/types/blogpost-types";
import MenuItem from "./menu-item";
import { AnimatePresence, motion } from "motion/react";
import Wallets from "../wallets/wallet-modal";
import ChainList from "../wallets/chain-list";
import MenuLogo from "./menu-logo";

type Props = { blogposts: Blogpost[]; categories: Category[] };

const MenuBar = ({ categories, blogposts }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenChains, setIsOpenChains] = useState(false);

  const pathname = usePathname();
  const { push } = useRouter();

  const { navigationItemsMain, navigationItemsHome } = useRouteOptions({
    categories,
    blogposts,
  });

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (isOpen || isOpenChains) {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
    } else {
      html.style.overflow = "";
      body.style.overflow = "";
    }
    return () => {
      html.style.overflow = "";
      body.style.overflow = "";
    };
  }, [isOpen, isOpenChains]);

  const isHomeRoute =
    pathname.includes("/blog") ||
    pathname.includes("/contacts") ||
    pathname.includes("/privacy") ||
    pathname === "/";

  return (
    <div className="menu-bar">
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key="wallets-key"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="header__wallet__wrapper"
          >
            <Wallets linkCallback={() => isOpen && setIsOpen(false)} />
          </motion.div>
        )}
        {isOpenChains && (
          <motion.div
            key="chains-key"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="header__wallet__wrapper"
          >
            <ChainList
              closeIfOpenChains={() => isOpenChains && setIsOpenChains(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="menu-bar__navigation">
        <MenuItem slug="/" icon={<MenuHome />} />
        {(isHomeRoute ? navigationItemsHome : navigationItemsMain).map(
          (item) => {
            return (
              <MenuItem
                modal={item.modal}
                icon={item.iconMobile}
                key={item.slug}
                slug={item.slug}
                active={item.active}
              />
            );
          }
        )}
      </div>
      <div className="menu-bar__wallet">
        {isHomeRoute ? (
          <button
            onClick={() => push("/swap")}
            className="buy-btn buy-btn--active confirmation__buttons__cta"
          >
            <span>Visit Swap</span>
            <BtnPolygons />
          </button>
        ) : (
          <Wallet />
        )}
      </div>
      <MenuLogo isRedirect />
      {/* <div className="menu-bar__logo">
        <MenuLogoDefault />
      </div> */}
    </div>
  );
};

export default MenuBar;
