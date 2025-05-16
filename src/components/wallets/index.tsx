"use client";

import {
  useWallets,
  useSolanaWallets,
  usePrivy,
  useLogin,
  ConnectedSolanaWallet,
  ConnectedWallet,
} from "@privy-io/react-auth";
import WalletItem from "./wallet-item";
import { PrivyLogo } from "../icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";

export default function Wallets() {
  const { wallets: ethereumWallets, ready: readyEth } = useWallets();
  const { wallets: solanaWallets, ready: readySol } = useSolanaWallets();
  const { ready, authenticated, linkWallet, user, logout } = usePrivy();
  const { login } = useLogin();

  const [activeWallet, setActiveWallet] = useState<
    ConnectedSolanaWallet | ConnectedWallet | null
  >(null);

  console.log("activeWallet", activeWallet);

  useEffect(() => {
    // guard: everything must be ready and we must have a user address
    if (
      ready &&
      authenticated &&
      user?.wallet?.address &&
      (readyEth || readySol)
    ) {
      const userAddr = user.wallet.address.toLowerCase();

      // try ETH first
      let found: ConnectedWallet | ConnectedSolanaWallet | undefined = readyEth
        ? ethereumWallets.find((w) => w.address?.toLowerCase() === userAddr)
        : undefined;

      // if not in ETH, try SOL
      if (!found && readySol) {
        found = solanaWallets.find(
          (w) => w.address?.toLowerCase() === userAddr
        );
      }

      // if we found it, set it; otherwise leave as-is (or clear if you prefer)
      if (found) {
        setActiveWallet(found);
      }
    }
  }, [
    ready,
    authenticated,
    user?.wallet?.address,
    readyEth,
    readySol,
    ethereumWallets,
    solanaWallets,
  ]);

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
  // only keep linked wallets
  const ethLinked = useMemo(() => {
    const linked = ethereumWallets.filter((w) => w.linked);
    // return liftUserWallet(linked, userAddress);
    return sortByUserFirst(linked, userAddress);
  }, [ethereumWallets, userAddress]);

  const solLinked = useMemo(() => {
    const linked = solanaWallets.filter((w) => w.linked);
    // return liftUserWallet(linked, userAddress);
    return sortByUserFirst(linked, userAddress);
  }, [solanaWallets, userAddress]);

  const userChain = user?.wallet?.chainType;

  const selectCallback = useCallback(
    (wallet: ConnectedWallet | ConnectedSolanaWallet) => {
      setActiveWallet(wallet);
    },
    [setActiveWallet]
  );

  // define each section once
  const EthSection = readyEth && authenticated && ethLinked.length > 0 && (
    <div className="wallets__container">
      <h2>Ethereum Wallets</h2>
      {ethLinked.map((w, i) => (
        <WalletItem
          key={i}
          name={w.meta.name}
          id={w.meta.id}
          icon={w.meta.icon}
          chainId={w.chainId}
          address={w.address}
          userWalletAdderess={user?.wallet?.address}
          isLinked
          loginOrLink={w.loginOrLink}
          unlink={w.unlink}
          logout={logout}
          selectCallback={() => selectCallback(w)}
          activeWalletAddress={activeWallet?.address}
        />
      ))}
    </div>
  );

  const SolSection = readySol && authenticated && solLinked.length > 0 && (
    <div className="wallets__container">
      <h2>Solana Wallets</h2>
      {solLinked.map((w, i) => (
        <WalletItem
          key={i}
          name={w.meta.name}
          id={w.meta.id}
          icon={w.meta.icon}
          chainId="792703809"
          address={w.address}
          userWalletAdderess={user?.wallet?.address}
          isLinked
          loginOrLink={w.loginOrLink}
          unlink={w.unlink}
          logout={logout}
          selectCallback={() => selectCallback(w)}
          activeWalletAddress={activeWallet?.address}
        />
      ))}
    </div>
  );

  return (
    <div className="wallets">
      {/** render in order based on userChain */}
      {userChain === "solana" ? (
        <>
          {SolSection}
          {EthSection}
        </>
      ) : (
        <>
          {EthSection}
          {SolSection}
        </>
      )}

      {/** always show the connect/login button */}
      <div className="wallets__container">
        {authenticated ? (
          <button
            disabled={!ready}
            onClick={() => linkWallet()}
            className="wallet-item__connect"
          >
            <span>Connect a new wallet</span>
            <PrivyLogo />
          </button>
        ) : (
          <button
            disabled={!ready}
            onClick={() => login()}
            className="wallet-item__connect"
          >
            <span>Login</span>
            <PrivyLogo />
          </button>
        )}
      </div>
    </div>
  );
}
