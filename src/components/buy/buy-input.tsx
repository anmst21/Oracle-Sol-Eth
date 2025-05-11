"use client";

import { BuySwap } from "../icons";
import React, { useState, ChangeEvent } from "react";

const MIN_AMOUNT = 20;
const ETH_PRICE = 2500; // your real $/ETH feed here

export default function BuyInput() {
  const [amount, setAmount] = useState<number>(MIN_AMOUNT);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;
    if (raw.startsWith("$")) raw = raw.slice(1);
    const cleaned = raw.replace(/[^\d.]/g, "");

    if (cleaned === "") {
      setAmount(0);
      return;
    }

    const parsed = parseFloat(cleaned);
    setAmount(isNaN(parsed) ? 0 : parsed);
  };

  const showDollar = amount > 0;
  const showError = amount < MIN_AMOUNT;
  const displayValue = String(amount);
  const widthInCh = displayValue.length;
  const priceStr = (amount / ETH_PRICE).toFixed(5);
  const [intPart, decPart] = priceStr.split(".");

  return (
    <div className="buy-input">
      <div className="buy-input-container">
        <div className="buy-input-container__wrapper">
          {showDollar && (
            <span
              style={{
                left: -28 - widthInCh * 2,
              }}
            >
              $
            </span>
          )}

          <input
            size={Math.max(displayValue.length, 1)}
            type="text"
            inputMode="decimal"
            value={showDollar ? `${displayValue}` : ""}
            //  value={displayValue}
            placeholder={"0"}
            onChange={handleChange}
            onFocus={(e) => e.target.select()}
            style={{
              fontSize: 64,
              textAlign: "center",
              width: "fit-content",
            }}
          />
        </div>
      </div>
      <div className="buy-input__stats">
        <div className="buy-input__currency">
          <span>ETH</span>
        </div>
        <div className="buy-input__price">
          {showError ? (
            <span style={{ color: "#E80C00" }}>
              Minimum amount is ${MIN_AMOUNT}
            </span>
          ) : (
            <span>
              {intPart}
              <span style={{ color: "#AEE900" }}>.</span>
              {decPart}
            </span>
          )}
        </div>
        <button className="buy-input__swap">
          <BuySwap />
        </button>
      </div>
    </div>
  );
}
