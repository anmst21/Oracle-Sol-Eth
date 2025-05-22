import { usePrivy } from "@privy-io/react-auth";
import { Execute } from "@reservoir0x/relay-sdk";
import React from "react";

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

  let label: string = "Loading";
  let disabled: boolean = true;
  let handleClick: (() => void) | undefined = undefined;

  if (!ready || isLoadingQuote) {
    // 1. still initializing the SDK
    label = "Loading…";
    disabled = true;
  } else if (!authenticated) {
    // 2. SDK ready but user not logged in
    label = "Connect Wallet";
    disabled = false;
    handleClick = login;
  } else if (error && !quote && !isLoadingQuote) {
    label = error.includes("Invalid address")
      ? "Invalid address for chain"
      : error.includes("'send'")
      ? "Switch buy wallet to send"
      : error;
    disabled = true;
  }
  //    else if (!isLoadingQuote && isInsuficientBalance) {
  //     label = "Insuficient Balance";
  //     disabled = true;
  //   }
  else if (isNoInputData) {
    // 3. logged in but missing input
    label = "Enter input value";
    disabled = true;
  } else if (isNoTokenData) {
    // 4. missing token selection
    label = "Select tokens";
    disabled = true;
  } else if (isNoWalletData) {
    // 5. missing which wallet to use for buy
    label = "Select wallet";
    disabled = true;
  } else if (quote && !isLoadingQuote && isAdaptedWallet) {
    // 7. everything’s set, you can buy
    label = "Execute";
    disabled = false;
    handleClick = onBuy;
  }

  return (
    <button onClick={handleClick} disabled={disabled} className="buy-btn">
      <span>{label}</span>
    </button>
  );
};

export default BuyBtn;
