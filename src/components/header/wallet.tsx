"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import WalletHeader from "@/components/wallets/wallet-header";
import Wallets from "@/components/wallets/wallet-modal";
import { AnimatePresence, motion } from "motion/react";
import ChainList from "../wallets/chain-list";

const HeaderWalletButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenChains, setIsOpenChains] = useState(false);

  // one ref for the entire interactive area
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
    document.addEventListener("mousedown", (e) =>
      handleClickOutside(e, () => setIsOpenChains(false))
    );

    return () => {
      document.removeEventListener("mousedown", (e) =>
        handleClickOutside(e, () => setIsOpen(false))
      );
      document.addEventListener("mousedown", (e) =>
        handleClickOutside(e, () => setIsOpenChains(false))
      );
    };
  }, []);

  // true toggle
  const onClick = () => setIsOpen((prev) => !prev);

  const closeIfOpen = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [setIsOpen, isOpen]);
  const closeIfOpenChains = useCallback(() => {
    if (isOpenChains) {
      setIsOpenChains(false);
    }
  }, [setIsOpenChains, isOpenChains]);

  const chainCallback = useCallback(() => {
    setIsOpenChains(!isOpenChains);
  }, [setIsOpenChains, isOpenChains]);

  return (
    // attach the ref here, so header + dropdown are “inside”
    <div
      id="wallet-modal-container"
      className="header__wallet"
      ref={containerRef}
    >
      <WalletHeader
        isOpenWallet={isOpen}
        isOpenChains={isOpenChains}
        closeIfOpen={closeIfOpen}
        closeIfOpenChains={closeIfOpenChains}
        chainCallback={chainCallback}
        callback={onClick}
      />

      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key="wallets-key"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(30px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="header__wallet__wrapper"
          >
            <Wallets callback={() => setIsOpen(false)} linkCallback={closeIfOpen} />
          </motion.div>
        )}
        {isOpenChains && (
          <motion.div
            key="chains-key"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(30px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="header__wallet__wrapper"
          >
            <ChainList closeIfOpenChains={closeIfOpenChains} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeaderWalletButton;
