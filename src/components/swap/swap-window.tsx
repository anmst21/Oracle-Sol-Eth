import React, { useCallback } from "react";
import {
  ArrowSmall,
  CoinFade,
  HexChain,
  InputCoin,
  SwapArrow,
  UserQuestion,
} from "../icons";
import { truncateAddress } from "@/helpers/truncate-address";
import { useTokenModal } from "@/context/TokenModalProvider";
import { UnifiedToken } from "@/types/coin-types";
import Image from "next/image";
import { getIconUri } from "@/helpers/get-icon-uri";
type Props = {
  mode: "buy" | "sell";
  isNativeBalance?: boolean;
  token: UnifiedToken | null;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  inputValue: string;
};

const address = "0x1334429526Fa8B41BC2CfFF3a33C5762c5eD0Bce";

const presetOptions = [
  { value: "20%", multiplier: 0.2 },
  { value: "50%", multiplier: 0.5 },
  { value: "MAX", multiplier: 1 },
];

const SwapWindow = ({ mode, isNativeBalance, token }: Props) => {
  const { setIsOpen, setModalMode } = useTokenModal();

  const openTokenModal = useCallback(() => {
    setIsOpen(true);
    setModalMode(mode);
  }, [setIsOpen, setModalMode, mode]);

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
  const [intUsdPart, decUsdPart] = valueUsd.split(".");
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
            {<CoinFade address={address} />}
          </div>
          <span>{truncateAddress(address)}</span>
          <div className="recipient-window__address__arrow">
            <ArrowSmall />
          </div>
        </div>

        <button onClick={openTokenModal} className="token-to-buy__token">
          <div className="token-to-buy__token__icon">
            {!token ? (
              <HexChain width={32} question />
            ) : (
              <HexChain
                width={32}
                uri={token.chainId ? getIconUri(token.chainId) : undefined}
              />
            )}
            <div className="user-placeholder">
              {token && token.logo ? (
                <Image
                  src={token.logo}
                  width={30}
                  height={30}
                  alt={`${mode} token input`}
                />
              ) : (
                <UserQuestion />
              )}
            </div>
          </div>
          <div className="token-to-buy__token__text">
            <h4>{token ? token.symbol : "Select"}</h4>
            <span>{token ? truncateAddress(token.address) : "Token"}</span>
          </div>
          <div className="token-to-buy__token__arrow">
            <SwapArrow />
          </div>
        </button>
        {isNativeBalance ? (
          <div className="swap-window__token__ammount">
            {presetOptions.map((option, i) => (
              <button className="swap-window__token__ammount__option" key={i}>
                {option.value}
              </button>
            ))}
          </div>
        ) : (
          <div className="swap-window__token__ammount__placeholder" />
        )}
      </div>
    </div>
  );
};

export default SwapWindow;
