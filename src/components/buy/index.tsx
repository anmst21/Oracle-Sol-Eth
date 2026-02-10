"use client";

import {
  MoonpayBuyQuoteResponse,
  MoonpayCountriesResponse,
  MoonpayCryptoCurrency,
  MoonpayFiatCurrency,
  MoonpayIpResponse,
} from "@/types/moonpay-api";
import BuyWindowInput from "./buy-window-input";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usdCurrency } from "@/helpers/moonpay-usd-currency";
import { baseEthToken } from "@/helpers/base-eth-token";
import { UnifiedToken } from "@/types/coin-types";
import { InputType, OracleRouteType } from "./types";
import { AnimatePresence } from "motion/react";
import CurrenciesModal from "./currencies-modal";
import { useOnRamp } from "@/context/OnRampProvider";

import RegionsModal from "@/components/buy/regions-modal";
import BuyInputWallet from "./buy-input-wallet";
import BuyWindowCta from "./buy-window-cta";

import { fetchMoonpayBuyQuote } from "@/actions/fetch-moonpay-quote";
import { fetchRelayPrice } from "@/helpers/fetch-relay-price";
import { getMoonpayCode } from "@/helpers/get-moonpay-code";
import { useActiveWallet } from "@/context/ActiveWalletContext";
import {
  ConnectedSolanaWallet,
  ConnectedWallet,
} from "@privy-io/react-auth";
import { SwapWallet } from "../swap/types";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const MoonPayBuyWidget = dynamic(
  () => import("@moonpay/moonpay-react").then((mod) => mod.MoonPayBuyWidget),
  { ssr: false }
);

type Props = {
  moonpayIp: MoonpayIpResponse;
  fiatCurrencies: MoonpayFiatCurrency[];
  cryptoCurrencies: MoonpayCryptoCurrency[];
  countries: MoonpayCountriesResponse;
};

const BuyWindow = ({
  moonpayIp,
  fiatCurrencies,
  cryptoCurrencies,
  countries,
}: Props) => {
  const { setMoonpayCryptos } = useOnRamp();
  const router = useRouter();

  useEffect(() => {
    if (cryptoCurrencies.length > 0) {
      setMoonpayCryptos(cryptoCurrencies);
    }
  }, [cryptoCurrencies, setMoonpayCryptos]);

  const [fiatCurrency, setFiatCurrency] =
    useState<MoonpayFiatCurrency>(usdCurrency);
  const [activeToken, setActiveToken] = useState<UnifiedToken>(baseEthToken);
  const [inputType, setInputType] = useState<InputType>("fiat");
  const [value, setValue] = useState("20");
  const [isOpenCurrencies, setIsOpenCurrencies] = useState(false);

  // Wallet state (lifted from BuyInputWallet)
  const { activeWallet: defaultWallet } = useActiveWallet();
  const [buyWallet, setBuyWallet] = useState<
    SwapWallet | ConnectedWallet | ConnectedSolanaWallet | null
  >(null);

  useEffect(() => {
    if (!buyWallet && defaultWallet) setBuyWallet(defaultWallet);
  }, [buyWallet, defaultWallet]);

  // Quote state
  const [quote, setQuote] = useState<MoonpayBuyQuoteResponse | null>(null);
  const [relayEstimate, setRelayEstimate] = useState<string>("");
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  // MoonPay widget state
  const [showWidget, setShowWidget] = useState(false);

  const routeType =
    activeToken.source === "moonpay"
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

  const isBuyAllowed = useMemo(
    () => moonpayIp.isAllowed && moonpayIp.isBuyAllowed,
    [moonpayIp]
  );

  const onInputTypeChange = useCallback(() => {
    if (inputType === "crypto") setInputType("fiat");
    if (inputType === "fiat") setInputType("crypto");
  }, [setInputType, inputType]);

  const onCurrenciesOpen = useCallback(() => setIsOpenCurrencies(true), []);

  const onCurrencyChange = useCallback(
    (value: MoonpayFiatCurrency) => {
      setFiatCurrency(value);
      setIsOpenCurrencies(false);
      setInputType("fiat");
      setValue(String(value.minAmount));
    },
    [setFiatCurrency]
  );

  const { isOpenRegions, setIsOpenRegions } = useOnRamp();

  // Debounced quote fetching
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const fiatAmount = parseFloat(value);
    if (!value || isNaN(fiatAmount) || fiatAmount <= 0) {
      setQuote(null);
      setRelayEstimate("");
      setQuoteError(null);
      setIsLoadingQuote(false);
      return;
    }

    setIsLoadingQuote(true);
    setQuoteError(null);

    debounceRef.current = setTimeout(async () => {
      try {
        const moonpayCode = getMoonpayCode(activeToken, cryptoCurrencies);
        if (!moonpayCode) {
          setQuoteError("Token not supported");
          setIsLoadingQuote(false);
          return;
        }

        if (routeType === OracleRouteType.DIRECT) {
          // DIRECT: fetch MoonPay quote for the token directly
          const q = await fetchMoonpayBuyQuote({
            currencyCode: moonpayCode,
            baseCurrencyCode: fiatCurrency.code,
            baseCurrencyAmount: value,
          });
          setQuote(q);
          setRelayEstimate("");
        } else {
          // ORACLE: fetch MoonPay quote for eth_base, then Relay price
          const q = await fetchMoonpayBuyQuote({
            currencyCode: "eth_base",
            baseCurrencyCode: fiatCurrency.code,
            baseCurrencyAmount: value,
          });
          setQuote(q);

          // Now estimate swap from base ETH → target token
          if (q.quoteCurrencyAmount > 0 && activeToken.chainId) {
            const estimate = await fetchRelayPrice({
              originChainId: 8453,
              originCurrency: "0x0000000000000000000000000000000000000000",
              destinationChainId: activeToken.chainId,
              destinationCurrency: activeToken.address,
              amount: String(q.quoteCurrencyAmount),
              originDecimals: 18,
            });
            setRelayEstimate(estimate ?? "");
          }
        }

        setQuoteError(null);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to fetch quote";
        setQuoteError(msg);
        setQuote(null);
        setRelayEstimate("");
      } finally {
        setIsLoadingQuote(false);
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, activeToken, fiatCurrency.code, routeType, cryptoCurrencies]);

  // Conversion display value
  const conversionValue = useMemo(() => {
    if (routeType === OracleRouteType.DIRECT && quote) {
      return String(quote.quoteCurrencyAmount);
    }
    if (routeType === OracleRouteType.ORACLE && relayEstimate) {
      return relayEstimate;
    }
    return "";
  }, [routeType, quote, relayEstimate]);

  // MoonPay widget currency code
  const widgetCurrencyCode = useMemo(() => {
    if (routeType === OracleRouteType.DIRECT) {
      return getMoonpayCode(activeToken, cryptoCurrencies) ?? undefined;
    }
    return "eth_base";
  }, [routeType, activeToken, cryptoCurrencies]);

  const handleBuy = useCallback(() => {
    setShowWidget(true);
  }, []);

  const handleTransactionCompleted = useCallback(async () => {
    setShowWidget(false);
    if (routeType === OracleRouteType.ORACLE) {
      router.push(
        `/swap?sellAddress=0x0000000000000000000000000000000000000000&sellChainId=8453&buyAddress=${activeToken.address}&buyChainId=${activeToken.chainId}`
      );
    }
  }, [routeType, activeToken, router]);

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
        isError={!moonpayIp.isBuyAllowed}
        countryName={moonpayIp.country}
        conversionValue={conversionValue}
        isLoadingQuote={isLoadingQuote}
      />
      <BuyInputWallet
        isError={!moonpayIp.isBuyAllowed}
        activeWallet={buyWallet}
        setActiveWallet={setBuyWallet}
      />
      <BuyWindowCta
        isError={!moonpayIp.isBuyAllowed}
        isLoadingQuote={isLoadingQuote}
        quoteError={quoteError}
        hasQuote={!!quote}
        hasValue={!!value && parseFloat(value) > 0}
        hasWallet={!!buyWallet}
        routeType={routeType}
        onBuy={handleBuy}
      />
      {showWidget && widgetCurrencyCode && (
        <MoonPayBuyWidget
          variant="overlay"
          currencyCode={widgetCurrencyCode}
          baseCurrencyCode={fiatCurrency.code}
          baseCurrencyAmount={value}
          walletAddress={buyWallet?.address}
          visible={showWidget}
          onTransactionCompleted={handleTransactionCompleted}
          onCloseOverlay={() => setShowWidget(false)}
        />
      )}
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
            moonpayIp={moonpayIp}
            countries={countries}
            closeModal={() => setIsOpenRegions(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BuyWindow;
