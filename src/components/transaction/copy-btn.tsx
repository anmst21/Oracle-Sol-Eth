"use client";

import React from "react";
import { SwapCopy } from "../icons";
import { handleCopy } from "@/helpers/handle-copy";

function CopyBtn({ value }: { value: string | undefined }) {
  return (
    <button
      disabled={!value}
      onClick={() => value && handleCopy(value)}
      className="transaction-info__item__button tx-icon tx-copy"
    >
      <SwapCopy />
    </button>
  );
}

export default CopyBtn;
