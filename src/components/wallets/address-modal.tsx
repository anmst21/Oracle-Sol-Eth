import React, { useCallback, useState } from "react";
import { InputCross, PensilLarge, SaveDisk } from "../icons";
import WalletItem from "./wallet-item";
import { useActiveWallet } from "@/context/ActiveWalletContext";
import {
  ConnectedSolanaWallet,
  ConnectedWallet,
  usePrivy,
} from "@privy-io/react-auth";
import { isValidSolanaAddress } from "@/helpers/is-valid-solana-address";
import { isAddress as isValidEthereumAddress } from "viem";
import { PastedWallet } from "../swap/types";
import { motion } from "motion/react";
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
    setPastedWallets,
    pastedWallets,
  } = useActiveWallet();

  const [manualAddress, setManualAddress] = useState("");
  const [error, setError] = useState<string | null>(null);

  console.log("Address Modal Error", error);

  const { authenticated, user, logout } = usePrivy();

  const setWallet = useCallback(
    (wallet: ConnectedWallet | ConnectedSolanaWallet | PastedWallet | null) => {
      if (wallet && "isPasted" in wallet && wallet.isPasted) {
        setActiveBuyWallet({
          type: wallet.type,
          address: wallet.address,
          chainId: wallet.chainId,
        });
      } else if (wallet)
        setActiveBuyWallet({
          address: wallet?.address,
          type: wallet.type,
          chainId:
            wallet.type === "ethereum"
              ? Number((wallet as ConnectedWallet).chainId.split(":")[1])
              : 792703809,
        });
    },
    [setActiveBuyWallet]
  );

  const handleEthAddress = useCallback(
    (address: string) => {
      const newActiveItem: PastedWallet = {
        address,
        type: "ethereum",
        chainId: 1,
        isPasted: true,
      };

      setActiveBuyWallet(newActiveItem);

      const existingConnected = ethLinked.find(
        (wallet) => wallet.address === address
      );
      const existingPasted = pastedWallets.find(
        (wallet) => wallet.address === address
      );

      if (!existingConnected && !existingPasted) {
        setPastedWallets([...pastedWallets, newActiveItem]);
      }

      setIsAddressModalOpen(false);
    },
    [
      setActiveBuyWallet,
      setIsAddressModalOpen,
      setPastedWallets,
      ethLinked,
      pastedWallets,
    ]
  );

  const handleSolAddress = useCallback(
    (address: string) => {
      const newActiveItem: PastedWallet = {
        address,
        type: "solana",
        chainId: 792703809,
        isPasted: true,
      };
      setActiveBuyWallet(newActiveItem);
      const existingConnected = solLinked.find(
        (wallet) => wallet.address === address
      );
      const existingPasted = pastedWallets.find(
        (wallet) => wallet.address === address
      );

      if (!existingConnected && !existingPasted) {
        setPastedWallets([...pastedWallets, newActiveItem]);
      }

      setIsAddressModalOpen(false);
    },
    [
      setActiveBuyWallet,
      setIsAddressModalOpen,
      pastedWallets,
      setPastedWallets,
      solLinked,
    ]
  );

  const PastedSection = pastedWallets && pastedWallets.length > 0 && (
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
          selectCallback={() => setWallet(w)}
          activeWalletAddress={activeBuyWallet?.address}
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

  const handleSave = () => {
    setError(null);
    if (isValidEthereumAddress(manualAddress)) {
      handleEthAddress(manualAddress);
    } else if (isValidSolanaAddress(manualAddress)) {
      handleSolAddress(manualAddress);
    } else {
      setError("Invalid ETH or SOL address");
    }

    closeModal();
  };

  return (
    <div onClick={closeModal} className="address-modal__wrapper">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
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
              <input
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value.trim())}
                placeholder="Enter Address"
                type="text"
              />
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
          </div>
          <button onClick={handleSave} className="address-modal__cta">
            <SaveDisk />
            <span>Save</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AddressModal;
