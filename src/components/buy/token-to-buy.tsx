import React from "react";
import { HexChain, SwapArrow, UserQuestion } from "../icons";

type Props = {};

const presetAmountValues = [20, 100, 300, 1000];

const TokenToBuy = (props: Props) => {
  return (
    <div className="token-to-buy">
      <div className="token-to-buy__token">
        <div className="token-to-buy__token__icon">
          <HexChain width={32} question />
          <div className="user-placeholder">
            <UserQuestion />
          </div>
        </div>
        <div className="token-to-buy__token__text">
          <h4>Select</h4>
          <span>Token</span>
        </div>
        <div className="token-to-buy__token__arrow">
          <SwapArrow />
        </div>
      </div>
      <div className="token-to-buy__presets">
        {presetAmountValues.map((preset, i) => (
          <button key={i}>
            <span>$</span>
            <span className="light-color">{preset}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TokenToBuy;
