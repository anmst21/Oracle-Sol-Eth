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

interface ActiveWalletContextValue {
  ethLinked: ConnectedWallet[];
  solLinked: ConnectedSolanaWallet[];
  activeWallet: ConnectedWallet | ConnectedSolanaWallet | null;
  setActiveWallet: React.Dispatch<
    React.SetStateAction<ConnectedWallet | ConnectedSolanaWallet | null>
  >;
  readyEth: boolean;
  readySol: boolean;
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

  return (
    <ActiveWalletContext.Provider
      value={{
        ethLinked,
        solLinked,
        activeWallet,
        setActiveWallet,
        readyEth,
        readySol,
      }}
    >
      {children}
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
