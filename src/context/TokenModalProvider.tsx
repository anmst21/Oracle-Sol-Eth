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
  Suspense,
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
  // console.log("sellToken buyToken", sellToken, buyToken);
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
      try {
        const balance = await getSolBalance(address);
        setNativeSolBalance(balance);
      } catch (e) {
        console.error("Failed to fetch SOL balance:", e);
      } finally {
        setIsLoadingNativeSolBalance(false);
      }
    },
    []
  );

  const ethCoins = useCallback(
    async (address: string) => {
      setIsLoadingUserEthTokens(true);
      try {
        const tokens = await getUserEthTokens({ address });
        setUserEthTokens(tokens);
      } catch (e) {
        console.error("Failed to fetch ETH tokens:", e);
      } finally {
        setIsLoadingUserEthTokens(false);
      }
    },
    []
  );

  const solCoins = useCallback(
    async (address: string) => {
      try {
        const tokens = await getUserSolTokens({ address });
        setUserSolanaTokens(tokens);
      } catch (e) {
        console.error("Failed to fetch Solana tokens:", e);
      }
    },
    []
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

  // console.log({ nativeSolBalance, userEthTokens, activeWallet });

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
      <Suspense>
        <SearchParamsSync
          sellToken={sellToken}
          buyToken={buyToken}
          setSellToken={setSellToken}
          setBuyToken={setBuyToken}
        />
      </Suspense>
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

function SearchParamsSync({
  sellToken,
  buyToken,
  setSellToken,
  setBuyToken,
}: {
  sellToken: UnifiedToken | null;
  buyToken: UnifiedToken | null;
  setSellToken: React.Dispatch<React.SetStateAction<UnifiedToken | null>>;
  setBuyToken: React.Dispatch<React.SetStateAction<UnifiedToken | null>>;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Capture initial URL params once (ref avoids stale closure issues)
  const initialParams = useRef({
    sellChain: searchParams.get("sellTokenChain"),
    sellAddr: searchParams.get("sellTokenAddress"),
    buyChain: searchParams.get("buyTokenChain"),
    buyAddr: searchParams.get("buyTokenAddress"),
  });

  // Gate: block state→URL writes until the initial URL→State load finishes
  const [urlLoaded, setUrlLoaded] = useState(false);

  // ── URL → State (once on mount) ───────────────────────────────
  useEffect(() => {
    const { sellChain, sellAddr, buyChain, buyAddr } = initialParams.current;

    // Nothing to restore from URL
    if (!sellChain && !sellAddr && !buyChain && !buyAddr) {
      setUrlLoaded(true);
      return;
    }

    const isValid = (address: string, chainId: number) =>
      chainId === 792703809
        ? isValidSolanaAddress(address)
        : isAddress(address);

    const fetchOne = async (
      address: string,
      chainId: number
    ): Promise<UnifiedToken | null> => {
      if (!isValid(address, chainId)) return null;
      try {
        const [raw] = await queryTokenList("https://api.relay.link", {
          limit: 1,
          chainIds: [chainId],
          address,
        });
        if (!raw) return null;
        return {
          chainId: raw.chainId!,
          address: raw.address!,
          symbol: raw.symbol!,
          name: raw.name!,
          source: "relay",
          logo: raw.metadata?.logoURI,
        };
      } catch {
        return null;
      }
    };

    (async () => {
      const [sellResult, buyResult] = await Promise.allSettled([
        sellChain && sellAddr
          ? fetchOne(sellAddr, Number(sellChain))
          : Promise.resolve(null),
        buyChain && buyAddr
          ? fetchOne(buyAddr, Number(buyChain))
          : Promise.resolve(null),
      ]);

      const sell =
        sellResult.status === "fulfilled" ? sellResult.value : null;
      const buy =
        buyResult.status === "fulfilled" ? buyResult.value : null;

      // Set whatever resolved; failed/missing tokens stay null
      if (sell) setSellToken(sell);
      if (buy) setBuyToken(buy);

      // Ungate state→URL sync — the next effect will clean up
      // any URL params for tokens that failed to fetch
      setUrlLoaded(true);
    })();
  }, [setSellToken, setBuyToken]);

  // ── State → URL (syncs after initial load completes) ──────────
  useEffect(() => {
    if (!urlLoaded) return;

    const params = new URLSearchParams();
    if (sellToken) {
      params.set("sellTokenChain", String(sellToken.chainId));
      params.set("sellTokenAddress", sellToken.address);
    }
    if (buyToken) {
      params.set("buyTokenChain", String(buyToken.chainId));
      params.set("buyTokenAddress", buyToken.address);
    }

    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
  }, [sellToken, buyToken, pathname, urlLoaded]);

  return null;
}

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
