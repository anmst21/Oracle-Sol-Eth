import React, { useCallback, useEffect, useState } from "react";
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
import GreenDot from "../green-dot";
import { SwapWallet } from "./types";
import WalletModal from "../wallets/wallet-modal";
import { useTokenPrice } from "@reservoir0x/relay-kit-hooks";
import { ConnectedSolanaWallet, ConnectedWallet } from "@privy-io/react-auth";

type Props = {
  mode: "buy" | "sell";
  isNativeBalance?: boolean;
  token: UnifiedToken | null;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  inputValue: string;
  setActiveWallet: React.Dispatch<
    React.SetStateAction<ConnectedWallet | ConnectedSolanaWallet | null>
  >;

  activeWallet: ConnectedWallet | ConnectedSolanaWallet | SwapWallet | null;
  tokenBalance: string | undefined;
  s?: () => void;
};

const presetOptions = [
  { value: "20%", multiplier: 0.2 },
  { value: "50%", multiplier: 0.5 },
  { value: "MAX", multiplier: 1 },
];

const buyPresetOptions = [
  { value: "+20%", multiplier: 1.2 },
  { value: "+50%", multiplier: 1.5 },
  { value: "+100%", multiplier: 2 },
];

const SwapWindow = ({
  mode,
  token,
  setActiveWallet,
  activeWallet,
  inputValue,
  setInputValue,
  tokenBalance = "0.000000",
  s,
}: Props) => {
  const { setIsOpen, setModalMode, isOpen } = useTokenModal();

  const [isOpenAddressModal, setIsOpenAddressModal] = useState(false);
  const openTokenModal = useCallback(() => {
    setIsOpen(true);
    setModalMode(mode);
  }, [setIsOpen, setModalMode, mode]);

  const callback = useCallback(
    (wallet: ConnectedWallet | ConnectedSolanaWallet | null) => {
      setIsOpenAddressModal(false);
      if (mode === "buy" && wallet) {
        setActiveWallet(wallet);
      }
    },
    [mode, setActiveWallet]
  );

  const priceOptions =
    token?.address && token?.chainId
      ? {
          address: token?.address,
          chainId: token?.chainId,
        }
      : undefined;

  const {
    data: ethPriceResponse,
    isLoading,
    error,
  } = useTokenPrice("https://api.relay.link", priceOptions, {
    // Optional query options
    refetchInterval: 60000, // Refresh every minute
  });

  console.log("ethPriceResponse", ethPriceResponse);

  const valueUsd =
    inputValue.length > 0 && ethPriceResponse?.price
      ? (ethPriceResponse?.price * Number(inputValue)).toFixed(2)
      : "XX.XX";

  const [intUsdPart, decUsdPart] = valueUsd.split(".");

  const [intBalancePart, decBalancePart] = tokenBalance.split(".");

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
        <label className="swap-window__input__main">
          <input
            type="number"
            inputMode="decimal"
            placeholder="0"
            // if your state is a string:
            value={inputValue}
            onChange={(e) => {
              const raw = e.currentTarget.value;
              setInputValue(raw);
            }}
          />
          <InputCoin />
        </label>
        <div className="swap-window__input__quote">
          <div className="swap-window__input__quote__value">
            <GreenDot int={intUsdPart} dec={decUsdPart} />
          </div>
          <div className="swap-window__input__quote__usd">USD</div>
        </div>
      </div>
      <div className="swap-window__token">
        <div
          onMouseEnter={() => setIsOpenAddressModal(true)}
          onMouseLeave={() => setIsOpenAddressModal(false)}
          className="swap-window__token__wallet"
        >
          <div className="swap-window__token__wallet__pfp">
            {activeWallet?.address && (
              <CoinFade
                key={activeWallet?.address}
                address={activeWallet?.address}
              />
            )}
          </div>
          <span>
            {!activeWallet?.address
              ? "0x00...XXXX"
              : truncateAddress(activeWallet?.address)}
          </span>
          <div className="recipient-window__address__arrow">
            <ArrowSmall />
          </div>
          {isOpenAddressModal && (
            <div className="swap-window__wallet">
              <WalletModal
                isBuy={mode === "buy"}
                callback={(
                  wallet: ConnectedWallet | ConnectedSolanaWallet | null
                ) => {
                  callback(wallet);
                }}
                swapWindow
                activeAddress={activeWallet?.address}
              />
            </div>
          )}
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
        {Number(tokenBalance) !== 0 ||
        (token && mode === "buy" && inputValue.length > 0) ? (
          <div className="swap-window__token__ammount">
            {(mode === "sell" ? presetOptions : buyPresetOptions).map(
              (option, i) => (
                <button
                  onClick={() =>
                    setInputValue(
                      (
                        (mode === "buy"
                          ? Number(inputValue)
                          : Number(tokenBalance)) * option.multiplier
                      ).toString()
                    )
                  }
                  className="swap-window__token__ammount__option"
                  key={i}
                >
                  {option.value}
                </button>
              )
            )}
          </div>
        ) : (
          <div className="swap-window__token__ammount__placeholder" />
        )}
      </div>
    </div>
  );
};

export default SwapWindow;
