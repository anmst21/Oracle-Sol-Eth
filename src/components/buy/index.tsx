"use client";

import {
  MoonpayCountriesResponse,
  MoonpayCryptoCurrency,
  MoonpayFiatCurrency,
  MoonpayIpResponse,
} from "@/types/moonpay-api";
import BuyWindowInput from "./buy-window-input";
import { useCallback, useMemo, useState } from "react";
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

type Props = {
  moonpayIp: MoonpayIpResponse;
  cryptoCurrencies: MoonpayCryptoCurrency[];
  fiatCurrencies: MoonpayFiatCurrency[];
  countries: MoonpayCountriesResponse;
};

const BuyWindow = ({
  moonpayIp,
  cryptoCurrencies,
  fiatCurrencies,
  countries,
}: Props) => {
  const [fiatCurrency, setFiatCurrency] =
    useState<MoonpayFiatCurrency>(usdCurrency);

  const [activeToken, setActiveToken] = useState<UnifiedToken>(baseEthToken);

  const [inputType, setInputType] = useState<InputType>("fiat");

  const [value, setValue] = useState("20");

  const [isOpenCurrencies, setIsOpenCurrencies] = useState(false);

  const [routeType, setRouteType] = useState<OracleRouteType>(
    OracleRouteType.ORACLE
  );
  // fiatCurrency.maxBuyAmount

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
      />
      <BuyInputWallet isError={!moonpayIp.isBuyAllowed} />
      <BuyWindowCta isError={!moonpayIp.isBuyAllowed} />
      <AnimatePresence mode="wait">
        {isOpenCurrencies && (
          <CurrenciesModal
            // type={historyModalMode}
            // setType={setHistoryModalMode}
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
