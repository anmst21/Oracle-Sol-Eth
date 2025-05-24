"use client";

import { useRelayChains } from "@reservoir0x/relay-kit-hooks";
import React, { useCallback, useMemo } from "react";
// import { HexChain } from "../icons";
// import { getIconUri } from "@/helpers/get-icon-uri";
import { useActiveWallet } from "@/context/ActiveWalletContext";
import { useTokenModal } from "@/context/TokenModalProvider";
import ChainItem from "./chian-item";
import { zeroAddress } from "viem";

const ChainList = ({
  closeIfOpenChains,
}: {
  closeIfOpenChains: () => void;
}) => {
  const { chains, isLoading } = useRelayChains();

  const ethChains = useMemo(
    () => chains?.filter((chain) => chain.vmType === "evm"),
    [chains]
  );

  const solChain = useMemo(
    () => chains?.find((chain) => chain.id === 792703809),
    [chains]
  );

  const { activeWallet } = useActiveWallet();
  const {
    nativeSolBalance,
    userEthTokens,
    isLoadingNativeSolBalance,
    isLoadingUserEthTokens,
  } = useTokenModal();

  const activeWalletChainId =
    activeWallet?.type === "ethereum"
      ? Number(activeWallet.chainId.split(":")[1])
      : 792703809;

  const switchEthChain = useCallback(
    async (id: number) =>
      activeWallet?.type === "ethereum" &&
      (await activeWallet.switchChain(id), closeIfOpenChains()),
    [activeWallet, closeIfOpenChains]
  );

  return (
    <div className="chain-list">
      {!isLoading &&
        activeWallet?.type === "ethereum" &&
        ethChains?.map((chain) => {
          const balance = (
            userEthTokens?.find(
              (c) => c.chainId === chain.id && c.address === zeroAddress
            )?.balance || 0
          ).toFixed(6);

          return (
            <ChainItem
              type="eth"
              key={chain.id}
              chainId={chain.id}
              displayName={chain.displayName}
              isLoadingBalance={isLoadingUserEthTokens}
              balance={balance}
              isActive={activeWalletChainId === chain.id}
              callback={() => switchEthChain(chain.id)}
            />
          );
        })}

      {!isLoading && solChain && activeWallet?.type === "solana" && (
        <ChainItem
          isActive={true}
          type="sol"
          chainId={solChain.id}
          displayName={solChain.displayName}
          isLoadingBalance={isLoadingNativeSolBalance}
          balance={(nativeSolBalance?.balance || 0).toFixed(6)}
        />
      )}
    </div>
  );
};

export default ChainList;
