"use client";

import { useRelayChains } from "@reservoir0x/relay-kit-hooks";
import React, { useCallback, useMemo, useState } from "react";
// import { HexChain } from "../icons";
// import { getIconUri } from "@/helpers/get-icon-uri";
import { useActiveWallet } from "@/context/ActiveWalletContext";
import { useTokenModal } from "@/context/TokenModalProvider";
import ChainItem from "./chian-item";
import { zeroAddress } from "viem";
import { InputCross } from "../icons";

const ChainList = ({
  closeIfOpenChains,
}: {
  closeIfOpenChains: () => void;
}) => {
  const { chains, isLoading } = useRelayChains();

  const [searchTerm, setSearchTerm] = useState("");

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

  const isInputDisabled = isLoading || activeWalletChainId === 792703809;

  const filteredEthChains = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase().trim();
    return ethChains
      ? ethChains.filter(
          (chain) =>
            chain.displayName.toLowerCase().includes(term) ||
            chain.id.toString().includes(term)
        )
      : [];
  }, [ethChains, searchTerm]);

  return (
    <div className="chain-list">
      <div className="chain-sidebar__contianer">
        <label
          style={{
            pointerEvents: isInputDisabled ? "none" : "auto",
          }}
          className="chain-sidebar__input"
        >
          <input
            disabled={isInputDisabled}
            type="text"
            placeholder="Enter name or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded"
          />
          {searchTerm.length > 0 && (
            <button
              onClick={() => setSearchTerm("")}
              className="chain-sidebar__input__abandon"
            >
              <InputCross />
            </button>
          )}
        </label>
      </div>
      {!isLoading &&
        activeWallet?.type === "ethereum" &&
        ethChains &&
        (searchTerm.length > 0 ? filteredEthChains : ethChains).map((chain) => {
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
