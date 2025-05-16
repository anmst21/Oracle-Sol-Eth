"use client";

import {
  usePrivy,
  ConnectedSolanaWallet,
  ConnectedWallet,
} from "@privy-io/react-auth";
import WalletItem from "./wallet-item";
import { PrivyLogo } from "../icons";
import React, { useCallback } from "react";
import { useActiveWallet } from "@/context/ActiveWalletContext";
import { SwapWallet } from "../swap/types";

export default function Wallets({
  swapWindow,
  callback,
  isBuy,
  activeAddress,
}: {
  callback?: (wallet?: SwapWallet) => void;
  swapWindow?: boolean;
  isBuy?: boolean;
  activeAddress?: string;
}) {
  const { ready, authenticated, linkWallet, user, logout, login } = usePrivy();

  const {
    ethLinked,
    solLinked,
    activeWallet,
    setActiveWallet,
    readyEth,
    readySol,
  } = useActiveWallet();

  const userChain = user?.wallet?.chainType;

  const selectCallback = useCallback(
    (wallet: ConnectedWallet | ConnectedSolanaWallet) => {
      if (!isBuy) {
        setActiveWallet(wallet);
      }

      if (callback && !isBuy) callback();
      if (callback && isBuy)
        callback({
          type: wallet.type,
          address: wallet.address,
          chainId:
            wallet.type === "ethereum"
              ? Number(wallet.chainId.split(":")[1])
              : 792703809,
        });
    },
    [setActiveWallet, callback, isBuy]
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
          activeWalletAddress={
            activeAddress ? activeAddress : activeWallet?.address
          }
          isMini={swapWindow}
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
          activeWalletAddress={
            activeAddress ? activeAddress : activeWallet?.address
          }
          isMini={swapWindow}
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
