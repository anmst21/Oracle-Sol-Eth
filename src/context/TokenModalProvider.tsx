"use client";

import TokenModal from "@/components/modal";
import { useChainsData } from "@/hooks/useChains";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  FC,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useCommunityCoins } from "./FarcasterCommunityTokensProvider";
import { useSolanaCoins } from "./DexScreenerTrendingSolataTokensProvider";
import { useGeckoTokens } from "./GeckoTerminalCoinsProvider";
import { UnifiedToken } from "@/types/coin-types";
import { getSolBalance, SolBalanceResponse } from "@/actions/get-sol-balance";
import { ModalMode } from "@/types/modal-mode";
import { RelayChain } from "@/types/relay-query-chain-type";
import { getTokenAccountsWithMetadata as getUserEthTokens } from "@/actions/get-user-owned-ethereum-tokens";
import { getTokenAccountsWithMetadata as getUserSolTokens } from "@/actions/get-user-owned-solana-tokens";
import { useActiveWallet } from "./ActiveWalletContext";

interface TokenModalContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setModalMode: (mode: ModalMode) => void;
  isLoaded: boolean;
  loadChains: () => Promise<void>;
  sellToken: UnifiedToken | null;
  buyToken: UnifiedToken | null;
  chains: RelayChain[];
  nativeSolBalance: SolBalanceResponse | null;
  userEthTokens: UnifiedToken[] | null;
  userSolanaTokens: UnifiedToken[] | null;
  setBuyToken: React.Dispatch<React.SetStateAction<UnifiedToken | null>>;
  setSellToken: React.Dispatch<React.SetStateAction<UnifiedToken | null>>;
}

const TokenModalContext = createContext<TokenModalContextValue | undefined>(
  undefined
);

interface TokenModalProviderProps {
  children: ReactNode;
}

export const TokenModalProvider: FC<TokenModalProviderProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [userEthTokens, setUserEthTokens] = useState<UnifiedToken[] | null>(
    null
  );
  const [nativeSolBalance, setNativeSolBalance] =
    useState<SolBalanceResponse | null>(null);

  const [userSolanaTokens, setUserSolanaTokens] = useState<
    UnifiedToken[] | null
  >(null);

  const [sellToken, setSellToken] = useState<UnifiedToken | null>(null);
  const [buyToken, setBuyToken] = useState<UnifiedToken | null>(null);
  console.log("sellToken buyToken", sellToken, buyToken);
  const [modalMode, setModalMode] = useState<ModalMode>(null);

  useEffect(() => {
    setIsOpen(false);
  }, [sellToken, buyToken]);

  const {
    isLoading: isLoadingChains,
    isLoaded: isLoadedChains,
    error: chainsError,
    chains,
    featuredChains,
    otherChains,
    solanaChain,
    baseChain,
    loadChains,
    ethereumChain,
  } = useChainsData();

  const {
    data: communityCoins,
    isLoading: isLoadingCommunityCoins,
    loadCoins: loadCommunityCoins,
  } = useCommunityCoins();

  const {
    data: solanaTrendingCoins,
    isLoading: isLoadingSolanaTrendingCoins,
    loadCoins: loadSolanaCoins,
  } = useSolanaCoins();

  const {
    data: geckoTrendingCoins,
    isLoading: isLoadingGeckoCoins,
    loadTokens: loadGeckoCoinsForChain,
  } = useGeckoTokens();

  const appsChains = useMemo(
    () => [...featuredChains, ...otherChains],
    [featuredChains, otherChains]
  );

  const solNativeBalance = useCallback(
    async (address: string) => {
      const balance = await getSolBalance(address);
      setNativeSolBalance(balance);
    },
    [setNativeSolBalance]
  );

  const ethCoins = useCallback(
    async (address: string) => {
      const tokens = await getUserEthTokens({
        address,
      });
      setUserEthTokens(tokens);
    },
    [setUserEthTokens]
  );

  const solCoins = useCallback(
    async (address: string) => {
      const tokens = await getUserSolTokens({
        address,
      });
      setUserSolanaTokens(tokens);
    },
    [setUserSolanaTokens]
  );

  const { activeWallet } = useActiveWallet();
  useEffect(() => {
    if (activeWallet) {
      if (activeWallet.type === "ethereum") {
        ethCoins(activeWallet.address);
      }

      if (activeWallet.type === "solana") {
        solCoins(activeWallet.address);
      }
      if (activeWallet.type === "solana") {
        solNativeBalance(activeWallet.address);
      }
    }
  }, [ethCoins, solCoins, solNativeBalance, activeWallet]);
  console.log({ nativeSolBalance, userEthTokens, activeWallet });

  //Number(chainId.split(":")[1])
  return (
    <TokenModalContext.Provider
      value={{
        isOpen,
        setIsOpen,
        isLoaded: isLoadedChains,
        loadChains,
        setModalMode,
        buyToken,
        sellToken,
        chains: appsChains,
        nativeSolBalance,
        userEthTokens,
        userSolanaTokens,
        setBuyToken,
        setSellToken,
      }}
    >
      {children}
      {isOpen && (
        <TokenModal
          loadChains={loadChains}
          chains={chains}
          solanaChain={solanaChain}
          otherChains={otherChains}
          baseChain={baseChain}
          featuredChains={featuredChains}
          chainsError={chainsError}
          isLoadingChains={isLoadingChains}
          isLoadedChains={isLoadedChains}
          ethereumChain={ethereumChain}
          setIsOpen={setIsOpen}
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
          modalMode={modalMode}
          setSellToken={setSellToken}
          setBuyToken={setBuyToken}
        />
      )}
    </TokenModalContext.Provider>
  );
};

export function useTokenModal(): TokenModalContextValue {
  const context = useContext(TokenModalContext);
  if (!context) {
    throw new Error("useTokenModal must be used within a TokenModalProvider");
  }
  return context;
}
