import React, { useCallback, useEffect, useState } from "react";
import { BuyWallet, BuyCard } from "@/components/icons";
import WalletButton from "../universals/wallet-button";
import { AnimatePresence, motion } from "motion/react";
import WalletModal from "../wallets/wallet-modal";
import { useActiveWallet } from "@/context/ActiveWalletContext";
import {
  ConnectedSolanaWallet,
  ConnectedWallet,
  usePrivy,
} from "@privy-io/react-auth";
import { SwapWallet } from "../swap/types";
import classNames from "classnames";

type Props = {
  isError: boolean;
};

const BuyInputWallet = ({ isError }: Props) => {
  const [isOpenAddressModal, setIsOpenAddressModal] = useState(false);
  const { activeWallet: defaultWallet } = useActiveWallet();
  const [activeWallet, setActiveWallet] = useState<
    SwapWallet | ConnectedWallet | ConnectedSolanaWallet | null
  >(null);

  const { ready } = usePrivy();

  useEffect(() => {
    if (!activeWallet && defaultWallet) setActiveWallet(defaultWallet);
  }, [activeWallet, defaultWallet]);

  const isOpenCallback = useCallback(
    (value: boolean) => setIsOpenAddressModal(value),
    [setIsOpenAddressModal]
  );

  const callback = useCallback(
    (wallet: SwapWallet | null | undefined) => {
      setIsOpenAddressModal(false);
      if (wallet) {
        setActiveWallet(wallet);
      }
    },
    [setActiveWallet]
  );

  return (
    <div className="buy-input-wallet">
      <div
        className={classNames("buy-input-wallet__container", {
          "buy-input-wallet__container--error": isError,
        })}
      >
        <div className="buy-input-wallet__top">
          <div className="buy-input-wallet__top__key">
            <BuyWallet />
            <span>Recipment</span>
          </div>
          <WalletButton
            isWalletError={false}
            isLoading={!ready}
            activeWallet={activeWallet}
            setIsOpenCallback={isOpenCallback}
          >
            <AnimatePresence mode="wait">
              {isOpenAddressModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="swap-window__wallet"
                >
                  <WalletModal
                    isBuy={true}
                    callback={(wallet) => {
                      callback(wallet);
                    }}
                    swapWindow
                    activeAddress={activeWallet?.address}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </WalletButton>
        </div>
        <div className="buy-input-wallet__bottom">
          <div className="buy-input-wallet__bottom__key">
            <BuyCard />
            <span>Payment Method</span>
          </div>
          <div className="buy-input-wallet__bottom__item">
            <span>Card</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyInputWallet;
