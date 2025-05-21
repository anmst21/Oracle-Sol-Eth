import React, { useCallback } from "react";
import { InputCross, PensilLarge, SaveDisk } from "../icons";
import WalletItem from "./wallet-item";
import { useActiveWallet } from "@/context/ActiveWalletContext";
import {
  ConnectedSolanaWallet,
  ConnectedWallet,
  usePrivy,
} from "@privy-io/react-auth";

const AddressModal = () => {
  const {
    ethLinked,
    solLinked,

    readyEth,
    readySol,
    activeBuyWallet,
    //  isAddressModalOpen,
    setActiveBuyWallet,
    setIsAddressModalOpen,
  } = useActiveWallet();

  const { authenticated, user, logout } = usePrivy();

  const setWallet = useCallback(
    (w: ConnectedWallet | ConnectedSolanaWallet | null) => {
      setActiveBuyWallet(w);
    },
    [setActiveBuyWallet]
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
          logout={logout}
          selectCallback={() => setWallet(w)}
          activeWalletAddress={activeBuyWallet?.address}
          isMini={true}
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
          logout={logout}
          selectCallback={() => setWallet(w)}
          activeWalletAddress={activeBuyWallet?.address}
          isMini={true}
        />
      ))}
    </>
  );
  const userChain = user?.wallet?.chainType;

  const closeModal = useCallback(() => {
    setIsAddressModalOpen(false);
  }, [setIsAddressModalOpen]);

  return (
    <div onClick={closeModal} className="address-modal__wrapper">
      <div
        onClick={(e) => e.stopPropagation()}
        className="address-modal__container"
      >
        <div className="address-modal">
          <div className="address-modal__header">
            <div className="address-modal__header__badge">BUY</div>
            <div className="address-modal__header__address">
              <span>Address</span>
              <button onClick={() => closeModal()}>
                <InputCross />
              </button>
            </div>
          </div>
          <div className="address-modal__bottom">
            <label className="address-modal__input">
              <input placeholder="Enter Address" type="text" />
              <PensilLarge />
            </label>
            <div className="address-modal__use">
              <span>Use connected wallet</span>
            </div>
            <div className="address-modal__wallets">
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
            </div>
          </div>
          <button className="address-modal__cta">
            <SaveDisk />
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
