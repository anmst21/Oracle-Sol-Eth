"use client";

import React, { useMemo } from "react";
import { HexChain, UserQuestion, Wallet } from "../icons";
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

  const isLoading = !ready || (authenticated && !activeWallet);

  return (
    <div className={classNames("wallet-header", { "wallet-header--loading": isLoading })}>
      <button
        onClick={() =>
          !isLoading && (authenticated ? (callback(), closeIfOpenChains()) : login())
        }
        className="wallet-header__address"
      >
        <div className="wallet-header__address__provider">
          <Wallet />
        </div>
        <div
          className={classNames("wallet-header__address__value", {
            "button--active": isOpenWallet && !isLoading,
          })}
        >
          <SkeletonLoaderWrapper width={20} height={20} isLoading={isLoading}>
            <div
              key={activeWallet?.address}
              className="wallet-header__address__value__image"
            >
              {activeWallet?.meta?.icon ? (
                <Image
                  alt={activeWallet.meta.id}
                  src={activeWallet.meta.icon.replace(/^\n+/, "").trimEnd()}
                  width={20}
                  height={20}
                />
              ) : (
                <UserQuestion />
              )}
            </div>
          </SkeletonLoaderWrapper>
          <SkeletonLoaderWrapper height={20} isLoading={isLoading} flex>
            <AnimatePresence mode="popLayout">
              <motion.span
                key={activeWallet?.address ?? "none"}
                {...slidingTextAnimation}
              >
                {activeWallet?.address
                  ? truncateAddress(activeWallet.address)
                  : "Login"}
              </motion.span>
            </AnimatePresence>
          </SkeletonLoaderWrapper>
        </div>
      </button>
      <div className="divider">
        <div />
      </div>
      <button
        onClick={() => !isLoading && (chainCallback(), closeIfOpen())}
        className="wallet-header__balance"
      >
        <div
          key={activeWallet?.address}
          className="wallet-header__balance__chain"
        >
          <SkeletonLoaderWrapper width={20} height={20} isLoading={isLoading}>
            <HexChain
              width={20}
              uri={
                activeWallet?.type === "ethereum"
                  ? getIconUri(Number(activeWallet.chainId.split(":")[1]))
                  : getIconUri(792703809)
              }
            />
          </SkeletonLoaderWrapper>
        </div>
        <div
          className={classNames("wallet-header__balance__number", {
            "button--active": isOpenChains && !isLoading,
          })}
        >
          <SkeletonLoaderWrapper height={20} isLoading={isLoading} flex>
            <AnimatePresence mode="popLayout">
              <motion.span {...slidingTextAnimation} key={activeBalance}>
                <GreenDot int={balance[0]} dec={balance[1]} />
              </motion.span>
            </AnimatePresence>
          </SkeletonLoaderWrapper>
        </div>
      </button>
    </div>
  );
};

export default WalletHeader;
