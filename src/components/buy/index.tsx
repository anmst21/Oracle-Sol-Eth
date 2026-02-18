"use client";

import {
  CoinbasePurchaseCurrency,
  OnrampFiatCurrency,
} from "@/types/coinbase-onramp";
import BuyWindowInput from "./buy-window-input";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { baseEthToken } from "@/helpers/base-eth-token";
import { solanaToken } from "@/helpers/solana-token";
import { UnifiedToken } from "@/types/coin-types";
import { InputType, OracleRouteType } from "./types";
import { AnimatePresence } from "motion/react";
import CurrenciesModal from "./currencies-modal";
import { useOnRamp } from "@/context/OnRampProvider";

import RegionsModal from "@/components/buy/regions-modal";
import BuyInputWallet from "./buy-input-wallet";
import BuyWindowCta from "./buy-window-cta";

import { fetchCoinbaseQuote } from "@/actions/fetch-coinbase-quote";
import { fetchCoinbaseSessionToken } from "@/actions/fetch-coinbase-session-token";
import { fetchRelayPrice } from "@/helpers/fetch-relay-price";
import { getCoinbaseNetworkName } from "@/helpers/coinbase-chain-map";
import { useActiveWallet } from "@/context/ActiveWalletContext";
import {
  ConnectedSolanaWallet,
  ConnectedWallet,
} from "@privy-io/react-auth";
import { SwapWallet } from "../swap/types";
import { useRouter } from "next/navigation";
import DynamicNotification from "../dynamic-notification";

const USD_CURRENCY: OnrampFiatCurrency = {
  id: "USD",
  code: "usd",
  name: "US Dollar",
  icon: "https://flagcdn.com/us.svg",
  minBuyAmount: 20,
  maxBuyAmount: 10000,
};

type Props = {
  country: string;
  fiatCurrencies: OnrampFiatCurrency[];
  purchaseCurrencies: CoinbasePurchaseCurrency[];
  isSupported: boolean;
};

const BuyWindow = ({
  country,
  fiatCurrencies,
  purchaseCurrencies,
  isSupported,
}: Props) => {
  const {
    setCoinbaseCryptos,
    setUserCountry,
    setIsSupported,
    isOpenRegions,
    setIsOpenRegions,
  } = useOnRamp();
  const router = useRouter();

  useEffect(() => {
    if (purchaseCurrencies.length > 0) {
      setCoinbaseCryptos(purchaseCurrencies);
    }
    setUserCountry(country);
    setIsSupported(isSupported);
  }, [purchaseCurrencies, setCoinbaseCryptos, country, setUserCountry, isSupported, setIsSupported]);

  const defaultFiat = fiatCurrencies.find((f) => f.code === "usd") ?? fiatCurrencies[0] ?? USD_CURRENCY;

  const [fiatCurrency, setFiatCurrency] = useState<OnrampFiatCurrency>(defaultFiat);
  const [activeToken, setActiveToken] = useState<UnifiedToken>(baseEthToken);
  const [inputType, setInputType] = useState<InputType>("fiat");
  const [value, setValue] = useState("20");
  const [debouncedValue, setDebouncedValue] = useState("20");
  const [isOpenCurrencies, setIsOpenCurrencies] = useState(false);

  // Wallet state (lifted from BuyInputWallet)
  const { activeWallet: defaultWallet } = useActiveWallet();
  const [buyWallet, setBuyWallet] = useState<
    SwapWallet | ConnectedWallet | ConnectedSolanaWallet | null
  >(null);

  const handleWalletChange = useCallback(
    (wallet: SwapWallet | ConnectedWallet | ConnectedSolanaWallet | null) => {
      setBuyWallet(wallet);
      if (!wallet) return;
      const walletType = (wallet as SwapWallet).type;
      if (walletType === "solana") {
        setActiveToken(solanaToken);
      } else if (walletType === "ethereum") {
        setActiveToken(baseEthToken);
      }
    },
    []
  );

  useEffect(() => {
    if (!buyWallet && defaultWallet) handleWalletChange(defaultWallet);
  }, [buyWallet, defaultWallet, handleWalletChange]);

  // Quote state
  const [quoteData, setQuoteData] = useState<{
    purchaseAmount: number;
    paymentTotal: number;
    fee: number;
  } | null>(null);
  const [relayEstimate, setRelayEstimate] = useState<string>("");
  const [isLoadingQuote, setIsLoadingQuote] = useState(true);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  // Notification state
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

  const routeType =
    activeToken.source === "coinbase"
      ? OracleRouteType.DIRECT
      : OracleRouteType.ORACLE;

  const onInputValueChange = useCallback(
    (value: string) => {
      setValue(value);
    },
    [setValue]
  );

  const onActiveTokenChange = useCallback(
    (token: UnifiedToken) => {
      setActiveToken(token);
    },
    [setActiveToken]
  );

  const isBuyAllowed = isSupported;

  // Conversion display value (must be above onInputTypeChange)
  const conversionValue = useMemo(() => {
    if (inputType === "crypto" && quoteData) {
      // In crypto mode, show the fiat total as conversion
      return String(quoteData.paymentTotal);
    }
    if (routeType === OracleRouteType.DIRECT && quoteData) {
      return String(quoteData.purchaseAmount);
    }
    if (routeType === OracleRouteType.ORACLE && relayEstimate) {
      return relayEstimate;
    }
    return "";
  }, [inputType, routeType, quoteData, relayEstimate]);

  const onInputTypeChange = useCallback(() => {
    if (conversionValue) {
      const num = parseFloat(conversionValue);
      setValue(isNaN(num) ? conversionValue : parseFloat(num.toFixed(6)).toString());
    }
    setInputType((prev) => (prev === "fiat" ? "crypto" : "fiat"));
  }, [conversionValue]);

  const onPresetClick = useCallback((amt: string) => {
    setInputType("fiat");
    setValue(amt);
  }, []);

  const onCurrenciesOpen = useCallback(() => setIsOpenCurrencies(true), []);

  const onCurrencyChange = useCallback(
    (value: OnrampFiatCurrency) => {
      setFiatCurrency(value);
      setIsOpenCurrencies(false);
      setInputType("fiat");
      setValue(String(value.minBuyAmount));
    },
    [setFiatCurrency]
  );

  // Debounce input value (500ms)
  useEffect(() => {
    const numVal = parseFloat(value);
    if (!value || isNaN(numVal) || numVal <= 0) {
      setDebouncedValue("");
      return;
    }
    const id = setTimeout(() => setDebouncedValue(value), 500);
    return () => clearTimeout(id);
  }, [value]);

  // Track fiat-per-crypto rate from last successful quote
  const rateRef = useRef<number>(0);

  // Fetch quote when debounced value settles
  useEffect(() => {
    let cancelled = false;

    const numVal = parseFloat(debouncedValue);
    if (!debouncedValue || isNaN(numVal) || numVal <= 0) {
      setQuoteData(null);
      setRelayEstimate("");
      setQuoteError(null);
      setIsLoadingQuote(false);
      return;
    }

    // Compute the fiat amount to send to Coinbase
    let fiatAmount: string;
    if (inputType === "fiat") {
      fiatAmount = debouncedValue;
    } else {
      // Crypto mode: estimate fiat from last rate
      if (rateRef.current > 0) {
        fiatAmount = String(Math.max(numVal * rateRef.current, fiatCurrency.minBuyAmount));
      } else {
        // No rate yet — can't quote
        setIsLoadingQuote(false);
        return;
      }
    }

    // Skip if outside payment limits
    const fiatNum = parseFloat(fiatAmount);
    if (fiatNum < fiatCurrency.minBuyAmount || fiatNum > fiatCurrency.maxBuyAmount) {
      setQuoteData(null);
      setRelayEstimate("");
      setIsLoadingQuote(false);
      return;
    }

    setIsLoadingQuote(true);
    setQuoteError(null);

    (async () => {
      try {
        // Always quote ETH on base for Oracle route;
        // for Direct, try the token's network, fall back to ETH if not tradeable
        let purchaseCurrency =
          routeType === OracleRouteType.DIRECT
            ? activeToken.symbol
            : "ETH";
        let purchaseNetwork =
          routeType === OracleRouteType.DIRECT && activeToken.chainId
            ? getCoinbaseNetworkName(activeToken.chainId) ?? undefined
            : "base";
        let fallbackToOracle = false;

        let q: Awaited<ReturnType<typeof fetchCoinbaseQuote>>;
        try {
          q = await fetchCoinbaseQuote({
            purchaseCurrency,
            purchaseNetwork,
            paymentAmount: fiatAmount,
            paymentCurrency: fiatCurrency.code.toUpperCase(),
            country,
          });
        } catch (directErr: any) {
          // If network not tradeable, fall back to buying ETH on base
          if (directErr?.message?.includes("NETWORK_NOT_TRADABLE") ||
              directErr?.message?.includes("NOT_TRADABLE")) {
            purchaseCurrency = "ETH";
            purchaseNetwork = "base";
            fallbackToOracle = true;
            q = await fetchCoinbaseQuote({
              purchaseCurrency,
              purchaseNetwork,
              paymentAmount: fiatAmount,
              paymentCurrency: fiatCurrency.code.toUpperCase(),
              country,
            });
          } else {
            throw directErr;
          }
        }

        if (cancelled) return;

        const purchaseAmount = parseFloat(q.purchase_amount.value);
        const paymentTotal = parseFloat(q.payment_total.value);
        const fee = parseFloat(q.coinbase_fee.value);

        setQuoteData({ purchaseAmount, paymentTotal, fee });

        // Update rate for crypto→fiat conversion
        if (purchaseAmount > 0) {
          rateRef.current = paymentTotal / purchaseAmount;
        }

        if (routeType === OracleRouteType.DIRECT && !fallbackToOracle) {
          setRelayEstimate("");
        } else {
          // ORACLE or fallback: estimate swap from ETH -> target token
          if (purchaseAmount > 0 && activeToken.chainId) {
            const estimate = await fetchRelayPrice({
              originChainId: 1,
              originCurrency: "0x0000000000000000000000000000000000000000",
              destinationChainId: activeToken.chainId,
              destinationCurrency: activeToken.address,
              amount: String(purchaseAmount),
              originDecimals: 18,
            });
            if (cancelled) return;
            setRelayEstimate(estimate ?? "");
          }
        }

        setQuoteError(null);
      } catch (e) {
        if (cancelled) return;
        console.error("Buy quote error:", e);
        const raw = e instanceof Error ? e.message : "Failed to fetch quote";
        let msg = raw;
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const parsed = JSON.parse(jsonMatch[0]);
            msg = parsed.message || parsed.error || raw;
          } catch {
            // keep raw
          }
        }
        setQuoteError(msg);
        triggerNotif(msg, "error");
        setQuoteData(null);
        setRelayEstimate("");
      } finally {
        if (!cancelled) setIsLoadingQuote(false);
      }
    })();

    return () => { cancelled = true; };
  }, [debouncedValue, inputType, activeToken, fiatCurrency.code, routeType, country]);

  const handleBuy = useCallback(async () => {
    if (!buyWallet?.address) {
      triggerNotif("No wallet connected", "error");
      return;
    }

    // Open popup immediately to avoid popup blockers
    const popup = window.open("about:blank", "coinbase-onramp", "width=460,height=720");

    try {
      const chainName = activeToken.chainId
        ? getCoinbaseNetworkName(activeToken.chainId)
        : "ethereum";
      const blockchains = [chainName ?? "ethereum"];
      const assets =
        routeType === OracleRouteType.DIRECT
          ? [activeToken.symbol]
          : ["ETH"];

      const { token } = await fetchCoinbaseSessionToken({
        address: buyWallet.address,
        blockchains,
        assets,
      });

      const isSandbox = process.env.NEXT_PUBLIC_COINBASE_SANDBOX === "true";
      const baseUrl = isSandbox
        ? "https://pay.coinbase.com/buy/select-asset"
        : "https://pay.coinbase.com/buy/select-asset";

      const params = new URLSearchParams({
        sessionToken: token,
        defaultAsset: routeType === OracleRouteType.DIRECT ? activeToken.symbol : "ETH",
        fiatCurrency: fiatCurrency.code.toUpperCase(),
        presetFiatAmount: value,
      });

      if (popup) {
        popup.location.href = `${baseUrl}?${params.toString()}`;

        // Poll for popup close
        const pollTimer = setInterval(() => {
          if (popup.closed) {
            clearInterval(pollTimer);
            handleTransactionCompleted();
          }
        }, 1000);
      } else {
        triggerNotif("Popup blocked — please allow popups for this site", "error");
      }
    } catch (e) {
      console.error("Coinbase session error:", e);
      popup?.close();
      const msg = e instanceof Error ? e.message : "Failed to start checkout";
      triggerNotif(msg, "error");
    }
  }, [routeType, value, activeToken, fiatCurrency.code, buyWallet]);

  const handleTransactionCompleted = useCallback(async () => {
    if (routeType === OracleRouteType.DIRECT) {
      triggerNotif(`Successfully purchased ${activeToken.symbol}!`, "success");
    } else {
      triggerNotif("ETH purchased — redirecting to swap...", "success");
      router.push(
        `/swap?sellAddress=0x0000000000000000000000000000000000000000&sellChainId=1&buyAddress=${activeToken.address}&buyChainId=${activeToken.chainId}`
      );
    }
  }, [routeType, activeToken, router, triggerNotif]);

  return (
    <div className="buy-window">
      <BuyWindowInput
        activeToken={activeToken}
        setActiveToken={onActiveTokenChange}
        value={value}
        setValue={onInputValueChange}
        fiatCurrency={fiatCurrency}
        setFiatCurrency={setFiatCurrency}
        fiatCurrencies={fiatCurrencies}
        isBuyAllowed={isBuyAllowed}
        inputType={inputType}
        switchInputType={onInputTypeChange}
        onCurrenciesOpen={onCurrenciesOpen}
        routeType={routeType}
        isError={!isSupported}
        countryName={country}
        conversionValue={conversionValue}
        isLoadingQuote={isLoadingQuote}
        onPresetClick={onPresetClick}
      />
      <BuyInputWallet
        isError={!isSupported}
        activeWallet={buyWallet}
        setActiveWallet={handleWalletChange}
      />
      <BuyWindowCta
        isError={!isSupported}
        isLoadingQuote={isLoadingQuote}
        quoteError={quoteError}
        hasQuote={!!quoteData}
        hasValue={!!value && parseFloat(value) > 0}
        hasWallet={!!buyWallet}
        routeType={routeType}
        onBuy={handleBuy}
      />
      <AnimatePresence mode="wait">
        {isOpenCurrencies && (
          <CurrenciesModal
            fiatCurrency={fiatCurrency}
            onCurrencyChange={onCurrencyChange}
            fiatCurrencies={fiatCurrencies}
            closeModal={() => setIsOpenCurrencies(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {isOpenRegions && (
          <RegionsModal
            country={country}
            closeModal={() => setIsOpenRegions(false)}
          />
        )}
      </AnimatePresence>
      <DynamicNotification message={notifMessage} type={notifType} time={5} />
    </div>
  );
};

export default BuyWindow;
