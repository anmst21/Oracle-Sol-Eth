import React from "react";
import {
  ArrowSmall,
  CoinFade,
  HexChain,
  InputCoin,
  SwapArrow,
  UserQuestion,
} from "../icons";
import { truncateAddress } from "@/helpers/truncate-address";

type Props = {
  mode: "buy" | "sell";
  isNativeBalance?: boolean;
};

const address = "0x1334429526Fa8B41BC2CfFF3a33C5762c5eD0Bce";

const presetOptions = [
  { value: "20%", multiplier: 0.2 },
  { value: "50%", multiplier: 0.5 },
  { value: "MAX", multiplier: 1 },
];

const SwapWindow = ({ mode, isNativeBalance }: Props) => {
  const balance = "0.000510";
  const valueUsd = "1233.23";

  const GreenDot = ({ int, dec }: { int: string; dec: string }) => {
    return (
      <>
        <span>{int}</span>
        <span style={{ color: "#AEE900" }}>.</span>
        <span>{dec}</span>
      </>
    );
  };

  const [intBalancePart, decBalancePart] = balance.split(".");
  const [intUsdPart, decUsdPart] = balance.split(".");
  return (
    <div className="swap-window">
      <div className="swap-window__input">
        <div className="swap-window__input__balance">
          <div className="swap-window__input__balance__mode">{mode}</div>
          <div className="swap-window__input__balance__heading">
            <span>Balance:</span>
          </div>
          <div className="swap-window__input__balance__value">
            <GreenDot int={intBalancePart} dec={decBalancePart} />
          </div>
        </div>
        <div className="swap-window__input__main">
          <input placeholder="0" />
          <InputCoin />
        </div>
        <div className="swap-window__input__quote">
          <div className="swap-window__input__quote__value">
            <GreenDot int={intUsdPart} dec={decUsdPart} />
          </div>
          <div className="swap-window__input__quote__usd">USD</div>
        </div>
      </div>
      <div className="swap-window__token">
        <div className="swap-window__token__wallet">
          <div className="swap-window__token__wallet__pfp">
            <CoinFade address={address} />
          </div>
          <span>{truncateAddress(address)}</span>
          <div className="recipient-window__address__arrow">
            <ArrowSmall />
          </div>
        </div>

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
        {isNativeBalance ? (
          <div className="swap-window__token__ammount">
            {presetOptions.map((option, i) => (
              <button className="swap-window__token__ammount__option" key={i}>
                {option.value}
              </button>
            ))}
          </div>
        ) : (
          <div className="swap-window__token__ammount__placeholder"></div>
        )}
      </div>
    </div>
  );
};

export default SwapWindow;
