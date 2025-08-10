import { RelayChain } from "@/types/relay-query-chain-type";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ModalChains from "./modal-chains";
import ModalCoins from "./modal-coins";
import FeaturedCoinItem from "./featured-coin-item";
import { useTokenList } from "@reservoir0x/relay-kit-hooks";
import { getIconUri } from "@/helpers/get-icon-uri";
import { InputCross } from "../icons";
import { UnifiedToken } from "@/types/coin-types";
import { SolBalanceResponse } from "@/actions/get-sol-balance";
import { ModalMode } from "@/types/modal-mode";
import { motion } from "motion/react";
import FeaturedSkeleton from "./featured-skeleton";
import { useTokenModal } from "@/context/TokenModalProvider";

interface ModalProps {
  loadChains: () => Promise<void>;
  chains: RelayChain[];
  solanaChain: RelayChain | undefined;
  ethereumChain: RelayChain | undefined;
  otherChains: RelayChain[];
  baseChain: RelayChain | undefined;
  featuredChains: RelayChain[];
  chainsError: Error | null;
  isLoadingChains: boolean;
  isLoadedChains: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;

  communityCoins: UnifiedToken[] | null;
  isLoadingCommunityCoins: boolean;
  loadCommunityCoins: () => void;
  solanaTrendingCoins: UnifiedToken[] | null;
  isLoadingSolanaTrendingCoins: boolean;
  loadSolanaCoins: () => void;
  geckoTrendingCoins: UnifiedToken[] | null;
  isLoadingGeckoCoins: boolean;
  loadGeckoCoinsForChain: (chain: string) => void;

  userEthTokens: UnifiedToken[] | null;
  setUserEthTokens: React.Dispatch<React.SetStateAction<UnifiedToken[] | null>>;
  nativeSolBalance: SolBalanceResponse | null;
  setNativeSolBalance: React.Dispatch<
    React.SetStateAction<SolBalanceResponse | null>
  >;
  userSolanaTokens: UnifiedToken[] | null;
  setUserSolanaTokens: React.Dispatch<
    React.SetStateAction<UnifiedToken[] | null>
  >;
  // setBuyToken: React.Dispatch<React.SetStateAction<UnifiedToken | null>>;
  // setSellToken: React.Dispatch<React.SetStateAction<UnifiedToken | null>>;
  modalMode: ModalMode;
}

const Modal: React.FC<ModalProps> = ({
  // setBuyToken,
  // setSellToken,
  modalMode,
  chains,
  chainsError,
  otherChains,
  featuredChains,
  isLoadedChains,
  isLoadingChains,
  loadChains,
  baseChain,
  solanaChain,
  ethereumChain,
  setIsOpen,
  communityCoins,
  isLoadingCommunityCoins,
  loadCommunityCoins,
  solanaTrendingCoins,
  isLoadingSolanaTrendingCoins,
  loadSolanaCoins,
  geckoTrendingCoins,
  isLoadingGeckoCoins,
  loadGeckoCoinsForChain,
  userEthTokens,
  setUserEthTokens,
  nativeSolBalance,
  setNativeSolBalance,
  userSolanaTokens,
  setUserSolanaTokens,
}) => {
  const [activeChainId, setActiveChainId] = useState(0);

  const { data: suggestedTokens, isLoading: isLoadingSuggested } = useTokenList(
    "https://api.relay.link",
    {
      limit: 10,
      term: "",
      chainIds: activeChainId === 0 ? [1, 8453, 792703809] : [activeChainId],
    }
  );

  console.log("suggested", suggestedTokens);

  useEffect(() => {
    if (!isLoadedChains && !isLoadingChains && !chainsError) {
      loadChains().catch(console.error);
    }
  }, [isLoadedChains, isLoadingChains, chainsError, loadChains]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const chainFeaturedTokens: UnifiedToken[] = useMemo(() => {
    const chain = chains.find((t) => t.id === activeChainId);
    if (!chain?.featuredTokens) return [];
    return chain.featuredTokens.map((token) => ({
      source: "eth" as const,
      chainId: Number(token.id), // assert you know it's there
      address: token.address!, // ditto
      symbol: token.symbol!,
      logo: token.metadata?.logoURI,
      priceUsd: undefined,
      balance: undefined,
      name: token.name!,
    }));
  }, [activeChainId, chains]);

  const { selectToken } = useTokenModal();

  return (
    <div onClick={closeModal} className="modal__wrapper">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="modal"
      >
        <div className="modal__header">
          <div className="modal__header__inner">
            <span>Select Token</span>
            <button
              onClick={() => closeModal()}
              className="chain-sidebar__input__abandon"
            >
              <InputCross />
            </button>
          </div>
        </div>
        <div className="modal-native-coins__featured">
          <div className="modal-native-coins__featured__header">
            <h2>Featured</h2>
          </div>
          {suggestedTokens && suggestedTokens.length > 0
            ? suggestedTokens.map((token, i) => {
                if (!chains) return;

                return (
                  <FeaturedCoinItem
                    key={i}
                    coinSymbol={token.symbol}
                    chainSrc={
                      token.chainId ? getIconUri(token.chainId) : undefined
                    }
                    coinSrc={token.metadata?.logoURI}
                    token={token}
                    onSelect={selectToken}
                    modalMode={modalMode}
                    isLoading={isLoadingSuggested}
                  />
                );
              })
            : Array.from({ length: 7 }, (_, idx) => (
                <FeaturedSkeleton key={idx} />
              ))}
        </div>
        <div className="modal__main">
          <ModalChains
            setActiveChainId={setActiveChainId}
            activeChainId={activeChainId}
            otherChains={otherChains}
            featuredChains={featuredChains}
            baseChain={baseChain}
            solanaChain={solanaChain}
            ethereumChain={ethereumChain}
            isLoadingChains={isLoadingChains}
          />

          <ModalCoins
            featuredChains={featuredChains}
            baseChain={baseChain}
            solanaChain={solanaChain}
            activeChainId={activeChainId}
            communityCoins={communityCoins}
            isLoadingCommunityCoins={isLoadingCommunityCoins}
            loadCommunityCoins={loadCommunityCoins}
            solanaTrendingCoins={solanaTrendingCoins}
            isLoadingSolanaTrendingCoins={isLoadingSolanaTrendingCoins}
            loadSolanaCoins={loadSolanaCoins}
            geckoTrendingCoins={geckoTrendingCoins}
            isLoadingGeckoCoins={isLoadingGeckoCoins}
            loadGeckoCoinsForChain={loadGeckoCoinsForChain}
            userEthTokens={userEthTokens}
            setUserEthTokens={setUserEthTokens}
            nativeSolBalance={nativeSolBalance}
            setNativeSolBalance={setNativeSolBalance}
            userSolanaTokens={userSolanaTokens}
            setUserSolanaTokens={setUserSolanaTokens}
            chainFeaturedTokens={chainFeaturedTokens}
            onSelect={selectToken}
            modalMode={modalMode}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;
