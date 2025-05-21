"use client";

import React, { useCallback, useEffect, useState } from "react";
import SwapWindow from "./swap-window";
import { SwapSwitch } from "../icons";
import { useTokenModal } from "@/context/TokenModalProvider";
import { useActiveWallet } from "@/context/ActiveWalletContext";
import { getEthToken, solanaToken } from "@/helpers/solana-token";
import { solanaChain } from "@/helpers/solanaChain";
import SwapMeta from "./swap-meta";
import { APIError, Execute, getClient } from "@reservoir0x/relay-sdk";

import {
  convertViemChainToRelayChain,
  MAINNET_RELAY_API,
  createClient,
} from "@reservoir0x/relay-sdk";
import { base, mainnet } from "viem/chains";
import { parseUnits } from "viem/utils";
import { queryTokenList } from "@reservoir0x/relay-kit-hooks";

createClient({
  baseApiUrl: MAINNET_RELAY_API,
  source: "YOUR.SOURCE",
  chains: [
    convertViemChainToRelayChain(mainnet),
    convertViemChainToRelayChain(base),
  ],
});

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

  const {
    activeWallet,
    ethLinked,
    solLinked,
    setActiveWallet,
    activeBuyWallet,
    setActiveBuyWallet,
    adaptedWallet,
  } = useActiveWallet();

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

  console.log("activeWallet", activeWallet);

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
    setActiveBuyWallet,
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
  }, [activeWallet, setSellToken]);

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
  }, [activeBuyWallet, setBuyToken]);

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
  }, [sellToken, setActiveWallet]);

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
  }, [buyToken, setActiveBuyWallet]);

  const [quote, setQuote] = useState<Execute | null>(null);
  const [error, setError] = useState<string | null>(null);
  console.log("quote", quote, error);
  useEffect((): void => {
    // reset error any time inputs change
    setError(null);

    // if we don’t have everything we need, clear quote and bail
    if (
      !adaptedWallet ||
      !activeWallet ||
      !activeBuyWallet ||
      !sellToken ||
      !buyToken ||
      !sellInputValue
    ) {
      setQuote(null);
      return;
    }

    const client = getClient();
    if (!client) {
      console.warn("SDK client not initialized yet");
      return;
    }

    const fetchQuote = async (): Promise<void> => {
      try {
        const tokenMeta = await queryTokenList("https://api.relay.link", {
          chainIds: [sellToken.chainId as number],
          address: sellToken.address,
        });

        if (tokenMeta.length === 0) {
          throw new Error("Token metadata not found");
        }

        const decimals = tokenMeta[0].decimals;
        if (decimals == null) {
          throw new Error("Token decimals not available");
        }

        const amountWei = parseUnits(sellInputValue, decimals);

        const q = await client.actions.getQuote({
          chainId: sellToken.chainId as number,
          toChainId: buyToken.chainId as number,
          currency: sellToken.address,
          toCurrency: buyToken.address,
          amount: amountWei.toString(),
          wallet: adaptedWallet,
          recipient: activeBuyWallet.address,
          tradeType: "EXACT_INPUT",
          // options: {
          //   slippageTolerance: "50",
          // },
        });

        if (error) setError(null);
        setQuote(q);
      } catch (e: unknown) {
        console.error("Failed to fetch quote:", e);

        // safely extract message
        const msg =
          e instanceof Error
            ? e.message
            : typeof e === "string"
            ? e
            : "Unknown error";

        if (msg.toLowerCase().includes("no routes found")) {
          setError("No routes found for that pair");
        } else if (msg.toLowerCase().includes("decimals")) {
          setError("Unable to fetch quote");
        } else {
          setError(msg);
        }

        setQuote(null);
      }
    };

    fetchQuote();
  }, [
    adaptedWallet,
    activeWallet,
    activeBuyWallet,
    sellToken,
    buyToken,
    sellInputValue,
    error,
  ]);

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
      <SwapMeta quote={quote} />
    </>
  );
};

export default SwapContainer;
