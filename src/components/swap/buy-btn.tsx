import { usePrivy } from "@privy-io/react-auth";
import { Execute } from "@reservoir0x/relay-sdk";
import React, { useEffect, useState } from "react";
import {
  ButtonFunds,
  ButtonPrivy,
  ButtonToken,
  BtnPolygons,
  ButtonValue,
  ButtonWallet,
  ButtonSwap,
  ButtonLoad,
  InputCross,
  ButtonSend,
} from "@/components/icons";
import classNames from "classnames";

import { AnimatePresence, motion } from "motion/react";

export const LoaderIcon = () => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        duration: 2,
        ease: "linear",
      }}
      style={{ display: "flex" }} // ensure it wraps the button properly
    >
      <ButtonLoad />
    </motion.div>
  );
};

type Props = {
  isNoInputData: boolean;
  isNoTokenData: boolean;
  isNoWalletData: boolean;
  isLoadingQuote: boolean;
  onBuy?: () => void;
  error: string | null;
  quote: Execute | null;
  isAdaptedWallet: boolean;
  isInsuficientBalance: boolean;
};

const BuyBtn = ({
  isLoadingQuote,
  isNoInputData,
  isNoTokenData,
  isNoWalletData,
  onBuy,
  isAdaptedWallet,
  error,
  quote,
  isInsuficientBalance,
}: Props) => {
  const { authenticated, ready, login } = usePrivy();
  //   const disableLogin = !ready || (ready && authenticated);

  const [isLoading, setIsLoading] = useState(isLoadingQuote);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (isLoadingQuote) {
      setIsLoading(true);
    } else {
      t = setTimeout(() => setIsLoading(false), 500);
    }
    return () => clearTimeout(t);
  }, [isLoadingQuote]);

  let label: string = "Fetching Quote";
  let disabled: boolean = true;
  let handleClick: (() => void) | undefined = undefined;
  let icon = <LoaderIcon />;

  if (!ready || isLoading) {
    // 1. still initializing the SDK
    label = "Fetching Quote";
    disabled = true;
    icon = <LoaderIcon />;
  } else if (!authenticated) {
    // 2. SDK ready but user not logged in
    label = "Login with Wallet";
    disabled = false;
    handleClick = login;
    icon = <ButtonPrivy />;
  } else if (error && !quote && !isLoading) {
    label = error.includes("Invalid address")
      ? "Invalid address for chain"
      : error.includes("'send'")
        ? "Switch buy wallet to send"
        : error;

    disabled = true;
    if (error.includes("'send'")) {
      icon = <ButtonSend />;
      label = "Change Address";
    } else {
      icon = <InputCross />;
      label = "Error";
    }
  } else if (!isLoading && isInsuficientBalance) {
    label = "Funds (Runnable)";
    disabled = false;
    icon = <ButtonFunds />;
    handleClick = onBuy;
  } else if (isNoInputData) {
    // 3. logged in but missing input
    label = "Enter Value";
    disabled = true;
    icon = <ButtonValue />;
  } else if (isNoTokenData) {
    // 4. missing token selection
    label = "Select tokens";
    disabled = true;
    icon = <ButtonToken />;
  } else if (isNoWalletData) {
    // 5. missing which wallet to use for buy
    label = "Select wallet";
    disabled = true;
    icon = <ButtonWallet />;
  } else if (quote && !isLoading && isAdaptedWallet) {
    // 7. everything’s set, you can buy
    label = "Execute";
    disabled = false;
    handleClick = onBuy;
    icon = <ButtonSwap />;
  }

  const animatedProps = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
    transition: { duration: 0.3 },
    style: { display: "flex", gap: 10 },
  } as const;

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={classNames("buy-btn", {
        "buy-btn--disabled": isLoading || disabled || error?.includes("'send'"),
        "buy-btn--connect": ready && !authenticated,
        "buy-btn--error": error && !error.includes("'send'"),
        "buy-btn--active":
          quote && !isLoading && isAdaptedWallet && authenticated,
        "buy-btn--semi": !isLoading && isInsuficientBalance && authenticated,
      })}
    >
      <BtnPolygons />

      <AnimatePresence mode="popLayout">
        <motion.div
          className="buy-btn__svg"
          key={label + "-icon-left"}
          {...animatedProps}
        >
          {icon}
          {(label.toLocaleLowerCase().includes("funds") ||
            label.toLocaleLowerCase().includes("execute")) &&
            icon}
          {(label.toLocaleLowerCase().includes("funds") ||
            label.toLocaleLowerCase().includes("execute")) &&
            icon}
        </motion.div>
      </AnimatePresence>
      <AnimatePresence mode="popLayout">
        <motion.span key={label} {...animatedProps}>
          {label}
        </motion.span>
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        <motion.div
          className="buy-btn__svg"
          key={label + "-icon-right"}
          {...animatedProps}
        >
          {(label.toLocaleLowerCase().includes("funds") ||
            label.toLocaleLowerCase().includes("execute")) &&
            icon}
          {(label.toLocaleLowerCase().includes("funds") ||
            label.toLocaleLowerCase().includes("execute")) &&
            icon}
          {icon}
        </motion.div>
      </AnimatePresence>
    </button>
  );
};

export default BuyBtn;
