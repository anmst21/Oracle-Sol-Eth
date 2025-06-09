"use client";

import {
  usePrivy,
  ConnectedSolanaWallet,
  ConnectedWallet,
} from "@privy-io/react-auth";
import WalletItem from "./wallet-item";
import { LogOutDoor, PensilSmall, PrivyLogo } from "../icons";
import React, { useCallback } from "react";
import { useActiveWallet } from "@/context/ActiveWalletContext";
import { PastedWallet, SwapWallet } from "../swap/types";

export default function Wallets({
  swapWindow,
  callback,
  isBuy,
  activeAddress,
  linkCallback,
}: {
  callback?: (wallet?: SwapWallet | null) => void;
  swapWindow?: boolean;
  isBuy?: boolean;
  activeAddress?: string;
  linkCallback?: () => void;
}) {
  const { ready, authenticated, linkWallet, user, logout, login } = usePrivy();

  const {
    ethLinked,
    solLinked,
    activeWallet,
    setActiveWallet,
    readyEth,
    readySol,

    pastedWallets,
    //  isAddressModalOpen,
    setIsAddressModalOpen,
  } = useActiveWallet();

  const userChain = user?.wallet?.chainType;

  const selectCallback = useCallback(
    (wallet: ConnectedWallet | ConnectedSolanaWallet | PastedWallet) => {
      if ("isPasted" in wallet && wallet.isPasted && callback) {
        callback({
          type: wallet.type,
          address: wallet.address,
          chainId: wallet.chainId,
        });
      } else {
        if (!isBuy) {
          setActiveWallet(wallet as ConnectedWallet | ConnectedSolanaWallet);
        }

        if (callback && !isBuy) callback();
        if (callback && isBuy)
          callback({
            type: wallet.type,
            address: wallet.address,
            chainId:
              wallet.type === "ethereum"
                ? Number((wallet as ConnectedWallet).chainId.split(":")[1])
                : 792703809,
          });
      }
    },
    [setActiveWallet, callback, isBuy]
  );

  // define each section once
  const PastedSection = isBuy && pastedWallets && pastedWallets.length > 0 && (
    <>
      {pastedWallets.map((w, i) => (
        <WalletItem
          key={i}
          name={undefined}
          id={w.chainId === 792703809 ? "792703809" : `:${w.chainId}`}
          // icon={getIconUri(w.chainId)}
          chainId={w.chainId === 792703809 ? "792703809" : `:${w.chainId}`}
          address={w.address}
          userWalletAdderess={user?.wallet?.address}
          isLinked
          loginOrLink={undefined}
          unlink={undefined}
          logout={undefined}
          selectCallback={() => selectCallback(w)}
          activeWalletAddress={
            activeAddress ? activeAddress : activeWallet?.address
          }
          isMini
          isPasted
        />
      ))}
    </>
  );
  const EthSection = readyEth && authenticated && ethLinked.length > 0 && (
    <>
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
          logout={() => (linkCallback && linkCallback(), logout())}
          selectCallback={() => selectCallback(w)}
          activeWalletAddress={
            activeAddress ? activeAddress : activeWallet?.address
          }
          isMini={swapWindow}
        />
      ))}
    </>
  );

  const SolSection = readySol && authenticated && solLinked.length > 0 && (
    <>
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
          logout={() => (linkCallback && linkCallback(), logout())}
          selectCallback={() => selectCallback(w)}
          activeWalletAddress={
            activeAddress ? activeAddress : activeWallet?.address
          }
          isMini={swapWindow}
        />
      ))}
    </>
  );

  const openAddressModal = useCallback(() => {
    setIsAddressModalOpen(true);
  }, [setIsAddressModalOpen]);

  const disableLogin = !ready || (ready && authenticated);

  return (
    <>
      {ready && (
        <div className="wallets">
          {/** render in order based on userChain */}
          {userChain === "solana" ? (
            <>
              {SolSection}
              {EthSection}
              {PastedSection}
            </>
          ) : (
            <>
              {EthSection}
              {SolSection}
              {PastedSection}
            </>
          )}

          {/** always show the connect/login button */}

          <div className="wallets__container">
            {isBuy && authenticated && (
              <button
                disabled={!authenticated}
                onClick={openAddressModal}
                className="wallet-item__connect"
              >
                <PensilSmall />
                <span>Paste Address</span>
              </button>
            )}
            {authenticated ? (
              <button
                disabled={!authenticated}
                onClick={() => (linkCallback && linkCallback(), linkWallet())}
                className="wallet-item__connect"
              >
                <PrivyLogo />
                <span>Link a new wallet</span>
              </button>
            ) : (
              <button
                disabled={disableLogin}
                onClick={() => login()}
                className="wallet-item__connect"
              >
                <PrivyLogo />
                <span>Login</span>
              </button>
            )}

            {authenticated && !swapWindow && (
              <button
                disabled={!authenticated}
                onClick={() => logout()}
                className="wallet-item__connect"
              >
                <LogOutDoor />
                <span>Log Out</span>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
