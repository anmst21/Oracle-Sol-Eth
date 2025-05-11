"use client";
import {
  ChainBalance as EthChainBalance,
  getTokenAccountsWithMetadata as getUserEthTokens,
} from "@/actions/get-user-owned-ethereum-tokens";
import {
  EnrichedToken,
  getTokenAccountsWithMetadata as getUserSolTokens,
} from "@/actions/get-user-owned-solana-tokens";
import { useRelayChains, useTokenList } from "@reservoir0x/relay-kit-hooks";
import { useEffect, useMemo, useState } from "react";

import { getSolBalance, SolBalanceResponse } from "@/actions/get-sol-balance";
import { useCommunityCoins } from "@/context/FarcasterCommunityTokensProvider";
import { isAddress, zeroAddress } from "viem";
import { applyDecimals } from "@/helpers/apply-decimals";
import ModalCoinItem from "@/components/modal/modal-coin-item";
import { useSolanaCoins } from "@/context/DexScreenerTrendingSolataTokensProvider";
import { useGeckoTokens } from "@/context/GeckoTerminalCoinsProvider";
import { queryTokenList } from "@reservoir0x/relay-kit-hooks";
import ModalChains from "@/components/modal/modal-chains";

type RelayToken = {
  chainId?: number;
  address?: string;
  symbol?: string;
  name?: string;
  decimals?: number;
  vmType?: "bvm" | "evm" | "svm" | "tvm" | "tonvm" | "suivm";
  metadata?: {
    logoURI?: string;
    verified?: boolean;
    isNative?: boolean;
  };
};

type UnifiedToken = {
  chainId?: number;
  address: string;
  symbol: string;
  logo?: string;
  priceUsd?: number;
  balance?: number;
  source: "relay" | "eth" | "sol" | "community" | "gecko" | "solTrending";
};

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handle);
  }, [value, delay]);
  return debounced;
}

export default function Home() {
  const [activeChainId, setActiveChainId] = useState<number>(0);

  const [searchTerm, setSearchTerm] = useState(""); // raw input
  const [searchTokens, setSearchTokens] = useState<RelayToken[]>([]); // fetched results
  const [loadingSearchList, setLoadingSearchList] = useState(false);
  const [errorSearching, setErrorSearching] = useState<string | null>(null);
  console.log("searchTokens", searchTokens);
  const debouncedTerm = useDebounce(searchTerm, 500);

  const { data: suggestedTokens } = useTokenList("https://api.relay.link", {
    limit: 20,
    term: "",
    chainIds: activeChainId === 0 ? undefined : [activeChainId],
  });

  useEffect(() => {
    if (!debouncedTerm) {
      setSearchTokens([]);
      setErrorSearching(null);
      return;
    }

    let cancelled = false;
    setLoadingSearchList(true);
    setErrorSearching(null);

    queryTokenList("https://api.relay.link", {
      limit: 10,
      term: isAddress(debouncedTerm) ? undefined : debouncedTerm,
      chainIds: activeChainId === 0 ? undefined : [activeChainId],
      address: isAddress(debouncedTerm) ? debouncedTerm : undefined,
    })
      .then((data) => {
        if (!cancelled) setSearchTokens(data);
      })
      .catch((err) => {
        if (!cancelled) setErrorSearching(err.message || "Unknown error");
      })
      .finally(() => {
        if (!cancelled) setLoadingSearchList(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedTerm, activeChainId]);

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

  const [userEthTokens, setUserEthTokens] = useState<EthChainBalance[] | null>(
    null
  );
  const [nativeSolBalance, setNativeSolBalance] =
    useState<SolBalanceResponse | null>(null);

  const [userSolanaTokens, setUserSolanaTokens] = useState<
    EnrichedToken[] | null
  >(null);
  console.log("geckoTrendingCoins", geckoTrendingCoins);

  // queryTokenList("https://api.relay.link", {
  //   limit: 20,
  //   term: "usdc",
  // });

  useEffect(() => {
    loadGeckoCoinsForChain("base");
  }, [loadGeckoCoinsForChain]);

  useEffect(() => {
    loadCommunityCoins();
  }, [loadCommunityCoins]);

  useEffect(() => {
    loadSolanaCoins();
  }, [loadSolanaCoins]);

  useEffect(() => {
    const solNativeBalance = async () => {
      const balance = await getSolBalance(
        "8dc4Gk3riGii9sASFB8EuEEJeQ5BruDWPZQW7so55JEp"
      );
      setNativeSolBalance(balance);
    };
    const ethCoins = async () => {
      const tokens = await getUserEthTokens({
        address: "0x1334429526Fa8B41BC2CfFF3a33C5762c5eD0Bce",
      });
      setUserEthTokens(tokens);
    };
    const solCoins = async () => {
      const tokens = await getUserSolTokens({
        address: "8dc4Gk3riGii9sASFB8EuEEJeQ5BruDWPZQW7so55JEp",
      });
      setUserSolanaTokens(tokens);
    };
    solNativeBalance();
    solCoins();
    ethCoins();
  }, []);

  const nativeTokens = useMemo(
    () => userEthTokens?.filter((t) => t.address === "native") ?? [],
    [userEthTokens]
  );
  const nonNativeUserEthTokens = useMemo(
    () => userEthTokens?.filter((t) => t.address !== "native") ?? [],
    [userEthTokens]
  );

  const { chains } = useRelayChains();

  const nonBitcoin = useMemo(
    () => (chains ?? []).filter((c) => c.id !== 8253038),
    [chains]
  );
  const featuredIds = useMemo(
    () => new Set<number>([7777777, 42161, 8453, 1, 56, 666666666, 792703809]),
    []
  );

  // 3. Partition into featured vs others
  const featuredChains = useMemo(
    () => nonBitcoin.filter((c) => featuredIds.has(c.id)),
    [nonBitcoin, featuredIds]
  );
  const otherChains = useMemo(
    () => nonBitcoin.filter((c) => !featuredIds.has(c.id)),
    [nonBitcoin, featuredIds]
  );

  const solanaChain = useMemo(
    () => featuredChains.find((chain) => chain.id === 792703809),
    [featuredChains]
  );
  const baseChain = useMemo(
    () => featuredChains.find((chain) => chain.id === 8453),
    [featuredChains]
  );

  console.log("solanaChain", solanaChain);

  const allTokens = useMemo<UnifiedToken[]>(() => {
    const out: UnifiedToken[] = [];

    // -- Relay search results --
    out.push(
      ...searchTokens.map((t) => ({
        source: "relay" as const,
        chainId: t.chainId,
        address: t.address === "native" ? zeroAddress : t.address!,
        symbol: t.symbol!,
        logo: t.metadata?.logoURI,
        priceUsd: undefined,
      }))
    );

    // -- your Ethereum balances --
    out.push(
      ...(userEthTokens ?? []).map((t) => ({
        source: "eth" as const,
        chainId: t.chain_id,
        address: t.address === "native" ? zeroAddress : t.address,
        symbol: t.symbol,
        logo: t.token_metadata.logo,
        priceUsd: t.price_usd,
        balance: Number(applyDecimals(t.amount, t.decimals)),
      }))
    );

    // -- native SOL --
    if (nativeSolBalance && solanaChain) {
      out.push({
        source: "sol" as const,
        chainId: solanaChain.id,
        address: solanaChain.currency!.address as string,
        symbol: solanaChain.currency!.symbol as string,
        logo: solanaChain.icon!.light,
        priceUsd: nativeSolBalance.solUsdPrice as number,
        balance: nativeSolBalance.balance,
      });
    }

    // -- other Solana tokens --
    out.push(
      ...(userSolanaTokens ?? []).map((t) => ({
        source: "sol" as const,
        chainId: solanaChain?.id,
        address: t.mint,
        symbol: t.metadata.symbol,
        logo: t.imgUri,
        // nullish coalesce to undefined so it matches `number | undefined`
        priceUsd: t.priceUsd ?? undefined,
        balance: t.amount,
      }))
    );

    // -- Farcaster community coins --
    out.push(
      ...(communityCoins ?? []).map((t) => ({
        source: "community" as const,
        chainId: t.chainId,
        address: t.address,
        symbol: t.symbol,
        logo: t.metadata.logoURI,
        priceUsd: t.stats.token_price_usd,
      }))
    );

    // -- Gecko trending on Base --
    out.push(
      ...(geckoTrendingCoins ?? []).map((t) => ({
        source: "gecko" as const,
        chainId: baseChain?.id,
        address: t.meta!.base!.attributes.address,
        symbol: t.meta!.base!.attributes.symbol,
        logo: t.meta!.base!.attributes.image_url,
        priceUsd: Number(t.attributes.base_token_price_usd),
      }))
    );

    // -- Solana trending --
    out.push(
      ...(solanaTrendingCoins ?? []).map((t) => ({
        source: "solTrending" as const,
        chainId: solanaChain?.id,
        address: t.baseToken.address,
        symbol: t.baseToken.symbol,
        logo: t.info.imageUrl || "",
        priceUsd: Number(t.priceUsd),
      }))
    );

    return out;
  }, [
    searchTokens,
    userEthTokens,
    nativeSolBalance,
    userSolanaTokens,
    communityCoins,
    geckoTrendingCoins,
    solanaTrendingCoins,
    solanaChain,
    baseChain,
  ]);

  const filteredUnique = useMemo(() => {
    if (!searchTerm) return [];

    const term = searchTerm.toLowerCase();
    const seen = new Set<string>();

    return allTokens
      .filter((t) => {
        const matchesTerm =
          t.symbol.toLowerCase().includes(term) ||
          t.address.toLowerCase().includes(term);

        const matchesChain = activeChainId === 0 || t.chainId === activeChainId;

        return matchesTerm && matchesChain;
      })
      .filter((t) => {
        if (seen.has(t.address)) {
          return false;
        }
        seen.add(t.address);
        return true;
      });
  }, [searchTerm, allTokens, activeChainId]);

  const ethNativeList = useMemo(() => {
    if (!nativeTokens) return [];
    return activeChainId === 0
      ? nativeTokens
      : nativeTokens.filter((t) => t.chain_id === activeChainId);
  }, [nativeTokens, activeChainId]);

  // same for the “other” ERC-20s
  const ethOtherList = useMemo(() => {
    if (!nonNativeUserEthTokens) return [];
    return activeChainId === 0
      ? nonNativeUserEthTokens
      : nonNativeUserEthTokens.filter((t) => t.chain_id === activeChainId);
  }, [nonNativeUserEthTokens, activeChainId]);

  const filteredCommunityCoins = useMemo(() => {
    if (!communityCoins) return [];
    return activeChainId === 0
      ? communityCoins
      : communityCoins.filter((c) => c.chainId === activeChainId);
  }, [communityCoins, activeChainId]);

  return (
    <div>
      <ModalChains
        setActiveChainId={setActiveChainId}
        activeChainId={activeChainId}
        otherChains={otherChains}
        featuredChains={featuredChains}
      />
      <input
        type="text"
        placeholder="Search tokens…"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: "100%", padding: 8, fontSize: 16 }}
      />
      <div className="modal-native-coins">
        {searchTokens && searchTokens.length > 0 && searchTerm.length > 0 && (
          <div>
            <h2>Search Result</h2>
            {filteredUnique.length &&
              filteredUnique.map((t, i) => {
                const chain = chains?.find((c) => c.id === t.chainId);
                return (
                  <ModalCoinItem
                    key={i}
                    userBalance={t.balance}
                    priceUsd={t.priceUsd}
                    coinAddress={t.address}
                    coinSymbol={t.symbol}
                    chainSrc={chain?.icon?.squaredLight}
                    coinSrc={t.logo}
                  />
                );
              })}
          </div>
        )}

        {suggestedTokens &&
          suggestedTokens.length > 0 &&
          !searchTerm.length && (
            <div>
              <h2>Suggested Tokens</h2>
              {suggestedTokens.map((token, i) => {
                if (!chains) return;

                const chain = chains.find((c) => c.id === token.chainId);

                return (
                  <ModalCoinItem
                    key={i}
                    //   userBalance={Number(balanceNative)}
                    //  priceUsd={token.price_usd}
                    coinAddress={
                      token.address === "native"
                        ? zeroAddress
                        : (token.address as string)
                    }
                    coinSymbol={token.symbol}
                    chainSrc={chain?.icon?.squaredLight}
                    coinSrc={token.metadata?.logoURI}
                  />
                );
              })}
            </div>
          )}
        {ethNativeList.length > 0 &&
          activeChainId !== 792703809 &&
          !searchTerm.length && (
            <div>
              <h2>Native Ethereum Balance</h2>
              {ethNativeList.map((token, i) => {
                const chain = featuredChains.find(
                  (c) => c.id === token.chain_id
                );
                console.log("token", token);
                const balanceNative = Number(
                  applyDecimals(token.amount, token.decimals)
                ).toFixed(6);
                return (
                  <ModalCoinItem
                    key={i}
                    userBalance={Number(balanceNative)}
                    priceUsd={token.price_usd}
                    coinAddress={
                      token.address === "native"
                        ? zeroAddress
                        : (token.address as string)
                    }
                    coinSymbol={token.symbol}
                    chainSrc={chain?.icon?.squaredLight}
                    coinSrc={token.token_metadata.logo}
                  />
                );
              })}
            </div>
          )}
        {nativeSolBalance &&
          nativeSolBalance.balance !== 0 &&
          (activeChainId === 792703809 || activeChainId === 0) &&
          !searchTerm.length && (
            <div>
              <h2>Native Solana Balance</h2>
              {solanaChain &&
                solanaChain?.icon?.light &&
                solanaChain?.icon?.squaredLight &&
                solanaChain.currency?.address &&
                solanaChain.currency?.symbol && (
                  <ModalCoinItem
                    userBalance={nativeSolBalance.balance}
                    priceUsd={nativeSolBalance.solUsdPrice}
                    coinAddress={solanaChain.currency?.address}
                    coinSymbol={solanaChain.currency?.symbol}
                    chainSrc={solanaChain?.icon?.squaredLight}
                    coinSrc={solanaChain?.icon?.light}
                  />
                )}
            </div>
          )}

        {ethOtherList.length > 0 &&
          activeChainId !== 792703809 &&
          !searchTerm.length && (
            <div>
              <h2>Other Ethereum Tokens</h2>
              {ethOtherList.map((token, i) => {
                const chain = featuredChains.find(
                  (c) => c.id === token.chain_id
                );
                console.log("token", token);
                const balanceNative = Number(
                  applyDecimals(token.amount, token.decimals)
                ).toFixed(6);
                return (
                  <ModalCoinItem
                    key={i}
                    userBalance={Number(balanceNative)}
                    priceUsd={token.price_usd}
                    coinAddress={
                      token.address === "native"
                        ? zeroAddress
                        : (token.address as string)
                    }
                    coinSymbol={token.symbol}
                    chainSrc={chain?.icon?.squaredLight}
                    coinSrc={token.token_metadata.logo}
                  />
                );
              })}
            </div>
          )}
        {userSolanaTokens &&
          userSolanaTokens.length > 0 &&
          solanaChain?.icon?.squaredLight &&
          (activeChainId === 792703809 || activeChainId === 0) &&
          !searchTerm.length && (
            <div>
              <h2>Other Solana Tokens</h2>
              {userSolanaTokens.map((token, i) => {
                return (
                  <ModalCoinItem
                    key={i}
                    userBalance={token.amount}
                    priceUsd={token.priceUsd}
                    coinAddress={token.mint}
                    coinSymbol={token.metadata.symbol}
                    chainSrc={solanaChain?.icon?.squaredLight}
                    coinSrc={token.imgUri}
                  />
                );
              })}
            </div>
          )}
        {!isLoadingCommunityCoins &&
          filteredCommunityCoins.length > 0 &&
          !searchTerm.length && (
            <div>
              <h2>Farcaster Community Coins</h2>

              {filteredCommunityCoins.map((token, i) => {
                const chain = featuredChains.find(
                  (c) => c.id === token.chainId
                );
                return (
                  <ModalCoinItem
                    key={i}
                    //  userBalance={token.amount} // if you have balances
                    priceUsd={token.stats.token_price_usd}
                    coinAddress={token.address}
                    coinSymbol={token.symbol}
                    chainSrc={chain?.icon?.squaredLight}
                    coinSrc={token.metadata.logoURI}
                  />
                );
              })}
            </div>
          )}
        {!isLoadingGeckoCoins &&
          baseChain &&
          geckoTrendingCoins &&
          geckoTrendingCoins.length > 0 &&
          (activeChainId === 0 || activeChainId === 8453) &&
          !searchTerm.length && (
            <div>
              <h2>Base Trending Coins</h2>

              {geckoTrendingCoins.map((token, i) => {
                console.log("base token", token);
                if (
                  !token.meta?.base?.attributes.address ||
                  !token.meta?.base?.attributes.image_url
                )
                  return;
                return (
                  <ModalCoinItem
                    key={i}
                    //  userBalance={token.amount}
                    priceUsd={Number(token.attributes.base_token_price_usd)}
                    coinAddress={token.meta?.base?.attributes.address}
                    coinSymbol={token.meta?.base?.attributes.symbol}
                    chainSrc={baseChain?.icon?.squaredLight}
                    coinSrc={token.meta?.base?.attributes.image_url}
                  />
                );
              })}
            </div>
          )}
        {!isLoadingSolanaTrendingCoins &&
          solanaTrendingCoins &&
          solanaTrendingCoins.length > 0 &&
          (activeChainId === 792703809 || activeChainId === 0) &&
          !searchTerm.length && (
            <div>
              <h2>Solana Trending Coins</h2>

              {solanaTrendingCoins.map((token, i) => {
                return (
                  <ModalCoinItem
                    key={i}
                    priceUsd={Number(token.priceUsd)}
                    coinAddress={token.baseToken.address}
                    coinSymbol={token.baseToken.symbol}
                    chainSrc={solanaChain?.icon?.squaredLight}
                    coinSrc={token.info.imageUrl}
                  />
                );
              })}
            </div>
          )}
      </div>
    </div>
  );
}
