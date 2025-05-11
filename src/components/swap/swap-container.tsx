"use client";

import React, { useState } from "react";
import SwapWindow from "./swap-window";
import { SwapSwitch } from "../icons";

type Props = {};

const SwapContainer = (props: Props) => {
  const [buyInputValue, setBuyInputValue] = useState("");
  const [sellInputValue, setSellInputValue] = useState("");

  return (
    <div className="swap-container">
      <SwapWindow mode="sell" isNativeBalance />
      <button className="swap-container__switch">
        <SwapSwitch />
      </button>
      <SwapWindow mode="buy" />
    </div>
  );
};

export default SwapContainer;
