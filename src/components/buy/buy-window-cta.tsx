import { usePrivy } from "@privy-io/react-auth";
import React, { useEffect, useState } from "react";
import {
  ButtonPrivy,
  BtnPolygons,
  ButtonValue,
  ButtonWallet,
  ButtonLoad,
  InputCross,
  ButtonSwap,
} from "@/components/icons";
import classNames from "classnames";
import { AnimatePresence, motion } from "motion/react";
import { buttonSlideAnimation } from "../shared/animation";
import { OracleRouteType } from "./types";

const LoaderIcon = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
    style={{ display: "flex" }}
  >
    <ButtonLoad />
  </motion.div>
);

type Props = {
  isError: boolean;
  isLoadingQuote: boolean;
  quoteError: string | null;
  hasQuote: boolean;
  hasValue: boolean;
  hasWallet: boolean;
  routeType: OracleRouteType;
  onBuy: () => void;
};

const BuyWindowCta = ({
  isError,
  isLoadingQuote,
  quoteError,
  hasQuote,
  hasValue,
  hasWallet,
  routeType,
  onBuy,
}: Props) => {
  const { authenticated, ready, login } = usePrivy();

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

  let label = "Fetching Quote";
  let disabled = true;
  let handleClick: (() => void) | undefined = undefined;
  let icon = <LoaderIcon />;

  if (isError) {
    label = "Unavailable";
    disabled = true;
    icon = <InputCross />;
  } else if (!ready || isLoading) {
    label = "Fetching Quote";
    disabled = true;
    icon = <LoaderIcon />;
  } else if (!authenticated) {
    label = "Login with Wallet";
    disabled = false;
    handleClick = login;
    icon = <ButtonPrivy />;
  } else if (quoteError) {
    label = quoteError.length > 30 ? "Quote Error" : quoteError;
    disabled = true;
    icon = <InputCross />;
  } else if (!hasValue) {
    label = "Enter Amount";
    disabled = true;
    icon = <ButtonValue />;
  } else if (!hasWallet) {
    label = "Select Wallet";
    disabled = true;
    icon = <ButtonWallet />;
  } else if (hasQuote && !isLoading) {
    label =
      routeType === OracleRouteType.ORACLE ? "Buy ETH" : "Buy";
    disabled = false;
    handleClick = onBuy;
    icon = <ButtonSwap />;
  }

  const animatedProps = buttonSlideAnimation;

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={classNames("buy-btn", {
        "buy-btn--disabled": isLoading || disabled,
        "buy-btn--connect": ready && !authenticated,
        "buy-btn--error": !!quoteError || isError,
        "buy-btn--active": hasQuote && !isLoading && authenticated && !isError,
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
          {label.toLowerCase().includes("buy") && icon}
          {label.toLowerCase().includes("buy") && icon}
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
          {label.toLowerCase().includes("buy") && icon}
          {label.toLowerCase().includes("buy") && icon}
          {icon}
        </motion.div>
      </AnimatePresence>
    </button>
  );
};

export default BuyWindowCta;
