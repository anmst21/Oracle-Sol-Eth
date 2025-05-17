"use client";

import React, { useCallback, useEffect, useState } from "react";
import SwapWindow from "./swap-window";
import { SwapSwitch } from "../icons";
import { useTokenModal } from "@/context/TokenModalProvider";
import { useActiveWallet } from "@/context/ActiveWalletContext";
import { getEthToken, solanaToken } from "@/helpers/solana-token";
import { solanaChain } from "@/helpers/solanaChain";
import { ConnectedSolanaWallet, ConnectedWallet } from "@privy-io/react-auth";
import SwapMeta from "./swap-meta";

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

  const [activeBuyWallet, setActiveBuyWallet] = useState<
    ConnectedWallet | ConnectedSolanaWallet | null
  >(null);

  const { activeWallet, ethLinked, solLinked, setActiveWallet } =
    useActiveWallet();

  useEffect(() => {
    if (activeWallet && !activeBuyWallet) {
      const chainId =
        activeWallet.type === "ethereum"
          ? Number(activeWallet.chainId.split(":")[1])
          : 792703809;
      if (!buyToken) {
        setActiveBuyWallet(activeWallet);
      } else {
        if (buyToken && buyToken.chainId === 792703809) {
          setActiveBuyWallet(solLinked[0]);
        }
        if (buyToken && buyToken.chainId !== 792703809) {
          setActiveWallet(ethLinked[0]);
        }
      }

      setSellToken(getEthToken(chainId));
    }
  }, [
    activeWallet,
    activeBuyWallet,
    setSellToken,
    setActiveWallet,
    buyToken,
    ethLinked,
    solLinked,
  ]);

  useEffect(() => {
    if (
      activeWallet?.type === "ethereum" &&
      sellToken?.chainId === solanaChain.id
    ) {
      setSellToken(getEthToken(Number(activeWallet.chainId.split(":")[1])));
    }

    if (
      activeWallet?.type === "solana" &&
      sellToken?.chainId !== solanaChain.id
    ) {
      setSellToken(solanaToken);
    }
  }, [activeWallet]);

  useEffect(() => {
    if (
      activeBuyWallet?.type === "ethereum" &&
      buyToken?.chainId === solanaChain.id
    ) {
      setBuyToken(getEthToken(Number(activeBuyWallet.chainId)));
    }

    if (
      activeBuyWallet?.type === "solana" &&
      buyToken?.chainId !== solanaChain.id
    ) {
      setBuyToken(solanaToken);
    }
  }, [activeBuyWallet]);

  useEffect(() => {
    if (
      activeWallet?.type === "ethereum" &&
      sellToken?.chainId === solanaChain.id
    ) {
      setActiveWallet(solLinked[0]);
    }

    if (
      activeWallet?.type === "solana" &&
      sellToken?.chainId !== solanaChain.id
    ) {
      setActiveWallet(ethLinked[0]);
    }
  }, [sellToken]);

  useEffect(() => {
    if (
      activeBuyWallet?.type === "ethereum" &&
      buyToken?.chainId === solanaChain.id
    ) {
      setActiveBuyWallet(solLinked[0]);
    }

    if (
      activeBuyWallet?.type === "solana" &&
      buyToken?.chainId !== solanaChain.id
    ) {
      setActiveBuyWallet(ethLinked[0]);
    }
  }, [buyToken]);

  return (
    <>
      <div className="swap-container">
        <SwapWindow
          inputValue={sellInputValue}
          setInputValue={setSellInputValue}
          token={sellToken}
          mode="sell"
          isNativeBalance
          setActiveWallet={setActiveWallet}
          activeWallet={activeWallet}
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
      <SwapMeta />
    </>
  );
};

export default SwapContainer;
