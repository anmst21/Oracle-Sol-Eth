"use client";

import React, { useEffect, useState } from "react";
import SwapWindow from "./swap-window";
import { SwapSwitch } from "../icons";
import { useTokenModal } from "@/context/TokenModalProvider";
import { SwapWallet } from "./types";
import { useActiveWallet } from "@/context/ActiveWalletContext";

const SwapContainer = () => {
  const [sellInputValue, setSellInputValue] = useState("");
  const [buyInputValue, setBuyInputValue] = useState("");

  const { sellToken, buyToken } = useTokenModal();

  const [activeSellWallet, setActiveSellWallet] = useState<SwapWallet | null>(
    null
  );
  const [activeBuyWallet, setActiveBuyWallet] = useState<SwapWallet | null>(
    null
  );

  const { activeWallet } = useActiveWallet();

  useEffect(() => {
    if (activeWallet && !activeSellWallet && !activeBuyWallet) {
      const walletData = {
        chainId:
          activeWallet.type === "ethereum"
            ? Number(activeWallet.chainId.split(":")[1])
            : 792703809,
        address: activeWallet.address,
        type: activeWallet.type,
      };
      setActiveSellWallet(walletData);
      setActiveBuyWallet(walletData);
    }
  }, [activeWallet, activeBuyWallet, activeSellWallet]);

  useEffect(() => {
    if (activeWallet && activeSellWallet) {
      const walletData = {
        chainId:
          activeWallet.type === "ethereum"
            ? Number(activeWallet.chainId.split(":")[1])
            : 792703809,
        address: activeWallet.address,
        type: activeWallet.type,
      };
      setActiveSellWallet(walletData);
    }
  }, [activeWallet]);

  console.log({ activeBuyWallet, activeSellWallet });

  return (
    <div className="swap-container">
      <SwapWindow
        inputValue={sellInputValue}
        setInputValue={setSellInputValue}
        token={sellToken}
        mode="sell"
        isNativeBalance
        setActiveWallet={setActiveSellWallet}
        activeWallet={activeSellWallet}
      />
      <button className="swap-container__switch">
        <SwapSwitch />
      </button>
      <SwapWindow
        inputValue={buyInputValue}
        setInputValue={setBuyInputValue}
        token={buyToken}
        mode="buy"
        setActiveWallet={setActiveBuyWallet}
        activeWallet={activeBuyWallet}
      />
    </div>
  );
};

export default SwapContainer;
