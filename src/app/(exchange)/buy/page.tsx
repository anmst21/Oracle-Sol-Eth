"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import BuyInput from "@/components/buy/buy-input";
import TokenToBuy from "@/components/buy/token-to-buy";
import RecipientWindow from "@/components/buy/recipient-window";

const MoonPayBuyWidget = dynamic(
  () => import("@moonpay/moonpay-react").then((mod) => mod.MoonPayBuyWidget),
  { ssr: false }
);

export default function Page() {
  const [visible, setVisible] = useState(false);

  return (
    <div className="buy-page">
      <div className="buy-widget">
        <div className="buy-widget__header">
          <span>Enter the amount</span>
        </div>
        <BuyInput />
        <TokenToBuy />
        <RecipientWindow />
      </div>

      {/* <MoonPayBuyWidget
        variant="embedded"
        baseCurrencyCode="usd"
        baseCurrencyAmount="100"
        defaultCurrencyCode="sol"
        visible={visible}
        showAllCurrencies="true"
      />
      <button onClick={() => setVisible(!visible)}>Toggle widget</button> */}
    </div>
  );
}
