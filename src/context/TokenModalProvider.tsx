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
  useRef,
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
import { usePathname, useSearchParams } from "next/navigation";
import { queryTokenList } from "@reservoir0x/relay-kit-hooks";
import { isAddress } from "viem";
import { isValidSolanaAddress } from "@/helpers/is-valid-solana-address";
import { AnimatePresence } from "motion/react";

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
  isLoadingNativeSolBalance: boolean;
  isLoadingUserEthTokens: boolean;

  openTokenModal: (opts: {
    mode: ModalMode;
    onSelect: (t: UnifiedToken) => void; // optional override
  }) => void;
  selectToken: (t: UnifiedToken) => void;
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

  const selectionHandlerRef = useRef<((t: UnifiedToken) => void) | null>(null);

  const openTokenModal = useCallback(
    ({
      mode,
      onSelect,
    }: {
      mode: ModalMode;
      onSelect: (t: UnifiedToken) => void;
    }) => {
      setModalMode(mode);
      selectionHandlerRef.current = onSelect;
      setIsOpen(true);
    },
    []
  );

  const selectToken = useCallback((t: UnifiedToken) => {
    if (selectionHandlerRef.current) selectionHandlerRef.current(t);
    setIsOpen(false); // auto-close after pick
  }, []);

  const [userEthTokens, setUserEthTokens] = useState<UnifiedToken[] | null>(
    null
  );
  const [isLoadingUserEthTokens, setIsLoadingUserEthTokens] = useState(false);

  const [nativeSolBalance, setNativeSolBalance] =
    useState<SolBalanceResponse | null>(null);
  const [isLoadingNativeSolBalance, setIsLoadingNativeSolBalance] =
    useState(false);

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
      setIsLoadingNativeSolBalance(true);
      const balance = await getSolBalance(address);
      setNativeSolBalance(balance);
      setIsLoadingNativeSolBalance(false);
    },
    [setNativeSolBalance]
  );

  const ethCoins = useCallback(
    async (address: string) => {
      setIsLoadingUserEthTokens(true);
      const tokens = await getUserEthTokens({
        address,
      });
      setUserEthTokens(tokens);
      setIsLoadingUserEthTokens(false);
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
      if (activeWallet.type === "ethereum" && !userEthTokens) {
        ethCoins(activeWallet.address);
      }

      if (activeWallet.type === "solana" && !userSolanaTokens) {
        solCoins(activeWallet.address);
      }
      if (activeWallet.type === "solana" && !nativeSolBalance) {
        solNativeBalance(activeWallet.address);
      }
    }
  }, [
    ethCoins,
    solCoins,
    solNativeBalance,
    activeWallet,
    userEthTokens,
    userSolanaTokens,
    nativeSolBalance,
  ]);

  console.log({ nativeSolBalance, userEthTokens, activeWallet });

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sellTokenChain = searchParams.get("sellTokenChain");
  const sellTokenAddress = searchParams.get("sellTokenAddress");
  const buyTokenChain = searchParams.get("buyTokenChain");
  const buyTokenAddress = searchParams.get("buyTokenAddress");

  useEffect(() => {
    if (!sellToken && !buyToken) return;

    const params = new URLSearchParams();
    if (sellToken) {
      params.set("sellTokenChain", (sellToken.chainId as number).toString());
      params.set("sellTokenAddress", sellToken.address);
    }
    if (buyToken) {
      params.set("buyTokenChain", (buyToken.chainId as number).toString());
      params.set("buyTokenAddress", buyToken.address);
    }

    // This just rewrites the URL in-place, no Next.js navigation
    window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
  }, [sellToken, buyToken]);

  const getToken = useCallback(
    async (address: string, chainId: string, mode: "sell" | "buy") => {
      const [raw] = await queryTokenList("https://api.relay.link", {
        limit: 1,
        chainIds: [Number(chainId)],
        address,
      });

      if (raw) {
        const unified: UnifiedToken = {
          chainId: raw.chainId!,
          address: raw.address!,
          symbol: raw.symbol!,
          name: raw.name!,
          //  decimals: raw.decimals!,
          source: "relay",
          logo: raw.metadata?.logoURI,
        };
        if (mode === "sell") {
          setSellToken(unified);
        } else {
          setBuyToken(unified);
        }
      } else {
        // clear the URL params…
        const params = new URLSearchParams(searchParams);
        if (mode === "sell") {
          params.delete("sellTokenChain");
          params.delete("sellTokenAddress");
        } else {
          params.delete("buyTokenChain");
          params.delete("buyTokenAddress");
        }
        window.history.replaceState(null, "", `${pathname}?${params}`);
      }
    },
    [pathname, searchParams]
  );

  useEffect(() => {
    if (!sellTokenChain || !sellTokenAddress) return;
    if (
      (sellTokenChain && !sellTokenAddress) ||
      (!sellTokenChain && sellTokenAddress) ||
      (Number(sellTokenChain) === 792703809 &&
        !isValidSolanaAddress(sellTokenAddress)) ||
      (Number(sellTokenChain) !== 792703809 && !isAddress(sellTokenAddress))
    ) {
      const params = new URLSearchParams(searchParams);
      params.delete("sellTokenChain");
      params.delete("sellTokenAddress");
      window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
    }
    if (sellTokenChain && sellTokenAddress) {
      getToken(sellTokenAddress, sellTokenChain, "sell");
    }
  }, [sellTokenAddress, sellTokenChain]);

  useEffect(() => {
    if (!buyTokenChain || !buyTokenAddress) return;
    if (
      (buyTokenChain && !buyTokenAddress) ||
      (!buyTokenChain && buyTokenAddress) ||
      (Number(buyTokenChain) === 792703809 &&
        !isValidSolanaAddress(buyTokenAddress)) ||
      (Number(buyTokenChain) !== 792703809 && !isAddress(buyTokenAddress))
    ) {
      const params = new URLSearchParams(searchParams);
      params.delete("buyTokenChain");
      params.delete("buyTokenAddress");
      window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
    }
    if (buyTokenChain && buyTokenAddress) {
      getToken(buyTokenAddress, buyTokenChain, "buy");
    }
  }, [buyTokenAddress, buyTokenChain]);
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
        isLoadingNativeSolBalance,
        isLoadingUserEthTokens,
        openTokenModal,
        selectToken,
      }}
    >
      {children}
      <AnimatePresence mode="wait">
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
            // setSellToken={setSellToken}
            // setBuyToken={setBuyToken}
          />
        )}
      </AnimatePresence>
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

//  otherChains = { otherChains };
//  featuredChains = { featuredChains };
//  baseChain = { baseChain };
//  solanaChain = { solanaChain };
//  ethereumChain = { ethereumChain };
//  isLoadingChains = { isLoadingChains };
