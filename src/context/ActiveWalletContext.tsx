"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useRef,
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
import { PastedWallet, SwapWallet } from "@/components/swap/types";
import { extractChain } from "viem";
import * as viemChains from "viem/chains";
import { AdaptedWallet, adaptViemWallet } from "@reservoir0x/relay-sdk";
import { connection } from "@/helpers/solana-connection";
import { AnimatePresence } from "motion/react";

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
  pastedWallets: PastedWallet[];
  setPastedWallets: React.Dispatch<React.SetStateAction<PastedWallet[]>>;
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

  const [pastedWallets, setPastedWallets] = useState<PastedWallet[]>([]);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // console.log("isAddressModalOpen", isAddressModalOpen);

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
    const linked = ethereumWallets.filter(
      (w) => w.linked && w.meta.name !== "Browser Extension"
    );
    return sortByUserFirst(linked, userAddress);
  }, [ethereumWallets, userAddress]);

  const solLinked = useMemo(() => {
    const linked = solanaWallets.filter(
      (w) => w.linked && w.meta.name !== "Browser Extension"
    );
    return sortByUserFirst(linked, userAddress);
  }, [solanaWallets, userAddress]);

  // Tracks whether the initial wallet selection driven by a deep-link chain has fired.
  // Prevents subsequent effect re-runs from falling through to the ETH fallback.
  const deepLinkWalletPicked = useRef(false);

  // auto-select active wallet on auth
  useEffect(() => {
    if (!ready || !authenticated || !userAddress || (!readyEth && !readySol)) return;

    const sp = new URLSearchParams(window.location.search);
    const sellIsSolana =
      sp.get("sellChainId") === "792703809" ||
      sp.get("sellTokenChain") === "792703809";
    const buyIsSolana =
      sp.get("buyChainId") === "792703809" ||
      sp.get("buyTokenChain") === "792703809";

    if (sellIsSolana) {
      // Wait until Solana wallets are ready
      if (!readySol) return;
      // Already handled — don't let subsequent fires fall through to ETH fallback
      if (deepLinkWalletPicked.current) return;
      // SOL wallets not populated yet (readySol fired before wallets loaded) — wait
      if (solLinked.length === 0) return;

      deepLinkWalletPicked.current = true;
      setActiveWallet(solLinked[0]);
      // Buy wallet follows buy chain: ETH if buy token is on ETH, SOL otherwise
      if (!buyIsSolana && ethLinked.length > 0) {
        setActiveBuyWallet({
          address: ethLinked[0].address,
          chainId: Number(ethLinked[0].chainId.split(":")[1]),
          type: "ethereum",
        });
      } else {
        setActiveBuyWallet({
          address: solLinked[0].address,
          type: "solana",
          chainId: 792703809,
        });
      }
      return;
    }

    if (buyIsSolana) {
      // Sell is ETH, buy is SOL — need both chains ready
      if (!readySol || !readyEth) return;
      if (deepLinkWalletPicked.current) return;
      if (solLinked.length === 0 || ethLinked.length === 0) return;

      deepLinkWalletPicked.current = true;
      const ethSellWallet =
        ethereumWallets.find(
          (w) =>
            w.address?.toLowerCase() === userAddress.toLowerCase() &&
            w.meta.name !== "Browser Extension"
        ) ?? ethLinked[0];
      setActiveWallet(ethSellWallet);
      setActiveBuyWallet({
        address: solLinked[0].address,
        type: "solana",
        chainId: 792703809,
      });
      return;
    }

    // Standard wallet auto-selection for non-deep-link case
    if (activeWallet) return; // already initialized, don't override

    let found: ConnectedWallet | ConnectedSolanaWallet | undefined;
    if (readyEth) {
      found = ethereumWallets.find(
        (w) =>
          w.address?.toLowerCase() === userAddress.toLowerCase() &&
          w.meta.name !== "Browser Extension"
      );
    }
    if (!found && readySol) {
      found = solanaWallets.find(
        (w) =>
          w.address?.toLowerCase() === userAddress.toLowerCase() &&
          w.meta.name !== "Browser Extension"
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
  }, [
    ready,
    authenticated,
    userAddress,
    readyEth,
    readySol,
    ethereumWallets,
    solanaWallets,
    activeWallet,
    solLinked,
    ethLinked,
  ]);

  //active wallet privider

  const [adaptedWallet, setAdaptedWallet] = useState<AdaptedWallet | null>(
    null
  );

  useEffect(() => {
    // bail early if we have nothing to adapt
    if (!activeWallet) return;

    // clear immediately so swap-container's fetchQuote guard blocks stale calls
    setAdaptedWallet(null);

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
        console.log("[wallet-debug] adapting wallet, chainId:", activeWallet.chainId);
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
        pastedWallets,
        setPastedWallets,
      }}
    >
      {children}
      <AnimatePresence mode="wait">
        {isAddressModalOpen && <AddressModal />}
      </AnimatePresence>
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
