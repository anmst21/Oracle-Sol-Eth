import { getIconUri } from "@/helpers/get-icon-uri";
import { HexChain, ArrowSmall } from "../icons";
import SkeletonLoaderWrapper from "../skeleton";
import { solanaChain } from "@/helpers/solanaChain";
import classNames from "classnames";
import { AnimatePresence, motion } from "motion/react";
import { truncateAddress } from "@/helpers/truncate-address";
import { slidingTextAnimation } from "../swap/animation";
import { ReactNode } from "react";
import { ConnectedSolanaWallet, ConnectedWallet } from "@privy-io/react-auth";
import { SwapWallet } from "../swap/types";

type Props = {
  isWalletError: boolean;
  isLoading: boolean;
  children: ReactNode;
  activeWallet: ConnectedWallet | ConnectedSolanaWallet | SwapWallet | null;
  setIsOpenCallback: (value: boolean) => void;
};

const WalletButton = ({
  isLoading,
  isWalletError,
  children,
  activeWallet,
  setIsOpenCallback,
}: Props) => {
  return (
    <div
      onClick={() => setIsOpenCallback(true)}
      onMouseLeave={() => setIsOpenCallback(false)}
      className={classNames("swap-window__token__wallet", {
        "swap-window__token__wallet--error": isWalletError,
      })}
    >
      <SkeletonLoaderWrapper width={20} height={20} isLoading={isLoading}>
        <div className="swap-window__token__wallet__pfp">
          {!activeWallet ? (
            <HexChain width={20} question />
          ) : (
            <HexChain
              width={20}
              uri={
                activeWallet?.type === "ethereum"
                  ? getIconUri(1)
                  : getIconUri(solanaChain.id)
              }
            />
          )}
        </div>
      </SkeletonLoaderWrapper>
      <SkeletonLoaderWrapper width={92.5} height={20} isLoading={isLoading}>
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={activeWallet?.address ?? "placeholder"}
            {...slidingTextAnimation}
          >
            {!activeWallet?.address
              ? "XxXX...XXXX"
              : truncateAddress(activeWallet.address)}
          </motion.span>
        </AnimatePresence>
      </SkeletonLoaderWrapper>
      <div
        className={classNames("recipient-window__address__arrow", {
          "recipient-window__address__arrow--inactive": isLoading,
        })}
      >
        <ArrowSmall />
      </div>
      {children}
    </div>
  );
};

export default WalletButton;
