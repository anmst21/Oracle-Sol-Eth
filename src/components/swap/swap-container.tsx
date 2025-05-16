"use client";

import React, { useCallback, useEffect, useState } from "react";
import SwapWindow from "./swap-window";
import { SwapSwitch } from "../icons";
import { useTokenModal } from "@/context/TokenModalProvider";
import { SwapWallet } from "./types";
import { useActiveWallet } from "@/context/ActiveWalletContext";
import { getEthToken, solanaToken } from "@/helpers/solana-token";

const SwapContainer = () => {
  const [sellInputValue, setSellInputValue] = useState("");
  const [buyInputValue, setBuyInputValue] = useState("");

  const {
    sellToken,
    buyToken,
    nativeSolBalance,
    userEthTokens,
    userSolanaTokens,
    setBuyToken,
    setSellToken,
  } = useTokenModal();

  const getTokenBalance = useCallback(
    (address: string | undefined, chainId: number | undefined) => {
      if (!address || !chainId) return;

      if (chainId === 792703809) {
        if (address === "11111111111111111111111111111111") {
          return nativeSolBalance?.balance.toFixed(6);
        } else {
          return (
            userSolanaTokens?.find((token) => token.address === address)
              ?.balance || 0
          ).toFixed(6);
        }
      } else {
        return (
          userEthTokens?.find(
            (token) => token.address === address && token.chainId === chainId
          )?.balance || 0
        ).toFixed(6);
      }
    },
    [userEthTokens, userSolanaTokens, nativeSolBalance]
  );

  const [activeSellWallet, setActiveSellWallet] = useState<SwapWallet | null>(
    null
  );
  const [activeBuyWallet, setActiveBuyWallet] = useState<SwapWallet | null>(
    null
  );

  const { activeWallet, ethLinked, solLinked, setActiveWallet } =
    useActiveWallet();

  //   useEffect(() => {
  //   if (sellToken?.chainId !== activeSellWallet?.chainId) {
  //     setActiveSellWallet()
  //   }
  // }, [sellToken])

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

    // if (
    //   activeWallet &&
    //   activeWallet.type === "solana" &&
    //   sellToken?.chainId !== 792703809
    // ) {
    //   setSellToken(solanaToken);
    // }
    // if (
    //   activeWallet &&
    //   activeWallet.type === "ethereum" &&
    //   sellToken?.chainId !== Number(activeWallet.chainId.split(":")[1])
    // ) {
    //   const chainId = Number(activeWallet.chainId.split(":")[1]);
    //   const token = getEthToken(chainId);
    //   setSellToken(token);
    // }

    //@ts-nocheck
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
        tokenBalance={getTokenBalance(sellToken?.address, sellToken?.chainId)}
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
        tokenBalance={getTokenBalance(buyToken?.address, buyToken?.chainId)}
      />
    </div>
  );
};

export default SwapContainer;
