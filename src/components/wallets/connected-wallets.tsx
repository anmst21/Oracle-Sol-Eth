import React from "react";
import WalletItem from "./wallet-item";
import {
  usePrivy,
  ConnectedSolanaWallet,
  ConnectedWallet,
} from "@privy-io/react-auth";
import { useActiveWallet } from "@/context/ActiveWalletContext";
import { PastedWallet } from "../swap/types";

type Props = {
  activeAddress: string | undefined;
  setWallet: (
    wallet: ConnectedWallet | ConnectedSolanaWallet | PastedWallet | null
  ) => void;
};

const ConnectedWallets = ({ setWallet, activeAddress }: Props) => {
  const { authenticated, user, logout } = usePrivy();

  const {
    ethLinked,
    solLinked,

    readyEth,
    readySol,
    //   activeBuyWallet,

    pastedWallets,
  } = useActiveWallet();

  const PastedSection = pastedWallets && pastedWallets.length > 0 && (
    <>
      {pastedWallets.map((w, i) => (
        <WalletItem
          key={`pasted-${i}-${w.address}`}
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
          selectCallback={() => setWallet(w)}
          activeWalletAddress={activeAddress}
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
          key={`eth-${i}-${w.address}`}
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
          selectCallback={() => setWallet(w)}
          activeWalletAddress={activeAddress}
          isMini={true}
        />
      ))}
    </>
  );

  const SolSection = readySol && authenticated && solLinked.length > 0 && (
    <>
      {solLinked.map((w, i) => (
        <WalletItem
          key={`sol-${i}-${w.address}`}
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
          selectCallback={() => setWallet(w)}
          activeWalletAddress={activeAddress}
          isMini={true}
        />
      ))}
    </>
  );

  const userChain = user?.wallet?.chainType;

  return (
    <div className="address-modal__wallets">
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
    </div>
  );
};

export default ConnectedWallets;
