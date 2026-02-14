"use client";

import React, { useMemo } from "react";
import { HexChain, PrivyLogo, UserQuestion, Wallet } from "../icons";
import { getIconUri } from "@/helpers/get-icon-uri";
import { useActiveWallet } from "@/context/ActiveWalletContext";
import Image from "next/image";
import { truncateAddress } from "@/helpers/truncate-address";
import { useTokenModal } from "@/context/TokenModalProvider";
import { zeroAddress } from "viem";
import GreenDot from "../green-dot";
import { usePrivy } from "@privy-io/react-auth";
import { AnimatePresence, motion } from "motion/react";
import { slidingTextAnimation } from "../shared/animation";
import classNames from "classnames";
import SkeletonLoaderWrapper from "../skeleton";

const WalletHeader = ({
  callback,
  chainCallback,
  closeIfOpenChains,
  closeIfOpen,
  isOpenWallet,
  isOpenChains,
}: {
  chainCallback: () => void;
  callback: () => void;
  closeIfOpenChains: () => void;
  closeIfOpen: () => void;
  isOpenWallet: boolean;
  isOpenChains: boolean;
}) => {
  const { activeWallet } = useActiveWallet();
  const { nativeSolBalance, userEthTokens } = useTokenModal();

  const activeBalance = useMemo(() => {
    if (activeWallet?.type === "ethereum") {
      return userEthTokens?.find(
        (token) =>
          token.address === zeroAddress &&
          token.chainId === Number(activeWallet.chainId.split(":")[1])
      )?.balance;
    } else {
      return nativeSolBalance?.balance;
    }
  }, [activeWallet, nativeSolBalance, userEthTokens]);

  const balance = (
    activeBalance ? activeBalance?.toFixed(6) : "0.000000"
  ).split(".");
  const { ready, authenticated, login } = usePrivy();
  const disableLogin = !ready || (ready && authenticated);

  const showSkeleton = !ready || (authenticated && !activeWallet);

  return (
    <div className="wallet-header">
      {showSkeleton ? (
        <SkeletonLoaderWrapper
          radius={4}
          height={36}
          width={120}
          isLoading={true}
        />
      ) : !authenticated ? (
        <button
          disabled={disableLogin}
          onClick={() => login()}
          className="wallet-item__connect"
        >
          <span>Login</span>
          <PrivyLogo />
        </button>
      ) : (
        <>
          <button
            onClick={() => (callback(), closeIfOpenChains())}
            className="wallet-header__address"
          >
            <div className="wallet-header__address__provider">
              <Wallet />
            </div>
            <div
              className={classNames("wallet-header__address__value", {
                "button--active": isOpenWallet,
              })}
            >
              <div
                key={activeWallet?.address}
                className="wallet-header__address__value__image"
              >
                {activeWallet?.meta?.icon ? (
                  <Image
                    alt={activeWallet?.meta.id}
                    src={activeWallet?.meta.icon.replace(/^\n+/, "").trimEnd()}
                    width={20}
                    height={20}
                  />
                ) : (
                  <UserQuestion />
                )}
              </div>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={activeWallet?.address}
                  {...slidingTextAnimation}
                >
                  {activeWallet?.address
                    ? truncateAddress(activeWallet?.address)
                    : "Connect"}
                </motion.span>
              </AnimatePresence>
            </div>
          </button>
          <div className="divider">
            <div />
          </div>
          <button
            onClick={() => (chainCallback(), closeIfOpen())}
            className="wallet-header__balance"
          >
            <div
              key={activeWallet?.address}
              className="wallet-header__balance__chain"
            >
              <HexChain
                width={20}
                uri={
                  activeWallet?.type === "ethereum"
                    ? getIconUri(Number(activeWallet.chainId.split(":")[1]))
                    : getIconUri(792703809)
                }
              />
            </div>
            <div
              className={classNames("wallet-header__balance__number", {
                "button--active": isOpenChains,
              })}
            >
              <AnimatePresence mode="popLayout">
                <motion.span {...slidingTextAnimation} key={activeBalance}>
                  <GreenDot int={balance[0]} dec={balance[1]} />
                </motion.span>
              </AnimatePresence>
            </div>
          </button>
        </>
      )}
    </div>
  );
};

export default WalletHeader;
