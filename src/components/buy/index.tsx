import {
  MoonpayCountriesResponse,
  MoonpayCryptoCurrency,
  MoonpayFiatCurrency,
  MoonpayIpResponse,
} from "@/types/moonpay-api";
import React from "react";

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
  console.log({ countries, moonpayIp, cryptoCurrencies, fiatCurrencies });
  return (
    <div className="buy-window">
      <div className="buy-window-input"></div>
      <div className="buy-window-wallet"></div>
      <div className="buy-window-cta"></div>
    </div>
  );
};

export default BuyWindow;
