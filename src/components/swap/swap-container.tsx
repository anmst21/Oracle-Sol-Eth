"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SwapWindow from "./swap-window";
import { SwapSwitch } from "../icons";
import { useTokenModal } from "@/context/TokenModalProvider";
import { useActiveWallet } from "@/context/ActiveWalletContext";
import { getEthToken, solanaToken } from "@/helpers/solana-token";
import { solanaChain } from "@/helpers/solanaChain";
import SwapMeta from "./swap-meta";
import {
  Execute,
  getClient,
  ProgressData,
  RelayChain,
} from "@reservoir0x/relay-sdk";
import { TradeType } from "./types";
import { UnifiedToken } from "@/types/coin-types";
import {
  // convertViemChainToRelayChain,
  MAINNET_RELAY_API,
  createClient,
} from "@reservoir0x/relay-sdk";
// import { base, mainnet } from "viem/chains";
import { parseUnits } from "viem/utils";
import { queryTokenList, useRelayChains } from "@reservoir0x/relay-kit-hooks";
import { useSlippage } from "@/context/SlippageContext";
import BuyBtn from "./buy-btn";
// import { usePrivy } from "@privy-io/react-auth";
// import { SendTransactionError } from "@solana/web3.js";
// import { connection } from "../connects";
// useSearchParams replaced with window.location.search to avoid SSG bailout
import Confirmation from "../confirmation";
import { AnimatePresence } from "motion/react";
// import DeepLink from "../deep-link";
import DynamicNotification from "../dynamic-notification";

// createClient({
//   baseApiUrl: MAINNET_RELAY_API,
//   source: "oracleswap.app",
//   chains: [
//     convertViemChainToRelayChain(mainnet),
//     convertViemChainToRelayChain(base),
//   ],
// });

const SwapContainer = ({ isHero }: { isHero?: boolean }) => {
  const [sellInputValue, setSellInputValue] = useState("");
  const [buyInputValue, setBuyInputValue] = useState("");
  const prevEthSellToken = useRef<UnifiedToken | null>(null);
  const prevSolSellToken = useRef<UnifiedToken | null>(null);
  const prevEthBuyToken = useRef<UnifiedToken | null>(null);
  const prevSolBuyToken = useRef<UnifiedToken | null>(null);

  const {
    isCustomSlippage,
    value: slippageValue,
    isDragging: isDraggingSlippage,
  } = useSlippage();

  const {
    sellToken,
    buyToken,
    nativeSolBalance,
    userEthTokens,
    userSolanaTokens,
    setBuyToken,
    setSellToken,
    //   chains,
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
              ?.balance ?? 0
          ).toFixed(6);
        }
      } else {
        return (
          userEthTokens?.find(
            (token) => token.address === address && token.chainId === chainId
          )?.balance ?? 0
        ).toFixed(6);
      }
    },
    [userEthTokens, userSolanaTokens, nativeSolBalance]
  );

  // console.log("activeWallet", activeWallet);

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
        if (buyToken && buyToken.chainId === 792703809 && solLinked[0]) {
          setActiveBuyWallet({
            chainId: solanaChain.id,
            address: solLinked[0].address,
            type: "solana",
          });
        }
        if (buyToken && buyToken.chainId !== 792703809 && ethLinked[0]) {
          setActiveWallet(ethLinked[0]);
          setActiveBuyWallet({
            address: ethLinked[0].address,
            chainId: Number(ethLinked[0].chainId.split(":")[1]),
            type: "ethereum",
          });
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

  // useEffect(() => {
  //   if (
  //     activeWallet?.type === "ethereum" &&
  //     sellToken?.chainId === solanaChain.id
  //   ) {
  //     setSellToken(getEthToken(Number(activeWallet.chainId.split(":")[1])));
  //   }

  //   if (
  //     activeWallet?.type === "solana" &&
  //     sellToken?.chainId !== solanaChain.id
  //   ) {
  //     setSellToken(solanaToken);
  //   }
  // }, [activeWallet, setSellToken]);

  // When buy token chain changes → switch buy wallet to match
  useEffect(() => {
    if (
      activeBuyWallet?.type === "ethereum" &&
      buyToken?.chainId === solanaChain.id &&
      solLinked[0]
    ) {
      setActiveBuyWallet({
        chainId: solanaChain.id,
        address: solLinked[0].address,
        type: "solana",
      });
    }

    if (
      activeBuyWallet?.type === "solana" &&
      buyToken?.chainId !== solanaChain.id &&
      ethLinked[0]
    ) {
      setActiveBuyWallet({
        chainId: Number(ethLinked[0].chainId.split(":")[1]),
        address: ethLinked[0].address,
        type: "ethereum",
      });
    }
  }, [buyToken]);

  // When buy wallet changes → switch buy token to match
  useEffect(() => {
    if (
      activeBuyWallet?.type === "ethereum" &&
      buyToken?.chainId === solanaChain.id
    ) {
      prevSolBuyToken.current = buyToken;
      setBuyToken(
        prevEthBuyToken.current ??
          getEthToken(Number(activeBuyWallet.chainId))
      );
    }

    if (
      activeBuyWallet?.type === "solana" &&
      buyToken?.chainId !== solanaChain.id
    ) {
      prevEthBuyToken.current = buyToken;
      setBuyToken(prevSolBuyToken.current ?? solanaToken);
    }
  }, [activeBuyWallet]);

  // When sell token chain changes → switch wallet to match
  useEffect(() => {
    if (
      activeWallet?.type === "ethereum" &&
      sellToken?.chainId === solanaChain.id &&
      solLinked[0]
    ) {
      setActiveWallet(solLinked[0]);
    }

    if (
      activeWallet?.type === "solana" &&
      sellToken?.chainId !== solanaChain.id &&
      ethLinked[0]
    ) {
      setActiveWallet(ethLinked[0]);
    }
  }, [sellToken]);

  // When wallet changes → switch sell token to match
  useEffect(() => {
    if (
      activeWallet?.type === "ethereum" &&
      sellToken?.chainId === solanaChain.id
    ) {
      prevSolSellToken.current = sellToken;
      setSellToken(
        prevEthSellToken.current ??
          getEthToken(Number(activeWallet.chainId.split(":")[1]))
      );
    }

    if (
      activeWallet?.type === "solana" &&
      sellToken?.chainId !== solanaChain.id
    ) {
      prevEthSellToken.current = sellToken;
      setSellToken(prevSolSellToken.current ?? solanaToken);
    }
  }, [activeWallet]);

  // useEffect(() => {
  //   if (
  //     activeBuyWallet?.type === "ethereum" &&
  //     buyToken?.chainId === solanaChain.id
  //   ) {
  //     setActiveBuyWallet({
  //       chainId: solanaChain.id,
  //       address: solLinked[0].address,
  //       type: "ethereum",
  //     });
  //   }

  //   if (
  //     activeBuyWallet?.type === "solana" &&
  //     buyToken?.chainId !== solanaChain.id
  //   ) {
  //     setActiveBuyWallet({
  //       chainId: Number(ethLinked[0].chainId.split(":")[1]),
  //       address: ethLinked[0].address,
  //       type: "ethereum",
  //     });
  //   }
  // }, [buyToken, setActiveBuyWallet]);

  const [quote, setQuote] = useState<Execute | null>(null);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [tradeType, setTradeType] = useState<TradeType>(TradeType.EXACT_INPUT);
  const [notifMessage, setNotifMessage] = useState("");
  const [notifType, setNotifType] = useState<"error" | "success" | null>(null);

  const triggerNotif = useCallback(
    (message: string, type: "error" | "success") => {
      setNotifMessage("");
      setNotifType(null);
      setTimeout(() => {
        setNotifMessage(message);
        setNotifType(type);
      }, 0);
    },
    []
  );

  // console.log("quote", quote, error, tradeType);

  const handleTokenSwitch = useCallback(() => {
    if (isLoading) return;
    setIsSwitching(true);
    setQuote(null);
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

    if (buyToken) setSellToken(buyToken);
    if (sellToken) setBuyToken(sellToken);

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
  }, [quote]);

  // console.log("quote active", activeBuyWallet, buyToken);
  const { chains, isSuccess: chainsLoaded } = useRelayChains();

  // Cache chains from useRelayChains() — these have viemChain populated.
  // The SDK's internal configureDynamicChains() overwrites getClient().chains
  // with objects that LACK viemChain, so we must restore before every execute.
  const chainsRef = useRef<RelayChain[]>([]);
  if (chainsLoaded && chains?.length) {
    chainsRef.current = chains as RelayChain[];
  }

  // Create the client once — never re-create on chain changes so we don't
  // replace the global singleton with one that has empty/fallback chains.
  const client = useMemo(
    () =>
      createClient({
        baseApiUrl: MAINNET_RELAY_API,
        source: "oracleswap.app",
      }),
    []
  );

  const fetchQuote = useCallback(async (): Promise<void> => {
    setError(null);
    setIsLoading(true);
    if (isSwitching) return setIsLoading(false);

    if (
      (buyInputValue.length === 0 && tradeType === TradeType.EXACT_OUTPUT) ||
      (sellInputValue.length === 0 && tradeType === TradeType.EXACT_INPUT)
    )
      return setIsLoading(false);

    if (
      !adaptedWallet ||
      !activeWallet ||
      !activeBuyWallet ||
      !sellToken ||
      !buyToken
    ) {
      // if (isLoading) return;
      // if we don’t have everything we need, clear quote and bail
      setQuote(null);
      return setIsLoading(false);
    }

    try {
      //   const client = getClient();
      if (!client) {
        console.warn("SDK client not initialized yet");
        return setIsLoading(false);
      }

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
      // console.log("quote props", {
      //   chainId: sellToken.chainId as number,
      //   toChainId: buyToken.chainId as number,
      //   currency: sellToken.address,
      //   toCurrency: buyToken.address,
      //   amount: amountWei.toString(),
      //   wallet: adaptedWallet,
      //   recipient: activeBuyWallet.address,
      //   tradeType,
      // });

      const q = await client.actions.getQuote({
        chainId: sellToken.chainId as number,
        toChainId: buyToken.chainId as number,
        currency: sellToken.address,
        toCurrency: buyToken.address,
        amount: amountWei.toString(),
        wallet: adaptedWallet,
        user: activeWallet.address,
        recipient: activeBuyWallet.address,
        tradeType,
        options: {
          appFees: [
            {
              fee: "100",
              recipient: "0x1334429526Fa8B41BC2CfFF3a33C5762c5eD0Bce",
            },
          ],
          slippageTolerance: isCustomSlippage
            ? Math.round(slippageValue * 100).toString()
            : undefined,
        },
      });

      setError(null);
      setQuote(q);
      setIsLoading(false);
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
        triggerNotif("No routes found for that pair", "error");
        setIsLoading(false);
      } else if (msg.toLowerCase().includes("decimals")) {
        setIsLoading(false);
        setError("Unable to fetch quote");
        triggerNotif("Unable to fetch quote", "error");
      } else if (msg.includes("Invalid address")) {
        setError("Invalid address for chain");
        triggerNotif("Invalid address for chain", "error");
        setIsLoading(false);
      } else if (msg.includes("Swap output amount is too small")) {
        setError("Swap output amount is too small");
        triggerNotif("Swap output amount is too small", "error");
        setIsLoading(false);
      } else {
        setError(msg);
        triggerNotif(msg, "error");
        setIsLoading(false);
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
    // client,
    isSwitching,
    sellInputValue,
    sellToken,
    tradeType,
    slippageValue,
    client,
    isCustomSlippage,
  ]);

  useEffect(() => {
    // reset error any time inputs change

    if (
      adaptedWallet &&
      activeBuyWallet &&
      activeWallet &&
      sellToken &&
      buyToken &&
      !isSwitching &&
      !isDraggingSlippage
    )
      fetchQuote();
  }, [
    adaptedWallet,
    activeBuyWallet,
    sellToken,
    activeWallet,
    buyToken,
    isSwitching,
    slippageValue,
    isDraggingSlippage,
    isCustomSlippage,
  ]);

  const onBuy = useCallback(async () => {
    if (quote && adaptedWallet && sellToken?.chainId) {
      const chainId = await adaptedWallet.getChainId();
      console.log("[swap-debug] wallet chainId:", chainId, "| expected:", sellToken.chainId);

      if (chainId !== sellToken?.chainId) {
        console.log("[swap-debug] switching chain from", chainId, "to", sellToken.chainId);
        try {
          await adaptedWallet.switchChain(sellToken.chainId);
          const newChainId = await adaptedWallet.getChainId();
          console.log("[swap-debug] chain after switch:", newChainId);
        } catch (switchErr) {
          console.error("[swap-debug] switchChain failed:", switchErr);
          triggerNotif("Failed to switch network", "error");
          return;
        }
      }

      // The SDK's configureDynamicChains() can overwrite getClient().chains
      // with objects that lack viemChain. Wrap wallet handlers so we restore
      // the properly-configured chains right before the SDK does its lookup.
      const ensureChains = () => {
        if (chainsRef.current.length) {
          getClient().chains = chainsRef.current;
        }
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const wrap = (fn: (...a: any[]) => any) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async (...a: any[]) => { ensureChains(); return fn(...a); };
      const walletWithChains = {
        ...adaptedWallet,
        handleSendTransactionStep: wrap(adaptedWallet.handleSendTransactionStep),
        ...(adaptedWallet.handleBatchTransactionStep && {
          handleBatchTransactionStep: wrap(adaptedWallet.handleBatchTransactionStep),
        }),
        ...(adaptedWallet.handleConfirmTransactionStep && {
          handleConfirmTransactionStep: wrap(adaptedWallet.handleConfirmTransactionStep),
        }),
      };

      console.log("[swap-debug] executing quote...");
      ensureChains();
      try {
        await client.actions.execute({
          quote,
          wallet: walletWithChains,
          onProgress: (progress) => setProgress(progress),
        });
      } catch (err) {
        console.error("[swap-debug] execute error:", err);
        setProgress(null);
        const msg =
          err instanceof Error ? err.message : typeof err === "string" ? err : "";
        const lower = msg.toLowerCase();
        if (
          lower.includes("user rejected") ||
          lower.includes("user denied") ||
          lower.includes("action_rejected")
        ) {
          triggerNotif("Transaction rejected in wallet", "error");
        } else {
          triggerNotif(
            msg ? msg.slice(0, 100) : "Transaction failed",
            "error"
          );
        }
      }
    }
  }, [adaptedWallet, client, quote, sellToken?.chainId, triggerNotif]);

  // console.log("progress", progress, quote, adaptedWallet);

  ////// url deeplinking logic
  const deepLinked = useRef(false);

  useEffect(() => {
    if (deepLinked.current) return;
    const sp = new URLSearchParams(window.location.search);
    const sellAddress = sp.get("sellAddress");
    const sellChainId = sp.get("sellChainId");
    const buyAddress = sp.get("buyAddress");
    const buyChainId = sp.get("buyChainId");

    if (sellAddress && sellChainId && buyAddress && buyChainId) {
      deepLinked.current = true;
      const sChainId = Number(sellChainId);
      const bChainId = Number(buyChainId);

      setSellToken({
        source: "eth",
        chainId: sChainId,
        address: sellAddress,
        symbol: "ETH",
        name: "Ether",
        logo: `https://assets.relay.link/icons/${sChainId}/light.png`,
      });

      // Fetch token metadata for the buy token
      queryTokenList("https://api.relay.link", {
        chainIds: [bChainId],
        address: buyAddress,
      }).then((tokens) => {
        if (tokens.length > 0) {
          const t = tokens[0];
          setBuyToken({
            source: "relay",
            chainId: bChainId,
            address: buyAddress,
            symbol: t.symbol ?? buyAddress.slice(0, 6),
            name: t.name ?? "Unknown",
            logo: t.metadata?.logoURI ?? undefined,
            decimals: t.decimals ?? undefined,
          });
        } else {
          setBuyToken({
            source: "relay",
            chainId: bChainId,
            address: buyAddress,
            symbol: buyAddress.slice(0, 6),
            name: "Unknown Token",
          });
        }
      });
    }
  }, [setSellToken, setBuyToken]);

  const clearProgressState = useCallback(() => {
    setProgress(null);
  }, []);

  const sellTokenBalance = useMemo(
    () => getTokenBalance(sellToken?.address, sellToken?.chainId),
    [sellToken, getTokenBalance]
  );
  const buyTokenBalance = useMemo(
    () => getTokenBalance(buyToken?.address, buyToken?.chainId),
    [buyToken, getTokenBalance]
  );

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
          tokenBalance={sellTokenBalance}
          tradeType={tradeType}
          setTradeType={setTradeType}
          fetchQuote={fetchQuote}
          isSwitching={isSwitching}
          tokenPrice={quote?.details?.currencyIn?.amountUsd}
          isLoadingQuote={isLoading}
          setToken={setSellToken}
        />
        <button onClick={handleTokenSwitch} className="swap-container__switch">
          <SwapSwitch />
          <span>Switch</span>
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
          tokenBalance={buyTokenBalance}
          tradeType={tradeType}
          setTradeType={setTradeType}
          fetchQuote={fetchQuote}
          isSwitching={isSwitching}
          tokenPrice={quote?.details?.currencyOut?.amountUsd}
          isLoadingQuote={isLoading}
          setToken={setBuyToken}
        />
      </div>
      <BuyBtn
        isInsuficientBalance={
          Number(sellTokenBalance) <
          Number(quote?.details?.currencyIn?.amountFormatted)
        }
        isNoInputData={
          (buyInputValue.length === 0 &&
            tradeType === TradeType.EXACT_OUTPUT) ||
          (sellInputValue.length === 0 && tradeType === TradeType.EXACT_INPUT)
        }
        isNoTokenData={!buyToken || !sellToken}
        isNoWalletData={!activeWallet || !activeBuyWallet}
        isLoadingQuote={isLoading}
        error={error}
        quote={quote}
        onBuy={onBuy}
        isAdaptedWallet={adaptedWallet !== null}
      />
      {!isHero && <SwapMeta isLoading={isLoading} quote={quote} />}
      {/* <DeepLink /> */}
      <DynamicNotification message={notifMessage} type={notifType} time={5} />
      <AnimatePresence mode="wait">
        {progress && (
          <Confirmation
            isInsuficientBalance={
              Number(sellTokenBalance) <
              Number(quote?.details?.currencyIn?.amountFormatted)
            }
            clearProgressState={clearProgressState}
            progress={progress}
            buyTokenLogo={buyToken?.logo}
            sellTokenLogo={sellToken?.logo}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default SwapContainer;
