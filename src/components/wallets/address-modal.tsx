import React, { useCallback } from "react";
import { InputCross, PensilLarge, SaveDisk } from "../icons";
import { useActiveWallet } from "@/context/ActiveWalletContext";
import { ConnectedSolanaWallet, ConnectedWallet } from "@privy-io/react-auth";

import { PastedWallet } from "../swap/types";
import { motion } from "motion/react";
import ConnectedWallets from "./connected-wallets";
import { useAddressModal } from "@/hooks/useAdddressModal";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
const AddressModal = () => {
  useBodyScrollLock();
  const { setActiveBuyWallet, setIsAddressModalOpen, activeBuyWallet } =
    useActiveWallet();

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

  // const handleSave = () => {
  //   setError(null);
  //   if (isValidEthereumAddress(manualAddress)) {
  //     handleEthAddress(manualAddress);
  //   } else if (isValidSolanaAddress(manualAddress)) {
  //     handleSolAddress(manualAddress);
  //   } else {
  //     setError("Invalid ETH or SOL address");
  //   }

  //   closeModal();
  // };

  const closeModal = useCallback(() => {
    setIsAddressModalOpen(false);
  }, [setIsAddressModalOpen]);

  const { handleSave, manualAddress, setManualAddress } = useAddressModal({
    closeModal,
    setActiveWallet: setActiveBuyWallet,
  });

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
            <ConnectedWallets
              activeAddress={activeBuyWallet?.address}
              setWallet={setWallet}
            />
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
