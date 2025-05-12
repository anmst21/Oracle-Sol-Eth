"use client";

import React, { useState } from "react";
import SwapWindow from "./swap-window";
import { SwapSwitch } from "../icons";
import { useTokenModal } from "@/context/TokenModalProvider";

const SwapContainer = () => {
  const [sellInputValue, setSellInputValue] = useState("");
  const [buyInputValue, setBuyInputValue] = useState("");

  const { sellToken, buyToken } = useTokenModal();

  return (
    <div className="swap-container">
      <SwapWindow
        inputValue={sellInputValue}
        setInputValue={setSellInputValue}
        token={sellToken}
        mode="sell"
        isNativeBalance
      />
      <button className="swap-container__switch">
        <SwapSwitch />
      </button>
      <SwapWindow
        inputValue={buyInputValue}
        setInputValue={setBuyInputValue}
        token={buyToken}
        mode="buy"
      />
    </div>
  );
};

export default SwapContainer;
