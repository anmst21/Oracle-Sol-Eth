import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ModalCoinItem from "./modal-coin-item";
import { isAddress, zeroAddress } from "viem";
import { InputCross, SearchGlass } from "../icons";
import { RelayToken, UnifiedToken } from "@/types/coin-types";
import { queryTokenList, useRelayChains } from "@reservoir0x/relay-kit-hooks";
import { useDebounce } from "@/hooks/useDebounce";
import { SolBalanceResponse } from "@/actions/get-sol-balance";

import { RelayChain } from "@/types/relay-query-chain-type";
import { getIconUri } from "@/helpers/get-icon-uri";
import { ModalMode } from "@/types/modal-mode";
import NativeCoinSkeleton from "./native-coin-skeleton";
import { useOnRamp } from "@/context/OnRampProvider";
import { COINBASE_CHAIN_ID } from "./modal-chains";
import {
  getCoinbaseChainId,
  supportedCoinbaseNetworks,
} from "@/helpers/coinbase-chain-map";

type Props = {
  activeChainId: number;
  featuredChains: RelayChain[];
  baseChain: RelayChain | undefined;
  solanaChain: RelayChain | undefined;
  chainFeaturedTokens: UnifiedToken[];
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

  onSelect: (t: UnifiedToken) => void;
  modalMode: ModalMode;
};

const ModalCoins = ({
  chainFeaturedTokens,
  onSelect,
  modalMode,
  activeChainId,
  baseChain,
  solanaChain,
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
  //  setUserEthTokens,
  nativeSolBalance,
  //  setNativeSolBalance,
  userSolanaTokens,
}: //  setUserSolanaTokens,
Props) => {
  const [searchTerm, setSearchTerm] = useState(""); // raw input
  const [searchTokens, setSearchTokens] = useState<RelayToken[]>([]); // fetched results
  const [, setLoadingSearchList] = useState(false);
  const [, setErrorSearching] = useState<string | null>(null);
  const debouncedTerm = useDebounce(searchTerm, 500);

  const { chains } = useRelayChains();
  const chainIds = useMemo(() => chains?.map((chain) => chain.id), [chains]);

  // --- Coinbase supported tokens ---
  const { coinbaseCryptos } = useOnRamp();
  const isCoinbaseActive = activeChainId === COINBASE_CHAIN_ID;
  const [coinbaseTokens, setCoinbaseTokens] = useState<UnifiedToken[]>([]);
  const [isLoadingCoinbase, setIsLoadingCoinbase] = useState(false);
  const coinbaseFetched = useRef(false);

  const filteredCoinbaseCryptos = useMemo(() => {
    return coinbaseCryptos.flatMap((currency) =>
      currency.networks
        .filter((n) => supportedCoinbaseNetworks.has(n.name))
        .map((network) => ({
          symbol: currency.symbol,
          name: currency.name,
          icon_url: currency.icon_url,
          network_name: network.name,
          contract_address: network.contract_address,
          chain_id: network.chain_id,
        }))
    );
  }, [coinbaseCryptos]);

  const fetchCoinbaseTokens = useCallback(async () => {
    if (coinbaseFetched.current || filteredCoinbaseCryptos.length === 0) return;
    coinbaseFetched.current = true;
    setIsLoadingCoinbase(true);

    // Dedupe and build lookup structures
    const seen = new Set<string>();
    const deduped: typeof filteredCoinbaseCryptos = [];

    for (const crypto of filteredCoinbaseCryptos) {
      const chainId = getCoinbaseChainId(crypto.network_name);
      if (!chainId) continue;
      const addr = crypto.contract_address ?? "";
      const isNative = !addr || addr === "0" || addr === "";
      const key = `${chainId}:${isNative ? "native" : addr.toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      deduped.push(crypto);
    }

    // Build bulk token keys for a single API call
    const tokenKeys: string[] = deduped.map((crypto) => {
      const chainId = getCoinbaseChainId(crypto.network_name)!;
      const addr = crypto.contract_address ?? "";
      const isNative = !addr || addr === "0" || addr === "";
      return `${chainId}:${isNative ? zeroAddress : addr.toLowerCase()}`;
    });

    // Single bulk fetch
    let relayResults: RelayToken[] = [];
    try {
      relayResults = await queryTokenList("https://api.relay.link", {
        tokens: tokenKeys,
        limit: tokenKeys.length,
      });
    } catch {
      // Relay lookup failed — we'll fall back to Coinbase metadata below
    }

    // Index relay results by chainId:address for fast lookup
    const relayByKey = new Map<string, RelayToken>();
    for (const rt of relayResults) {
      if (rt.chainId && rt.address) {
        relayByKey.set(`${rt.chainId}:${rt.address.toLowerCase()}`, rt);
      }
    }

    const tokens: UnifiedToken[] = deduped.map((crypto) => {
      const chainId = getCoinbaseChainId(crypto.network_name)!;
      const addr = crypto.contract_address ?? "";
      const isNative = !addr || addr === "0" || addr === "";
      const lookupKey = `${chainId}:${isNative ? zeroAddress : addr.toLowerCase()}`;
      const relayToken = relayByKey.get(lookupKey);

      const resolvedAddr = relayToken?.address || (isNative ? zeroAddress : addr);

      // Cross-reference user balances + prices
      let balance: number | undefined;
      let priceUsd: number | undefined;

      if (chainId === 792703809) {
        if (isNative && nativeSolBalance) {
          balance = nativeSolBalance.balance;
          priceUsd = nativeSolBalance.solUsdPrice ?? undefined;
        } else {
          const found = userSolanaTokens?.find(
            (t) => t.address.toLowerCase() === resolvedAddr.toLowerCase()
          );
          if (found) {
            balance = found.balance;
            priceUsd = found.priceUsd;
          }
        }
      } else {
        const found = userEthTokens?.find(
          (t) =>
            t.address.toLowerCase() === resolvedAddr.toLowerCase() &&
            t.chainId === chainId
        );
        if (found) {
          balance = found.balance;
          priceUsd = found.priceUsd;
        }
      }

      return {
        source: "coinbase" as const,
        chainId,
        address: resolvedAddr,
        symbol: relayToken?.symbol || crypto.symbol.toUpperCase(),
        name: relayToken?.name || crypto.name,
        logo: relayToken?.metadata?.logoURI || crypto.icon_url,
        balance: balance ?? 0,
        priceUsd: priceUsd ?? undefined,
      };
    });

    setCoinbaseTokens(tokens);
    setIsLoadingCoinbase(false);
  }, [filteredCoinbaseCryptos, nativeSolBalance, userSolanaTokens, userEthTokens]);

  useEffect(() => {
    if (modalMode === "onramp" && coinbaseTokens.length === 0) {
      fetchCoinbaseTokens();
    }
  }, [modalMode, coinbaseTokens.length, fetchCoinbaseTokens]);

  useEffect(() => {
    if (!debouncedTerm) {
      setSearchTokens([]);
      setErrorSearching(null);
      return;
    }

    let cancelled = false;
    setLoadingSearchList(true);
    setSearchTokens([]);
    setErrorSearching(null);

    queryTokenList("https://api.relay.link", {
      limit: 10,
      term: isAddress(debouncedTerm) ? undefined : debouncedTerm,
      chainIds: activeChainId === 0 ? chainIds : [activeChainId],
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
  }, [debouncedTerm, activeChainId, chainIds]);

  useEffect(() => {
    if (!geckoTrendingCoins) loadGeckoCoinsForChain("base");
  }, [loadGeckoCoinsForChain, geckoTrendingCoins]);

  useEffect(() => {
    if (!communityCoins) loadCommunityCoins();
  }, [loadCommunityCoins, communityCoins]);

  useEffect(() => {
    if (!solanaTrendingCoins) loadSolanaCoins();
  }, [loadSolanaCoins, solanaTrendingCoins]);

  const nativeTokens = useMemo(
    () => userEthTokens?.filter((t) => t.address === zeroAddress) ?? [],
    [userEthTokens]
  );
  const nonNativeUserEthTokens = useMemo(
    () => userEthTokens?.filter((t) => t.address !== zeroAddress) ?? [],
    [userEthTokens]
  );

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
        name: t.name || "Token",
      }))
    );

    if (userEthTokens) {
      out.push(...userEthTokens);
    }

    if (nativeSolBalance && solanaChain) {
      out.push({
        source: "sol" as const,
        chainId: solanaChain.id,
        address: solanaChain.currency!.address as string,
        symbol: solanaChain.currency!.symbol as string,
        logo: solanaChain.iconUrl as string | undefined,
        priceUsd: nativeSolBalance.solUsdPrice as number,
        balance: nativeSolBalance.balance,
        name: "Solana",
      });
    }
    if (userSolanaTokens) {
      out.push(...userSolanaTokens);
    }
    if (communityCoins) {
      out.push(...communityCoins);
    }
    if (geckoTrendingCoins) {
      out.push(...geckoTrendingCoins);
    }
    if (solanaTrendingCoins) {
      out.push(...solanaTrendingCoins);
    }

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
      : nativeTokens.filter((t) => t.chainId === activeChainId);
  }, [nativeTokens, activeChainId]);

  // same for the "other" ERC-20s
  const ethOtherList = useMemo(() => {
    if (!nonNativeUserEthTokens) return [];
    return activeChainId === 0
      ? nonNativeUserEthTokens
      : nonNativeUserEthTokens.filter((t) => t.chainId === activeChainId);
  }, [nonNativeUserEthTokens, activeChainId]);

  const filteredCommunityCoins = useMemo(() => {
    if (!communityCoins) return [];
    return activeChainId === 0
      ? communityCoins
      : communityCoins.filter((c) => c.chainId === activeChainId);
  }, [communityCoins, activeChainId]);

  const coinbaseLookup = useMemo(() => {
    const set = new Set<string>();
    for (const t of coinbaseTokens) {
      set.add(`${t.chainId}:${t.address.toLowerCase()}`);
    }
    return set;
  }, [coinbaseTokens]);

  const getCoinbaseSource = (chainId: number | undefined, address: string) => {
    if (modalMode !== "onramp" || !chainId) return undefined;
    return coinbaseLookup.has(`${chainId}:${address.toLowerCase()}`) ? "coinbase" as const : undefined;
  };

  return (
    <div className="coins-list">
      <div className="chain-sidebar__contianer">
        <label className="chain-sidebar__input">
          <SearchGlass />
          <input
            type="text"
            placeholder="Search tokens"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm.length !== 0 && (
            <button
              onClick={() => setSearchTerm("")}
              className="chain-sidebar__input__abandon"
            >
              <InputCross />
            </button>
          )}
        </label>
      </div>

      <div className="modal-native-coins">
        {/* Coinbase Supported Tokens — only when Coinbase filter is active */}
        {isCoinbaseActive && !searchTerm.length && (
          <div className="modal-native-coins__container">
            <div className="chain-sidebar__header">
              <h2>Coinbase Supported</h2>
              <h2>Balance/Native</h2>
            </div>
            {isLoadingCoinbase
              ? Array.from({ length: 7 }, (_, idx) => (
                  <NativeCoinSkeleton key={idx} />
                ))
              : coinbaseTokens.map((token, i) => (
                  <ModalCoinItem
                    key={i}
                    userBalance={token.balance}
                    priceUsd={token.priceUsd}
                    coinAddress={token.address}
                    coinSymbol={token.symbol}
                    chainSrc={
                      token.chainId ? getIconUri(token.chainId) : undefined
                    }
                    coinSrc={token.logo}
                    coinName={token.name}
                    onSelect={onSelect}
                    modalMode={modalMode}
                    chainId={token.chainId}
                    tokenSource="coinbase"
                  />
                ))}
          </div>
        )}

        {/* Search results — always visible */}
        {searchTokens && searchTokens.length > 0 && searchTerm.length > 0 && (
          <div className="modal-native-coins__container">
            <div className="chain-sidebar__header">
              <h2>Search Result</h2>
            </div>
            {filteredUnique.length > 0 &&
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
                    coinName={t.name}
                    onSelect={onSelect}
                    modalMode={modalMode}
                    chainId={t.chainId}
                    tokenSource={getCoinbaseSource(t.chainId, t.address)}
                  />
                );
              })}
          </div>
        )}

        {/* Standard sections — hidden when Coinbase filter is active */}
        {!isCoinbaseActive && (
          <>
            {ethNativeList.length > 0 &&
              (activeChainId === 1 || activeChainId === 0) &&
              searchTerm.length === 0 && (
                <div className="modal-native-coins__container">
                  <div className="chain-sidebar__header">
                    <h2>Native Ethereum Balance</h2>
                    <h2>Balance/Native</h2>
                  </div>
                  {ethNativeList.map((token, i) => {
                    return (
                      <ModalCoinItem
                        key={i}
                        userBalance={token.balance}
                        priceUsd={token.priceUsd}
                        coinAddress={
                          token.address === "native"
                            ? zeroAddress
                            : (token.address as string)
                        }
                        coinSymbol={token.symbol}
                        chainSrc={
                          token.chainId
                            ? getIconUri(token.chainId)
                            : getIconUri(1)
                        }
                        coinSrc={token.logo}
                        coinName={"Ether"}
                        onSelect={onSelect}
                        modalMode={modalMode}
                        chainId={token.chainId}
                        tokenSource={getCoinbaseSource(token.chainId, token.address === "native" ? zeroAddress : token.address)}
                      />
                    );
                  })}
                </div>
              )}
            {nativeSolBalance &&
              nativeSolBalance.balance !== 0 &&
              (activeChainId === 792703809 || activeChainId === 0) &&
              !searchTerm.length && (
                <div className="modal-native-coins__container">
                  <div className="chain-sidebar__header">
                    <h2>Native Solana Balance</h2>
                    <h2>Balance/Native</h2>
                  </div>
                  {solanaChain &&
                    solanaChain.currency?.address &&
                    solanaChain.currency?.symbol && (
                      <ModalCoinItem
                        userBalance={nativeSolBalance.balance}
                        priceUsd={nativeSolBalance.solUsdPrice}
                        coinAddress={solanaChain.currency?.address}
                        coinSymbol={solanaChain.currency?.symbol}
                        chainSrc={getIconUri(792703809)}
                        coinSrc={getIconUri(792703809)}
                        coinName="Solana"
                        onSelect={onSelect}
                        modalMode={modalMode}
                        chainId={792703809}
                        tokenSource={getCoinbaseSource(792703809, solanaChain.currency?.address ?? "")}
                      />
                    )}
                </div>
              )}

            {ethOtherList.length > 0 &&
              activeChainId !== 792703809 &&
              !searchTerm.length && (
                <div className="modal-native-coins__container">
                  <div className="chain-sidebar__header">
                    <h2>Other Ethereum Tokens</h2>
                    <h2>Balance/Native</h2>
                  </div>
                  {ethOtherList.map((token, i) => {
                    return (
                      <ModalCoinItem
                        key={i}
                        userBalance={token.balance}
                        priceUsd={token.priceUsd}
                        coinAddress={
                          token.address === "native"
                            ? zeroAddress
                            : (token.address as string)
                        }
                        coinSymbol={token.symbol}
                        chainSrc={
                          token.chainId ? getIconUri(token.chainId) : undefined
                        }
                        coinSrc={token.logo}
                        coinName={token.name}
                        onSelect={onSelect}
                        modalMode={modalMode}
                        chainId={token.chainId}
                        tokenSource={getCoinbaseSource(token.chainId, token.address === "native" ? zeroAddress : token.address)}
                      />
                    );
                  })}
                </div>
              )}

            {userSolanaTokens &&
              userSolanaTokens.length > 0 &&
              (activeChainId === 792703809 || activeChainId === 0) &&
              !searchTerm.length && (
                <div className="modal-native-coins__container">
                  <div className="chain-sidebar__header">
                    <h2>Other Solana Tokens</h2>
                    <h2>Balance/Native</h2>
                  </div>
                  {userSolanaTokens.map((token, i) => {
                    return (
                      <ModalCoinItem
                        key={i}
                        userBalance={token.balance}
                        priceUsd={token.priceUsd}
                        coinAddress={token.address}
                        coinSymbol={token.symbol}
                        chainSrc={getIconUri(792703809)}
                        coinSrc={token.logo}
                        coinName={token.name}
                        onSelect={onSelect}
                        modalMode={modalMode}
                        chainId={792703809}
                        tokenSource={getCoinbaseSource(792703809, token.address)}
                      />
                    );
                  })}
                </div>
              )}

            {activeChainId !== 0 && !searchTerm.length && (
              <div className="modal-native-coins__container">
                <div className="chain-sidebar__header">
                  <h2>Related Tokens</h2>
                </div>
                {chainFeaturedTokens.length > 0 &&
                  chainFeaturedTokens.map((token, i) => {
                    return (
                      <ModalCoinItem
                        key={i}
                        userBalance={token.balance}
                        priceUsd={token.priceUsd}
                        coinAddress={token.address}
                        coinSymbol={token.symbol}
                        chainSrc={getIconUri(activeChainId)}
                        coinSrc={token.logo}
                        coinName={token.name}
                        chainId={activeChainId}
                        onSelect={onSelect}
                        modalMode={modalMode}
                        tokenSource={getCoinbaseSource(activeChainId, token.address)}
                      />
                    );
                  })}
              </div>
            )}

            {!isLoadingCommunityCoins &&
              filteredCommunityCoins.length > 0 &&
              !searchTerm.length && (
                <div className="modal-native-coins__container">
                  <div className="chain-sidebar__header">
                    <h2>Farcaster Community Coins</h2>
                    <h2>Price/Native</h2>
                  </div>

                  {filteredCommunityCoins.map((token, i) => {
                    return (
                      <ModalCoinItem
                        key={i}
                        priceUsd={token.priceUsd}
                        priceNative={token.priceNative}
                        coinAddress={token.address}
                        coinSymbol={token.symbol}
                        chainSrc={
                          token.chainId ? getIconUri(token.chainId) : undefined
                        }
                        coinSrc={token.logo}
                        coinName={token.name}
                        onSelect={onSelect}
                        modalMode={modalMode}
                        chainId={token.chainId}
                        tokenSource={getCoinbaseSource(token.chainId, token.address)}
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
                <div className="modal-native-coins__container">
                  <div className="chain-sidebar__header">
                    <h2>Solana Trending Coins</h2>
                    <h2>Price/Native</h2>
                  </div>

                  {solanaTrendingCoins.map((token, i) => {
                    return (
                      <ModalCoinItem
                        key={i}
                        priceUsd={token.priceUsd}
                        priceNative={token.priceNative}
                        coinAddress={token.address}
                        coinSymbol={token.symbol}
                        chainSrc={
                          token.chainId ? getIconUri(token.chainId) : undefined
                        }
                        coinSrc={token.logo}
                        coinName={token.name}
                        onSelect={onSelect}
                        modalMode={modalMode}
                        chainId={token.chainId}
                        tokenSource={getCoinbaseSource(token.chainId, token.address)}
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
                <div className="modal-native-coins__container">
                  <div className="chain-sidebar__header">
                    <h2>Base Trending Coins</h2>
                    <h2>Price/Native</h2>
                  </div>

                  {geckoTrendingCoins.map((token, i) => {
                    return (
                      <ModalCoinItem
                        key={i}
                        priceUsd={token.priceUsd}
                        priceNative={token.priceNative}
                        coinAddress={token.address}
                        coinSymbol={token.symbol}
                        chainSrc={
                          token.chainId ? getIconUri(token.chainId) : undefined
                        }
                        coinSrc={token.logo}
                        coinName={token.name}
                        onSelect={onSelect}
                        modalMode={modalMode}
                        chainId={token.chainId}
                        tokenSource={getCoinbaseSource(token.chainId, token.address)}
                      />
                    );
                  })}
                </div>
              )}

            {isLoadingCommunityCoins &&
              isLoadingGeckoCoins &&
              isLoadingSolanaTrendingCoins && (
                <div className="modal-native-coins__container">
                  <div className="chain-sidebar__header">
                    <h2>Loading Coins</h2>
                    <h2>Balance/Native</h2>
                  </div>
                  {Array.from({ length: 7 }, (_, idx) => (
                    <NativeCoinSkeleton key={idx} />
                  ))}
                </div>
              )}
          </>
        )}

        {searchTerm.length > 0 && searchTokens.length === 0 && (
          <div className="modal-native-coins__container">
            <div className="chain-sidebar__header">
              <h2>Searching</h2>
              <h2>Balance/Native</h2>
            </div>
            {Array.from({ length: 7 }, (_, idx) => (
              <NativeCoinSkeleton key={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalCoins;
