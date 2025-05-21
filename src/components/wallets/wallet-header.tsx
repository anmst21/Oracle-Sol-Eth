"use client";

import React, { useMemo } from "react";
import { HexChain, Wallet } from "../icons";
import { getIconUri } from "@/helpers/get-icon-uri";
import { useActiveWallet } from "@/context/ActiveWalletContext";
import Image from "next/image";
import { truncateAddress } from "@/helpers/truncate-address";
import { useTokenModal } from "@/context/TokenModalProvider";
import { zeroAddress } from "viem";
import GreenDot from "../green-dot";

const WalletHeader = ({
  callback,
  closeIfOpen,
}: {
  closeIfOpen: () => void;
  callback: () => void;
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

  return (
    <div className="wallet-header">
      <div onClick={closeIfOpen} className="wallet-header__balance">
        <div className="wallet-header__balance__chain">
          <HexChain
            width={20}
            uri={
              activeWallet?.type === "ethereum"
                ? getIconUri(Number(activeWallet.chainId.split(":")[1]))
                : getIconUri(792703809)
            }
          />
        </div>
        <div className="wallet-header__balance__number">
          <GreenDot int={balance[0]} dec={balance[1]} />
        </div>
      </div>
      <div className="divider">
        <div />
      </div>
      <button onClick={callback} className="wallet-header__address">
        <div className="wallet-header__address__provider">
          <Wallet />
        </div>
        <div className="wallet-header__address__value">
          <div className="wallet-header__address__value__image">
            {activeWallet?.meta.icon && (
              <Image
                alt={activeWallet?.meta.id}
                src={activeWallet?.meta.icon.replace(/^\n+/, "").trimEnd()}
                width={20}
                height={20}
              />
            )}
          </div>

          <span>
            {activeWallet?.address
              ? truncateAddress(activeWallet?.address)
              : "0xXX...XXXX"}
          </span>
        </div>
      </button>
    </div>
  );
};

export default WalletHeader;
