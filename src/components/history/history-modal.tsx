import { AnimatePresence, motion } from "motion/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { HistorySortType } from "./types";
import classNames from "classnames";
import { InputCross, PensilLarge, SearchGlass, SaveDisk } from "../icons";
import { useAddressModal } from "@/hooks/useAdddressModal";
import { PastedWallet } from "../swap/types";
import { ConnectedSolanaWallet, ConnectedWallet } from "@privy-io/react-auth";
import ModalChains from "../modal/modal-chains";
import { useChainsData } from "@/hooks/useChains";
import ConnectedWallets from "../wallets/connected-wallets";
import { useHistory } from "@/context/HistoryProvider";
import { slidingTextAnimation } from "../swap/animation";
import HistoryModalWrapper from "./history-modal-wrapper";

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

  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const networkBtnRef = useRef<HTMLButtonElement>(null);
  const walletBtnRef = useRef<HTMLButtonElement>(null);
  const [underline, setUnderline] = useState({ left: 0, width: 0 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const btnRef = type === "network" ? networkBtnRef : walletBtnRef;
    const node = btnRef.current;
    const container = buttonContainerRef.current;
    if (node && container) {
      const containerRect = container.getBoundingClientRect();
      const btnRect = node.getBoundingClientRect();
      setUnderline({
        left: btnRect.left - containerRect.left,
        width: btnRect.width,
      });
      setReady(true);
    }
  }, [type]);

  return (
    <HistoryModalWrapper
      info="If multiple chains or wallet addresses match, they will be sorted according to your selected criteria."
      closeModal={closeModal}
      header="Sort By"
    >
      <div className="slippage-modal__button" ref={buttonContainerRef} style={{ position: "relative" }}>
        <button
          ref={networkBtnRef}
          className={classNames({
            "slippage-modal__button--active": type === "network",
          })}
          onClick={() => setType("network")}
        >
          Network
        </button>
        <button
          ref={walletBtnRef}
          className={classNames({
            "slippage-modal__button--active": type === "wallet",
          })}
          onClick={() => setType("wallet")}
        >
          Wallet
        </button>
        {ready && (
          <motion.div
            className="underline"
            animate={{ left: underline.left, width: underline.width }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
            style={{ position: "absolute", top: "50%", translateY: "-50%", height: 26 }}
          />
        )}
      </div>
      <div className="history-modal__input">
        <label className="address-modal__input">
          <AnimatePresence initial={false} mode="popLayout">
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
          <AnimatePresence initial={false} mode="popLayout">
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
      <AnimatePresence mode="popLayout" initial={false}>
        {type === "network" && (
          <motion.div
            {...sectionAnimation}
            key="wallet-network"
            className="chain-sidebar__contianer"
          >
            <ModalChains
              forceExpanded
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
      </AnimatePresence>
    </HistoryModalWrapper>
  );
};

export default HistoryModal;
