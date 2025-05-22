"use client";

import React, { useCallback, useEffect, useState } from "react";
import SwapWindow from "./swap-window";
import { SwapSwitch } from "../icons";
import { useTokenModal } from "@/context/TokenModalProvider";
import { useActiveWallet } from "@/context/ActiveWalletContext";
import { getEthToken, solanaToken } from "@/helpers/solana-token";
import { solanaChain } from "@/helpers/solanaChain";
import SwapMeta from "./swap-meta";
import { Execute, getClient } from "@reservoir0x/relay-sdk";
import { TradeType } from "./types";
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
        setActiveBuyWallet({
          address: activeWallet.address,
          chainId,
          type: activeWallet.type,
        });
      } else {
        if (buyToken && buyToken.chainId === 792703809) {
          setActiveBuyWallet({
            chainId: solanaChain.id,
            address: solLinked[0].address,
            type: "ethereum",
          });
        }
        if (buyToken && buyToken.chainId !== 792703809) {
          setActiveWallet(ethLinked[0]);
        }
      }

      setSellToken(getEthToken(chainId));
      setBuyToken(getEthToken(chainId));
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
      setActiveBuyWallet({
        chainId: solanaChain.id,
        address: solLinked[0].address,
        type: "ethereum",
      });
    }

    if (
      activeBuyWallet?.type === "solana" &&
      buyToken?.chainId !== solanaChain.id
    ) {
      setActiveBuyWallet({
        chainId: Number(ethLinked[0].chainId.split(":")[1]),
        address: ethLinked[0].address,
        type: "ethereum",
      });
    }
  }, [buyToken, setActiveBuyWallet]);

  const [quote, setQuote] = useState<Execute | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [tradeType, setTradeType] = useState<TradeType>(TradeType.EXACT_INPUT);

  console.log("quote", quote, error, tradeType);

  const handleTokenSwitch = useCallback(() => {
    if (isLoading) return;
    // 1. swap tokens
    setIsSwitching(true);
    // 2. swap wallets

    const resolveActiveBuyWallet = () => {
      if (activeBuyWallet) {
        const result = (
          activeBuyWallet?.type === "solana" ? solLinked : ethLinked
        ).find((wallet) => wallet.address === activeBuyWallet.address);
        if (result) {
          return result;
        } else {
          return ethLinked[0] || solLinked[0];
        }
      } else return ethLinked[0] || solLinked[0];
    };

    setActiveWallet(resolveActiveBuyWallet());
    if (activeWallet) {
      const chainId =
        activeWallet.type === "ethereum"
          ? Number(activeWallet.chainId.split(":")[1])
          : 792703809;
      setActiveBuyWallet({
        address: activeWallet?.address,
        type: activeWallet?.type,
        chainId,
      });
    }

    setSellToken(buyToken!);
    setBuyToken(sellToken!);

    // 3. swap input values based on tradeType
    if (tradeType === TradeType.EXACT_INPUT) {
      // we stay in EXACT_INPUT mode, so the new sellInput is the old buyInput
      setBuyInputValue(sellInputValue);
      setSellInputValue("");
      setTradeType(TradeType.EXACT_OUTPUT);
    } else {
      // in EXACT_OUTPUT, new buyInput is the old sellInput

      setSellInputValue(buyInputValue);
      setBuyInputValue("");
      setTradeType(TradeType.EXACT_INPUT);
    }
    setIsSwitching(false);
  }, [
    setIsSwitching,
    setSellToken,
    setBuyToken,
    ethLinked,
    solLinked,
    setActiveWallet,
    setActiveBuyWallet,
    setSellInputValue,
    setBuyInputValue,
    setTradeType,
    activeBuyWallet,
    activeWallet,
    buyInputValue,
    buyToken,
    isLoading,
    sellInputValue,
    sellToken,
    tradeType,
  ]);

  useEffect(() => {
    if (
      tradeType === TradeType.EXACT_INPUT &&
      quote &&
      quote.details?.currencyOut?.amountFormatted
    ) {
      setBuyInputValue(quote.details?.currencyOut?.amountFormatted);
    }
    if (
      tradeType === TradeType.EXACT_OUTPUT &&
      quote &&
      quote.details?.currencyIn?.amountFormatted
    ) {
      setSellInputValue(quote.details?.currencyIn?.amountFormatted);
    }
  }, [quote, tradeType]);

  console.log("quote active", activeBuyWallet, buyToken);

  const fetchQuote = useCallback(async (): Promise<void> => {
    setError(null);
    if (isSwitching) return;
    // if (isLoading) return;
    // if we don’t have everything we need, clear quote and bail
    if (
      !adaptedWallet ||
      !activeWallet ||
      !activeBuyWallet ||
      !sellToken ||
      !buyToken
    ) {
      setQuote(null);
      return;
    }

    const client = getClient();
    if (!client) {
      console.warn("SDK client not initialized yet");
      return;
    }
    try {
      setIsLoading(true);
      const tokenMeta = await queryTokenList("https://api.relay.link", {
        chainIds: [
          (tradeType === TradeType.EXACT_INPUT ? sellToken : buyToken)
            .chainId as number,
        ],
        address: (tradeType === TradeType.EXACT_INPUT ? sellToken : buyToken)
          .address,
      });

      if (tokenMeta.length === 0) {
        throw new Error("Token metadata not found");
      }

      const decimals = tokenMeta[0].decimals;
      if (decimals == null) {
        throw new Error("Token decimals not available");
      }

      const amountWei = parseUnits(
        tradeType === TradeType.EXACT_INPUT ? sellInputValue : buyInputValue,
        decimals
      );
      console.log("quote props", {
        chainId: sellToken.chainId as number,
        toChainId: buyToken.chainId as number,
        currency: sellToken.address,
        toCurrency: buyToken.address,
        amount: amountWei.toString(),
        wallet: adaptedWallet,
        recipient: activeBuyWallet.address,
        tradeType,
      });

      const q = await client.actions.getQuote({
        chainId: sellToken.chainId as number,
        toChainId: buyToken.chainId as number,
        currency: sellToken.address,
        toCurrency: buyToken.address,
        amount: amountWei.toString(),
        wallet: adaptedWallet,
        recipient: activeBuyWallet.address,
        tradeType,
        // options: {
        //   slippageTolerance: "50",
        // },
      });

      if (error) setError(null);
      setQuote(q);
      setIsLoading(false);
    } catch (e: unknown) {
      console.error("Failed to fetch quote:", e);
      setIsLoading(false);
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
      if (tradeType === TradeType.EXACT_INPUT) setBuyInputValue("");
      if (tradeType === TradeType.EXACT_OUTPUT) setSellInputValue("");
      setQuote(null);
    }
  }, [
    activeBuyWallet,
    activeWallet,
    adaptedWallet,
    buyInputValue,
    buyToken,
    error,
    isSwitching,
    sellInputValue,
    sellToken,
    tradeType,
  ]);

  useEffect(() => {
    // reset error any time inputs change
    if (
      (buyInputValue.length > 0 || sellInputValue.length > 0) &&
      adaptedWallet &&
      activeBuyWallet &&
      activeWallet &&
      sellToken &&
      buyToken &&
      !isSwitching
    )
      fetchQuote();
  }, [adaptedWallet, activeBuyWallet, sellToken, buyToken, isSwitching]);

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
          setActiveBuyWallet={setActiveBuyWallet}
          activeWallet={activeWallet}
          tokenBalance={getTokenBalance(sellToken?.address, sellToken?.chainId)}
          tradeType={tradeType}
          setTradeType={setTradeType}
          fetchQuote={fetchQuote}
          isSwitching={isSwitching}
        />
        <button onClick={handleTokenSwitch} className="swap-container__switch">
          <SwapSwitch />
        </button>
        <SwapWindow
          inputValue={buyInputValue}
          setInputValue={setBuyInputValue}
          token={buyToken}
          mode="buy"
          setActiveWallet={setActiveBuyWallet}
          setActiveBuyWallet={setActiveBuyWallet}
          activeWallet={activeBuyWallet}
          tokenBalance={getTokenBalance(buyToken?.address, buyToken?.chainId)}
          tradeType={tradeType}
          setTradeType={setTradeType}
          fetchQuote={fetchQuote}
          isSwitching={isSwitching}
        />
      </div>
      <SwapMeta quote={quote} />
    </>
  );
};

export default SwapContainer;
