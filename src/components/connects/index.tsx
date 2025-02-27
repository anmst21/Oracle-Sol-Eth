"use client";

import { useState, useEffect, useCallback } from "react";
import {
  usePrivy,
  useWallets,
  useSolanaWallets,
  ConnectedSolanaWallet,
  ConnectedWallet,
} from "@privy-io/react-auth";
import { createPublicClient, custom, formatUnits, Hex } from "viem";
import { mainnet } from "viem/chains";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import {
  createClient,
  convertViemChainToRelayChain,
  MAINNET_RELAY_API,
} from "@reservoir0x/relay-sdk";
import { supportedChains } from "@/context/PrivyProvider";
import { solanaChain } from "@/helpers/solanaChain";
import TokenModal from "../token-modal";

const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC as string);

const ethChains = supportedChains.map((chain) =>
  convertViemChainToRelayChain(chain)
);

const chains = [...ethChains, solanaChain];

const chainItems = chains.map((chain) => ({
  id: chain.id,
  explorerUrl: chain.explorerUrl,
  httpRpcUrl: chain.httpRpcUrl,
  displayName: chain.displayName,
  name: chain.name,
}));

console.log("chainItems", chainItems);

createClient({
  baseApiUrl: MAINNET_RELAY_API,
  source: "https://h3llcat.app/",
  chains,
});

function Base64Image({ src }: { src: string }) {
  return (
    <img
      src={src}
      alt="SVG Image"
      style={{ borderRadius: 1000 }}
      width={30}
      height={30}
    />
  );
}

type ActiveWallet = {
  chainType: "solana" | "ethereum" | undefined;
  address: string | undefined;
};

export default function Connect() {
  const { ready, login, logout, authenticated, user, connectWallet } =
    usePrivy();

  const { wallets, ready: readyWallets } = useWallets();
  const { wallets: solWallets, ready: readySolWallets } = useSolanaWallets();
  const [activeWallet, setActiveWallet] = useState<ActiveWallet>({
    chainType: undefined,
    address: undefined,
  });

  useEffect(() => {
    if (ready && authenticated && user) {
      setActiveWallet({
        chainType: user?.wallet?.chainType,
        address: user?.wallet?.address,
      });
    } else if (!authenticated) {
      setActiveWallet({
        chainType: undefined,
        address: undefined,
      });
    }
  }, [ready, authenticated, user]);
  // Instead of arrays, use objects keyed by wallet address
  const [ethBalances, setEthBalances] = useState<Record<string, bigint | null>>(
    {}
  );
  const [solBalances, setSolBalances] = useState<Record<string, number | null>>(
    {}
  );

  console.log("user", user, activeWallet);
  console.log("wallets", wallets, solWallets);

  const formatSolBalance = (lamports: number) =>
    (lamports / LAMPORTS_PER_SOL).toFixed(6);
  const formatEthBalance = (units: bigint) =>
    Number(formatUnits(units, 18)).toFixed(6);

  const fetchEthBalance = useCallback(async (wallet: ConnectedWallet) => {
    if (!wallet.linked) {
      // Set balance to null for unlinked wallets
      setEthBalances((prev) => ({ ...prev, [wallet.address]: null }));
      return;
    }
    try {
      const provider = await wallet.getEthereumProvider();
      const publicClient = createPublicClient({
        chain: mainnet,
        transport: custom(provider),
      });
      const balance = await publicClient.getBalance({
        address: wallet.address as Hex,
      });
      setEthBalances((prev) => ({ ...prev, [wallet.address]: balance }));
    } catch (err) {
      console.error("Error fetching ETH balance", err);
      setEthBalances((prev) => ({ ...prev, [wallet.address]: null }));
    }
  }, []);

  const fetchSolBalance = useCallback(async (wallet: ConnectedSolanaWallet) => {
    if (!wallet.linked) {
      setSolBalances((prev) => ({ ...prev, [wallet.address]: null }));
      return;
    }
    try {
      const balance = await connection.getBalance(
        new PublicKey(wallet.address)
      );
      setSolBalances((prev) => ({ ...prev, [wallet.address]: balance }));
    } catch (err) {
      console.error("Error fetching SOL balance", err);
      setSolBalances((prev) => ({ ...prev, [wallet.address]: null }));
    }
  }, []);

  // When the Ethereum wallet list changes, reset balances and fetch new ones
  useEffect(() => {
    if (readyWallets && wallets.length > 0 && authenticated) {
      // Clear previous balances
      setEthBalances({});
      wallets.forEach((wallet) => {
        fetchEthBalance(wallet);
      });
    }
  }, [readyWallets, fetchEthBalance, authenticated]);

  // When the Solana wallet list changes, reset balances and fetch new ones
  useEffect(() => {
    if (readySolWallets && solWallets.length > 0 && authenticated) {
      setSolBalances({});
      solWallets.forEach((wallet) => {
        fetchSolBalance(wallet);
      });
    }
  }, [readySolWallets, fetchSolBalance, authenticated]);

  return (
    <div>
      {ready && (
        <button
          onClick={() => {
            (!authenticated ? login : connectWallet)();
          }}
        >
          {!authenticated ? "Login" : "Connect Another Wallet"}
        </button>
      )}
      {ready && authenticated && (
        <button
          onClick={async () => {
            await logout();
            setEthBalances({});
            setSolBalances({});
          }}
        >
          Logout
        </button>
      )}
      <h3>Ethereum Wallets</h3>
      {readyWallets &&
        authenticated &&
        wallets.map((wallet, index) => (
          <div key={index}>
            <div>
              <button
                // disabled={wallet.linked || !authenticated}
                onClick={() => {
                  if (!wallet.linked) {
                    wallet.loginOrLink();
                  } else {
                    setActiveWallet({
                      chainType: wallet.type,
                      address: wallet.address,
                    });
                  }
                }}
              >
                {wallet.meta.icon && <Base64Image src={wallet.meta.icon} />}
                Link Eth {wallet.address}
              </button>
              {wallet.linked && authenticated && (
                <button onClick={() => wallet.unlink()}>Unlink</button>
              )}
            </div>
            <div>
              <span>
                Balance:{" "}
                {ethBalances[wallet.address] !== undefined
                  ? ethBalances[wallet.address] !== null
                    ? formatEthBalance(ethBalances[wallet.address]!)
                    : "N/A"
                  : "Loading..."}
              </span>
            </div>
          </div>
        ))}
      <h3>Solana Wallets</h3>
      {readySolWallets &&
        authenticated &&
        solWallets.map((wallet, index) => (
          <div key={index}>
            <div>
              <button
                onClick={() => {
                  if (!wallet.linked) {
                    wallet.loginOrLink();
                  } else {
                    setActiveWallet({
                      chainType: wallet.type,
                      address: wallet.address,
                    });
                  }
                }}
              >
                {wallet.meta.icon && <Base64Image src={wallet.meta.icon} />}{" "}
                Link Solana {wallet.address}
              </button>
              {wallet.linked && authenticated && (
                <button onClick={() => wallet.unlink()}>Unlink</button>
              )}
            </div>
            <div>
              <span>
                Balance:{" "}
                {solBalances[wallet.address] !== undefined
                  ? solBalances[wallet.address] !== null
                    ? formatSolBalance(solBalances[wallet.address]!)
                    : "N/A"
                  : "Loading..."}
              </span>
            </div>
          </div>
        ))}
    </div>
  );
}
