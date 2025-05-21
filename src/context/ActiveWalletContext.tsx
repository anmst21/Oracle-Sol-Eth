"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import {
  useWallets,
  useSolanaWallets,
  usePrivy,
  ConnectedWallet,
  ConnectedSolanaWallet,
} from "@privy-io/react-auth";
import AddressModal from "@/components/wallets/address-modal";
import { createWalletClient, custom } from "viem";
import { adaptSolanaWallet } from "@reservoir0x/relay-solana-wallet-adapter";

import { extractChain } from "viem";
import * as viemChains from "viem/chains";
import { AdaptedWallet, adaptViemWallet } from "@reservoir0x/relay-sdk";
import {
  connection,
  sendTransactionAdapter,
} from "@/helpers/solana-connection";

const chain = (id: number) =>
  extractChain({
    chains: Object.values(viemChains), // pulls in all built-in chains
    id: id as never,
  });

interface ActiveWalletContextValue {
  ethLinked: ConnectedWallet[];
  solLinked: ConnectedSolanaWallet[];
  activeWallet: ConnectedWallet | ConnectedSolanaWallet | null;
  setActiveWallet: React.Dispatch<
    React.SetStateAction<ConnectedWallet | ConnectedSolanaWallet | null>
  >;
  adaptedWallet: AdaptedWallet | null;
  readyEth: boolean;
  readySol: boolean;
  setActiveBuyWallet: React.Dispatch<
    React.SetStateAction<ConnectedWallet | ConnectedSolanaWallet | null>
  >;
  activeBuyWallet: ConnectedWallet | ConnectedSolanaWallet | null;
  setIsAddressModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAddressModalOpen: boolean;
}

const ActiveWalletContext = createContext<ActiveWalletContextValue | undefined>(
  undefined
);

export function ActiveWalletProvider({ children }: { children: ReactNode }) {
  const { wallets: ethereumWallets, ready: readyEth } = useWallets();
  const { wallets: solanaWallets, ready: readySol } = useSolanaWallets();
  const { ready, authenticated, user } = usePrivy();

  const [activeWallet, setActiveWallet] = useState<
    ConnectedWallet | ConnectedSolanaWallet | null
  >(null);

  const [activeBuyWallet, setActiveBuyWallet] = useState<
    ConnectedWallet | ConnectedSolanaWallet | null
  >(null);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  console.log("isAddressModalOpen", isAddressModalOpen);

  // helper to sort so user address is first
  function sortByUserFirst<T extends { address?: string }>(
    list: T[],
    userAddress?: string
  ): T[] {
    const normalized = userAddress?.toLowerCase();
    return [...list].sort((a, b) => {
      if (a.address?.toLowerCase() === normalized) return -1;
      if (b.address?.toLowerCase() === normalized) return 1;
      return 0;
    });
  }

  const userAddress = user?.wallet?.address;

  const ethLinked = useMemo(() => {
    const linked = ethereumWallets.filter((w) => w.linked);
    return sortByUserFirst(linked, userAddress);
  }, [ethereumWallets, userAddress]);

  const solLinked = useMemo(() => {
    const linked = solanaWallets.filter((w) => w.linked);
    return sortByUserFirst(linked, userAddress);
  }, [solanaWallets, userAddress]);

  // auto-select active wallet on auth
  useEffect(() => {
    if (ready && authenticated && userAddress && (readyEth || readySol)) {
      let found: ConnectedWallet | ConnectedSolanaWallet | undefined;
      if (readyEth) {
        found = ethereumWallets.find(
          (w) => w.address?.toLowerCase() === userAddress.toLowerCase()
        );
      }
      if (!found && readySol) {
        found = solanaWallets.find(
          (w) => w.address?.toLowerCase() === userAddress.toLowerCase()
        );
      }
      if (found) {
        setActiveWallet(found);
      }
    }
  }, [
    ready,
    authenticated,
    userAddress,
    readyEth,
    readySol,
    ethereumWallets,
    solanaWallets,
  ]);

  //active wallet privider

  const [adaptedWallet, setAdaptedWallet] = useState<AdaptedWallet | null>(
    null
  );
  console.log("adaptedWallet", adaptedWallet);
  useEffect(() => {
    if (activeWallet && activeWallet?.type === "ethereum") {
      const walletClient = createWalletClient({
        chain: chain(Number(activeWallet.chainId.split(":")[1])),
        transport: custom(window.ethereum!),
      });

      const adaptedViemClient = adaptViemWallet(walletClient);

      setAdaptedWallet(adaptedViemClient);
    }

    if (activeWallet && activeWallet?.type === "solana" && connection) {
      const adaptedSolanaWallet = adaptSolanaWallet(
        activeWallet.address,
        792703809, //chain id that Relay uses to identify solana
        connection,
        sendTransactionAdapter
      );
      setAdaptedWallet(adaptedSolanaWallet);
    }
  }, [activeWallet]);

  return (
    <ActiveWalletContext.Provider
      value={{
        ethLinked,
        solLinked,
        activeWallet,
        setActiveWallet,
        readyEth,
        readySol,
        setActiveBuyWallet,
        activeBuyWallet,
        setIsAddressModalOpen,
        isAddressModalOpen,
        adaptedWallet,
      }}
    >
      {children}
      {isAddressModalOpen && <AddressModal />}
    </ActiveWalletContext.Provider>
  );
}

export function useActiveWallet() {
  const context = useContext(ActiveWalletContext);
  if (!context) {
    throw new Error(
      "useActiveWallet must be used within an ActiveWalletProvider"
    );
  }
  return context;
}
