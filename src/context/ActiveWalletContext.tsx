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
import { SwapWallet } from "@/components/swap/types";
import { extractChain } from "viem";
import * as viemChains from "viem/chains";
import { AdaptedWallet, adaptViemWallet } from "@reservoir0x/relay-sdk";
import { connection } from "@/helpers/solana-connection";

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
  setActiveBuyWallet: React.Dispatch<React.SetStateAction<SwapWallet | null>>;
  activeBuyWallet: SwapWallet | null;
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

  const [activeBuyWallet, setActiveBuyWallet] = useState<SwapWallet | null>(
    null
  );

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
        setActiveBuyWallet({
          address: found.address,
          type: found.type,
          chainId:
            found.type === "ethereum"
              ? Number(found.chainId.split(":")[1])
              : 792703809,
        });
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

  useEffect(() => {
    // bail early if we have nothing to adapt
    if (!activeWallet) return;

    // async IIFE so we can await getEthereumProvider()
    (async () => {
      if (activeWallet.type === "ethereum") {
        // 1. pull out the EIP-1193 provider
        const provider = await activeWallet.getEthereumProvider();

        // 2. build your WalletClient with the actual provider (not a Promise)
        const walletClient = createWalletClient({
          chain: chain(Number(activeWallet.chainId.split(":")[1])),
          transport: custom(provider),
        });

        // 3. adapt & set state
        setAdaptedWallet(adaptViemWallet(walletClient));
      }
      if (activeWallet?.type === "solana" && connection) {
        // narrow the type so TS knows we have a solana wallet
        const solWallet = activeWallet as ConnectedSolanaWallet;

        setAdaptedWallet(
          adaptSolanaWallet(
            solWallet.address,
            792703809,
            connection,
            // our new sign‐and‐send wrapper:
            async (tx, opts) => {
              // 1) let Privy’s wallet instance sign it
              const signed = await solWallet.signTransaction(tx);

              // 2) send the raw bytes
              const raw = signed.serialize();
              const sig = await connection.sendRawTransaction(raw, opts);

              return { signature: sig };
            }
          )
        );
      }
    })();
  }, [activeWallet]);

  useEffect(() => {
    if (ready && !authenticated && activeWallet) {
      setActiveWallet(null);
    }
    if (ready && !authenticated && activeBuyWallet) {
      setActiveBuyWallet(null);
    }
  }, [authenticated, ready, activeBuyWallet, activeWallet]);

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
