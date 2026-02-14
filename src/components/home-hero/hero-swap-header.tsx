"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import SlippageModal from "../slippage-modal";
import { AnimatePresence, motion } from "motion/react";
import SwapCog from "../icons/SwapCog";
import Image from "next/image";
import { usePrivy } from "@privy-io/react-auth";
import { PrivyLogo, UserQuestion, Wallet } from "../icons";
import { useActiveWallet } from "@/context/ActiveWalletContext";
import { slidingTextAnimation } from "../shared/animation";
import { truncateAddress } from "@/helpers/truncate-address";
import Wallets from "@/components/wallets/wallet-modal";

const SwapHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [isOpenSlippage, setIsOpenSlippage] = useState(false);
  const { activeWallet } = useActiveWallet();

  const { authenticated, login, ready } = usePrivy();
  const disableLogin = !ready || (ready && authenticated);

  useEffect(() => {
    if (!authenticated) setIsOpen(false);
  }, [authenticated]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (isOpen) {
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
  }, [isOpen]);

  const closeIfOpen = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [setIsOpen, isOpen]);

  const onClick = () => setIsOpen((prev) => !prev);

  const containerRef = useRef<HTMLDivElement>(null);
  function handleClickOutside(event: MouseEvent, callback: () => void) {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      callback();
    }
  }

  // const isBelow1024 = useMediaQuery({ query: "(max-width: 1024px)" });

  useEffect(() => {
    document.addEventListener("mousedown", (e) =>
      handleClickOutside(e, () => setIsOpen(false))
    );

    return () => {
      document.removeEventListener("mousedown", (e) =>
        handleClickOutside(e, () => setIsOpen(false))
      );
    };
  }, []);

  return (
    <div ref={containerRef} className="swap-header">
      {/* <div id="wallet-modal-container" className="header__wallet"> */}
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
            <Wallets
              callback={() => setIsOpen(false)}
              linkCallback={closeIfOpen}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {/* </div> */}
      <div className="swap-header__badge">Wallet</div>

      {!authenticated ? (
        <button
          disabled={disableLogin}
          onClick={() => login()}
          className="wallet-item__connect"
        >
          <span>Login</span>
          <PrivyLogo />
        </button>
      ) : (
        <button onClick={onClick} className="wallet-header__address">
          <div className="wallet-header__address__provider">
            <Wallet />
          </div>
          <div
            className={classNames("wallet-header__address__value", {
              "button--active": isOpen,
            })}
          >
            <div
              key={activeWallet?.address}
              className="wallet-header__address__value__image"
            >
              {activeWallet?.meta?.icon ? (
                <Image
                  alt={activeWallet?.meta.id}
                  src={activeWallet?.meta.icon.replace(/^\n+/, "").trimEnd()}
                  width={24}
                  height={24}
                />
              ) : (
                <UserQuestion />
              )}
            </div>
            <AnimatePresence mode="popLayout">
              <motion.span
                key={activeWallet?.address}
                {...slidingTextAnimation}
              >
                {activeWallet?.address
                  ? truncateAddress(activeWallet?.address)
                  : "Connect"}
              </motion.span>
            </AnimatePresence>
          </div>
        </button>
      )}
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
