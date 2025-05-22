"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import WalletHeader from "@/components/wallets/wallet-header";
import Wallets from "@/components/wallets/wallet-modal";
import { Portal } from "../slippage-modal/portal";
import { usePrivy } from "@privy-io/react-auth";
import { PrivyLogo } from "../icons";

const HeaderWalletButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  // one ref for the entire interactive area
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    // always listen — it’s cheap
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // true toggle
  const onClick = () => setIsOpen((prev) => !prev);

  const closeIfOpen = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [setIsOpen, isOpen]);

  return (
    // attach the ref here, so header + dropdown are “inside”
    <div
      id="wallet-modal-container"
      className="header__wallet"
      ref={containerRef}
    >
      <WalletHeader closeIfOpen={closeIfOpen} callback={onClick} />

      {containerRef.current && (
        <Portal hostId="wallet-modal-container">
          <div className="header__wallet__wrapper">
            {isOpen && <Wallets linkCallback={closeIfOpen} />}
          </div>
        </Portal>
      )}
    </div>
  );
};

export default HeaderWalletButton;
