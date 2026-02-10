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
import { MOONPAY_CHAIN_ID } from "./modal-chains";
import {
  getMoonpayChainId,
  supportedMoonpayNetworks,
} from "@/helpers/moonpay-chain-map";

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

  // --- MoonPay supported tokens ---
  const { moonpayCryptos } = useOnRamp();
  const isMoonpayActive = activeChainId === MOONPAY_CHAIN_ID;
  const [moonpayTokens, setMoonpayTokens] = useState<UnifiedToken[]>([]);
  const [isLoadingMoonpay, setIsLoadingMoonpay] = useState(false);
  const moonpayFetched = useRef(false);

  const filteredMoonpayCryptos = useMemo(() => {
    return moonpayCryptos.filter(
      (c) => !c.isSuspended && supportedMoonpayNetworks.has(c.metadata.networkCode)
    );
  }, [moonpayCryptos]);

  const fetchMoonpayTokens = useCallback(async () => {
    if (moonpayFetched.current || filteredMoonpayCryptos.length === 0) return;
    moonpayFetched.current = true;
    setIsLoadingMoonpay(true);

    const tokens: UnifiedToken[] = [];
    const seen = new Set<string>();

    const promises = filteredMoonpayCryptos.map(async (crypto) => {
      const chainId = getMoonpayChainId(crypto.metadata.networkCode);
      if (!chainId) return;

      const addr = String(crypto.metadata.contractAddress);
      const key = `${chainId}:${addr.toLowerCase()}`;
      if (seen.has(key)) return;
      seen.add(key);

      try {
        const [relayToken] = await queryTokenList("https://api.relay.link", {
          limit: 1,
          chainIds: [chainId],
          ...(addr !== "0" && addr !== ""
            ? { address: addr }
            : { term: crypto.code.split("_")[0] }),
        });

        // cross-reference user balances + prices
        let balance: number | undefined;
        let priceUsd: number | undefined;
        const resolvedAddr = relayToken?.address || (addr === "0" ? "0x0000000000000000000000000000000000000000" : addr);

        if (chainId === 792703809) {
          if ((addr === "0" || addr === "") && nativeSolBalance) {
            balance = nativeSolBalance.balance;
            priceUsd = nativeSolBalance.solUsdPrice;
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

        tokens.push({
          source: "moonpay",
          chainId,
          address: relayToken?.address || (addr === "0" ? "0x0000000000000000000000000000000000000000" : addr),
          symbol: relayToken?.symbol || crypto.code.split("_")[0].toUpperCase(),
          name: relayToken?.name || crypto.name,
          logo: relayToken?.metadata?.logoURI || crypto.icon,
          balance: balance ?? 0,
          priceUsd,
        });
      } catch {
        tokens.push({
          source: "moonpay",
          chainId,
          address: addr === "0" ? "0x0000000000000000000000000000000000000000" : addr,
          symbol: crypto.code.split("_")[0].toUpperCase(),
          name: crypto.name,
          logo: crypto.icon,
          balance: 0,
        });
      }
    });

    await Promise.allSettled(promises);
    setMoonpayTokens(tokens);
    setIsLoadingMoonpay(false);
  }, [filteredMoonpayCryptos, nativeSolBalance, userSolanaTokens, userEthTokens]);

  useEffect(() => {
    if (modalMode === "onramp" && moonpayTokens.length === 0) {
      fetchMoonpayTokens();
    }
  }, [modalMode, moonpayTokens.length, fetchMoonpayTokens]);

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

  // same for the “other” ERC-20s
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

  const moonpayLookup = useMemo(() => {
    const set = new Set<string>();
    for (const t of moonpayTokens) {
      set.add(`${t.chainId}:${t.address.toLowerCase()}`);
    }
    return set;
  }, [moonpayTokens]);

  const getMoonpaySource = (chainId: number | undefined, address: string) => {
    if (modalMode !== "onramp" || !chainId) return undefined;
    return moonpayLookup.has(`${chainId}:${address.toLowerCase()}`) ? "moonpay" as const : undefined;
  };

  // const { activeWallet } = useActiveWallet();

  return (
    <div className="coins-list">
      <div className="chain-sidebar__contianer">
        <label className="chain-sidebar__input">
          <SearchGlass />
          <input
            type="text"
            placeholder="Search Ticker or Address"
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
        {/* MoonPay Supported Tokens — only when MoonPay filter is active */}
        {isMoonpayActive && !searchTerm.length && (
          <div className="modal-native-coins__container">
            <div className="chain-sidebar__header">
              <h2>MoonPay Supported</h2>
              <h2>Balance/Native</h2>
            </div>
            {isLoadingMoonpay
              ? Array.from({ length: 7 }, (_, idx) => (
                  <NativeCoinSkeleton key={idx} />
                ))
              : moonpayTokens.map((token, i) => (
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
                    tokenSource="moonpay"
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
                    tokenSource={getMoonpaySource(t.chainId, t.address)}
                  />
                );
              })}
          </div>
        )}

        {/* Standard sections — hidden when MoonPay filter is active */}
        {!isMoonpayActive && (
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
                        tokenSource={getMoonpaySource(token.chainId, token.address === "native" ? zeroAddress : token.address)}
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
                        tokenSource={getMoonpaySource(792703809, solanaChain.currency?.address ?? "")}
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
                        tokenSource={getMoonpaySource(token.chainId, token.address === "native" ? zeroAddress : token.address)}
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
                        tokenSource={getMoonpaySource(792703809, token.address)}
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
                        tokenSource={getMoonpaySource(activeChainId, token.address)}
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
                        tokenSource={getMoonpaySource(token.chainId, token.address)}
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
                        tokenSource={getMoonpaySource(token.chainId, token.address)}
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
                        tokenSource={getMoonpaySource(token.chainId, token.address)}
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
