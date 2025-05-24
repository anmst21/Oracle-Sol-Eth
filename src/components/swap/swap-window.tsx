import React, { useCallback, useEffect, useState } from "react";
import {
  ArrowSmall,
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
import { SwapWallet, TradeType } from "./types";
import WalletModal from "../wallets/wallet-modal";
import {
  ConnectedSolanaWallet,
  ConnectedWallet,
  usePrivy,
} from "@privy-io/react-auth";
import { useDebounce } from "@/hooks/useDebounce";
import { solanaChain } from "@/helpers/solanaChain";
import classNames from "classnames";
import SkeletonLoaderWrapper from "../skeleton";
import { AnimatePresence, motion } from "motion/react";
import { slidingTextAnimation } from "./animation";

const containerVariants = {
  enter: { opacity: 1, transition: { duration: 0.2, ease: "easeInOut" } },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
};

const buttonVariants = {
  enter: { opacity: 1, transition: { duration: 0.2, ease: "easeInOut" } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: "easeInOut" } },
};

type Props = {
  mode: "buy" | "sell";
  isNativeBalance?: boolean;
  token: UnifiedToken | null;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  inputValue: string;
  setActiveWallet:
    | React.Dispatch<
        React.SetStateAction<ConnectedWallet | ConnectedSolanaWallet | null>
      >
    | React.Dispatch<React.SetStateAction<SwapWallet | null>>;
  setActiveBuyWallet: React.Dispatch<React.SetStateAction<SwapWallet | null>>;
  activeWallet: SwapWallet | ConnectedWallet | ConnectedSolanaWallet | null;
  tokenBalance: string | undefined;
  s?: () => void;
  tradeType: TradeType;
  setTradeType: React.Dispatch<React.SetStateAction<TradeType>>;
  fetchQuote: () => Promise<void>;
  isSwitching: boolean;
  tokenPrice: string | undefined;
  isLoadingQuote: boolean;
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
  tokenPrice,
  activeWallet,
  inputValue,
  setInputValue,
  tokenBalance = "0.000000",
  tradeType,
  setTradeType,
  fetchQuote,
  isSwitching,
  setActiveBuyWallet,
  isLoadingQuote,
}: Props) => {
  const { setIsOpen, setModalMode } = useTokenModal();

  const [isOpenAddressModal, setIsOpenAddressModal] = useState(false);
  const openTokenModal = useCallback(() => {
    setIsOpen(true);
    setModalMode(mode);
  }, [setIsOpen, setModalMode, mode]);

  const callback = useCallback(
    (wallet: SwapWallet | null | undefined) => {
      setIsOpenAddressModal(false);
      if (mode === "buy" && wallet) {
        setActiveBuyWallet(wallet);
      }
    },
    [mode, setActiveBuyWallet]
  );

  const valueUsd = tokenPrice ? Number(tokenPrice).toFixed(2) : "XX.XX";

  const [intUsdPart, decUsdPart] = valueUsd.split(".");

  const [intBalancePart, decBalancePart] = tokenBalance.split(".");

  const debouncedRaw = useDebounce(inputValue, 300);

  useEffect(() => {
    if (
      mode === "sell" &&
      tradeType === TradeType.EXACT_INPUT &&
      !isSwitching
    ) {
      fetchQuote();
    }
    if (
      mode === "buy" &&
      tradeType === TradeType.EXACT_OUTPUT &&
      !isSwitching
    ) {
      fetchQuote();
    }
  }, [debouncedRaw, isSwitching]);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (mode === "sell" && tradeType !== TradeType.EXACT_INPUT) {
        setTradeType(TradeType.EXACT_INPUT);
      }
      if (mode === "buy" && tradeType !== TradeType.EXACT_OUTPUT) {
        setTradeType(TradeType.EXACT_OUTPUT);
      }
      setInputValue(e.currentTarget.value);
    },
    [mode, tradeType, setTradeType, setInputValue]
  );

  const onOptionClick = useCallback(
    (mult: number) => (
      setInputValue(
        (
          (mode === "buy" ? Number(inputValue) : Number(tokenBalance)) * mult
        ).toString()
      ),
      mode === "sell"
        ? setTradeType(TradeType.EXACT_INPUT)
        : setTradeType(TradeType.EXACT_OUTPUT),
      fetchQuote()
    ),
    [fetchQuote, mode, inputValue, tokenBalance, setTradeType, setInputValue]
  );

  const isLoading =
    (tradeType === TradeType.EXACT_INPUT && mode === "buy" && isLoadingQuote) ||
    (tradeType === TradeType.EXACT_OUTPUT && mode === "sell" && isLoadingQuote);

  const { ready } = usePrivy();

  return (
    <div className="swap-window">
      <div className="swap-window__input">
        <div className="swap-window__input__balance">
          <div className="swap-window__input__balance__mode">{mode}</div>
          <div className="swap-window__input__balance__heading">
            <span>Balance:</span>
          </div>
          <div className="swap-window__input__balance__value">
            <SkeletonLoaderWrapper
              radius={2}
              height={18}
              width={48.95}
              isLoading={isLoadingQuote}
            >
              <GreenDot int={intBalancePart} dec={decBalancePart} />
            </SkeletonLoaderWrapper>
          </div>
        </div>

        <label className="swap-window__input__main">
          <SkeletonLoaderWrapper
            radius={2}
            height={24}
            width={"auto"}
            isLoading={isLoading}
            flex
          >
            <input
              type="number"
              inputMode="decimal"
              placeholder="0"
              // if your state is a string:
              value={inputValue}
              onChange={onChange}
            />
          </SkeletonLoaderWrapper>
          <InputCoin />
        </label>
        <div className="swap-window__input__quote">
          <div className="swap-window__input__quote__value">
            <SkeletonLoaderWrapper
              radius={2}
              height={18}
              width={30}
              isLoading={isLoadingQuote}
            >
              <GreenDot int={intUsdPart} dec={decUsdPart} />
            </SkeletonLoaderWrapper>
          </div>
          <div className="swap-window__input__quote__usd">USD</div>
        </div>
      </div>
      <div className="swap-window__token">
        <div
          onClick={() => setIsOpenAddressModal(true)}
          onMouseLeave={() => setIsOpenAddressModal(false)}
          className={classNames("swap-window__token__wallet", {
            "swap-window__token__wallet--error":
              (token?.chainId === solanaChain.id &&
                activeWallet?.type !== "solana") ||
              (token?.chainId !== solanaChain.id &&
                activeWallet?.type !== "ethereum" &&
                token !== null &&
                activeWallet !== null),
          })}
        >
          <SkeletonLoaderWrapper
            width={20}
            height={20}
            isLoading={!ready || isSwitching}
          >
            <div className="swap-window__token__wallet__pfp">
              {!activeWallet ? (
                <HexChain width={20} question />
              ) : (
                <HexChain
                  width={20}
                  uri={
                    activeWallet?.type === "ethereum"
                      ? getIconUri(1)
                      : getIconUri(solanaChain.id)
                  }
                />
              )}
            </div>
          </SkeletonLoaderWrapper>
          <SkeletonLoaderWrapper
            width={92.5}
            height={20}
            isLoading={!ready || isSwitching}
          >
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={activeWallet?.address ?? "placeholder"}
                {...slidingTextAnimation}
              >
                {!activeWallet?.address
                  ? "XxXX...XXXX"
                  : truncateAddress(activeWallet.address)}
              </motion.span>
            </AnimatePresence>
          </SkeletonLoaderWrapper>
          <div
            className={classNames("recipient-window__address__arrow", {
              "recipient-window__address__arrow--inactive": !ready,
            })}
          >
            <ArrowSmall />
          </div>
          <AnimatePresence mode="wait">
            {isOpenAddressModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="swap-window__wallet"
              >
                <WalletModal
                  isBuy={mode === "buy"}
                  callback={(wallet) => {
                    callback(wallet);
                  }}
                  swapWindow
                  activeAddress={activeWallet?.address}
                />
              </motion.div>
            )}
          </AnimatePresence>
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
            <div
              className={classNames("user-placeholder", {
                "user-placeholder--empty": !token,
              })}
            >
              {token && token.logo ? (
                <Image
                  src={token.logo}
                  width={30}
                  height={30}
                  alt={`${mode} token input`}
                  key={token.name}
                />
              ) : (
                <UserQuestion />
              )}
            </div>
          </div>
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={tokenBalance ?? "balances"}
              {...slidingTextAnimation}
              className="token-to-buy__token__text"
            >
              <h4>{token ? token.symbol : "Select"}</h4>
              <span>{token ? truncateAddress(token.address) : "Token"}</span>
            </motion.div>
          </AnimatePresence>
          <div className="token-to-buy__token__arrow">
            <SwapArrow />
          </div>
        </button>
        <AnimatePresence mode="wait">
          {Number(tokenBalance) !== 0 ||
          (token && mode === "buy" && inputValue.length > 0) ? (
            <motion.div
              key="options"
              variants={containerVariants}
              initial="exit"
              animate="enter"
              exit="exit"
              className="swap-window__token__ammount"
            >
              {(mode === "sell" ? presetOptions : buyPresetOptions).map(
                (option) => (
                  <motion.button
                    key={option.value} // unique key per option
                    variants={buttonVariants}
                    initial="exit"
                    animate="enter"
                    exit="exit"
                    onClick={() => onOptionClick(option.multiplier)}
                    className="swap-window__token__ammount__option"
                  >
                    <span>{option.value}</span>
                  </motion.button>
                )
              )}
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              variants={containerVariants}
              initial="exit"
              animate="enter"
              exit="exit"
              className="swap-window__token__ammount__placeholder"
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SwapWindow;
