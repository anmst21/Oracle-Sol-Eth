import { AnimatePresence, motion } from "motion/react";
import React, { useCallback, useEffect, useState } from "react";
import { HistorySortType } from "./types";
import classNames from "classnames";
import ModalInfo from "../slippage-modal/modal-info";
import {
  InputCross,
  ModalInfo as Info,
  PensilLarge,
  SearchGlass,
  SaveDisk,
} from "../icons";
import { useAddressModal } from "@/hooks/useAdddressModal";
import { PastedWallet } from "../swap/types";
import { ConnectedSolanaWallet, ConnectedWallet } from "@privy-io/react-auth";
import ModalChains from "../modal/modal-chains";
import { useChainsData } from "@/hooks/useChains";
import ConnectedWallets from "../wallets/connected-wallets";
import { useHistory } from "@/context/HistoryProvider";
import { slidingTextAnimation } from "../swap/animation";

type Props = {
  closeModal: () => void;
  type: HistorySortType;
  setType: React.Dispatch<React.SetStateAction<HistorySortType>>;
};

const HistoryModal = ({ closeModal, type, setType }: Props) => {
  const {
    //  openModalPage,
    setActiveChainId,
    activeChainId,
    activeWallet,
    setActiveWallet,
  } = useHistory();

  const { handleSave, manualAddress, setManualAddress } = useAddressModal({
    closeModal,
    setActiveWallet,
  });
  const [isOpenInfo, setIsOpenInfo] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const {
    isLoading: isLoadingChains,
    isLoaded: isLoadedChains,
    // error: chainsError,
    // chains,
    featuredChains,
    otherChains,
    solanaChain,
    baseChain,
    loadChains,
    ethereumChain,
  } = useChainsData();

  useEffect(() => {
    if (!isLoadedChains) loadChains();
  }, [isLoadedChains]);

  useEffect(() => {
    setSearchTerm("");
    setManualAddress("");
  }, [type]);

  const setWallet = useCallback(
    (wallet: ConnectedWallet | ConnectedSolanaWallet | PastedWallet | null) => {
      if (wallet && "isPasted" in wallet && wallet.isPasted) {
        setActiveWallet({
          type: wallet.type,
          address: wallet.address,
          chainId: wallet.chainId,
        });
      } else if (wallet)
        setActiveWallet({
          address: wallet?.address,
          type: wallet.type,
          chainId:
            wallet.type === "ethereum"
              ? Number((wallet as ConnectedWallet).chainId.split(":")[1])
              : 792703809,
        });
      closeModal();
    },
    [setActiveWallet]
  );

  const sectionAnimation = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
    transition: { duration: 0.2 },
  };

  return (
    <div onClick={closeModal} className="history-modal__wrapper">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="history-modal"
      >
        <div className="history-modal__inner">
          <div className="modal__header__inner">
            <span>Sort By</span>

            <div
              className={classNames("slippage-modal__header__item info-hover", {
                "info-active": isOpenInfo,
              })}
              onMouseLeave={() => {
                if (isOpenInfo) setIsOpenInfo(false);
              }}
              onMouseEnter={() => {
                if (!isOpenInfo) setIsOpenInfo(true);
              }}
            >
              <Info />

              {isOpenInfo && (
                <ModalInfo
                  paragraph="If the price exceeds the maximum slippage percentage, the transaction will revert."
                  closeModal={() => setIsOpenInfo(false)}
                />
              )}
            </div>
            <button
              onClick={() => closeModal()}
              className="chain-sidebar__input__abandon"
            >
              <InputCross />
            </button>
          </div>

          <motion.div className="slippage-modal__button">
            <button
              className={classNames({
                "slippage-modal__button--active": type === "network",
              })}
              onClick={() => setType("network")}
              key={"network-sort"}
            >
              Network
              {type === "network" ? (
                <motion.div layoutId="underline" className="underline" />
              ) : null}
            </button>
            <button
              key={"wallet-sort"}
              className={classNames({
                "slippage-modal__button--active": type === "wallet",
              })}
              onClick={() => setType("wallet")}
            >
              Wallet
              {type === "wallet" ? (
                <motion.div layoutId="underline" className="underline" />
              ) : null}
            </button>
          </motion.div>
          <div className="history-modal__input">
            <label className="address-modal__input">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={`input-icon-${type}`}
                  {...slidingTextAnimation}
                  style={{
                    display: "flex",
                    width: 24,
                    height: 24,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  // className="chain-sidebar__input__abandon"
                >
                  {type === "network" ? <SearchGlass /> : <PensilLarge />}
                </motion.div>
              </AnimatePresence>
              <AnimatePresence mode="popLayout">
                {type === "network" ? (
                  <motion.input
                    {...slidingTextAnimation}
                    key="input-chain"
                    type="text"
                    placeholder="Search Chain"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                ) : (
                  <motion.input
                    {...slidingTextAnimation}
                    key="input-address"
                    value={manualAddress}
                    onChange={(e) => setManualAddress(e.target.value.trim())}
                    placeholder="Enter Address"
                    type="text"
                  />
                )}
              </AnimatePresence>

              {(manualAddress.length > 0 || searchTerm.length > 0) && (
                <button
                  onClick={() => {
                    if (manualAddress.length > 0) setManualAddress("");
                    if (searchTerm.length > 0) setSearchTerm("");
                  }}
                  className="chain-sidebar__input__abandon"
                >
                  <InputCross />
                </button>
              )}
            </label>
          </div>

          {type === "network" && (
            <motion.div
              {...sectionAnimation}
              key="wallet-network"
              className="chain-sidebar__contianer"
            >
              <ModalChains
                disableSearch
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setActiveChainId={(value) => {
                  setActiveChainId(value);
                  closeModal();
                }}
                activeChainId={activeChainId}
                otherChains={otherChains}
                featuredChains={featuredChains}
                baseChain={baseChain}
                solanaChain={solanaChain}
                ethereumChain={ethereumChain}
                isLoadingChains={isLoadingChains}
              />
            </motion.div>
          )}

          {type === "wallet" && (
            <motion.div
              {...sectionAnimation}
              key="wallet-wrapper"
              className="chain-sidebar__contianer"
            >
              <div className="address-modal__use">
                <span>Use connected wallet</span>
              </div>
              <ConnectedWallets
                activeAddress={activeWallet?.address}
                setWallet={setWallet}
              />
              <button onClick={handleSave} className="address-modal__cta">
                <SaveDisk />
                <span>Save</span>
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default HistoryModal;
